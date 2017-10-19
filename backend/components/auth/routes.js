import express from 'express';
const router = express.Router();

import jwt from 'jsonwebtoken';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { catchAsync } from '~/services/catchAsync';

import * as User from '~/components/users/model';

const makeAccountRetriever = (prov) => {
  const providerDetails = {
    Github: {
      tokenRequest: (request) => {
        const data = new FormData();
        data.append('client_id', process.env['GITHUB_OAUTH_ID']);
        data.append('client_secret', process.env['GITHUB_OAUTH_SECRET']);
        data.append('code', request.query.code);
        const params = { method: 'POST', body: data };
        const url = 'https://github.com/login/oauth/access_token';
        return [url, params];
      },
      parseToken: (tokenString) => tokenString.split('access_token=')[1].split('&scope')[0],
      accountRequest: (token) => {
        const params = {
          headers: {
            Authorization: `token ${token}`
          }
        };
        const url = 'https://api.github.com/user';
        return [url, params];
      }
    }
  };
  const retrieveFunc = async (req) => {
    const chosen = providerDetails[prov];
    const token = chosen.parseToken(await fetch(...chosen.tokenRequest(req)).then(res => (
      res.ok ? res.text() : Promise.reject(res)
    )));
    const acc = await fetch(...chosen.accountRequest(token)).then(res => res.json());
    return acc;
  };
  return retrieveFunc;
};

const retrieveAccount = makeAccountRetriever('Github');

// 1. after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here
router.get('/github/callback', catchAsync(async (request, response) => {
  const account = retrieveAccount(request);
  const user = await User.select.oneByOauth('github', account.id) || await User.insert.createFromGithub(account);
  if (!user.email) await User.update.update(user.id, account.email);
  const token = jwt.sign(user, process.env['JWT_SECRET']);
  response.redirect('/?token=' + token);
}));

// let's put token into header, so that we don't have to display the query string and the delete it
// nope, because turns out we can't see headers on initial page load

export { router };

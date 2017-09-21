import { db } from '~/db/init.js';

const insert = {
  createFromGithub: (profile) =>
    db.one(
      'INSERT INTO "user" (oauth_provider, oauth_id, username, avatar_url, email) VALUES (${oauthProvider}, ${oauthId}, ${username}, ${avatarUrl}, ${email}) RETURNING *',
      {
        oauthProvider: 'github',
        oauthId: profile.id.toString(),
        username: profile.login,
        avatarUrl: profile.avatar_url,
        email: profile.email
      }
    )
};

export { insert };

import { handleErrors } from './handleErrors';
const dogFetch = (dispatch, method, url, body = undefined) => {
  dispatch({
    status: Symbol('Loading')
  });
  return fetch(url, {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt')
    }),
    body: JSON.stringify(body)
  })
      .then(handleErrors)
      .then((response) => {
        dispatch({
          status: Symbol('Success'),
          response
        });
        return Promise.resolve(response);
      })
      .catch((error) => { // { error: error }
        console.log(error);
        dispatch({
          status: Symbol('Error'),
          response: error.error
        });
        return Promise.reject(error);
      });
};

window.dogFetch = dogFetch;

export { dogFetch };

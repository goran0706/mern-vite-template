import { signout } from './api-auth.js';

const isAuthenticated = () => {
  if (typeof window == 'undefined') {
    return false;
  }
  return sessionStorage.getItem('jwt')
    ? JSON.parse(sessionStorage.getItem('jwt'))
    : false;
};

const authenticate = (jwt, cb) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('jwt', JSON.stringify(jwt));
  }
  cb();
};

const clearJWT = cb => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('jwt');
  }
  cb();

  //optional
  signout().then(() => {
    document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });
};

export default { isAuthenticated, authenticate, clearJWT };

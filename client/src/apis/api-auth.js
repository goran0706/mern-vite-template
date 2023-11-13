import apiClient from './api-client';

const signin = async user => {
  try {
    const { data } = await apiClient.post('/auth/signin/', user, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true, // If you want to include credentials (cookies)
    });
    return await data;
  } catch (err) {
    console.log(err);
  }
};

const signout = async () => {
  try {
    const { data } = await apiClient.get('/auth/signout/');
    return await data;
  } catch (err) {
    console.log(err);
  }
};

export { signin, signout };

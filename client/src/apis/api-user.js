import apiClient from './api-client';

const create = async user => {
  try {
    const { data } = await apiClient.post('/api/users/', user, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return await data;
  } catch (err) {
    console.log(err);
  }
};

const list = async signal => {
  try {
    const { data } = await apiClient.get('/api/users/', {
      signal: signal,
    });
    return await data;
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, credentials, signal) => {
  try {
    const { data } = await apiClient.get('/api/users/' + params.userId, {
      signal: signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await data;
  } catch (err) {
    console.log(err);
  }
};

const update = async (params, credentials, user) => {
  try {
    const { data } = await apiClient.put('/api/users/' + params.userId, user, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await data;
  } catch (err) {
    console.log(err);
  }
};

const remove = async (params, credentials) => {
  try {
    const { data } = await apiClient.delete('/api/users/' + params.userId, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await data;
  } catch (err) {
    console.log(err);
  }
};

export { create, list, read, remove, update };

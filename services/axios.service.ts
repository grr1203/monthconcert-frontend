import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

export const baseUrl = Config.API_ENDPOINT;

// Private Axios Instance
export const privateAxiosInstance = axios.create({baseURL: baseUrl});
privateAxiosInstance.prototype.retryCount = 0;
privateAxiosInstance.interceptors.response.use(
  res => res,
  async error => {
    if (privateAxiosInstance.prototype.retryCount > 2) {
      if (error.response.status === 401 || error.response.status === 403) {
        return;
      } else {
        return Promise.reject(error);
      }
    }
    privateAxiosInstance.prototype.retryCount++;
    if (error.response.status === 401 || error.response.status === 403) {
      console.log(
        `${error.response.status} error, assume as token staled and get another idtoken with refresh token`,
      );
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.log('refresh token not exist');
        throw Promise.reject(error);
      }
      try {
        const accessToken = await refreshAccessToken(refreshToken);
        const {url, params, data, method} = error.config;
        const res = await privateAxiosInstance({
          method,
          data,
          url,
          params,
          headers: {Authorization: `Bearer ${accessToken}`},
        });
        return res;
      } catch (error) {
        console.log('failed to get token by refresh token');
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  },
);

export const refreshAccessToken = async (refreshToken: string) => {
  const res = await axios.post(`${baseUrl}/token`, {refreshToken});
  const accessToken = res.data.token;
  await AsyncStorage.setItem('accessToken', accessToken);
  return accessToken;
};

export const getJWTHeaderFromLocalStorage = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');

  if (accessToken) {
    return {Authorization: `Bearer ${accessToken}`};
  } else {
    console.log(`local storage에 인증토큰이 없습니다 : ${accessToken}`);
    return {};
  }
};

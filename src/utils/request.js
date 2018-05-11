/*eslint-disable*/
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../common/HAP';
import AppState from "../common/AppState";

const cookies = new Cookies();

// axios 配置
axios.defaults.timeout = 10000;
axios.defaults.baseURL = "http://101.132.194.204:9090";
// history.go(0);
// http request 拦截器);
axios.interceptors.request.use(
  (config) => {
    const newConfig = config;
    newConfig.headers['Content-Type'] = 'application/json';
    newConfig.headers.Accept = 'application/json';
    const accessToken = cookies.get(HAP.ACCESS_TOKEN);
    if (accessToken) {
      //newConfig.data = accessToken;
      newConfig.params = {"access_token":accessToken};
      //newConfig.headers.Authorization = `bearer ${accessToken}`;
    }
    return newConfig;
  },
  (err) => {
    const error = err;
    return Promise.reject(error);
  });

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return Promise.resolve(response);
    }
    // continue sending response to the then() method
    return Promise.resolve(response.data);
  },
  (error) => {
    const response = error.response;
    if (response) {
      const status = response.status;
      switch (status) {
        // check if unauthorized error returned
        case 401: {
          HAP.removeAccessToken();
          window.location = 'http://101.132.194.204:9090/oauth/oauth/authorize?response_type=token&client_id=app&redirect_uri=http://101.132.194.204:8080/design/%23/admin/workplace';
          break;
        }
        default:
          break;
      }
    }
    // request is rejected and will direct logic to the catch() method
    return Promise.reject(error);
  });

export default axios;

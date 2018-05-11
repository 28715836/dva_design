/*eslint-disable*/
import React from 'react';
import Cookies from 'universal-cookie';
import { message } from 'antd';

const cookies = new Cookies();
// (!function () {
const ACCESS_TOKEN = 'access_token';
const AUTH_URL = `101.132.194.204:9090/oauth/oauth/authorize?response_type=token&client_id=app&state=`;

const MenuCode = [];

const setCookie = (name, option) => cookies.set(name, option);
const getCookie = (name, option) => cookies.getALL(name, option);
const removeCookie = (name, option) => cookies.remove(name, option);

// 获取url token
function getAccessToken(hash) {
  if (hash) {
    const ai = hash.indexOf(ACCESS_TOKEN);
    if (ai !== -1) {
      const accessToken = hash.split('&')[1].split('=')[1];
      return accessToken;
    }
  }
  return null;
}

// 前端存储cookie token
function setAccessToken(token, expiresion) {
  const expires = expiresion * 1000;
  const expirationDate = new Date(Date.now() + expires);
  setCookie(ACCESS_TOKEN, token, {
    path: '/',
    expires: expirationDate,
  });
}

// 移除token
function removeAccessToken() {
  //alert("test");
  setAccessToken(null, 0);
  removeCookie(ACCESS_TOKEN, {
    path: '/',
  });
}

// 登出
function logout() {
  removeAccessToken();
  window.location = `http://101.132.194.204:9090/oauth/logout`;
}

// 提示错误信息
function prompt(type, content) {
  switch (type) {
    case 'success':
      message.success(content);
      break;
    case 'error':
      message.error(content);
      break;
    default:
      break;
  }
}

// 处理错误相应
function handleResponseError(error) {
  const response = error.response;
  if (response) {
    const status = response.status;
    switch (status) {
      case 400: {
        const mess = response.data.message;
        message.error(mess);
        break;
      }
      default:
        break;
    }
  }
}

// 生成指定长度的随机字符串
function randomString(len = 32) {
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = chars.length;
  for (let i = 0; i < len; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
  }
  return code;
}

window.HAP = {
  ACCESS_TOKEN,
  AUTH_URL,
  getAccessToken,
  setCookie,
  getCookie,
  removeCookie,
  setAccessToken,
  removeAccessToken,
  logout,
  prompt,
  handleResponseError,
  randomString,
};
// })();

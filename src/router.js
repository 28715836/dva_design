/*eslint-disable*/
import React from 'react';
import { routerRedux, Router, Route, Switch } from 'dva/router';
import { Provider, observer } from 'mobx-react'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Admin from './routes/Admin/admin.js';
import Login from './routes/Login/Login.js';
import request from './utils/request';
import AppState from './common/AppState';
import stores from "./common/stores";
const { ConnectedRouter } = routerRedux;

function RouterConfig({ history }) {
  const token = HAP.getAccessToken(window.location.hash);
  if (token) {
    HAP.setAccessToken(token, 60 * 60);
  }
  request.get('/producer/user/userSelf').then((response) => {
    const user = response;
    if (user) {
      AppState.setAuthenticated(true);
      AppState.setCurrentUser(user);
    }
  });
  return (
      <Provider {...stores}>
        <ConnectedRouter history={history}>
            <Switch>
              <Route path="/" exact component={Admin} />
              <Route path="/admin" component={Admin} />
              <Route path="/login" component={Login} />
            </Switch>
        </ConnectedRouter>
      </Provider>
  );
}

export default RouterConfig;

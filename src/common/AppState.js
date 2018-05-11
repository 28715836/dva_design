import { observable, action, computed } from 'mobx';

class AppState {
  @observable isAuthenticated;
  @observable user;

  constructor(isAuthenticated = false) {
    this.isAuthenticated = isAuthenticated;
  }

  @action setCurrentUser(user) {
    this.user = user;
  }

  @computed get currentUser() {
    return this.user;
  }

  @computed get isAuth() {
    return this.isAuthenticated;
  }

  @action setAuthenticated(flag) {
    this.isAuthenticated = flag;
  }

}

const appState = new AppState();
export default appState;


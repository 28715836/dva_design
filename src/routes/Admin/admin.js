/*eslint-disable*/
import React from 'react';
import {connect} from 'dva';
import {HashRouter as Router, Route, Redirect, Link, Switch} from 'react-router-dom';
import {Layout, Menu, Icon, Avatar, Breadcrumb, Dropdown, Modal, Button, Divider, Tooltip, Spin} from 'antd';
import {observer, inject} from 'mobx-react';
import Home from '../../components/Example';
import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';
import 'ant-design-pro/dist/ant-design-pro.css';
import NoticeIcon from '../../components/NoticeIcon';
import style from '../../components/GlobalHeader/index.less';
import request from "../../utils/request";
import logo from '../../assets/logo.svg';
import '../../assets/css/scroll.less';
import UserInfo from "../User/UserInfo";
import SubMenuRole from '../../common/SubMenuRole';
import UpdatePassword from "../User/UpdatePassword";
import Workplace from "../workplace/workplace";
import Store from '../Store/Store';
import Goods from '../Goods/Goods'
import insertGoods from '../Goods/insertGoods'
import Order from '../Order/Order'
import Comment from '../Comment/Comment'
import User from '../User/User'
import StoreApply from '../Store/StoreApply'
import AppState from "../../common/AppState";
import AdminComment from '../Comment/AdminComment'

const {Header, Footer, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;
const confirm = Modal.confirm;

@inject('AppState')
@observer
class Users extends React.Component {
  state = {
    collapsed: false,
    user: null,
    roleList: [],
    current: "工作台"
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  componentDidMount() {
    this.onShow();
  };

  onShow() {
    const {AppState} = this.props;
    request.get('/producer/user/userSelf').then((response) => {
      const user = response;
      const roleList = [];
      if (user) {
        for (var i = 0; i < user.roleList.length; i++) {
          roleList.push(user.roleList[i].roleName);
        }
        this.setState({
          user: user,
          roleList: roleList
        })
      }
    });
  }

  handleClick(e) {
    // console.log('click ', e.key);
    this.setState({
      current: e.key
    });
  }

  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);
    //console.log(urlParams)
    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return '/admin/workplace';
    }
    return redirect;
  }

  render() {
    const {user} = this.state;
    const bashRedirect = this.getBashRedirect();
    const menu = (
      <Menu className={style.menu} selectedKeys={[]}>
        <Menu.Item><Link to="/admin/userInfo"><Icon type="user"/>个人中心</Link></Menu.Item>
        <Menu.Item disabled><Icon type="setting"/>设置</Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout"><span onClick={() => HAP.logout()}><Icon type="logout"/>退出登录</span></Menu.Item>
      </Menu>
    );
    return (
      <Router>
        {user ? (
          <Layout>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              className={style.sider}
              width={256}
            >
              <div className={style.logo} key="logo">
                <Link to="/">
                  <img src={logo} alt="logo"/>
                  <h1>后台管理系统</h1>
                </Link>
              </div>

              <SubMenuRole
                current={this.state.current}
                //handleClick = {this.handleClick}
                role={this.state.roleList}
              />
            </Sider>
            <Layout style={{marginLeft: this.state.collapsed ? 80 : 256}}>
              <Header style={{padding: 0}}>
                <div className={style.header}>
                  <Icon
                    className={style.trigger}
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                  <div className={style.right}>
                    <HeaderSearch
                      className={`${style.action} ${style.search}`}
                      placeholder="站内搜索"
                      dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                      onSearch={(value) => {
                        // console.log('input', value); // eslint-disable-line
                      }}
                      onPressEnter={(value) => {
                        // console.log('enter', value); // eslint-disable-line
                      }}
                    />
                    <Tooltip title="使用文档">
                      <a
                        target="_blank"
                        href="http://pro.ant.design/docs/getting-started"
                        rel="noopener noreferrer"
                        className={style.action}
                      >
                        <Icon type="question-circle-o"/>
                      </a>
                    </Tooltip>
                    {/*<NoticeIcon*/}
                    {/*className={style.action}*/}
                    {/*count={13}*/}
                    {/*onItemClick={(item, tabProps) => {*/}
                    {/*console.log(item, tabProps); // eslint-disable-line*/}
                    {/*}}*/}
                    {/*// onClear={onNoticeClear}*/}
                    {/*// onPopupVisibleChange={onNoticeVisibleChange}*/}
                    {/*// loading={fetchingNotices}*/}
                    {/*popupAlign={{ offset: [20, -16] }}*/}
                    {/*>*/}
                    {/*<NoticeIcon.Tab*/}
                    {/*//list={noticeData['通知']}*/}
                    {/*title="通知"*/}
                    {/*emptyText="你已查看所有通知"*/}
                    {/*emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"*/}
                    {/*/>*/}
                    {/*<NoticeIcon.Tab*/}
                    {/*//list={noticeData['消息']}*/}
                    {/*title="消息"*/}
                    {/*emptyText="您已读完所有消息"*/}
                    {/*emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"*/}
                    {/*/>*/}
                    {/*<NoticeIcon.Tab*/}
                    {/*//list={noticeData['待办']}*/}
                    {/*title="待办"*/}
                    {/*emptyText="你已完成所有待办"*/}
                    {/*emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"*/}
                    {/*/>*/}
                    {/*</NoticeIcon>*/}
                    {user ? (
                      <Dropdown overlay={menu}>
                    <span className={`${style.action} ${style.account}`}>
                      <Avatar size="small" className={style.avatar} src={user.headPic}/>
                      <span className={style.name}>{user.name}</span>
                    </span>
                      </Dropdown>
                    ) : <Spin size="small" style={{marginLeft: 8}}/>}
                  </div>
                </div>
              </Header>
              <Content style={{margin: '24px 24px 0', height: '100%'}}>
                <Switch>
                  <Route path="/admin/userInfo" component={UserInfo}/>
                  <Route path="/admin/Home" component={Home}/>
                  <Route path="/admin/store" component={Store}/>
                  <Route path="/admin/workplace" component={Workplace}/>
                  <Route path="/admin/UpdatePassword" component={UpdatePassword}/>
                  <Route path="/admin/goods" component={Goods}/>
                  <Route path="/admin/insertGoods/:id" component={insertGoods}/>
                  <Route path="/admin/order" component={Order}/>
                  <Route path="/admin/Comment" component={Comment}/>
                  <Route path="/admin/user" component={User}/>
                  <Route path="/admin/storeApply" component={StoreApply}/>
                  <Route path="/admin/AdminComment" component={AdminComment}/>
                  <Redirect exact from="/" to={bashRedirect}/>
                  <Redirect to={bashRedirect}/>
                </Switch>
              </Content>
              <Footer style={{textAlign: 'center'}}>
                Copyright © 2018 商家店铺管理系统
              </Footer>
            </Layout>
          </Layout>) : <Spin
          style={{
            marginTop: 300,
            display: 'inherit',
            marginRight: 'auto',
          }}/>}
      </Router>
    );
  }
}

export default connect()(Users);

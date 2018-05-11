/*eslint-disable*/
import React from 'react';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

export default class SubMenuRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current : "工作台"
    }
  }
  componentDidMount() {
    this.onRole();
  };

  onRole() {
    const { role } = this.props;
    let subMenu = null;
    if (role.includes("ROLE_SUPER_ADMIN")){
      subMenu =(<Menu
        theme="dark"
        //onClick={this.props.handleClick()}
        defaultOpenKeys={['工作台']}
        defaultSelectedKeys={['工作台']}
        mode="inline"
      >
        <Menu.Item key="工作台"><Link to="/admin/workplace"><Icon type="line-chart" /><span>工作台</span></Link></Menu.Item>
        <SubMenu key="用户管理" title={<span><Icon type="user" /><span>用户</span></span>}>
          <Menu.Item key="商家申请"><Link to="/admin/storeApply">商家申请</Link></Menu.Item>
          <Menu.Item key="用户管理"><Link to="/admin/user">用户管理</Link></Menu.Item>
        </SubMenu>
        <Menu.Item key="AdminComment"><Link to="/admin/AdminComment"><Icon type="notification" /><span>评论管理</span></Link></Menu.Item>
        <SubMenu key="设置" title={<span><Icon type="setting" /><span>设置</span></span>}>
          <Menu.Item key="个人中心"><Link to="/admin/userInfo"><Icon type="user" /><span>个人中心</span></Link></Menu.Item>
          <Menu.Item key="修改密码"><Link to="/admin/updatePassword"><Icon type="user" /><span>修改密码</span></Link></Menu.Item>
        </SubMenu>
      </Menu>)
    } else if(role.includes("ROLE_ADMIN") && !role.includes("ROLE_SUPER_ADMIN")){
      subMenu =(<Menu
        theme="dark"
        //onClick={this.handleClick}
        defaultOpenKeys={['工作台']}
        defaultSelectedKeys={['工作台']}
        mode="inline"
      >
        <Menu.Item key="工作台"><Link to="/admin/workplace"><Icon type="line-chart" /><span>工作台</span></Link></Menu.Item>
        <Menu.Item key="店铺管理"><Link to="/admin/store"><Icon type="shop" /><span>店铺管理</span></Link></Menu.Item>
        <SubMenu key="商品管理" title={<span><Icon type="shopping-cart" /><span>商品管理</span></span>}>
          <Menu.Item key="商品信息"><Link to="/admin/goods">商品信息</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="订单管理" title={<span><Icon type="layout" /><span>订单管理</span></span>}>
          <Menu.Item key="订单管理"><Link to="/admin/order">订单管理</Link></Menu.Item>
        </SubMenu>
        <Menu.Item key="评论管理"><Link to="/admin/Comment"><Icon type="notification" /><span>评论管理</span></Link></Menu.Item>
        <SubMenu key="设置" title={<span><Icon type="setting" /><span>设置</span></span>}>
          <Menu.Item key="个人中心"><Link to="/admin/userInfo"><Icon type="user" /><span>个人中心</span></Link></Menu.Item>
          <Menu.Item key="修改密码"><Link to="/admin/updatePassword"><Icon type="user" /><span>修改密码</span></Link></Menu.Item>
        </SubMenu>
      </Menu>)
    }
    return subMenu;
  }
  render() {
    const { role } = this.props;
    return(
      <div>
        {this.onRole()}
      </div>
    )
  }
}

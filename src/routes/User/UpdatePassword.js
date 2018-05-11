import React, { PureComponent } from 'react';
import {
   Tabs, Card, Avatar
} from 'antd';
import OutUpdatePassword from "./OutUpdatePassword";
import SMSUpdatePassword from "./SMSUpdatePassword";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../workplace/Workplace.less';
import { observer, inject } from 'mobx-react';

@inject('AppState')
@observer
export default class UpdatePassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabActiveKey : 'tab1'
    }
  }
  onTabChange = (key) => {
    this.setState({ tabActiveKey: key });
  }

  render() {
    const breadcrumbList = [{
      title: '设置',
    }, {
      title: '修改密码',
    }];
    const tabList = [{
      key: 'tab1',
      tab: '原密码修改',
    }, {
      key: 'tab2',
      tab: '短信修改',
    }];
    const contentTabList = {
      tab1:<OutUpdatePassword/>,
      tab2:<SMSUpdatePassword/>
    }
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          {this.props.AppState.currentUser.headPic == null?(
            <Avatar size="large" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />):(
            <Avatar size="large" src={this.props.AppState.currentUser.headPic} />
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>修改密码</div>
          <div>你可以根据原密码修改密码，也可以使用注册时绑定的手机号进行验证码修改密码</div>
        </div>
      </div>
    );
    return (
      <PageHeaderLayout
          content={pageHeaderContent}
          breadcrumbList={breadcrumbList}
          tabList={tabList}
          onTabChange={this.onTabChange.bind(this)}
          tabActiveKey={this.state.tabActiveKey}>
            <Card bordered={false}>
              {contentTabList[this.state.tabActiveKey]}
            </Card>
      </PageHeaderLayout>
    );
  }
}

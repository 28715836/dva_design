import React from 'react';
import { Avatar } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { observer, inject } from 'mobx-react';
import styles from './Workplace.less';
import Analysis from "./Analysis";
import request from "../../utils/request";
@inject('AppState')
@observer
export default class Workplace extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      user : null,
      info : null
    }
  }
  componentDidMount() {
      this.setState({user:this.props.AppState.currentUser});
      this.information();
  }
  information () {
    var id = '';
    if (!JSON.stringify(this.props.AppState.currentUser.roleList).includes("ROLE_SUPER_ADMIN")) {
      id = this.props.AppState.currentUser.id
    }
    request.post(`/producer/order/paymentNum?id=${id}`).then((response) => {
      if (response) {
        this.setState({
          info : response,
        })
      }
    });
  }
  char() {
    const visitData = [];
    const beginDay = new Date();

    const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3];
    for (let i = 0; i < fakeY.length; i += 1) {
      visitData.push({
        x: beginDay.getFullYear() +"-"+ (i+1),
        y: fakeY[i],
      });
    }
    return visitData;
  }
  roleNames (roleList) {
    var roleNameList = [];
    if (roleList.length != 0) {
        for (var i = 0; i < roleList.length; i++) {
          roleNameList.push(roleList[i].roleDescribe);
          if (i + 1 < roleList.length) {
            roleNameList.push("  |  ");
          }
        }
    }
    return roleNameList;
  }
  getDate () {
    var hour = new Date().getHours();
    var time = '';
    if (hour > 0 && hour <= 9) {
      time = "早上好"
    }
    else if (hour > 9 && hour <= 11) {
      time = "上午好"
    }
    else if (hour > 11 && hour <= 13) {
      time = "中午好"
    }
    else if (hour > 13 && hour <= 18) {
      time = "下午好"
    }
    else {
      time = "晚上好"
    }
    return time;
  }
  render() {
    const { user } = this.state;
    let pageHeaderContent = null;
    if (user != null) {
      pageHeaderContent = (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={user.headPic} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>{this.getDate()}，{user.name}，祝你开心每一天！</div>
            <div>{this.roleNames(user.roleList)}</div>
          </div>
        </div>
      );
    }


    // const extraContent = (
    //       <div className={styles.extraContent}>
    //         <div className={styles.statItem}>
    //           <p>项目数</p>
    //           <p>56</p>
    //         </div>
    //         <div className={styles.statItem}>
    //           <p>团队内排名</p>
    //           <p>8<span> / 24</span></p>
    //     </div>
    //     <div className={styles.statItem}>
    //       <p>项目访问</p>
    //       <p>2,223</p>
    //     </div>
    //   </div>
    // );

    return (
      <PageHeaderLayout
        content={pageHeaderContent}
        // extraContent={extraContent}
      >
        <Analysis info = {this.state.info} visitData={this.char()}/>
      </PageHeaderLayout>
    );
  }
}

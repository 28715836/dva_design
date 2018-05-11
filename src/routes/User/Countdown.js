/*eslint-disable*/
import React, {Component} from 'react';
import {Button, message} from 'antd';
import './Countdown.css';
import {observer, inject} from 'mobx-react';
import request from "../../utils/request";

@inject('AppState')
@observer
class Countdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nums: 30,												// 倒计时时间（s）	      // 提示信息
      countdown: '发送验证码',											// 倒计时按钮值
      status: true,											// 倒计时按钮状态(disable:不可发送,able:可发送,sending:倒计时中)
    }
  }

  // 点击发送验证码
  handleSend = (event) => {
    request.post(`/producer/code/send/buildCode?phone=${this.props.AppState.currentUser.phone}&codeType=forget`).then((response) => {
      if (response.code == "200") {
        message.success("发送成功")
      } else {
        message.error("发送失败");
      }
    }).catch(error => {
      message.error("发送失败");
    });
    // 倒计时开启
    this.clock = setInterval(
      () => this.doLoop(),
      1000
    );
    this.setState({
      status: !this.state.status
    })
  }

  // 倒计时实现
  doLoop() {
    var nums = this.state.nums;
    nums--;
    this.setState({
      nums: nums
    });
    if (nums > 0) {
      this.setState({
        countdown: '重新发送(' + nums + 's)'
      });
    }
    else {
      this.resetButton();
    }
  }

  // 按钮重置
  resetButton() {
    clearInterval(this.clock);	// 清除js定时器
    this.setState({
      countdown: '发送验证码',
      status: true,
      nums: 30,	// 重置时间
    });
  }

  render() {
    return (
      <Button disabled={!this.state.status} onClick={this.handleSend}>{this.state.countdown}</Button>
    );
  }
}

export default Countdown;

import React, {Fragment} from 'react';
import {Form, Input, Button, message} from 'antd';
import styles from './style.less';
import Countdown from "./Countdown";
import request from "../../utils/request";
import { observer, inject } from 'mobx-react';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
@Form.create()
@inject('AppState')
@observer
export default class OutUpdatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        request.post(`/producer/user/forget?phone=${this.props.AppState.currentUser.phone}&code=${values.code}&password=${values.password}`).then((response) => {
          if (response != null) {
            message.success("修改成功,正在跳转");
            setTimeout(()=>{window.location = `http://101.132.194.204:9090/oauth/logout`;},1000);
          }
        }).catch(error => {
          message.error("修改失败");
        });
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  }

  render() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit} layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item
            {...formItemLayout}
            label="验证码"
          >
            {getFieldDecorator('code', {
              // initialValue: data.payAccount,
              rules: [{required: true, message: '请输入验证码'}],
            })(
              <Input style={{width: '70%'}} placeholder="请输入验证码"/>
            )}
            <Countdown/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Password"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" placeholder="请输入新密码"/>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="重新输入密码"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认密码相同!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} placeholder="请再次输入密码"/>
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

import React from 'react';
import { connect } from 'dva';
import {
  Form, Input,  Button, Card, Radio, Avatar, Spin, message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../workplace/Workplace.less';
import { observer, inject } from 'mobx-react';
import EditUploadResource from "../../components/Upload/EditUploadResource";
import request from "../../utils/request";
const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
@inject('AppState')
@observer
export default class UserInfo extends React.Component {
  state = {
    disabled: true,
    User: null,
    fileList: []
  }
  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  }
  componentDidMount () {
    this.onShowUserInfo();
  }
  onShowUserInfo () {
    const { AppState } = this.props;

    if (AppState.currentUser != null) {
      // console.log(AppState.currentUser.headPic)
      this.setState({
        fileList: [{
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: AppState.currentUser.headPic,
        }],
        User: AppState.currentUser,
      });
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.headPic = this.state.fileList[0].url;
        request.post(`/producer/user/updateUser/${this.props.AppState.currentUser.id}`,JSON.stringify(values)).then((response) => {
          if (response) {
            this.onShowUserInfo();
            message.success("修改成功")
          }
        }).catch(error=>{
          message.error("修改失败");
        });
      }
    });
  }
  //获取图片信息
  onImgUrl (imgUrl) {
    this.setState({
      fileList:[
        {
          name: imgUrl[0].fileName,
          url:imgUrl[0].filePath
        }
       ]
    })
  }
  render() {
    const { User, fileList } = this.state;
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const breadcrumbList = [{
      title: '设置',
    }, {
      title: '个人中心',
    }];
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          {this.props.AppState.currentUser.headPic == null?(
            <Avatar size="large" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />):(
            <Avatar size="large" src={this.props.AppState.currentUser.headPic} />
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>个人中心</div>
          <div>你可以在这里修改个人信息</div>
        </div>
      </div>
    );
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        content={pageHeaderContent}>
        <Card bordered={false}>
          {User ? (<Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="头像"
            >
              {getFieldDecorator('headPic', {
                initialValue: fileList[0].url,
                rules: [{
                  required: false, message: '请输入标题',
                }],
              })(
                <EditUploadResource disabled={this.state.disabled} fileList={this.state.fileList} onImgUrl = {this.onImgUrl.bind(this)}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="用户名"
            >
              {getFieldDecorator('username', {
                initialValue: User.name,
                rules: [{
                  required: true, message: '请输入用户名',
                }],
              })(
                <Input disabled={this.state.disabled} placeholder="请输入用户名" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {getFieldDecorator('sex', {
                initialValue: User.sex.toString(),
              })(
                <Radio.Group disabled={this.state.disabled}>
                  <Radio value="1">男</Radio>
                  <Radio value="0">女</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="手机号码"
            >
              {getFieldDecorator('phone', {
                initialValue: User.phone,
                rules: [{
                  required: true, message: '请输入手机号码',
                }],
              })(
                <Input disabled={this.state.disabled} placeholder="给目标起个名字" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="地址"
            >
              {getFieldDecorator('address', {
                initialValue: User.address,
                rules: [{
                  required: false, message: '请输入地址',
                }],
              })(
                <Input disabled={this.state.disabled} placeholder="请输入地址" />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button style={{display:!this.state.disabled?'none':'block'}} type="primary" onClick={this.toggleDisabled}>
                编辑
              </Button>
              <div style={{display:this.state.disabled?'none':'block'}}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.toggleDisabled}>取消</Button>
              </div>
            </FormItem>
          </Form>) : <Spin size="small" style={{ marginLeft: 8 }} />}
        </Card>
      </PageHeaderLayout>
    );
  }
}

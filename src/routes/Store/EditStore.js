import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Modal, Form, message } from 'antd';
import EditUploadResource from "../../components/Upload/EditUploadResource";
import request from "../../utils/request";
const { TextArea } = Input;

@Form.create()
export default class EditStore extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false ,
      storeName:this.props.Store.storeName,
      address:this.props.Store.address,
      contactPhone:this.props.Store.contactPhone,
      contactPeople:this.props.Store.contactPeople,
      description:this.props.Store.description,
      fileList : [{
        name: '00.png',
        url:this.props.Store.logoImgUrl
      }]
    }
  }
  //店铺名称
  onStoreName (e) {
    this.setState({
      storeName:e.target.value
    })
  }
  //店铺地址
  onStoreAddress (e) {
    this.setState({
      address:e.target.value
    })
  }
  //店铺联系人
  onContactPeople (e) {
    this.setState({
      contactPeople:e.target.value
    })
  }
  //店铺联系电话
  onContactPhone (e) {
    this.setState({
      contactPhone:e.target.value
    })
  }
  //描述
  onStoreDescription (e) {
    this.setState({
      description:e.target.value
    })
  }
  //获取图片信息
  onImgUrl (imgUrl) {
    // console.log(imgUrl);
    this.setState({
      fileList:[
        {
          name: imgUrl[0].fileName,
          url:imgUrl[0].filePath
        }
      ]
    })
  }
  handleOk () {
    const {description,contactPhone,contactPeople,address,storeName,fileList} = this.state;
    const Store = {
      description:description,
      contactPhone:contactPhone,
      contactPeople:contactPeople,
      address:address,
      storeName:storeName,
      logoImgUrl:fileList[0].url
    }
    request.post(`/producer/store/updateStore/${this.props.Store.id}`,JSON.stringify(Store)).then((response) => {
      if (response) {
        message.success("修改成功")
      }
    }).catch(error=>{
      message.error("修改失败");
    });
    this.setState({visible: false})
  }

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const { EditVisible,handleOk,handleCancel,Store } = this.props;
    const fileList= [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: Store.logoImgUrl,
    }]
    return (
      <div>
        {/*<Button type="primary" onClick={this.showModal}>Open</Button>*/}
        <Modal
          title="编辑店铺信息"
          visible={EditVisible}
          onOk={this.handleOk.bind(this)}
          onCancel={handleCancel}
        >
          <div style={{padding:'5px'}}>
            <span >店铺logo：</span>
            <EditUploadResource fileList={fileList} onImgUrl = {this.onImgUrl.bind(this)}/>
          </div>
          <div style={{padding:'5px'}}>
            <span >店铺名称：</span>
            <Input style={{width:'80%'}} defaultValue={Store.storeName} onChange={this.onStoreName.bind(this)}/>
          </div>
          <div style={{padding:'5px'}}>
            <span>联系人：</span>
            <Input style={{width:'80%'}}  defaultValue={Store.contactPeople} onChange={this.onContactPeople.bind(this)}/>
          </div>
          <div style={{padding:'5px'}}>
            <span>联系电话：</span>
            <Input style={{width:'80%'}} defaultValue={Store.contactPhone} onChange={this.onContactPhone.bind(this)}/>
          </div>
          <div style={{padding:'5px'}}>
            <span>店铺地址：</span>
            <Input style={{width:'80%'}} defaultValue={Store.address} onChange={this.onStoreAddress.bind(this)}/>
          </div>
          <div style={{padding:'5px'}}>
            <span>配送时间：</span>
            <Input style={{width:'80%'}} defaultValue={Store.deliveryTime}/>
          </div>
          <div style={{padding:'5px'}}>
            <span>店铺简介：</span>
            <TextArea style={{width:'80%'}} defaultValue={Store.description} onChange={this.onStoreDescription.bind(this)}/>
          </div>
        </Modal>
      </div>
    );
  }
}

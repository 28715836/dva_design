import React, { PureComponent,Fragment } from 'react';
import { Avatar,Row, Col, Card, Icon, Spin, Button } from 'antd';
import { observer, inject } from 'mobx-react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../workplace/Workplace.less';
import CardList from "./CardList";
import GMap from "../Map/GMap";
import request from "../../utils/request";
import EditStore from "./EditStore";
@inject('AppState')
@observer
export default class Store extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      store : null,
      EditVisible : false,
    }
  }
  componentDidMount() {
   this.onShowStore();
  }
  onShowStore () {
    const { AppState } = this.props;
    request.get(`/producer/store/selectStoreDetail/${AppState.currentUser.storeId}`).then((response) => {
      if (response) {
        // console.log(response);
        this.setState({
          store : response
        })
      }
    });
  }
  showEditModal = () => {
    this.setState({
      EditVisible: true,
    });
  }
  handleOk = (e) => {
    // console.log(e);
    this.setState({
      EditVisible: false,
    });
  }
  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      EditVisible: false,
    });
  }
  render() {
    const { store, EditVisible } = this.state;
    let list = [];
    let pageHeaderContent = null;
    let extraContent = null;
    if (store) {
       list = [{
         id: 1,
         title: '餐厅公告',
         description: store.description
       },
        {
          id:2,
          title:'联系电话',
          description:store.contactPhone
        },
         {
           id:7,
           title:'餐厅地址',
           description:store.address
         },
        {
          id:3,
          title:'起送费',
          description:store.send+"元"
        },
         {
           id:5,
           title:'联系人',
           description:store.contactPeople
         },
         {
          id:6,
          title:'配送时间',
          description:store.deliveryTime+"分钟"
        }]
       pageHeaderContent = (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar shape="square" size="large" src={store.logoImgUrl} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              {store.storeName}
            <Button onClick={this.showEditModal.bind(this)} type="primary" style={{marginRight:'10px',float:'right'}}>编辑</Button>
            <Button onClick={this.onShowStore.bind(this)} style={{marginRight:'10px',float:'right'}}><Icon type="reload" />刷新</Button>
            </div>
            <div>{store.description}</div>
          </div>
        </div>
      );
    }

     extraContent = (
      <div>
        <div className={styles.pageHeaderContent}>
          <div className={styles.header_content} style={{marginLeft: '0px',color:'#000'}}>
            配送区
          </div>
          <div style={{marginLeft:'10px'}}>
            <a>设置</a>
          </div>
        </div>
        <p><Icon type="laptop" /><span>在此处设置配送区</span></p>
      </div>
    );
    const breadcrumbList = [{
      title: '首页',
    }, {
      title: '店铺管理',
    }];
    return (
      <div>
      {store? (<PageHeaderLayout
          content={pageHeaderContent}
          breadcrumbList={breadcrumbList}

        >
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <CardList cardList={list}/>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card bordered={false} className={styles.card}>
                <Card.Meta
                  title={extraContent}
                  description={(
                    <div className={styles.item}><GMap RangeList={store.rangeList}/></div>
                  )}
                />
              </Card>
            </Col>
          </Row>
        <EditStore
          EditVisible = {EditVisible}
          Store = {store}
          handleOk = {this.handleOk.bind(this)}
          handleCancel = {this.handleCancel.bind(this)}
        />
      </PageHeaderLayout>):(<Spin style={{
        marginTop: 300,
        display: 'inherit',
        marginRight: 'auto',
      }}
      />)}
      </div>
    );
  }
}

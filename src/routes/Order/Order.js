import React,{Fragment}  from 'react';
import { Table, Card , Badge, Divider, Button, Dropdown, Icon, Menu, Alert, Form, Select, Row, Col, Input, message } from 'antd';
import request from "../../utils/request";
import { observer, inject } from 'mobx-react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from './TableList.less';
const FormItem = Form.Item;
const { Option } = Select;
@inject('AppState')
@observer
@Form.create()
export default class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Order : null,
      pagination: {},
      selectedRowKeys: [],
      selectedRows:[],
      orderId:[],
      formValues: {},
      orderNum:'',
      status:[],
      loading:false
    }
  }
  componentDidMount() {
    this.onShowOrder(this.state.status, this.state.orderNum);
  }
  onShowOrder (status, orderNum) {
    const { AppState } = this.props;
    this.setState({
      loading: true
    })
    request.get(`/producer/order/selectByOrderId/${AppState.currentUser.storeId}?status=${status}&orderNum=${orderNum}`).then((response) => {
      if (response) {
        //console.log(response);
        this.setState({
          Order : response,
          loading: false
        })
      }
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    // console.log(filters.status);
    this.onShowOrder(filters.status, this.state.orderNum);
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    // console.log('selectedRowKeys changed: ', selectedRows);
    this.setState({ selectedRowKeys:selectedRowKeys, selectedRows:selectedRows});
  }
  //批量操作
  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    if (!selectedRowKeys) return;
    var orderId = selectedRows.map(row => row.id).join(',');
    switch (e.key) {
      case 'accept':
        this.updateOrderStatus(2, orderId);
        break;
      case 'refuse':
        this.updateOrderStatus(3, orderId);
        break;
      default:
        break;
    }
  }
  //更改订单状态
  updateOrderStatus (statusNum, orderId) {
    const {status,orderNum } = this.state;
    // var orderId = selectedRows.map(row => row.id).join(',');
    request.post(`/producer/order/updateOrderStatus/${statusNum}?orderId=${orderId}`).then((response) => {
      if (response) {
        message.success("更改成功");
        this.clearSelect();
        this.onShowOrder(status, orderNum);
      }
    }).catch(error=>{
      message.error("更改失败");
    });
  }
  //清空选中
  clearSelect () {
    this.setState({ selectedRowKeys:[],selectedRows:[] });
  }
  //搜索
  handleSearch = (e) => {
    e.preventDefault();
    const {status, orderNum} = this.state;
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.status === undefined) {
        fieldsValue.status = ''
      }
      if (fieldsValue.orderNum === undefined) {
        fieldsValue.orderNum = []
      }
      this.setState({
        status: fieldsValue.status,
        orderNum:fieldsValue.orderNum
      });
      this.onShowOrder(fieldsValue.status, fieldsValue.orderNum);
    });
  }
  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      status: [],
      orderNum:''
    });
    this.onShowOrder([],'');
  }
  render() {
    const {selectedRowKeys, loading} =this.state;
    const { getFieldDecorator } = this.props.form;
    const breadcrumbList = [{
      title: '首页',
    }, {
      title: '订单管理',
    }];
    const statusMap = ['default', 'processing', 'error' ,'success'];
    const status = ['未接单', '已接单', '拒绝接单', '已完成'];
    const columns = [{
      key:'orderNum',
      title: '订单号',
      dataIndex: 'orderNum',
      fixed: 'left',
      width: 200,
      render: (text, row, index) => {
        return {
          children: <Ellipsis tooltip lines={1}>{text}</Ellipsis>,
        };
      },
    }, {
      key:'goodsOrderList',
      title: '商品信息',
      dataIndex: 'goodsOrderList',
      width: 150,
      render: (text, row, index) => {
        var Goods = [];
        for (var i= 0;i<text.length;i++) {
          if (text[i].goodsList[0] != null) {
            Goods.push(
              <p>{text[i].goodsList[0].name}*{text[i].goodsNum}</p>
            )
          }

        }
        return {
          children: <div>{Goods}</div>,
        };
      },
    },{
      key:'address',
      title: '收货人信息',
      dataIndex: 'address',
      render: (text, row, index) => {
        return {
          children: <div><p>{row.contactPeople}</p><p>{row.contactPhone}</p><p>{row.contactAddress}</p></div>,
        };
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 1,
        },
        {
          text: status[1],
          value: 2,
        },
        {
          text: status[2],
          value: 3,
        },
        {
          text: status[3],
          value: 4,
        },
      ],
      render(val, record) {
        return <Badge status={statusMap[val-1]} text={status[val-1]} />;
      },
    },{
      key:'remake',
      title: '备注',
      dataIndex: 'remake',
    },{
      key:'creationDate',
      title: '下单时间',
      dataIndex: 'creationDate',
      sorter: true,
    },{
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: 200,
      key: 'action',
      render: (record) => {
        var action = [];
        if (record.status === 1) {
          action.push(
            <Fragment>
            <a href="javascript:void(0)" onClick={this.updateOrderStatus.bind(this, 2,record.id)}>接单</a>
            <Divider type="vertical" />
              <a href="javascript:void(0)" onClick={this.updateOrderStatus.bind(this, 3, record.id)}>拒绝</a>
          </Fragment>)
        }
        if (record.status === 2) {
          action.push(
            <Fragment>
              <span>已接单</span>
            </Fragment>)
        }
        if (record.status === 3) {
          action.push(
            <Fragment>
              <span>已拒绝</span>
            </Fragment>)
        }
        if (record.status === 4) {
          action.push(
            <Fragment>
              <span>已完成</span>
            </Fragment>)
        }
    return action;
    }}];

    let data = [];
    if (this.state.Order != null) {
      data = this.state.Order;
    }
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="accept">批量接单</Menu.Item>
        <Menu.Item key="refuse">批量拒绝</Menu.Item>
      </Menu>
    );
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    const message = (<div>
      <span>已选中<a style={{fontWeight: 600}}>{selectedRowKeys ?` ${selectedRowKeys.length}` : '0'}</a>&nbsp;项</span>
      <a style={{marginLeft: '24px'}} onClick={this.clearSelect.bind(this)}>清空</a>
    </div>);

    const renderSimpleForm = (<Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="订单号">
            {getFieldDecorator('orderNum')(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="订单状态">
            {getFieldDecorator('status')(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="1">未接单</Option>
                <Option value="2">已接单</Option>
                <Option value="3">已拒绝</Option>
                <Option value="4">已完成</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
              <span>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
        </Col>
      </Row>
    </Form>)
    return(
      <PageHeaderLayout title="订单信息"
            breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {renderSimpleForm}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {
                selectedRowKeys.length > 0 && (
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                )
              }
            </div>
            <Alert style={{margin:'10px 0'}} message={message} type="info" showIcon />
            <Table
                rowSelection={rowSelection}
                onChange={this.handleTableChange}
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: 1300 }} />
          </div>
          </Card>
      </PageHeaderLayout>)
  }
}

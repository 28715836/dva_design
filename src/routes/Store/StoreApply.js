import React,{Fragment}  from 'react';
import { Table, Card , Divider,Form, Select, Row, Col, Input, Button, Menu, Dropdown, Icon, Alert, message } from 'antd';
import request from "../../utils/request";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Order/TableList.less';
import {loading} from "../../components/NoticeIcon";

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StoreApply : null,
      pagination: {},
      selectedRowKeys:[],
      selectedRows:[],
      storeName:'',
      status:[],
      sort:'',
      loading:false,
    }
  }
  componentDidMount() {
    const {status, storeName, sort} = this.state;
    this.onShowStoreApply(status, storeName, sort);
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys:selectedRowKeys, selectedRows:selectedRows});
  }
  onShowStoreApply (status, storeName, sort) {
   // const { AppState } = this.props;
    this.setState({
      loading: true
    })
    request.get(`/producer/store/selectStoreApply?status=${status}&storeName=${storeName}&sort=${sort}`).then((response) => {
      if (response) {
        this.setState({
          StoreApply : response,
          loading: false
        })
      }
    });
  }
  //搜索
  handleSearch = (e) => {
    e.preventDefault();
  //  const {status, storeName} = this.state;
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.status === undefined) {
        fieldsValue.status = ''
      }
      if (fieldsValue.storeName === undefined) {
        fieldsValue.storeName = []
      }
      this.setState({
        status: fieldsValue.status,
        storeName:fieldsValue.storeName
      });
      this.onShowStoreApply(fieldsValue.status, fieldsValue.storeName,'');
    });
  }
  //重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      status: [],
      storeName:''
    });
    this.onShowStoreApply([],'','');
  }
  //清空选中
  clearSelect () {
    this.setState({ selectedRowKeys:[] });
  }
  //批量操作
  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;

    if (!selectedRowKeys) return;
    var storeId = selectedRows.map(row => row.id).join(',');
    // console.log(storeId);
    switch (e.key) {
      case 'accept':
        this.updateStoreStatus(2, storeId);
        break;
      case 'refuse':
        this.updateStoreStatus(3, storeId);
        break;
      default:
        break;
    }
  }
  //更改店铺状态
  updateStoreStatus (statusNum, storeId) {
    const {status, storeName, sort} = this.state;
    request.post(`/producer/store/updateStoreApply/${statusNum}?storeId=${storeId}`).then((response) => {
      if (response) {
        message.success("更改成功");
        this.clearSelect();
        this.onShowStoreApply(status, storeName, sort);
      }
    }).catch(error=>{
      message.error("更改失败");
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    // console.log(filters);
    // console.log(sorter.order);
    sorter.order === undefined ?this.setState({sort:''}):this.setState({sort:sorter.order});
    switch (sorter.order) {
      case 'descend':
        this.onShowStoreApply(this.state.status, this.state.storeName,'DESC');
        break;
      case 'ascend':
        this.onShowStoreApply(this.state.status, this.state.storeName,'ASC');
        break;
      default:
        this.onShowStoreApply(this.state.status, this.state.storeName,'');
        break;
    }
  }
  render() {
    const {selectedRowKeys, loading} = this.state;
    const { getFieldDecorator } = this.props.form;
    const breadcrumbList = [{
      title: '用户',
    }, {
      title: '店铺申请',
    }];
    const columns = [{
      key:'logoImgUrl',
      title: '店铺logo',
      dataIndex: 'logoImgUrl',
      render: (text, row, index) => {
        return {
          children: <span><img style={{width:'40px',height:'40px'}} src={text}/></span>,
        };
      },
    },{
      key:'storeName',
      title: '店铺名称',
      dataIndex: 'storeName',
    },  {
      key:'address',
      title: '店铺地址',
      dataIndex: 'address',
    },{
      key:'user',
      title: '申请人',
      dataIndex: 'user',
      render: (text, row, index) => {
        return {
          children: <span>{text.name}</span>,
        };
      }
    },{
      key:'creationDate',
      title: '申请时间',
      dataIndex: 'creationDate',
      sorter: true,
    },{
      title: '操作',
      dataIndex: '',
      width: 200,
      key: 'action',
      render: (record) =>{
        // console.log(record)
        let action = <Fragment><span>已完成</span><Divider type="vertical" /><a href="">详情</a></Fragment>
        if (record.status === 1) {
           var storeId = [];
           // console.log(record)
           storeId.push(record.id)
            action = <Fragment><span><a onClick={this.updateStoreStatus.bind(this,2,storeId)}>同意</a></span><Divider type="vertical" /><span><a>拒绝</a></span><Divider type="vertical" /><a href="">详情</a></Fragment>
        }
        return {
          children:action,
        };
      }

    }];

    let data = [];
    if (this.state.StoreApply != null) {
      data = this.state.StoreApply;
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };

    const renderSimpleForm = (<Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="店铺名称">
            {getFieldDecorator('storeName')(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="店铺状态">
            {getFieldDecorator('status')(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="1">未审批</Option>
                <Option value="2">已通过</Option>
                <Option value="3">已拒绝</Option>
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
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="accept">批量同意</Menu.Item>
        <Menu.Item key="refuse">批量拒绝</Menu.Item>
      </Menu>
    );

    const message = (<div>
      <span>已选中<a style={{fontWeight: 600}}>{selectedRowKeys ?` ${selectedRowKeys.length}` : '0'}</a>&nbsp;项</span>
      <a style={{marginLeft: '24px'}} onClick={this.clearSelect.bind(this)}>清空</a>
    </div>);
    // let pagination = {
    //   defaultCurrent: 1,
    //   pageSize: 5,}
    return(
      <PageHeaderLayout title="店铺信息"
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
            loading={loading}
            // pagination = {pagination}
            dataSource={data}/>
          </div>
        </Card>
      </PageHeaderLayout>)
  }
}

import React  from 'react';
import { Table, Card , Avatar, Tag, Form, Select, Row, Col, Input, Button, Menu, Dropdown, Icon, Alert, message  } from 'antd';
import request from "../../utils/request";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Order/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      User : null,
      pagination: {},
      selectedRowKeys:[],
      selectedRows:[],
      loading:false,
      userName:'',
      status:'',
      sort:'',
    }
  }
  componentDidMount() {
    const { status, userName, sort } = this.state;
    this.onShowComment(status, userName, sort);
  }
  onShowComment (status, userName, sort) {
   // const { AppState } = this.props;
    this.setState({
      loading: true
    })
    request.get(`/producer/user/selectAllUser?status=${status}&userName=${userName}&sort=${sort}`).then((response) => {
      if (response) {
        this.setState({
          User : response,
          loading: false
        })
      }
    });
  }
  //搜索
  handleSearch = (e) => {
    e.preventDefault();
   // const {status, userName} = this.state;
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // console.log(fieldsValue);
      if (fieldsValue.status === undefined) {
        fieldsValue.status = ''
      }
      if (fieldsValue.userName === undefined) {
        fieldsValue.userName = ''
      }
      this.setState({
        status: fieldsValue.status,
        userName:fieldsValue.userName
      });
      this.onShowComment(fieldsValue.status, fieldsValue.userName,'');
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
    this.onShowComment('','','');
  }
  //清空选中
  clearSelect () {
    this.setState({ selectedRowKeys:[] });
  }
  //批量操作
  handleMenuClick = (e) => {
   // const { dispatch } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;

    if (!selectedRowKeys) return;
    var storeId = selectedRows.map(row => row.id).join(',');
    switch (e.key) {
      case 'accept':
        this.updateUserStatus(storeId, 'Y');
        break;
      case 'refuse':
        this.updateUserStatus(storeId, 'N');
        break;
      default:
        break;
    }
  }
  //更改订单状态
  updateUserStatus (storeId, statusNum) {
    const {status, userName, sort} = this.state;
    request.post(`/producer/user/updateLockStatus?userId=${storeId}&status=${statusNum}`).then((response) => {
      if (response) {
        message.success("更改成功");
        this.clearSelect();
        this.onShowComment(status, userName, sort);
      }
    }).catch(error=>{
      message.error("更改失败");
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    sorter.order === undefined ?this.setState({sort:''}):this.setState({sort:sorter.order});
    switch (sorter.order) {
      case 'descend':
        this.onShowComment(this.state.status, this.state.storeName,'DESC');
        break;
      case 'ascend':
        this.onShowComment(this.state.status, this.state.storeName,'ASC');
        break;
      default:
        this.onShowComment(this.state.status, this.state.storeName,'');
        break;
    }
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys:selectedRowKeys, selectedRows:selectedRows});
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, selectedRowKeys } = this.state;
    const breadcrumbList = [{
      title: '首页',
      href: '/admin/workplace',
    }, {
      title: '用户管理',
      href: '/',
    }];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    const columns = [{
      key:'headPic',
      title: '头像',
      width:'100',
      fixed: 'left',
      dataIndex: 'headPic',
      render: (text, row, index) => {
        if (text !== null) {
          return {
            children: <Avatar src={text}/>,
          };
        }
        return {
          children: <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />,
        };
      }
    }, {
      key:'name',
      title: '用户名',
      width:'200',
      fixed: 'left',
      dataIndex: 'name',
    },{
      key:'sex',
      title: '性别',
      dataIndex: 'sex',
      render: (text, row, index) => {
        if (text === 1) {
          return {
            children: <span>男</span>,
          };
        }
        if (text === 0) {
          return {
            children: <span>女</span>,
          };
        }
        return {
          children: <span>未填写</span>,
        };
      },
    },{
      key:'phone',
      title: '手机号',
      dataIndex: 'phone',
    },{
      key:'roleList',
      title: '角色',
      dataIndex: 'roleList',
      render: (text, row, index) => {
        var roles = [];
        if (text !== null) {
          for (var i=0; i<text.length;i++) {
              roles.push(<Tag>{text[i].roleDescribe}</Tag>)
          }
          return {children: <span>{roles}</span>,}
        }
        return {children: <span>无角色信息</span>}
      }
  },{
      key:'address',
      title: '地址',
      dataIndex: 'address',
    },{
      key:'isLock',
        title: '是否被锁',
        dataIndex: 'isLock',
    },{
      key:'creationDate',
      title: '创建时间',
      dataIndex: 'creationDate',
      sorter: true,
    },{
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: 100,
      key: 'action',
      render: (record) =>{
        var isLock = [];
        if (record.isLock === 'N') {
          isLock.push(<a onClick={this.updateUserStatus.bind(this,record.id, 'Y')}>冻结</a>)
        } else {
          isLock.push(<a onClick={this.updateUserStatus.bind(this,record.id, 'N')}>解锁</a>)
        }
        return {children: <span>{isLock}</span>}
      }
    }];

    let data = [];
    if (this.state.User != null) {
      data = this.state.User;
    }
    const renderSimpleForm = (<Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="用户名称">
            {getFieldDecorator('userName')(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="用户状态">
            {getFieldDecorator('status')(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="Y">已冻结</Option>
                <Option value="N">未冻结</Option>
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

    return(
      <PageHeaderLayout title="用户信息"
            breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {renderSimpleForm}
            </div>
            <div className={styles.tableListOperator}>
              <Button type="primary">
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
                  onChange={this.handleTableChange}
                  columns={columns}
                  rowSelection={rowSelection}
                  dataSource={data}
                  loading={loading}
                  scroll={{ x: 1500 }}/>
          </div>
        </Card>
      </PageHeaderLayout>)
  }
}

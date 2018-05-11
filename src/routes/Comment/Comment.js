import React,{Fragment}  from 'react';
import { Table, Card , Popover, Button, Form, Select, Row, Col, Input, Menu, Dropdown, Icon, Alert, Modal } from 'antd';
import request from "../../utils/request";
import { observer, inject } from 'mobx-react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import style from './style.less';
import styles from '../Order/TableList.less';
import {loading} from "../../components/NoticeIcon";
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
@inject('AppState')
@observer
export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Comment : null,
      pagination: {},
      selectedRowKeys:[],
      selectedRows:[],
      commentName:'',
      status:[],
      sort:'',
      loading:false,
      insertVisible: false,
      content:'',
      parId:[]
    }
  }
  componentDidMount() {
    this.onShowComment();
  }
  onShowComment () {
    this.setState({
      loading : true
    })
    request.get(`/producer/comment/selectComment?id=${this.props.AppState.currentUser.storeId}`).then((response) => {
      if (response) {
        // console.log(response);
        this.setState({
          Comment : response,
          loading : false
        })
      }
    });
  }
  //清空选中
  clearSelect () {
    this.setState({ selectedRowKeys:[] });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    // console.log(filters);

  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys:selectedRowKeys, selectedRows:selectedRows});
  }
  //添加评论
  insertComment(parId) {
    this.setState({
      insertVisible: true,
      parId:parId
    })
  }
  //批量操作
  handleMenuClick = (e) => {
    const { selectedRowKeys, selectedRows } = this.state;
    if (!selectedRowKeys) return;
    var parId = selectedRows.map(row => row.id).join(',');
    switch (e.key) {
      case 'accept':
        this.insertComment(parId);
        break;
      default:
        break;
    }
  }
  handleOk = () => {
    const { AppState } = this.props;
    const { parId, content } = this.state;
    request.get(`/producer/comment/replyComment/${AppState.currentUser.id}?parId=${parId}&content=${content}&storeId=${AppState.currentUser.storeId}`).then((response) => {
      if (response) {
        this.setState({
          insertVisible: false,
        })
        this.onShowComment();
      }
    });
  }
  handleCancel = () => {
    this.setState({
      insertVisible: false,
    });
  }
  commentContent (e) {
    this.setState({
      content: e.target.value
    })
  }
  render() {
    const {selectedRowKeys, loading, insertVisible} = this.state;
    const { getFieldDecorator } = this.props.form;
    const breadcrumbList = [{
      title: '首页',
    }, {
      title: '评论管理',
    }];
    const columns = [{
      key:'content',
      title: '评论内容',
      width:'200px',
      dataIndex: 'content',
      render: (text, row, index) => {
        var content = <div className={style["ant-popover-inner-content"]}>{text}</div>;
        return {
          children:
            <Popover content={content}>
              <div style={{overflow:'hidden',wordWrap:'break-word',maxHeight: '64px'}}>{text}</div>
            </Popover>,
        };
      },
    },{
      key:'user',
      title: '评论用户',
      dataIndex: 'user',
      render: (text, row, index) => {
        return {
          children: <span>{text.name}</span>,
        };
      },
    }, {
      key:'score',
      title: '评分',
      width:50,
      dataIndex: 'score',
      render: (text, row, index) => {
        return {
          children: <span>{text}分</span>,
        };
      },
    }, {
      key:'orderNum',
      title: '订单号',
      dataIndex: 'orderNum'
    },{
      key:'creationDate',
      title: '评论时间',
      dataIndex: 'creationDate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.creationDate - b.creationDate,
    },{
      title: '操作',
      dataIndex: '',
      width: 100,
      key: 'action',
      render: (record) =>
      {
        var action = <a onClick={this.insertComment.bind(this,record.id)}>回复</a>
        if (record.comment !== null) {
          action = <span>已回复</span>
        }
        return {
          children: <span>{action}</span>,
        };
      }
    }];

    let data = [];
    if (this.state.Comment != null) {
      data = this.state.Comment;
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    // const renderSimpleForm = (<Form onSubmit={this.handleSearch} layout="inline">
    //   <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
    //     <Col md={8} sm={24}>
    //       <FormItem label="店铺名称">
    //         {getFieldDecorator('storeName')(
    //           <Input placeholder="请输入" />
    //         )}
    //       </FormItem>
    //     </Col>
    //     <Col md={8} sm={24}>
    //       <FormItem label="店铺状态">
    //         {getFieldDecorator('status')(
    //           <Select placeholder="请选择" style={{ width: '100%' }}>
    //             <Option value="1">未审批</Option>
    //             <Option value="2">已通过</Option>
    //             <Option value="3">已拒绝</Option>
    //           </Select>
    //         )}
    //       </FormItem>
    //     </Col>
    //     <Col md={8} sm={24}>
    //           <span>
    //             <Button type="primary" htmlType="submit">查询</Button>
    //             <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
    //           </span>
    //     </Col>
    //   </Row>
    // </Form>)
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="accept">批量回复</Menu.Item>
      </Menu>
    );

    const message = (<div>
      <span>已选中<a style={{fontWeight: 600}}>{selectedRowKeys ?` ${selectedRowKeys.length}` : '0'}</a>&nbsp;项</span>
      <a style={{marginLeft: '24px'}} onClick={this.clearSelect.bind(this)}>清空</a>
    </div>);
    return(
      <PageHeaderLayout title="评论管理"
            breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {/*{renderSimpleForm}*/}
            </div>
            <div className={styles.tableListOperator}>
              <Button type="primary">
                快速回复
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
                  expandedRowRender={record => <div style={{ marginRight: 200,float:'right' }}>{record.comment === null?("未回复"):(<span>{record.comment.content}：{record.comment.user.name}</span>)}</div>}
                  columns={columns}
                  dataSource={data}
                  loading={loading}/>
          </div>
        </Card>
        <Modal
          title="评论回复"
          visible={insertVisible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="回复内容">
              {getFieldDecorator('content')(
                <TextArea rows={4} placeholder="请输入" onChange={this.commentContent.bind(this)}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>)
  }
}

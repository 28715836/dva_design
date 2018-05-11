import React,{Fragment}  from 'react';
import { Table, Card , Popover, Button, Form, Menu, Dropdown, Icon, Alert, message } from 'antd';
import request from "../../utils/request";
import { observer, inject } from 'mobx-react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import style from './style.less';
import styles from '../Order/TableList.less';
import {loading} from "../../components/NoticeIcon";
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
      loading:false,
    }
  }
  componentDidMount() {
    this.onShowComment();
  }
  onShowComment () {
    this.setState({
      loading : true
    })
    request.get(`/producer/comment/selectAllComment`).then((response) => {
      if (response) {
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
    console.log(filters);

  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys:selectedRowKeys, selectedRows:selectedRows});
  }
  //删除评论
  deleteComment(id) {
    this.setState({
      loading : true
    })
    request.post(`/producer/comment/deleteComment?id=${id}`).then((response) => {
      if (response) {
        message.success("删除成功");
        this.setState({
          loading : false
        });
        this.onShowComment();
      }
    }).catch(error => {
      message.error("删除失败");
    });
  }
  //批量操作
  handleMenuClick = (e) => {
    const { selectedRowKeys, selectedRows } = this.state;
    if (!selectedRowKeys) return;
    var id = selectedRows.map(row => row.id).join(',');
    switch (e.key) {
      case 'accept':
        this.deleteComment(id);
        break;
      default:
        break;
    }
  }

  render() {
    const {selectedRowKeys, loading} = this.state;
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
        var action = <a onClick={this.deleteComment.bind(this,record.id)}>删除</a>
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
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="accept">批量删除</Menu.Item>
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
                快速删除
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
                  loading={loading}/>
          </div>
        </Card>
      </PageHeaderLayout>)
  }
}

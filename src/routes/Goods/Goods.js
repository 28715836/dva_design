import React, { PureComponent } from 'react';
import { observer, inject } from 'mobx-react';
import { Button, AutoComplete, Input, Icon, Collapse, Card, List, message, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../workplace/Workplace.less';
import style from '../Store/CardList.less';
import request from "../../utils/request";
const { Meta } = Card;
const Panel = Collapse.Panel;
const confirm = Modal.confirm;
@inject('AppState')
@observer
export default class Goods extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Goods : null,
      userId : null,
      storeId : null,
      visible : false,
      editVisible : false,
      confirmLoading: false,
      categoryName: '',
      goodsOne:'',
    }
  }
  componentDidMount() {
      this.onShowGoods();
  }
  onShowGoods() {
    const { AppState } = this.props;
    request.get(`/producer/store/selectAllGoodsById/${AppState.currentUser.storeId}`).then((response) => {
      if (response.categories) {
        // console.log(response.categories);
        this.setState({
          Goods : response.categories,
          storeId : response.id
        })
      }
    }).catch(error=>{
      message.error(error);
    });
    this.setState({
      userId : AppState.currentUser.id,
    })
  }
  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };
  editCategory () {
    // console.log("=====================");
  }
  insertGoods() {
    this.linkToChange(`/admin/insertGoods/${this.props.AppState.currentUser.storeId}`);
  }
   callback(key) {
    // console.log(key);
  }
  handleOk = (e) => {
    this.setState({
      confirmLoading: true,
    });
    var category = {"categoryName":this.state.categoryName}
    request.post(`/producer/category/insertCategory/${this.props.AppState.currentUser.storeId}`,JSON.stringify(category)).then((response) => {
      if (response) {
        message.success("添加成功");
        this.onShowGoods();
      }
    }).catch(error=>{
      message.error(error);
    });
    this.setState({
      visible: false,
      confirmLoading: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
      editVisible: false,
    });
  }
  openCategory () {
    this.setState({
      visible: true,
    });
  }
  categoryName (e) {
    this.setState({
      categoryName: e.target.value,
    });
  }
  showDeleteConfirm(goodId) {
    var that = this;
    confirm({
      title: '你确定要删除这件商品吗?',
      content: '删除后将无法恢复',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        request.post(`/producer/goods/deleteGoodsById/${goodId}`).then((response) => {
          if (response) {
            message.success("删除成功");
            that.onShowGoods();
          }
          // console.log(response)
        }).catch(error=>{
          message.error(error);
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  openEditGoods (goods) {
    this.setState({
      editVisible: true,
      goodsOne: goods,
    });
  }
  editGoods () {
    var goodsInfo = [];
    const { editVisible, goodsOne } = this.state;
    if (editVisible) {
      if (goodsOne != null) {
        goodsInfo.push(<div>
          <Input defaultValue={goodsOne.name}/>
          <Input defaultValue={goodsOne.price}/>
          <Input defaultValue={goodsOne.detail}/>
        </div>);
      }
    }
    return goodsInfo;
  }
  extraContent (categoryId,categoryName) {
    const extraContent = (
      <div>
        <div className={styles.pageHeaderContent}>
          <div className={styles.header_content}>
            {categoryName}
          </div>
          <div style={{marginLeft:'10px'}}>
            {/*<Button style={{marginRight:'10px'}} onClick={this.editCategory.bind(this)} type="primary">编辑分类</Button>*/}
            {/*<Button style={{marginRight:'80px'}} type="danger">删除分类</Button>*/}
          </div>
        </div>
      </div>
    );
    return extraContent;
  }
  GoodsList () {
    const { Goods } = this.state;

    const panel = [];
    if (Goods) {
      for (var i = 0; i < Goods.length ; i++) {
        panel.push(
          <Panel header={this.extraContent(Goods[i].id,Goods[i].categoryName)} key={i}>
            <div className={style.cardList}>
              <List
                rowKey="id"
                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={Goods[i].goodsList}
                renderItem={item => (item ? (
                    <List.Item key={item.id}>
                      <Card
                        style={{ width: '250px'}}
                        cover={<img style={{height: 150}} alt={item.files[0].name} src={item.files[0].imgUrl} />}
                        actions={[<Icon onClick={this.showDeleteConfirm.bind(this,item.id)} type="delete" />,
                          <Icon type="edit"  onClick={this.openEditGoods.bind(this, item)}/>]}
                      >
                        <Meta
                          title={<div><div style={{float: 'left'}}>{item.name}</div><div style={{color:"red",float: 'right'}}>￥{item.price}</div></div>}
                          description={item.detail}
                        />
                      </Card>
                    </List.Item>
                  ) : (
                    <List.Item>
                      <Button type="dashed" className={style.newButton}>
                        <Icon type="plus" /> 新增商品
                      </Button>
                    </List.Item>
                  )
                )}
              />
            </div>
          </Panel>
        )
      }
    }
    return panel;
  }
  render() {
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.content}>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 300 }}
              size="large"
              placeholder="搜索商品"
              optionLabelProp="value"
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
            <Button onClick={this.openCategory.bind(this)} style={{height:'40px',marginLeft:'20px'}} type="primary">创建分类</Button>
            <Button style={{height:'40px',marginLeft:'10px'}} type="primary" onClick={this.insertGoods.bind(this)}>创建菜品</Button>
        </div>
      </div>
    );
    return (
      <PageHeaderLayout
        content={pageHeaderContent}
      >
        <Collapse bordered={false} defaultActiveKey={['1']} onChange={this.callback}>
          {this.GoodsList()}
        </Collapse>
        <Modal
          title="添加商品分类"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <Input placeholder="分类名称" onChange={this.categoryName.bind(this)}/>
        </Modal>
        <Modal
          title="编辑商品"
          visible={this.state.editVisible}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
        >
          {this.editGoods()}
        </Modal>
      </PageHeaderLayout>

    );
  }
}

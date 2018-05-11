import React, { PureComponent } from 'react';
import { Button, Row, Col, Card, Select, Checkbox, Input, InputNumber, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../workplace/Workplace.less';
import UploadResource from '../../components/Upload/UploadResource';
import request from "../../utils/request";
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const plainOptions = ['Apple', 'Pear', 'Orange'];

export default class Workplace extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList : [],
      goodsName : '',
      goodsPrice : 0.1,
      goodsDetail : '',
      Category : [],
      CategoryId: -1,
      Goods:'',
      flag:true,
    }
  }
  componentDidMount() {
    this.onShowCategory(this.props.match.params.id);
  }
  //查询店铺已有分类
  onShowCategory (id) {
    request.get(`/producer/category/selectCategoryByStoreId/${id}`).then((response) => {
      if (response) {
        this.setState({
          Category : response
        })
      }
    }).catch(error=>{
      message.error(error);
    });
  }
  //显示分类
  showCategoryDetail () {
    const {Category} = this.state;
    const showCategoryDetail = [];
    if (Category) {
      Category.map((item)=>{
        showCategoryDetail.push(
          <Option value={item.id}>{item.categoryName}</Option>
        )
      })
    }
    return showCategoryDetail;
  }

  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };
  back() {
    this.linkToChange(`/admin/goods`);
  }
  //商品分类
  handleChange(value) {
    this.setState({
      CategoryId: value
    })
  }
  onChange(checkedValues) {
    console.log('checked = ', checkedValues);
  }
  //商品名称
  onChangeName (e) {
    this.setState({
      goodsName: e.target.value
    })
  }
  //商品详情
  onChangeDetail (e) {
    this.setState({
      goodsDetail: e.target.value
    })
  }
  //商品价格
  onChangePrice (value) {
    this.setState({
      goodsPrice: value
    })
  }
  //商品图片
  getUrl (fileList) {
    console.log(fileList);
    this.setState({
      fileList:fileList
    })
  }
  //保存
  insertGoods() {
    const {goodsName, goodsDetail, goodsPrice, CategoryId, fileList} = this.state;
    if (CategoryId === -1) {
      message.error("商品分类不能为空")
      return;
    }
    if (fileList.length === 0) {
      message.error("商品图片不能为空")
      return;
    }
    const Goods = {
      name:goodsName,
      price:goodsPrice,
      detail:goodsDetail,
      categoryId:CategoryId
    }
    console.log(fileList)
    request.post(`/producer/goods/insertGoods/${CategoryId}?fileName=${fileList[0].filename}
    &filePath=${fileList[0].filePath}`,JSON.stringify(Goods)).then((response) => {
      if (response) {
        message.success("添加成功");
      }
    }).catch(error=>{
      message.error(error);
    });
  }
  render() {
    const { goodsName, goodsPrice, goodsDetail, Category } = this.state;
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.content}>
          <div className={styles.contentTitle}>创建菜品</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <Button onClick={this.insertGoods.bind(this)}>保存</Button>
        <Button onClick={this.back.bind(this)}>取消</Button>
      </div>
    );

    return (
      <PageHeaderLayout
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card>
              <div style={{marginBottom: 10}}>
                <p>菜品名称</p>
                <Input value={ goodsName } onChange={this.onChangeName.bind(this)}/>
              </div>
              <div style={{marginBottom: 10}}>
                <p>菜品简介</p>
                <TextArea rows={4} value={goodsDetail} onChange={this.onChangeDetail.bind(this)} />
              </div>
              <div style={{marginBottom: 10}}>
                <p>菜品图片</p>
                <UploadResource getUrl = {this.getUrl.bind(this)}/>
              </div>
              <div style={{marginBottom: 10}}>
                <p>菜品单价</p>
                <InputNumber
                  style={{width:'100%'}}
                  value={goodsPrice}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={this.onChangePrice.bind(this)}
                />
              </div>
              <div >
                <p>餐盒费</p>
                <InputNumber
                  style={{width:'100%'}}
                  defaultValue={0}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                 // onChange={onChange}
                />
              </div>
            </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card style={{ marginBottom: 24 }}>
              <div><span>菜品分类</span></div>
              <div style={{marginTop:'10px'}}>
                <Select defaultValue="-1" style={{ width: '100%' }} onChange={this.handleChange.bind(this)}>
                  <Option value="-1">----请选择----</Option>
                  {this.showCategoryDetail()}
                </Select>
              </div>
            </Card>
            <Card>
              <div><span>菜品标签</span></div>
              <div style={{marginTop:'10px'}}>
                <CheckboxGroup options={plainOptions} defaultValue={['Apple']} onChange={this.onChange} />
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}

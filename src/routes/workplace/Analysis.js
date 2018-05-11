import React, { Component } from 'react';
import {Row, Col, Icon, Tooltip } from 'antd';
import numeral from 'numeral';
import styles from './Analysis.less';
import Trend from '../../components/Trend';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
} from '../../components/Charts';

export default class Analysis extends Component {

  infoNum (index) {
    var sum = Math.random() * 1000;
    const { info } = this.props;
    // console.log(info)
    if (info != null) {
      if (index == 1) {
        sum = info[0];
      }
      if (index == 2) {
        sum = info[1];
      }
      if (index == 3) {
        sum = Math.random() * 100;
      }
    }
    return sum;
  }
  render(){
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
      style: { marginBottom: 24 },
    };
    const { visitData, info } = this.props;
    return(
      <Row gutter={24}>
        <Col {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title="总销售额"
            action={
              <Tooltip title="指标说明">
                <Icon type="info-circle-o" />
              </Tooltip>
            }
            total={yuan(this.infoNum(1))}
            footer={<Field label="日均销售额" value={`￥${numeral(this.infoNum(3)).format('0,0')}`} />}
            contentHeight={46}
          >
            <Trend flag="up" style={{ marginRight: 16 }}>
              周同比<span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
              日环比<span className={styles.trendText}>11%</span>
            </Trend>
          </ChartCard>
        </Col>
        <Col {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title="访问量"
            action={
              <Tooltip title="指标说明">
                <Icon type="info-circle-o" />
              </Tooltip>
            }
            total={numeral(this.infoNum(0)).format('0,0')}
            footer={<Field label="日访问量" value={numeral(this.infoNum(3)).format('0,0')} />}
            contentHeight={46}
          >
            <MiniArea color="#975FE4" data={visitData} />
          </ChartCard>
        </Col>
        <Col {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title="支付笔数"
            action={
              <Tooltip title="指标说明">
                <Icon type="info-circle-o" />
              </Tooltip>
            }
            total={numeral(this.infoNum(2)).format('0,0')}
            footer={<Field label="转化率" value="60%" />}
            contentHeight={46}
          >
            <MiniBar data={visitData} />
          </ChartCard>
        </Col>
        <Col {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title="运营活动效果"
            action={
              <Tooltip title="指标说明">
                <Icon type="info-circle-o" />
              </Tooltip>
            }
            total="78%"
            footer={
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <Trend flag="up" style={{ marginRight: 16 }}>
                  周同比<span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  日环比<span className={styles.trendText}>11%</span>
                </Trend>
              </div>
            }
            contentHeight={46}
          >
            <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
          </ChartCard>
        </Col>
      </Row>
    )
  }
}

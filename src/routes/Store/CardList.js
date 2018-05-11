import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List } from 'antd';

import styles from './CardList.less';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class CardList extends PureComponent {
  componentDidMount() {
  }

  render() {
    const { cardList } = this.props;
    return (
        <div className={styles.cardList}>
          <List
            rowKey="id"
            grid={{ gutter: 24, lg: 2, md: 2, sm: 1, xs: 1 }}
            dataSource={cardList}
            renderItem={item => (item ? (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card}>
                  <Card.Meta
                    title={<span>{item.title}</span>}
                    description={(
                      <div className={styles.item}>{item.description}</div>
                    )}
                  />
                </Card>
              </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" />
                  </Button>
                </List.Item>
              )
            )}
          />
        </div>
    );
  }
}

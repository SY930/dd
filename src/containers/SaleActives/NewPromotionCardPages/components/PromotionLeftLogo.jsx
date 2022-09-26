import { Col } from 'antd';
import { Component } from 'react';
import logoSrc from '../common/logo';
import styles from './style.less';

class PromotionLeftLogo extends Component {
  render() {
    const { promotionKey } = this.props;
    return (
      <Col span={4} className={styles.PromotionLeftLogo}>
        <img src={logoSrc[promotionKey]} alt="" />
      </Col>
    )
  }
}

export default PromotionLeftLogo


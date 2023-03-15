import { Button, Col, Alert } from 'antd';
import { Component } from 'react';
import { connect } from 'react-redux';
import {
    FANS_INTERACTIVITY_PROMOTION_TYPES,
    LOYALTY_PROMOTION_TYPES, NEW_CUSTOMER_PROMOTION_TYPES, ONLINE_PROMOTION_TYPES, REPEAT_PROMOTION_TYPES, SALE_PROMOTION_TYPES
} from '../../../../constants/promotionType';
import styles from './style.less';
import { decodeUrl } from '@hualala/platform-base';

class HeaderTitle extends Component {
    render() {
        const { onClose, onSave, promotionKey, loading } = this.props;
        const all_promotion_categories = [
            ...REPEAT_PROMOTION_TYPES,
            ...NEW_CUSTOMER_PROMOTION_TYPES,
            ...FANS_INTERACTIVITY_PROMOTION_TYPES,
            ...LOYALTY_PROMOTION_TYPES,
            ...SALE_PROMOTION_TYPES,
            ...ONLINE_PROMOTION_TYPES,
        ]
        const currentPromotion = all_promotion_categories.find(item => item.key == promotionKey);
        const { promotion } = this.props;
        const urlParams = decodeUrl();
        let mode = '';
        if (promotion[this.props.promotionKey]) {
            mode = promotion[this.props.promotionKey].mode;
        } else if (urlParams && urlParams.mode) {
            mode = urlParams.mode
        }

        return (
            <Col className={styles.headerTitle}>
                <h1 style={{ display: 'flex', alignItems: 'center' }}>
                    {currentPromotion.title}
                    {promotionKey == '87' ? <Alert style={{ marginBottom: 0, marginLeft: 10 }} message="请升级POS2.0-20221130beta/微信小程序SR-3.21.0以上版本使用" type="warning" showIcon /> : null}
                </h1>
                <span>
                    <Button onClick={onClose}>取消</Button>
                    {
                        mode != 'view' && <Button type="primary" style={{ marginLeft: '10px' }} onClick={onSave} loading={loading} disabled={loading}>保存</Button>
                    }
                </span>
            </Col>
        )
    }
}

const mapStateToProps = ({ newPromotionCardPagesReducer }) => {
    return {
        promotion: newPromotionCardPagesReducer.get('promotion').toJS(),
    }
};

export default connect(mapStateToProps, null)(HeaderTitle);



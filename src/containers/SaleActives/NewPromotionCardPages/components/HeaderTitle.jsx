import { Button, Col } from 'antd';
import { Component } from 'react';
import {
    FANS_INTERACTIVITY_PROMOTION_TYPES,
    LOYALTY_PROMOTION_TYPES, NEW_CUSTOMER_PROMOTION_TYPES, ONLINE_PROMOTION_TYPES, REPEAT_PROMOTION_TYPES, SALE_PROMOTION_TYPES
} from '../../../../constants/promotionType';
import styles from './style.less';

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
        return (
            <Col className={styles.headerTitle}>
                <h1>{currentPromotion.title}</h1>
                <span>
                    <Button onClick={onClose}>取消</Button>
                    <Button type="primary" style={{ marginLeft: '10px' }} onClick={onSave} loading={loading} disabled={loading}>保存</Button>
                </span>
            </Col>
        )
    }
}

export default HeaderTitle


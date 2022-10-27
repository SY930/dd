import React from 'react'
import {
    Row,
    Col,
    Form,
    Tooltip,
    Icon,
    Select,
    Radio
} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import Goods from '../../BasicModules/Goods';
import Coupon from '../../BasicModules/Coupon';

//积分换礼第三步
export const scoreConvertGiftStep3Render = function scoreConvertGiftStep3Render() {
    const { goodsData, couponData, exchangeType = '0' } = this.state;
    const { type, isNew, user, isUpdate, onlyModifyShop } = this.props;
    const { groupID } = user.accountInfo;

    const onExchangeType = ({ target }) => {
        this.setState({ exchangeType: target.value });
    }

    return (
        <div style={{ position: 'relative', zIndex: 100 }}>
            <Row>
                <Col span={20} offset={2} style={{ margin: '10px' }}>
                    <span style={{ margin: '0px 8px' }}>兑换类型</span>
                    <RadioGroup disabled={!isUpdate || onlyModifyShop} onChange={onExchangeType} value={exchangeType} >
                        <Radio value={'0'}>商品</Radio>
                        <Radio value={'1'}>优惠券</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            {exchangeType === '0' ?
            <Row>
                <Col span={24} offset={0}>
                <Goods disabled={!isUpdate || onlyModifyShop} groupID={groupID} value={goodsData} onChange={(data) => {
                    console.log(data, 'goodsData');
                    this.setState({
                        goodsData: data
                    })
                }} />
                </Col>
            </Row> :
            <Row>
                <Col span={24} offset={0}>
                <Coupon disabled={!isUpdate || onlyModifyShop} groupID={groupID} value={couponData} onChange={(data) => {
                    console.log(data, 'couponData');
                    this.setState({
                        couponData: data
                    })
                }} />
                </Col>
            </Row>}
        </div>
    )
}

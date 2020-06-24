/*
 * @Author: wangxiaofeng@hualala.com
 * @Date: 2020-06-15 14:49:36
 * @LastEditTime: 2020-06-24 11:41:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /platform-sale/src/containers/SpecialPromotionNEW/sendGifts/Three.jsx
 */

import React from 'react';
import {
    Tabs, Button, Icon, Input, Checkbox, Radio, Select, Form, Row, Col,
} from 'antd';
import { connect } from 'react-redux';

import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterSetSpecialGiftInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
import { fetchGiftListInfoAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import AddGifts from '../common/AddGifts';
import Point from '../../BasicModules/Point';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

// 赠送优惠券部分
function DiscountCouponPanel(props) {
    function handleTypeChange(val) {

    }

    const { couponType } = props;

    return (
        <RadioGroup value={couponType} onChange={({ target: { value } }) => { handleTypeChange(value) }}>
            <RadioButton value={1}>独立优惠券</RadioButton>
            <RadioButton value={4}>券包</RadioButton>
        </RadioGroup>
    );
}

class Three extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sendPoint: true,                // 0, 关闭， 1 开启
            sendCoupon: true,               // 0, 关闭券 1 打开券
            disabledGifts: false,
            data: [],
            couponType: 1,                  // 赠送的券类型
            point: 0,                       // 默认赠送积分
            cardList: [],                   // 可选会员卡
            cardTypeID: '',                 // 当前选中的会员卡
        }
    }


    componentDidMount() {

    }

    // Actions
    modifyStateWithKeyVal = (key, val) => {
        console.log('key, val', key, val);
        this.setState({
            [key]: val,
        }, () => {
            console.log(this.state.sendCoupon)
        })
    }

    // 赠送积分
    renderPointPanel = () => {
        return null
    }

    gradeChange = () => {
        return null;
    }

    discountCouponPanel = () => {
        const { couponType } = this.state;
        return (
            <RadioGroup value={couponType} onChange={({ target: { value } }) => { this.modifyStateWithKeyVal('couponType', value) }}>
                <RadioButton value={1}>独立优惠券</RadioButton>
                <RadioButton value={4}>券包</RadioButton>
            </RadioGroup>
        );
    }

    // 选择会员卡
    onCardTypeIDChange = ()=>{

    }


    // 独立优惠券或者券包
    renderCouponOrCouponPack = () => {
        const { couponType, disabledGifts = false } = this.state;

        // 独立优惠券
        if(couponType == '1') {
            return (
                <div style={{padding: '5px 0'}}>
                    <AddGifts
                        maxCount={10}
                        disabledGifts={disabledGifts}
                        type={'53'}
                        isNew={this.props.isNew}
                        value={
                            this.state.data
                        }
                        onChange={gifts => this.gradeChange(gifts, 0)}
                    />
                </div>
            )
        } 
        // 券包
        else if( couponType == '4') {

        }

        return null;
    }

    renderDiscountCouponPanel = () => {
        const { sendCoupon, disabledGifts = false } = this.state;
        if(sendCoupon == false) {
            return null;
        }
        return (
            <div>
                <div style={{padding: '5px 0'}}>
                    { this.discountCouponPanel() }
                </div>
                {
                    this.renderCouponOrCouponPack()
                }
            </div>
        )
    }

    // 是否渲染返积分
    renderPoint = ()=>{
        const { sendPoint } = this.state;
        if(sendPoint) {
            return <Point />
        }
        return null;
    }


    render() {
        const { sendPoint, sendCoupon } = this.state;

        return (
            <div>
                <Row>
                    <Col span={20} offset={2}>
                        <Checkbox
                            checked={sendPoint}
                            onChange={({ target: { checked: val } }) => {
                                this.modifyStateWithKeyVal('sendPoint', val)
                            }}
                        >赠送积分</Checkbox>
                        {
                            this.renderPoint()
                        }
                    </Col>
                </Row>
                <Row>
                    <Col span={20} offset={2}>
                        <Checkbox
                            checked={sendCoupon}
                            onChange={({ target: { checked: val } }) => {
                                this.modifyStateWithKeyVal('sendCoupon', val)
                            }}
                        >赠送优惠券</Checkbox>
                    </Col>
                    <Col span={20} offset={2}>
                        {this.renderDiscountCouponPanel()}
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        setSpecialGiftInfo: (opts) => {
            dispatch(saleCenterSetSpecialGiftInfoAC(opts));
        },
        fetchGiftListInfo: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Three);


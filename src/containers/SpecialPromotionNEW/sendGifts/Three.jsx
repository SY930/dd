/*
 * @Author: wangxiaofeng@hualala.com
 * @Date: 2020-06-15 14:49:36
 * @LastEditTime: 2020-06-15 14:51:28
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
import AddGifts from "../common/AddGifts";

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
            sendPoint: true, // 0, 关闭， 1 开启
            sendCoupon: true, // 0, 关闭券 1 打开券
            disabledGifts: false,
            data: [],
        }
    }

    componentDidMount() {

    }

    Actions
    modifyStateWithKeyVal = (key, val) => {
        this.setState({
            [key]: val,
        })
    }

    赠送积分
    renderPointPanel = () => {
        return null
    }

    gradeChange = () => {
        return null;
    }

    renderDiscountCouponPanel = () => {
        const { disabledGifts = false } = this.state;
        let a = b.x;
        return <DiscountCouponPanel />
        return (
            <React.Fragment>
                <DiscountCouponPanel />
                {/*<AddGifts*/}
                {/*    maxCount={10}*/}
                {/*    disabledGifts={disabledGifts}*/}
                {/*    type={'53'}*/}
                {/*    isNew={this.props.isNew}*/}
                {/*    value={*/}
                {/*        this.state.data*/}
                {/*    }*/}
                {/*    onChange={( gifts ) => this.gradeChange(gifts, 0)}*/}
                {/*/>*/}
            </React.Fragment>
        )
    }


    render() {
        const { sendPoint, sentCoupon } = this.state;

        return (
            <div>
                <Row>
                    <Col span={20} offset={2}>
                        <Checkbox
                            checked={sendPoint}
                            onChange={({ target: { value: val } }) => {
                                this.modifyStateWithKeyVal('sendPoint', val)
                            }}
                        >赠送积分</Checkbox>
                    </Col>
                </Row>
                <Row>
                    <Col span={20} offset={2}>
                        <Checkbox
                            checked={sentCoupon}
                            onChange={({ target: { value: val } }) => {
                                this.modifyStateWithKeyVal('sentCoupon', val)
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


/**
 * @Author: ZBL
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-03-02T14:31:40+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, Input } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';
import RangeInput from '../../../containers/SaleCenterNEW/common/RangeInput';

const FormItem = Form.Item;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import ProjectEditBox from '../../../components/basic/ProjectEditBox/ProjectEditBox';
import { NDiscount } from './NDiscount'; // 可增删的输入框 组件

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const Immutable = require('immutable');


const client = [
    { key: 'ALL_USER', value: '0', name: '不限制' },
    { key: 'CUSTOMER_ONLY', value: '1', name: '仅会员' },
    { key: 'CUSTOMER_EXCLUDED', value: '2', name: '非会员' },
];


class NDiscountDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            nDiscount: {
                0: {},
            },
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule = Object.assign({}, _rule);
        const dis = {};
        if (_rule.stage) {
            _rule.stage.map((rule, index) => {
                dis[index] = {
                    value: (rule.discountRate * 10).toFixed(2),
                    validateFlag: true,
                }
            });
            this.setState({ nDiscount: dis });
        }
        let { display } = this.state;
        display = !this.props.isNew;
        this.setState({ display });
    }


    handleSubmit = () => {
        // console.log("handleSubmit");
        let nextFlag = true;
        const { nDiscount } = this.state;
        const disArr = [];

        Object.keys(nDiscount).map((key) => {
            if (nDiscount[key].value == '') {
                nextFlag = false;
                nDiscount[key].validateFlag = false;
            } else {
                disArr.push(nDiscount[key]);
            }
        })
        this.setState({ nDiscount });

        if (nextFlag) {
            const rule = {
                stageType: 2,
                stage: disArr.map((nDis, index) => {
                    return {
                        stageAmount: index + 2,
                        discountRate: (nDis.value * 1000) / 10000,
                    }
                }),
            }
            this.props.setPromotionDetail({
                rule,
            });
            return true;
        }
        return false
    };

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };


    renderAdvancedSettingButton() {
        return (
            <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }} >
                <span className={styles.gTip}>更多活动用户限制和互斥限制请使用</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    高级设置 {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form className={styles.FormStyle}>
                    <PromotionDetailSetting />
                    <NDiscount
                        onChange={
                            (value) => {
                                let { nDiscount } = this.state;
                                nDiscount = value;
                                this.setState({ nDiscount });
                            }
                        }
                        form={this.props.form}
                        value={this.state.nDiscount}
                    />
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo: state.steps.toJS(),
        fullCut: state.sale_fullCut_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(NDiscountDetailInfo));

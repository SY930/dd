/**
 * @Author: chenshuang
 * @Date:   2017-04-01T10:57:21+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-05T11:16:58+08:00
 */


/*
 Created by Zbl on 2016/12/08 。 添加 满减活动
 */

import React, { Component } from 'react'
import { Row, Col, Form, Input, InputNumber, Select, TreeSelect } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';

const FormItem = Form.Item;
import {
    saleCenterSetPromotionDetailAC,
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const Option = Select.Option;
import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME,
} from '../../../redux/actions/saleCenterNEW/types';

const Immutable = require('immutable');

class VoucherDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            giftValue: '',
            transFee: '',
            stageAmount: '',
            giftItemID: '',
            giftName: '',
            giftMaxUseNum: '',
            stageType: '2',
            targetScope: '0',
            giftValueFlag: true,
        };

        this.renderVoucher = this.renderVoucher.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.onGiftValueChange = this.onGiftValueChange.bind(this);
        this.onTransFeeChange = this.onTransFeeChange.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onGiftMaxUseNumChange = this.onGiftMaxUseNumChange.bind(this);
    }
    componentDidMount() {
        this.props.fetchGiftListInfo({
            _groupID: 5,
        });

        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        const _categoryOrDish = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']);

        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule = Object.assign({}, _rule); let { display } = this.state;
        display = !this.props.isNew;
        this.setState({
            display,
            targetScope: _categoryOrDish || '0',
            giftPrice: _rule.giftPrice,
            giftName: _rule.giftName,
            transFee: _rule.transFee,
            giftValue: _rule.giftValue,
            stageType: _rule.stageType || '2',
            stageAmount: _rule.stage ? _rule.stage[0].stageAmount : _rule.stageAmount,
            giftMaxUseNum: _rule.stage ? _rule.stage[0].giftMaxUseNum : _rule.giftMaxUseNum,

        });
    }

    handleSubmit = (cbFn) => {
        const _state = this.state;
        if (_state.giftValue == null || _state.giftValue == '') {
            _state.giftValueFlag = false;
        }
        this.setState(_state);

        let nextFlag = true;

        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                nextFlag = false;
            }

            if (this.state.error == true) {
                nextFlag = false;
            }

            if (_state.giftValueFlag && nextFlag) {
                let rule;
                if (_state.stageType == '2') {
                    rule = {
                        transFee: _state.transFee,
                        giftValue: _state.giftValue,
                        stageType: _state.stageType,
                        giftItemID: _state.giftItemID,
                        giftName: _state.giftName,
                        stage: [
                            {
                                stageAmount: _state.stageAmount,
                                giftMaxUseNum: _state.giftMaxUseNum,
                            },
                        ],
                        targetScope: _state.targetScope,
                    };
                } else if (_state.stageType == '1') {
                    rule = {
                        transFee: _state.transFee,
                        giftValue: _state.giftValue,
                        stageType: _state.stageType,
                        giftItemID: _state.giftItemID,
                        giftName: _state.giftName,
                        stageAmount: _state.stageAmount,
                        giftMaxUseNum: _state.giftMaxUseNum,
                        targetScope: _state.targetScope,
                    };
                } else {
                    rule = {
                        transFee: _state.transFee,
                        giftValue: _state.giftValue,
                        stageType: _state.stageType,
                        giftItemID: _state.giftItemID,
                        giftName: _state.giftName,
                        giftMaxUseNum: _state.giftMaxUseNum,
                        targetScope: _state.targetScope,
                    };
                }
                // save state to redux
                this.props.setPromotionDetail({
                    rule,
                });
            } else {
                nextFlag = false;
            }
        });
        return nextFlag;
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.getIn(['$giftInfo', 'initialized'])) {
            const giftInfo = nextProps.promotionDetailInfo.getIn(['$giftInfo', 'data']).toJS();
            const _giftTypes = giftInfo
                .filter(giftItem =>
                    giftItem.giftType == 10 ||
                    giftItem.giftType == 20 ||
                    giftItem.giftType == 30
                );


            const treeData = [];
            _giftTypes.map((gt, idx) => {
                treeData.push({
                    label: SALE_CENTER_GIFT_TYPE.filter(giftTypeName => giftTypeName.value == gt.giftType)[0].label,
                    key: gt.giftType,
                    children: [],
                });
                gt.crmGifts.map((gift) => {
                    treeData[idx].children.push({
                        label: gift.giftName,
                        value: [gift.giftItemID, gift.giftName].join(' '),
                        key: gift.giftItemID,
                    });
                });
            });
            this.setState({ giftTreeData: treeData });
        }

        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) !=
        nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])) {
            this.setState({ targetScope: nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) });
        }
    }

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    onGiftValueChange(value) {
        let { giftValue, giftValueFlag } = this.state;
        if (value.number == null || value.number == '') {
            giftValueFlag = false;
            giftValue = value.number;
        } else {
            giftValueFlag = true;
            giftValue = value.number;
        }
        this.setState({ giftValue, giftValueFlag });
    }
    onTransFeeChange(value) {
        let { transFee } = this.state;
        transFee = value.number;
        this.setState({ transFee });
    }
    onStageAmountChange(value) {
        let { stageAmount } = this.state;
        stageAmount = value.number;
        this.setState({ stageAmount });
    }
    onGiftMaxUseNumChange(value) {
        let { giftMaxUseNum } = this.state;
        giftMaxUseNum = value.number;
        this.setState({ giftMaxUseNum });
    }
    renderVoucher() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <FormItem
                    label="减免金额"
                    className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={true}
                    validateStatus={this.state.giftValueFlag ? 'success' : 'error'}
                    help={this.state.giftValueFlag ? null : '请输入减免金额'}
                >
                    <PriceInput
                        addonBefore={''}
                        addonAfter={'元'}
                        modal="float"
                        value={{ number: this.state.giftValue }}
                        defaultValue={{ number: this.state.giftValue }}
                        onChange={this.onGiftValueChange}
                    />
                </FormItem>

                <FormItem
                    label="代金券"
                    className={[styles.FormItemStyle, styles.foodCount].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('giftName', {
                        rules: [{
                            whitespace: true,
                            required: true,
                            message: '请选择代金券',
                        }],
                        initialValue: [this.state.giftItemID, this.state.giftName].join(' '),
                        onChange: (value) => {
                            if (value) {
                                const newValue = value.split(' ');
                                let { giftName, giftItemID } = this.state;
                                giftName = newValue[1];
                                giftItemID = newValue[0];
                                this.setState({ giftName, giftItemID });
                            } else {

                            }
                        },
                    })(
                        <TreeSelect
                            className={styles.selectIn}
                            treeData={this.state.giftTreeData}
                            dropdownMatchSelectWidth={true}
                            dropdownStyle={{ maxHeight: 400, overflowY: 'scroll' }}
                            size="default"
                        />
                    )}
                </FormItem>

                <FormItem
                    label="券交易手续费"
                    className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <PriceInput
                        addonBefore={''}
                        addonAfter={'元'}
                        modal="float"
                        onChange={this.onTransFeeChange}
                        value={{ number: this.state.transFee }}
                        defaultValue={{ number: this.state.transFee }}
                    />
                </FormItem>

                <FormItem label="账单使用" className={[styles.FormItemStyle, styles.groupTicket, styles.priceInputSingle].join(' ')} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <Select
                        size="default"
                        value={`${this.state.stageType}`}
                        getPopupContainer={(node) => node.parentNode}
                        onChange={(value) => {
                            let { stageType } = this.state;
                            stageType = value;
                            this.setState({ stageType });
                        }}
                    >
                        <Option value="2" key="2">账单金额满</Option>
                        <Option value="1" key="1">账单金额每满</Option>
                    </Select>
                    <span className={styles.priceInLine}>
                        <PriceInput
                            addonBefore={''}
                            addonAfter={'元'}
                            modal="float"
                            onChange={this.onStageAmountChange}
                            value={{ number: this.state.stageAmount }}
                            defaultValue={{ number: this.state.stageAmount }}
                        />
                    </span>
                    <span className={[styles.inputLabel, styles.inputLabelTwo].join(' ')}>最多使用代金券</span>
                    <span className={styles.priceInLine}>
                        <PriceInput
                            addonBefore={''}
                            addonAfter={'张'}
                            modal="int"
                            onChange={this.onGiftMaxUseNumChange}
                            value={{ number: this.state.giftMaxUseNum }}
                            defaultValue={{ number: this.state.giftMaxUseNum }}
                        />
                    </span>
                </FormItem>
            </div>
        )
    }

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
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderVoucher()}
                    <PromotionDetailSetting />
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={true} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo: state.sale_steps.toJS(),
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

        fetchGiftListInfo: (opts) => {
            dispatch(fetchGiftListInfoAC(opts))
        },

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(VoucherDetailInfo));

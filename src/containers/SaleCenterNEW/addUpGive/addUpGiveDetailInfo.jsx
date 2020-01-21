/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-30T10:17:40+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: fullGiveDetailInfo.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T22:40:04+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React, { Component } from 'react';
import {
    Form,
    Select,
    Input,
} from 'antd';
import { connect } from 'react-redux';
import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'

const FormItem = Form.Item;
const Option = Select.Option;
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

@injectIntl()
class AddUpGiveDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: false,
            maxTimesStatus: 'success',
            rule: {
                stageType: '1',
                minTimes: '',
                maxTimes: '',
                stageAmount: '',
                giveFoodCount: '',
            },
            priceLst: [],
        };
        this.onChangeClick = this.onChangeClick.bind(this);
        this.handleStageTypeChange = this.handleStageTypeChange.bind(this);
        this.handleStageChange = this.handleStageChange.bind(this);
        this._handleStageChange = this._handleStageChange.bind(this);
        this.handleFoodCountChange = this.handleFoodCountChange.bind(this);
        this.onDishesChange = this.onDishesChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        let rule = this.props.promotionDetailInfo.toJS().$promotionDetail.rule;
        let priceLst = this.props.promotionDetailInfo.toJS().$promotionDetail.priceLst;
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const count = promotionType == '1080' ? 'giveFoodCount' : 'freeAmount';
        if (rule === null || rule === undefined) {
            return;
        }
        rule = {
            stageType: rule.stageType ? rule.stageType : '1',
            minTimes: rule.minTimes || '',
            maxTimes: rule.maxTimes || '',
            stageAmount: rule.stageAmount ? rule.stageAmount : '',
            giveFoodCount: rule[`${count}`] ? rule[`${count}`] : '',
        };
        priceLst = priceLst || [];
        const display = !this.props.isNew;
        this.setState({ rule, priceLst, display })
    }
    componentWillReceiveProps(nextProps) {
    }

    handleSubmit = (cbFn) => {
        let nextFlag = true;
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        this.props.form.validateFieldsAndScroll((err, values) => {
            const { rule, priceLst } = this.state;
            const count = promotionType == '1080' ? 'giveFoodCount' : 'freeAmount';
            const _rule = {
                stageType: rule.stageType,
                [count]: rule.giveFoodCount,
            };
            if (rule.stageType == '1') { // 每累计
                _rule.stageAmount = rule.stageAmount;
                if (_rule.stageAmount < 2) {
                    nextFlag = false;
                    this.props.form.setFields({
                        stageAmount: {
                            value: _rule.stageAmount,
                            errors: [new Error(SALE_LABEL.k5kmrzrz)],
                        },
                    })
                }
            } else { // 累计
                _rule.minTimes = rule.minTimes;
                _rule.maxTimes = rule.maxTimes;
                if (!rule.maxTimes || rule.maxTimes < rule.minTimes) {
                    nextFlag = false;
                    this.setState({ maxTimesStatus: 'error' })
                }
                if (_rule.minTimes < 2) {
                    nextFlag = false;
                    this.props.form.setFields({
                        stageAmount: {
                            value: _rule.minTimes,
                            errors: [new Error(SALE_LABEL.k5kmrzrz)],
                        },
                    })
                }
            }
            if (err) {
                nextFlag = false;
            }
            this.props.setPromotionDetail({ rule: _rule, priceLst });
        });
        return nextFlag;
    }
    onChangeClick() {
        this.setState(
            { display: !this.state.display }
        )
    }
    handleStageTypeChange(val) {
        const { rule } = this.state;
        rule.stageType = val;
        rule.minTimes = '';
        rule.maxTimes = '';
        rule.stageAmount = '';
        this.setState({ rule }, () => {
            this.props.form.setFieldsValue({
                stageAmount: '',
                stageAmountTwo: '',
            })
        })
    }
    handleStageChange(e) {
        const { rule } = this.state;
        const _value = e.target.value ? Number(e.target.value) : '';
        if (rule.stageType == '1') { // 每满
            rule.stageAmount = _value;
        } else { // 满
            rule.minTimes = _value;
        }
        this.setState({ rule }, () => {
            if (_value < 2) {
                this.props.form.setFields({
                    stageAmount: {
                        value: _value,
                        errors: [new Error(SALE_LABEL.k5kmrzrz)],
                    },
                })
            }
            if ((parseInt(this.state.rule.maxTimes || 0) < parseInt(this.state.rule.minTimes || 0) && this.state.rule.maxTimes && parseInt(this.state.rule.minTimes || 0) < 99999) || parseInt(this.state.rule.maxTimes) >= 100000) {
                this.setState({ maxTimesStatus: 'error' })
            } else {
                this.setState({ maxTimesStatus: 'success' })
            }
        });
    }
    _handleStageChange(e) {
        const { rule } = this.state;
        rule.maxTimes = e.target.value && !isNaN(e.target.value) ? parseInt(e.target.value) : '';
        this.setState({ rule }, () => {
            if (parseInt(this.state.rule.maxTimes) >= parseInt(this.state.rule.minTimes || 0) && parseInt(this.state.rule.maxTimes) < 100000) {
                this.setState({ maxTimesStatus: 'success' })
            } else {
                this.setState({ maxTimesStatus: 'error' })
            }
        })
    }
    handleFoodCountChange(e) {
        const { rule } = this.state;
        rule.giveFoodCount = e.target.value;
        this.setState({ rule })
    }
    onDishesChange(value) {
        let { priceLst } = this.state;
        priceLst = value.map((dish, index) => {
            return {
                foodUnitID: dish.itemID || index,
                foodUnitCode: dish.foodKey,
                foodName: dish.foodName,
                foodUnitName: dish.unit,
                brandID: dish.brandID || '0',
                price: dish.price,
                stageNo: 0,
            }
        });
        this.setState({ priceLst })
    }
    renderDishsSelectionBox = () => {
        const { intl } = this.props;
        const k5hkj1ef = intl.formatMessage(SALE_STRING.k5hkj1ef);

        return (
            <FormItem
                label={SALE_LABEL.k5hly0bq}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {
                    this.props.form.getFieldDecorator('priceLst', {
                        rules: [{
                            required: true,
                            message: k5hkj1ef,
                        }],
                        initialValue: this.state.priceLst,
                    })(
                        <ConnectedPriceListSelector isShopMode={this.props.isShopFoodSelectorMode} onChange={this.onDishesChange} />
                    )}
            </FormItem>
        )
    }
    renderAdvancedSettingButton() {
        return (
            <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }} >
                <span className={styles.gTip}>{SALE_LABEL.k5ezdwpv}</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                {SALE_LABEL.k5ezdx9f} {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const { intl } = this.props;
        const k5kms08n = intl.formatMessage(SALE_STRING.k5kms08n);
        const k5kms0gz = intl.formatMessage(SALE_STRING.k5kms0gz);
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);

        const k5kmrzrz = intl.formatMessage(SALE_STRING.k5kmrzrz);
        return (
            <Form>
                <FormItem
                    label={SALE_LABEL.k5kms00b}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 17 }}
                    style={{ marginLeft: '-32px' }}
                >
                    <Form layout="inline">
                        <FormItem
                            style={{ width: this.state.rule.stageType == '1' ? '62.5%' : '35%', marginRight: '2px' }}
                            className={styles.inputAddonSelect}
                        >
                            {
                                getFieldDecorator('stageAmount', {
                                    rules: [{
                                        required: true,
                                        message: k5kmrzrz,
                                        pattern: /^[1-9][0-9]{0,3}[0-8]?$/,
                                    }],
                                    initialValue: this.state.rule.stageType == '1' ? this.state.rule.stageAmount : this.state.rule.minTimes,
                                })(
                                    <Input
                                        // className={styles.inputAddonSelect}不生效
                                        addonBefore={<Select value={this.state.rule.stageType}
                                                             onChange={this.handleStageTypeChange}
                                                             getPopupContainer={(node) => node.parentNode}
                                        >
                                        <Option key="1">{k5kms08n}</Option>
                                        <Option key="2">{k5kms0gz}</Option>
                                        </Select>}
                                        addonAfter={SALE_LABEL.k5kms0pc}
                                        onChange={(val) => { this.handleStageChange(val) }}
                                    />
                                )}
                        </FormItem>
                        {this.state.rule.stageType == '1' ? null :
                        <FormItem style={{ width: '3%', margin: '0 2px' }}>
                            <p>{SALE_LABEL.k5kn0ay5}</p>
                            </FormItem>
                        }
                        {this.state.rule.stageType == '1' ? null :
                        <FormItem
                                style={{ width: '24%', marginRight: 0 }}
                                validateStatus={this.state.maxTimesStatus}
                                help={this.state.maxTimesStatus == 'success' ? null : `${this.state.rule.minTimes > 1 && this.state.rule.minTimes < 100000 ? this.state.rule.minTimes : 2}~99999${SALE_LABEL.k5kms0xo}`}
                            >
                                <Input
                                value={this.state.rule.maxTimes}
                                addonAfter={SALE_LABEL.k5kms0pc}
                                onChange={(val) => { this._handleStageChange(val) }}
                            />
                            </FormItem>
                        }
                        <FormItem style={{ width: '30%', marginLeft: '10px' }}>
                            {
                                getFieldDecorator('giveFoodCount', {
                                    rules: [{
                                        required: true,
                                        message: `0~100000 ${SALE_LABEL.k5kms0xo} ${promotionType == '1080' ? SALE_LABEL.k5kms160 : ','+ SALE_LABEL.k5kms1ec}`,
                                        pattern: promotionType == '1080' ? /^[1-9][0-9]{0,4}$/ : /(^[1-9][0-9]{0,4}(\.[0-9]{0,2})?$)|(^0\.([1-9][0-9]?|0[1-9])$)/,
                                    }],
                                    initialValue: this.state.rule.giveFoodCount,
                                })(
                                    <Input
                                        addonBefore={promotionType == '1080' ? SALE_LABEL.k5kn0bn5 : SALE_LABEL.k5ezcd0f}
                                        addonAfter={promotionType == '1080' ? k5ez4qy4 : k5ezdbiy}
                                        onChange={(val) => { this.handleFoodCountChange(val) }}
                                    />
                                )
                            }
                        </FormItem>
                    </Form>
                </FormItem>
                <div >
                    {promotionType == '1080' ? this.renderDishsSelectionBox() : null}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                </div>
            </Form>
        )
    }
}

function mapStateToProps(state) {
    return {
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
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
)(Form.create()(AddUpGiveDetailInfo));

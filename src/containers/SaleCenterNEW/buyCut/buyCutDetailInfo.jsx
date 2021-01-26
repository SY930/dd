import React from 'react'
import { Form, Radio, Select } from 'antd';
import { connect } from 'react-redux'
import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const Immutable = require('immutable');

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@injectIntl()
class BuyCutDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: false,
            stageAmount: '',
            freeAmount: '',
            discountRate: '',
            targetScope: 0,
            stageAmountFlag: true,
            freeAmountFlag: true,
            discountRateFlag: true,
            cutWay: '1',
            ruleType: '1',
        };

        this.renderBuyDishNumInput = this.renderBuyDishNumInput.bind(this);
        this.renderGiveDishNumInput = this.renderGiveDishNumInput.bind(this);
        this.renderCutWay = this.renderCutWay.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onDiscountRateChange = this.onDiscountRateChange.bind(this);
        this.onFreeAmountChange = this.onFreeAmountChange.bind(this);
        this.onCutWayChange = this.onCutWayChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        const display = !this.props.isNew;
        this.setState({
            display,
        });
        this.initRule();
    }

    initRule(props = this.props) {
        let _rule = props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);

        // 
        let [cutWay, ruleType = '1'] = [...String(_rule.disType)]

        this.setState({
            stageAmount: _rule.stageAmount,
            freeAmount: _rule.freeAmount || '',
            discountRate: _rule.discountRate ? Number((_rule.discountRate * 1).toFixed(3)).toString() : '',
            cutWay,
            ruleType,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) !=
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])) {
            this.setState({ targetScope: nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) });
        }
    }

    handleSubmit = () => {
        let { ruleType, cutWay, stageAmount, freeAmount, discountRate, targetScope, stageAmountFlag, freeAmountFlag, discountRateFlag } = this.state;
        if (stageAmount == null || stageAmount == '') {
            stageAmountFlag = false;
        }
        if (freeAmount == null || freeAmount == '') {
            freeAmountFlag = false;
        }
        if (discountRate == null || discountRate == '' || parseFloat(discountRate) > 10) {
            discountRateFlag = false;
        }
        this.setState({ freeAmountFlag, discountRateFlag, stageAmountFlag });

        // distype  
        if(ruleType == 1){
            if(cutWay == 1 || cutWay == 3){
                if (stageAmountFlag && freeAmountFlag) {
                    this.props.setPromotionDetail({
                        rule: {
                            disType: cutWay == 1 ? 1 : 31,
                            stageType: 0,
                            targetScope,
                            stageAmount,
                            freeAmount: parseFloat(freeAmount),
                        },
                    });
                    return true;
                }
                return false
            }else{
                if (stageAmountFlag && discountRateFlag) {
                    this.props.setPromotionDetail({
                        rule: {
                            disType: 2,
                            stageType: 0,
                            targetScope,
                            stageAmount,
                            discountRate: parseFloat(discountRate),
                        },
                    });
                    return true;
                }
                return false
            }
            return false;
        }
        if(ruleType == 2){
            if(cutWay == 1 || cutWay == 3){
                if (stageAmountFlag && freeAmountFlag) {
                    this.props.setPromotionDetail({
                        rule: {
                            disType: cutWay == 1 ? 12 : 32,
                            stageType: 0,
                            targetScope,
                            stageAmount,
                            freeAmount: parseFloat(freeAmount),
                        },
                    });
                    return true;
                }
                return false
            }else{
                if (stageAmountFlag && discountRateFlag) {
                    this.props.setPromotionDetail({
                        rule: {
                            disType: 22,
                            stageType: 0,
                            targetScope,
                            stageAmount,
                            discountRate: parseFloat(discountRate),
                        },
                    });
                    return true;
                }
                return false
            }
            return false;
        }
        return false
    };
    // 优惠方式change
    onCutWayChange(e) {
        let { cutWay } = this.state;
        cutWay = e.target.value;
        this.setState({ cutWay });
    }
    // 高级设置的显示隐藏
    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };
    // 指定菜品的购买数量
    onStageAmountChange(value) {
        let { stageAmount, stageAmountFlag } = this.state;
        if (value.number == null || value.number == '') {
            stageAmountFlag = false;
            stageAmount = value.number;
        } else {
            stageAmountFlag = true;
            stageAmount = value.number;
        }
        this.setState({ stageAmount, stageAmountFlag });
    }
    // 减免金额change
    onFreeAmountChange(value) {
        let { freeAmount, freeAmountFlag } = this.state;
        if (value.number == null || value.number == '') {
            freeAmountFlag = false;
            freeAmount = value.number;
        } else {
            freeAmountFlag = true;
            freeAmount = value.number;
        }
        this.setState({ freeAmount, freeAmountFlag });
    }
    // 折扣率change
    onDiscountRateChange(value) {
        let { discountRate, discountRateFlag } = this.state;
        if (value.number == null || value.number == '' || parseFloat(value.number) > 10) {
            discountRateFlag = false;
            discountRate = value.number;
        } else {
            discountRateFlag = true;
            discountRate = value.number;
        }
        this.setState({ discountRate, discountRateFlag });
    }

    ruleTypeChange = (val) => {
        this.setState({ruleType: val})
    }

    renderBuyDishNumInput = () => {
        const { intl } = this.props;
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        const k5ez4pvb = intl.formatMessage(SALE_STRING.k5ez4pvb);
        const RULE_TYPE = [
            { label: '指定菜品消费满', value: '1' },
            { label: '同一菜品消费满', value: '2' },
        ];
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={this.state.stageAmountFlag ? 'success' : 'error'}
            >
                <PriceInput
                    addonBefore={
                        <Select size="default"
                            onChange={this.ruleTypeChange}
                            value={this.state.ruleType}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                RULE_TYPE.map((item) => {
                                    return (<Option key={item.value} value={item.value}>{item.label}</Option>)
                                })
                            }
                        </Select>
                    }
                    addonAfter={k5ez4qy4}
                    value={{ number: this.state.stageAmount }}
                    defaultValue={{ number: this.state.stageAmount }}
                    onChange={this.onStageAmountChange}
                    modal="int"
                />
                {/* <span className={[styles.gTip, styles.gTipInLine].join(' ')}>{SALE_LABEL.k5hly0k2}</span> */}
            </FormItem>
        )
    }

    renderGiveDishNumInput = () => {
        const { intl } = this.props;
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);
        const k5ezcuto = intl.formatMessage(SALE_STRING.k5ezcuto);
        const k5ezdc19 = intl.formatMessage(SALE_STRING.k5ezdc19);
        const k5ezdckg = intl.formatMessage(SALE_STRING.k5ezdckg);
        if (this.state.cutWay === '1') {
            return (<FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={this.state.freeAmountFlag ? 'success' : 'error'}
            >

                <PriceInput
                    addonBefore={k5ezcuto}
                    addonAfter={k5ezdbiy}
                    value={{ number: this.state.freeAmount }}
                    defaultValue={{ number: this.state.freeAmount }}
                    onChange={this.onFreeAmountChange}
                    modal="float"
                />
            </FormItem>
            )
        }
        if (this.state.cutWay === '3') {
            return (<FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={this.state.freeAmountFlag ? 'success' : 'error'}
            >
                <PriceInput
                    addonBefore={'每份减免'}
                    addonAfter={k5ezdbiy}
                    value={{ number: this.state.freeAmount }}
                    defaultValue={{ number: this.state.freeAmount }}
                    onChange={this.onFreeAmountChange}
                    modal="float"
                />
            </FormItem>
            )
        }
        return (<FormItem
            className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
            wrapperCol={{ span: 17, offset: 4 }}
            required={true}
            validateStatus={this.state.discountRateFlag ? 'success' : 'error'}
            help={!this.state.discountRateFlag ? SALE_LABEL.k5ezcavr : null}
        >
            <PriceInput
                addonBefore={SALE_LABEL.k5kec1k8}
                addonAfter={k5ezdc19}
                placeholder={k5ezdckg}
                discountMode={true}
                value={{ number: this.state.discountRate }}
                defaultValue={{ number: this.state.discountRate }}
                onChange={this.onDiscountRateChange}
                modal="float"
            />
        </FormItem>
        )
    }

    renderCutWay() {
        return (

            <FormItem
                label={SALE_LABEL.k5kec0v8}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <RadioGroup value={this.state.cutWay} onChange={this.onCutWayChange}>
                    <Radio value={'1'} key="1">{SALE_LABEL.k5kec13k}</Radio>
                    <Radio value={'2'} key="2">{SALE_LABEL.k5kec1bw}</Radio>
                    <Radio value={'3'} key="3">{'每份减免'}</Radio>
                </RadioGroup>
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
        return (
            <div>
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                    {this.renderBuyDishNumInput()}
                    {this.renderCutWay()}
                    {this.renderGiveDishNumInput()}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
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
)(Form.create()(BuyCutDetailInfo));

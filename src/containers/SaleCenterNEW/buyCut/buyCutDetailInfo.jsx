import React from 'react'
import { Form, Radio } from 'antd';
import { connect } from 'react-redux'
import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';


const Immutable = require('immutable');

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
            cutWay: '0',
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

        this.setState({
            stageAmount: _rule.stageAmount,
            freeAmount: _rule.freeAmount || '',
            discountRate: _rule.discountRate ? Number((_rule.discountRate * 1).toFixed(3)).toString() : '',
            cutWay: _rule.freeAmount ? '0' : '1',
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) !=
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])) {
            this.setState({ targetScope: nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) });
        }
        if (nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule']) !==
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule'])) {
            this.initRule(nextProps);
        }
    }

    handleSubmit = () => {
        let { cutWay, stageAmount, freeAmount, discountRate, targetScope, stageAmountFlag, freeAmountFlag, discountRateFlag } = this.state;
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

        if (cutWay == '0') {
            if (stageAmountFlag && freeAmountFlag) {
                this.props.setPromotionDetail({
                    rule: {
                        disType: 1,
                        stageType: 0,
                        targetScope,
                        stageAmount,
                        freeAmount: parseFloat(freeAmount),
                    },
                });
                return true;
            }
            return false;
        }
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
        return false;
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

    renderBuyDishNumInput() {
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={this.state.stageAmountFlag ? 'success' : 'error'}
            >

                <PriceInput
                    addonBefore={'购买指定菜品满'}
                    addonAfter={'份'}
                    value={{ number: this.state.stageAmount }}
                    defaultValue={{ number: this.state.stageAmount }}
                    onChange={this.onStageAmountChange}
                    modal="int"
                />
                <span className={[styles.gTip, styles.gTipInLine].join(' ')}>表示购买菜品的总数，如输入2，代表所有菜品任意购买满2份</span>
            </FormItem>
        )
    }

    renderGiveDishNumInput() {
        if (this.state.cutWay === '0') {
            return (<FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={this.state.freeAmountFlag ? 'success' : 'error'}
            >

                <PriceInput
                    addonBefore={'减免金额'}
                    addonAfter={'元'}
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
            help={!this.state.discountRateFlag ? '不得为空, 不大于10' : null}
        >

            <PriceInput
                addonBefore={'打'}
                addonAfter={'折'}
                placeholder="输入不大于10的数字(例如9.5折, 8折)"
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
                label="优惠方式"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <RadioGroup value={this.state.cutWay} onChange={this.onCutWayChange}>
                    <Radio value={'0'} key="0">减金额</Radio>
                    <Radio value={'1'} key="1">打折扣</Radio>
                </RadioGroup>
            </FormItem>
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
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    {
                        this.props.isShopFoodSelectorMode ? <PromotionDetailSetting /> :
                        <ConnectedScopeListSelector/>
                    }
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

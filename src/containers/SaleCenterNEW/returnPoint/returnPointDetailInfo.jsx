import { Col, Form, Icon, Row, Select, Checkbox, message,Radio } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import CustomRangeInput from '../../../containers/SaleCenterNEW/common/CustomRangeInput';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import { saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import styles from '../ActivityPage.less';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';
const Immutable = require('immutable');

const Option = Select.Option;
const FormItem = Form.Item;
const CheckGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
@injectIntl()
class ReturnPointDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            showRulesOption: 0,
            maxCount: 3,
            ruleInfo: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: null,
                    end: null,
                },
            ],
            ruleInfo1: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: null,
                    end: null,
                },
            ],
            ruleType: '2',
            returnPointType:'1',
            checkedPoints: false,
            checkedQuota: false
        };
        this.onCustomRangeInputChange = this.onCustomRangeInputChange.bind(this);
        this.addRule = this.addRule.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.onChangeChecked = this.onChangeChecked.bind(this);
        this.setPointsType = this.setPointsType.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });

        // restore data from redux to state
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        let checkedPoints = false, checkedQuota = false;
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        if (Object.keys(_rule).length > 0) {
            let { display } = this.state;
            display = !this.props.isNew;
            let { ruleInfo, ruleInfo1 } = this.state;
            if (_rule.returnPointStageType == '1') {
                if (_rule.givePointRate && _rule.pointStageAmount) {
                    checkedPoints = true;
                    ruleInfo = [{
                        start: _rule.pointStageAmount,
                        end: _rule.givePointRate,
                        validationStatus: 'success',
                        helpMsg: null,
                    }]
                }
                if (_rule.giveBalanceRate && _rule.balanceStageAmount) {
                    checkedQuota = true;
                    ruleInfo1 = [{
                        start: _rule.balanceStageAmount,
                        end: _rule.giveBalanceRate,
                        validationStatus: 'success',
                        helpMsg: null,
                    }]
                }
            } else if (_rule.returnPointStageType == '2') {
                if (_rule.returnPointStage && _rule.returnPointStage.length > 0) {
                    checkedPoints = true;
                    ruleInfo = _rule.returnPointStage.map((stageInfo) => {
                        return {
                            start: stageInfo.pointStageAmount,
                            end: stageInfo.givePointRate,
                            validationStatus: 'success',
                            helpMsg: null,
                        }
                    })
                }
                if (_rule.returnBalanceStage && _rule.returnBalanceStage.length > 0) {
                    checkedQuota = true;
                    ruleInfo1 = _rule.returnBalanceStage.map((stageInfo) => {
                        return {
                            start: stageInfo.balanceStageAmount,
                            end: stageInfo.giveBalanceRate,
                            validationStatus: 'success',
                            helpMsg: null,
                        }
                    })
                }
            }

            this.setState({
                display,
                ruleType: _rule.returnPointStageType,
                returnPointType: _rule.returnPointType,
                ruleInfo,
                ruleInfo1,
                checkedPoints: checkedPoints,
                checkedQuota: checkedQuota,
            });
        }
    }

    handleSubmit = (cbFn) => {
        const { intl } = this.props;
        const k6hdptkl = intl.formatMessage(SALE_STRING.k6hdptkl);
        let { ruleInfo, ruleType, ruleInfo1, checkedPoints, checkedQuota,returnPointType } = this.state;
        if (!checkedPoints && !checkedQuota) {
            message.warning('请选择赠送积分或赠送卡值');
            return
        }
        if (!checkedPoints) {
            ruleInfo = [];
        }
        if (!checkedQuota) {
            ruleInfo1 = [];
        }
        let validateArr = ruleInfo.concat(ruleInfo1);
        const ruleValidation = validateArr.reduce((p, c) => {
            if (c.start == null || c.end == null || c.start == '' || c.end == '' || Number.isNaN(c.start) || Number.isNaN(c.end)) {
                c.validationStatus = 'error';
                c.helpMsg = k6hdptkl;
            }
            return p && c.validationStatus === 'success';
        }, true);
        let rule;
        console.log(ruleType,'ruletype00000000')
        // construct state to specified format
        if (ruleType == '2') {
            rule = {
                returnPointStageType: parseInt(ruleType),
                returnPointType: returnPointType,
                returnPointStage: ruleInfo.map((ruleInfo) => {
                    if (ruleInfo && ruleInfo.start && ruleInfo.end) {
                        return {
                            pointStageAmount: ruleInfo.start,
                            givePointRate: ruleInfo.end,
                        }
                    } else {
                        return null
                    }
                }),
                returnBalanceStage: ruleInfo1.map((ruleInfo) => {
                    if (ruleInfo && ruleInfo.start && ruleInfo.end) {
                        return {
                            balanceStageAmount: ruleInfo.start,
                            giveBalanceRate: ruleInfo.end,
                        }
                    } else {
                        return null
                    }
                }),
            };
        } else {
            rule = {
                returnPointStageType: parseInt(ruleType),
                returnPointType: returnPointType,
                pointStageAmount: ruleInfo.length > 0 ? ruleInfo[0].start : '',
                givePointRate: ruleInfo.length > 0 ? ruleInfo[0].end : '',
                balanceStageAmount: ruleInfo1.length > 0 ? ruleInfo1[0].start : '',
                giveBalanceRate: ruleInfo1.length > 0 ? ruleInfo1[0].end : '',
            }
        }
        // save state to redux
        if (ruleValidation) {
            this.props.setPromotionDetail({
                rule,
            });
            return true;
        }
        // TODO: add a message tips here
        this.setState({ ruleInfo });
    };

    componentWillUnmount() {

    }
    setPointsType = (e) => {
        const { value } = e.target;
        this.setState({
            returnPointType: value 
        })
    } 
    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };
    onChangeChecked(checkedValues) {
        const { target: { value, checked } } = checkedValues;
        const key = "checked" + value;
        if (value === '1') {
            this.setState({
                checkedPoints: checked,
                checkedType: value
            })
        }
        if (value === '2') {
            this.setState({
                checkedQuota: checked,
                checkedType: value
            })
        }
    }
    onCustomRangeInputChange(value, index, type) {
        const { intl } = this.props;
        const k6hdptkl = intl.formatMessage(SALE_STRING.k6hdptkl);

        let _validationStatus,
            _helpMsg;
        if ((parseFloat(value.end) > 0) || (value.start == null && value.end != null) || (value.start != null && value.end == null)) {
            _validationStatus = 'success';
            _helpMsg = null
        } else {
            _validationStatus = 'error';
            _helpMsg = k6hdptkl
        }

        const _tmp = type === '1' ? this.state.ruleInfo : this.state.ruleInfo1;
        _tmp[index] = {
            start: value.start,
            end: value.end,
            validationStatus: _validationStatus,
            helpMsg: _helpMsg,
        };
        if (type === '1') {
            this.setState({ ruleInfo: _tmp })
        } else if (type === '2') {
            this.setState({ ruleInfo1: _tmp })
        }
    }

    renderPromotionRule() {
        const { intl } = this.props;
        const { checkedPoints, checkedQuota } = this.state;
        const k6hdpt3x = intl.formatMessage(SALE_STRING.k6hdpt3x);
        const k6hdptc9 = intl.formatMessage(SALE_STRING.k6hdptc9);
        const type = [
            { value: '2', name: k6hdpt3x },
            { value: '1', name: k6hdptc9 },
        ];
        return (
            <div>
                <FormItem
                    label={SALE_LABEL.k5ez4n7x}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >

                    <Select
                        placeholder=""
                        className={`${styles.linkSelectorRight} returnPointClassJs`}
                        getPopupContainer={(node) => node.parentNode}
                        value={`${this.state.ruleType}`}
                        onChange={(val) => {
                            let { ruleType, maxCount } = this.state;
                            ruleType = val;
                            if (val == '1') {
                                maxCount = 1;
                                this.state.ruleInfo.length = 1;
                                this.state.ruleInfo1.length = 1;
                            } else {
                                maxCount = 3
                            }
                            this.setState({ ruleType, maxCount });
                        }
                        }
                    >
                        {type
                            .map((type) => {
                                return <Option key={type.value} value={type.value}>{type.name}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                <Checkbox value={'1'} onChange={this.onChangeChecked} checked={checkedPoints} className={styles.checkLabel}>赠送积分</Checkbox>
                {checkedPoints ? this.renderPointsComponent() : null}
                <Checkbox value={'2'} onChange={this.onChangeChecked} checked={checkedQuota} className={styles.checkLabel}>赠送卡值</Checkbox>
                {checkedQuota ? this.renderQuotaComponent() : null}
            </div>
        )
    }
    renderPointsComponent() {
        const { ruleInfo,returnPointType } = this.state;
        const { intl } = this.props;
        const k6hdptsx = intl.formatMessage(SALE_STRING.k6hdptsx);
        let unit  =  returnPointType == '1' ? '%' : '';
        console.log(unit,returnPointType,'returnPoint============')
        return (
            <Col>
                <FormItem
                    className={styles.FormItemStyle}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 10 }}
                    style={{marginLeft:110}}
                >
                    <RadioGroup
                        value={returnPointType}
                        onChange={(e) => this.setPointsType(e)}
                    >
                        <Radio value={'1'}>按比例返</Radio >
                        <Radio value={'2'}>按固定值返</Radio >
                    </RadioGroup >
                </FormItem>
                {
                    ruleInfo.map((ruleInfo, index) => {
                        const _value = {
                            start: null,
                            end: null,
                        };
                        if (ruleInfo.start) {
                            _value.start = ruleInfo.start;
                        }
                        if (ruleInfo.end) {
                            _value.end = ruleInfo.end;
                        }
                        return (
                            <Row key={`${index}`}>
                                <Col>
                                    <FormItem
                                        className={styles.FormItemStyle}
                                        style={{ marginLeft: '109px', width: '70.5%' }}
                                        validateStatus={ruleInfo.validationStatus}
                                        help={ruleInfo.helpMsg}
                                    >
                                        <CustomRangeInput
                                            relation={returnPointType == '2' ? '返固定积分' : k6hdptsx}
                                            addonBefore={this.state.ruleType == 1 ? SALE_LABEL.k67g8n1b : SALE_LABEL.k5nh214x}
                                            addonAfterUnit={unit}
                                            value={_value}
                                            onChange={(value) => {
                                                const _index = index;
                                                this.onCustomRangeInputChange(value, _index, '1');
                                            }
                                            }
                                        />
                                    </FormItem>
                                </Col>
                                {
                                    this.state.ruleType != 1 ?
                                        <Col>
                                            {this.renderOperationIcon(index, '1')}
                                        </Col>
                                        :
                                        ''
                                }
                            </Row >
                        )
                    })
                }
            </Col>
        )
    }
    renderQuotaComponent() {
        const { ruleInfo1 } = this.state;
        const { intl } = this.props;
        const k6hdptsx = '返卡值比例';
        return (ruleInfo1.map((ruleInfo, index) => {
            const _value = {
                start: null,
                end: null,
            };
            if (ruleInfo.start) {
                _value.start = ruleInfo.start;
            }
            if (ruleInfo.end) {
                _value.end = ruleInfo.end;
            }

            return (
                <Row key={`${index}`}>
                    <Col>
                        <FormItem
                            className={styles.FormItemStyle}
                            style={{ marginLeft: '109px', width: '70.5%' }}
                            validateStatus={ruleInfo.validationStatus}
                            help={ruleInfo.helpMsg}
                        >
                            <CustomRangeInput
                                relation={k6hdptsx}
                                addonBefore={this.state.ruleType == 1 ? SALE_LABEL.k67g8n1b : SALE_LABEL.k5nh214x}
                                addonAfterUnit={'%'}
                                value={
                                    _value
                                }
                                onChange={(value) => {
                                    const _index = index;
                                    this.onCustomRangeInputChange(value, _index, '2');
                                }
                                }
                            />
                        </FormItem>
                    </Col>
                    {
                        this.state.ruleType != 1 ?
                            <Col>
                                {this.renderOperationIcon(index, '2')}
                            </Col>
                            :
                            ''
                    }
                </Row >
            )
        }))
    }
    addRule(type) {
        if (type === '1') {
            let ruleInfo = [...this.state.ruleInfo];
            ruleInfo.push({
                validationStatus: 'success',
                helpMsg: null,
                start: null,
                end: null,
            });
            this.setState({
                ruleInfo
            });
        }
        if (type === '2') {
            let ruleInfo1 = [...this.state.ruleInfo1];
            ruleInfo1.push({
                validationStatus: 'success',
                helpMsg: null,
                start: null,
                end: null,
            });
            this.setState({
                ruleInfo1
            });
        }
    }

    deleteRule(index, e, type) {
        const { ruleInfo, ruleInfo1 } = this.state;
        const _tmp = type === '1' ? ruleInfo : ruleInfo1;
        _tmp.splice(index, 1);
        if (type === '1') {
            this.setState({
                'ruleInfo': _tmp,
            })
        }
        if (type === '2') {
            this.setState({
                'ruleInfo1': _tmp,
            })
        }

    }

    renderOperationIcon(index, type) {
        const { ruleInfo, ruleInfo1 } = this.state;
        const _len = type === '1' ? ruleInfo.length : ruleInfo1.length;

        if (this.state.maxCount == 1) {
            return null;
        }

        if (_len == 1 && this.state.maxCount > _len) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={() => this.addRule(type)} />
                </span>
            )
        }

        if (_len == this.state.maxCount && index == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon
                        className={styles.deleteIconLeft}
                        type="minus-circle-o"
                        onClick={(e) => {
                            const _index = index;
                            this.deleteRule(_index, e, type)
                        }}
                    />
                </span>
            )
        }
        if (index == _len - 1 && _len == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={() => this.addRule(type)} />
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        onClick={(e) => {
                            const _index = index;
                            this.deleteRule(_index, e, type)
                        }}
                    />
                </span>
            )
        }
        return null;
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
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={true} /> : null}
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
)(Form.create()(ReturnPointDetailInfo));

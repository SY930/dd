import { Col, Form, Icon, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import CustomRangeInput from '../../../containers/SaleCenterNEW/common/CustomRangeInput';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import { saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import styles from '../ActivityPage.less';
const Immutable = require('immutable');
const type = [
    { value: '2', name: '消费满一定金额即赠送相应积分' },
    { value: '1', name: '消费每满一定金额即赠送相应积分' },
];
const Option = Select.Option;
const FormItem = Form.Item;

class ReturnPointDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            maxCount: 3,

            ruleInfo: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: null,
                    end: null,
                },
            ],

            ruleType: '2',
        };
        this.onCustomRangeInputChange = this.onCustomRangeInputChange.bind(this);
        this.addRule = this.addRule.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });

        // restore data from redux to state
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule = Object.assign({}, _rule);
        if (Object.keys(_rule).length > 0) {
            let { display } = this.state;
            display = !this.props.isNew;
            let _ruleInfo;
            if (_rule.returnPointStage !== undefined) {
                _ruleInfo = _rule.returnPointStage.map((stageInfo) => {
                    return {
                        start: stageInfo.pointStageAmount,
                        end: stageInfo.givePointRate,
                        validationStatus: 'success',
                        helpMsg: null,
                    }
                })
            } else {
                _ruleInfo = [{
                    start: _rule.pointStageAmount,
                    end: _rule.givePointRate,
                    validationStatus: 'success',
                    helpMsg: null,
                }]
            }
            this.setState({
                display,
                ruleType: _rule.returnPointStageType,
                ruleInfo: _ruleInfo,
            });
        }
    }

    handleSubmit = (cbFn) => {
        const { ruleInfo, ruleType } = this.state;
        const ruleValidation = ruleInfo.reduce((p, c) => {
            if (c.start == null || c.end == null || c.start == '' || c.end == '' || Number.isNaN(c.start) || Number.isNaN(c.end)) {
                c.validationStatus = 'error';
                c.helpMsg = '请输入正确的金额或返积分比例';
            }
            return p && c.validationStatus === 'success';
        }, true);
        let rule;

        // construct state to specified format
        if (ruleType == '2') {
            rule = {
                returnPointStageType: parseInt(ruleType),
                returnPointStage: ruleInfo.map((ruleInfo) => {
                    return {
                        pointStageAmount: ruleInfo.start,
                        givePointRate: ruleInfo.end,
                    }
                }),
            };
        } else {
            rule = {
                returnPointStageType: parseInt(ruleType),
                pointStageAmount: ruleInfo[0].start,
                givePointRate: ruleInfo[0].end,
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

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    onCustomRangeInputChange(value, index) {
        let _validationStatus,
            _helpMsg;
        if ((parseFloat(value.end) >= 0) || (value.start == null && value.end != null) || (value.start != null && value.end == null)) {
            _validationStatus = 'success';
            _helpMsg = null
        } else {
            _validationStatus = 'error';
            _helpMsg = '请输入正确的金额或返积分比例'
        }

        const _tmp = this.state.ruleInfo;
        _tmp[index] = {
            start: value.start,
            end: value.end,
            validationStatus: _validationStatus,
            helpMsg: _helpMsg,
        };
        this.setState({ ruleInfo: _tmp })
    }

    renderPromotionRule() {
        return (
            <div>
                <FormItem
                    label="活动方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >

                    <Select
                        placeholder="请选择活动类别"
                        className={`${styles.linkSelectorRight} returnPointClassJs`}
                        getPopupContainer={(node) => node.parentNode}
                        value={`${this.state.ruleType}`}
                        onChange={(val) => {
                            let { ruleType, maxCount } = this.state;
                            ruleType = val;
                            if (val == '1') {
                                maxCount = 1;
                                this.state.ruleInfo.length = 1;
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
                {
                    this.renderRulesComponent()
                }


            </div>
        )
    }
    renderRulesComponent() {
        return (this.state.ruleInfo.map((ruleInfo, index) => {
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
                                relation={'返积分比例'}
                                addonBefore={this.state.ruleType == 1 ? '消费每满' : '消费满'}
                                addonAfterUnit={'%'}
                                value={
                                    _value
                                }
                                onChange={(value) => {
                                    const _index = index;
                                    this.onCustomRangeInputChange(value, _index);
                                }
                                }
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        {this.renderOperationIcon(index)}
                    </Col>

                </Row>

            )
        }))
    }

    addRule() {
        const _tmp = this.state.ruleInfo;
        _tmp.push({
            validationStatus: 'success',
            helpMsg: null,
            start: null,
            end: null,
        });

        this.setState({
            'ruleInfo': _tmp,
        });
    }

    deleteRule(index, e) {
        const _tmp = this.state.ruleInfo;
        _tmp.splice(index, 1);

        this.setState({
            'ruleInfo': _tmp,
        })
    }

    renderOperationIcon(index) {
        const _len = this.state.ruleInfo.length;
        //
        if (this.state.maxCount == 1) {
            return null;
        }

        if (_len == 1 && this.state.maxCount > _len) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addRule} />
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
                            this.deleteRule(_index, e)
                        }}
                    />
                </span>
            )
        }
        if (index == _len - 1 && _len == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addRule} />
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        onClick={(e) => {
                            const _index = index;
                            this.deleteRule(_index, e)
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

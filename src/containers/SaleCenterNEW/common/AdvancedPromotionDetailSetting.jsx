/**
 * @Author: chenshuang
 * @Date:   2017-03-30T14:17:50+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T17:27:56+08:00
 */


import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Radio, Button, Icon } from 'antd';
import styles from '../ActivityPage.less';
// import ProjectEditBox from '../../../components/basic/ProjectEditBox/ProjectEditBox';
import {
    saleCenterSetPromotionDetailAC,
    fetchPromotionListAC,
    fetchRoleListInfoAC,
    fetchSubjectListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    CLIENT_CATEGORY,
    PAYMENTS_OPTIONS,
    CLIENT_CATEGORY_RETURN_GIFT,
    CLIENT_CATEGORY_ADD_UP,
} from '../../../redux/actions/saleCenterNEW/types.js';
import EditBoxForPromotion from './EditBoxForPromotion';
import EditBoxForSubject from './EditBoxForSubject';
import EditBoxForRole from './EditBoxForRole';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Immutable = require('immutable');

class AdvancedPromotionDetailSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            promotionList: {},
            mutexPromotions: [],
            mutexSubjects: [],
            selectedRole: [],
            userSetting: 'ALL_USER',
            subjectType: '0',
            blackListRadio: '0',
            display: 'none',
        };

        this.renderUserSetting = this.renderUserSetting.bind(this);
        this.renderPaymentSetting = this.renderPaymentSetting.bind(this);
        this.renderExcludedPromotionSelection = this.renderExcludedPromotionSelection.bind(this);
        this.renderExcludedPayTypeSelection = this.renderExcludedPayTypeSelection.bind(this);
        this.onPromotionChange = this.onPromotionChange.bind(this);
        this.onSubjectChange = this.onSubjectChange.bind(this);
        this.renderRoleOptions = this.renderRoleOptions.bind(this);
        this.renderExcludedPromotionBlackList = this.renderExcludedPromotionBlackList.bind(this);
        this.handleBlackListRadioChange = this.handleBlackListRadioChange.bind(this);
    }
    componentDidMount() {
        let userSetting = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'userSetting']);
        const subjectType = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'subjectType']);
        const blackList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'blackList']);
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        userSetting = (promotionType === 'BILL_CUMULATION_FREE' || promotionType === 'FOOD_CUMULATION_GIVE')
            && userSetting === 'ALL_USER' ? 'CUSTOMER_ONLY' : userSetting;
        this.setState({
            userSetting,
            subjectType,
            blackListRadio: blackList ? '1' : '0',
        });
    }
    componentWillReceiveProps(nextProps) {
        let { userSetting, subjectType } = this.state;
        if (nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'userSetting']) !==
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'userSetting'])) {
            userSetting = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'userSetting']);
            this.setState({ userSetting });
        }
        if (nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'subjectType']) !==
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'subjectType'])) {
            subjectType = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'subjectType']);
            this.setState({ subjectType });
        }
    }


    renderUserSetting() {
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        // let _stash = promotionType == 'RETURN_GIFT' || promotionType == 'RETURN_POINT';
        return (
            <FormItem
                label={'活动适用用户'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >

                <Select
                    size={'default'}
                    className={styles.linkSelectorRight}
                    value={promotionType === 'RETURN_POINT' ? 'CUSTOMER_ONLY' :
                        promotionType === 'RETURN_GIFT' && this.props.stashSome ? 'CUSTOMER_ONLY' :
                            (promotionType === 'BILL_CUMULATION_FREE' || promotionType === 'FOOD_CUMULATION_GIVE')
                                && this.state.userSetting === 'ALL_USER' ? 'CUSTOMER_ONLY' :
                                this.state.userSetting}
                    onChange={(val) => {
                        {/* console.log(val) */ }
                        this.setState({
                            userSetting: val,
                        });
                        this.props.setPromotionDetail({
                            userSetting: val,
                        })
                    }}
                >
                    {
                        promotionType === 'RETURN_POINT' ? (<Option key={'CUSTOMER_ONLY'} value={'CUSTOMER_ONLY'}>{'仅会员'}</Option>) :
                            promotionType === 'RETURN_GIFT' ?
                                this.props.stashSome ?
                                    [CLIENT_CATEGORY_RETURN_GIFT[1]].map((type) => {
                                        return <Option key={type.key} value={type.key}>{type.name}</Option>
                                    }) :
                                    CLIENT_CATEGORY_RETURN_GIFT.map((type) => {
                                        return <Option key={type.key} value={type.key}>{type.name}</Option>
                                    }) :
                                promotionType === 'BILL_CUMULATION_FREE' || promotionType === 'FOOD_CUMULATION_GIVE' ?
                                    CLIENT_CATEGORY_ADD_UP.map((type) => {
                                        return <Option key={type.key} value={type.key}>{type.name}</Option>
                                    }) :
                                    CLIENT_CATEGORY
                                        .map((type) => {
                                            return <Option key={type.key} value={type.key}>{type.name}</Option>
                                        })
                    }
                </Select>
            </FormItem>
        )
    }

    renderPaymentSetting() {
        return (
            <FormItem
                label="支付限制"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <RadioGroup
                    value={this.state.subjectType}
                    onChange={(e) => {
                        this.setState({
                            subjectType: e.target.value,
                        });
                        this.props.setPromotionDetail({
                            subjectType: e.target.value,
                        })
                    }
                    }
                >
                    {PAYMENTS_OPTIONS
                        .map((type) => {
                            return <Radio key={type.value} value={type.value}>{type.name}</Radio >
                        })}
                </RadioGroup >
            </FormItem>
        )
    }

    onPromotionChange(val) {
        this.setState({
            mutexPromotions: val,
        });
        this.props.setPromotionDetail({
            blackList: this.state.blackListRadio != '0',
            mutexPromotions: val.map((promotion) => {
                return {
                    promotionIDStr: promotion.promotionIDStr || '',
                    sharedType: promotion.sharedType ? promotion.sharedType : '10',
                    finalShowName: promotion.finalShowName || '展示名称未匹配',
                }
            }),
        });
    }

    onSubjectChange(val) {
        this.setState({
            mutexSubjects: val,
        });

        this.props.setPromotionDetail({
            mutexSubjects: val.map((subject) => {
                return subject.subjectKey;
            }),
        });
    }
    onRoleChange = (val) => {
        this.setState({
            selectedRole: val,
        });

        this.props.setPromotionDetail({
            role: val.map((role) => {
                return role.roleID;
            }),
        });
    };
    renderExcludedPromotionBlackList() {
        const tip = (
            <div style={{ display: this.state.display, height: 240, width: 460 }} className={styles.tip}>
                <div><p style={{ marginBottom: 10 }}>共享名单方式</p></div>
                <Row style={{ height: '30%' }}>
                    <Col span={3} style={{ marginTop: -7 }}>白名单:</Col>
                    <Col span={20}>本活动与下方选择的活动<span style={{ color: '#222222' }}>共享</span>，空白（不选择）表示本活动与所有活动<span style={{ color: '#222222' }}>不共享</span></Col>
                </Row>
                <Row style={{ height: '30%' }}>
                    <Col span={3} style={{ marginTop: -7 }}>黑名单:</Col>
                    <Col span={20}>本活动与下方选择的活动<span style={{ color: '#222222' }}>不共享</span>，空白（不选择）表示本活动与所有活动<span style={{ color: '#222222' }}>共享</span></Col>
                </Row>
                <div style={{ marginRight: 14 }}>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={() => {
                                this.setState({ display: 'none' });
                            }}
                        >我知道了
                        </Button>
                    </div>
                </div>
            </div>
        );
        return (
            <FormItem
                label="共享名单方式"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <RadioGroup value={this.state.blackListRadio} onChange={this.handleBlackListRadioChange}>
                    <Radio key={'0'} value={'0'}>白名单</Radio>
                    <Radio key={'1'} value={'1'}>黑名单</Radio>
                    <Icon
                        type="question-circle-o"
                        className={styles.question}
                        onMouseOver={() => {
                            this.setState({ display: 'block' })
                        }}
                    />
                </RadioGroup>
                {tip}
            </FormItem>
        )
    }
    handleBlackListRadioChange(e) {
        this.setState({ blackListRadio: e.target.value });
        this.props.setPromotionDetail({
            blackList: e.target.value != '0',
        });
    }
    renderExcludedPromotionSelection() {
        return (

            <FormItem
                label={this.state.blackListRadio == '1' ? '活动共享黑名单' : '活动共享白名单'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <EditBoxForPromotion onChange={(val) => {
                    this.onPromotionChange(val)
                }}
                />
            </FormItem>
        )
    }

    renderExcludedPayTypeSelection() {
        return (
            <FormItem
                label="结算方式互斥"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <EditBoxForSubject onChange={(val) => {
                    this.onSubjectChange(val)
                }}
                />
            </FormItem>
        )
    }


    renderRoleOptions() {
        return (

            <FormItem
                label="活动执行角色"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <EditBoxForRole onChange={(val) => {
                    this.onRoleChange(val)
                }}
                />
            </FormItem>
        )
    }
    renderCardLeval = ($promotionDetail) => {
        return (
            <div>
                <FormItem
                    label="会员范围"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        // value={this.state.subjectType}
                        onChange={(e) => {
                            this.setState({
                                // subjectType: e.target.value,
                            });
                            this.props.setPromotionDetail({
                                // subjectType: e.target.value,
                            })
                        }
                        }
                    >
                        <Radio key={'0'} value={'0'}>卡类别</Radio >
                        <Radio key={'1'} value={'1'}>卡等级</Radio >
                    </RadioGroup >
                </FormItem>
                <FormItem
                    label="适用卡类/等级"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select
                        size={'default'}
                        className={styles.linkSelectorRight}
                        // value={}
                        onChange={(val) => {
                            {/* console.log(val) */ }
                            this.setState({
                                // userSetting: val,
                            });
                            this.props.setPromotionDetail({
                                // userSetting: val,
                            })
                        }}
                    >
                        {
                            [].map(type => <Option key={type.key} value={type.key}>{type.name}</Option>)

                        }
                    </Select>

                </FormItem>

            </div>
        )
    }

    render() {
        const $promotionDetail = this.props.promotionDetailInfo.get('$promotionDetail');
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const _stash = promotionType === 'RETURN_GIFT' || promotionType === 'RETURN_POINT';
        const $promotionScope = this.props.promotionScopeInfo.get('$scopeInfo');
        return (
            <div>
                {this.renderUserSetting($promotionDetail)}
                {this.renderCardLeval($promotionDetail)}
                {
                    this.props.payLimit ?
                        this.renderPaymentSetting($promotionDetail)
                        : null
                }
                {_stash ? null : this.renderExcludedPromotionBlackList()}
                {_stash ? null : this.renderExcludedPromotionSelection()}
                {/* {this.renderExcludedPayTypeSelection()} */}
                {
                    _stash || $promotionScope.toJS().auto == 1 || $promotionScope.toJS().channel == 2 ? null :
                        this.renderRoleOptions()
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user.toJS(),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },

        fetchPromotionList: (opts) => {
            dispatch(fetchPromotionListAC(opts))
        },

        fetchRoleList: (opts) => {
            dispatch(fetchRoleListInfoAC(opts));
        },

        fetchSubjectListInfo: (opts) => {
            dispatch(fetchSubjectListInfoAC(opts));
        },
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedPromotionDetailSetting);

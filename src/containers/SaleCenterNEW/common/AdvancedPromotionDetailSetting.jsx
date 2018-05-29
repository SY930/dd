/**
 * @Author: chenshuang
 * @Date:   2017-03-30T14:17:50+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T17:27:56+08:00
 */


import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Radio, Button, Icon } from 'antd';
import { is, fromJS } from 'immutable';
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
    CLIENT_CATEGORY_RETURN_POINT,
    CLIENT_CATEGORY_RETURN_GIFT,
    CLIENT_CATEGORY_ADD_UP,
} from '../../../redux/actions/saleCenterNEW/types.js';
import { fetchShopCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import EditBoxForPromotion from './EditBoxForPromotion';
import EditBoxForSubject from './EditBoxForSubject';
import EditBoxForRole from './EditBoxForRole';
import BaseHualalaModal from './BaseHualalaModal';


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
            cardScopeType: 0,
            cardInfo: [],
            cardScopeIDs: [],
            userSettingOPtios: [],
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
        const data = { groupID: this.props.user.accountInfo.groupID }
        let shopsIDs = this.props.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS();
        shopsIDs = shopsIDs[0] instanceof Object ? shopsIDs.map(shop => shop.shopID) : shopsIDs
        data.shopIDs = shopsIDs.join(',')
        this.props.fetchShopCardLevel({ data })
        // 获取会员等级信息
        const { groupCardTypeList = fromJS([]) } = this.props
        this.setState({
            cardInfo: groupCardTypeList.toJS(),
        })
        const $promotionDetail = this.props.promotionDetailInfo.get('$promotionDetail');
        let userSetting = $promotionDetail.get('userSetting');
        const subjectType = $promotionDetail.get('subjectType');
        const blackList = $promotionDetail.get('blackList');
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        let userSettingOPtios = []
        if (promotionType === 'BILL_CUMULATION_FREE' || promotionType === 'FOOD_CUMULATION_GIVE') {
            userSettingOPtios = CLIENT_CATEGORY_ADD_UP;
        } else if (promotionType === 'RETURN_GIFT') {
            userSettingOPtios = this.props.stashSome ? CLIENT_CATEGORY_RETURN_GIFT.slice(1) : CLIENT_CATEGORY_RETURN_GIFT
        } else if (promotionType === 'RETURN_POINT') {
            userSettingOPtios = CLIENT_CATEGORY_RETURN_POINT
        } else {
            userSettingOPtios = CLIENT_CATEGORY
        }
        if ((promotionType === 'BILL_CUMULATION_FREE' || promotionType === 'FOOD_CUMULATION_GIVE') && userSetting === 'ALL_USER') {
            userSetting = 'CUSTOMER_ONLY';
        }
        if (promotionType === 'RETURN_GIFT' && this.props.stashSome) {
            userSetting = 'CUSTOMER_ONLY';
        }
        if (promotionType === 'RETURN_POINT') {
            userSetting = 'CUSTOMER_ONLY';
        }

        const cardScopeList = $promotionDetail.get('cardScopeList');
        let cardScopeType = 0;
        const cardScopeIDs = [];
        (cardScopeList || []).forEach((card) => {
            cardScopeType = card.get('cardScopeType') || 0
            cardScopeIDs.push(card.get('cardScopeID'))
        })
        this.setState({
            userSetting,
            subjectType,
            blackListRadio: blackList ? '1' : '0',
            cardScopeType,
            cardScopeIDs,
            userSettingOPtios,
        }, () => {
            this.props.setPromotionDetail({
                userSetting: this.state.userSetting,
            })
        });
    }
    componentWillReceiveProps(nextProps) {
        let { userSetting, subjectType } = this.state;
        const promotionType = nextProps.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
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
        // 获取会员等级信息
        const { groupCardTypeList = fromJS([]) } = this.props
        const { groupCardTypeList: _groupCardTypeList = fromJS([]) } = nextProps
        if (!is(groupCardTypeList, _groupCardTypeList)) {
            this.setState({
                cardInfo: _groupCardTypeList.toJS(),
            })
        }
        if (promotionType === 'RETURN_GIFT' && this.props.stashSome !== nextProps.stashSome) {
            this.setState({
                userSetting: nextProps.stashSome ? 'CUSTOMER_ONLY' : 'ALL_USER',
                userSettingOPtios: nextProps.stashSome ? CLIENT_CATEGORY_RETURN_GIFT.slice(1) : CLIENT_CATEGORY_RETURN_GIFT,
                cardScopeType: 0,
                cardScopeIDs: [],
            }, () => {
                this.props.setPromotionDetail({
                    userSetting: this.state.userSetting,
                    cardScopeList: [],
                })
            });
        }
        // 第二步店铺更改重新获取卡类卡等级，并且重置已选
        if (!is(this.props.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']), nextProps.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']))) {
            // 新建
            let shopsIDs = this.props.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS();
            let _shopsIDs = nextProps.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS();
            shopsIDs = shopsIDs[0] instanceof Object ? shopsIDs.map(shop => shop.shopID) : shopsIDs
            _shopsIDs = _shopsIDs[0] instanceof Object ? _shopsIDs.map(shop => shop.shopID) : _shopsIDs
            if (!is(fromJS(_shopsIDs), fromJS(shopsIDs))) {
                const data = { groupID: this.props.user.accountInfo.groupID }
                data.shopIDs = _shopsIDs.join(',')
                this.props.fetchShopCardLevel({ data })
                this.handleCardScopeList({
                    cardScopeIDs: [],
                });
            }
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
                    value={this.state.userSetting}
                    className={`${styles.linkSelectorRight} advancedDetailClassJs`}
                    getPopupContainer={() => document.querySelector('.advancedDetailClassJs')}
                    onChange={(val) => {
                        this.setState({
                            userSetting: val,
                            cardScopeType: 0,
                            cardScopeIDs: [],
                        });
                        this.props.setPromotionDetail({
                            userSetting: val,
                            cardScopeList: undefined,
                        })
                    }}
                >
                    {
                        this.state.userSettingOPtios
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
    handleCardScopeList = (opts) => {
        this.setState(opts, () => {
            const { cardScopeType, cardScopeIDs } = this.state
            this.props.setPromotionDetail({
                cardScopeList: cardScopeIDs.length === 0
                    ? undefined
                    : cardScopeIDs.map((cardScopeID) => {
                        return {
                            cardScopeType,
                            cardScopeID,
                        }
                    }),
            })
        })
    }
    renderCardLeval = () => {
        const { cardInfo = [], cardScopeIDs = [], cardScopeType } = this.state;
        const boxData = new Set()
        // cardScopeType=1 // @mock
        cardScopeIDs.forEach((id) => {
            // ['759692756909309952'].forEach((id) => { //  @mock
            cardInfo.forEach((cat) => {
                cat.cardTypeLevelList.forEach((level) => {
                    if (level.cardLevelID === id) {
                        boxData.add(level)
                    }
                })
            })
        })
        return (
            <div>
                <FormItem
                    label="会员范围"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        value={this.state.cardScopeType}
                        onChange={(e) => {
                            this.handleCardScopeList({
                                cardScopeType: e.target.value,
                                cardScopeIDs: [],
                            });
                        }
                        }
                    >
                        <Radio key={0} value={0}>卡类别</Radio >
                        <Radio key={1} value={1}>卡等级</Radio >
                    </RadioGroup >
                </FormItem>
                <FormItem
                    label={`适用${cardScopeType == 0 ? '卡类' : '卡等级'}`}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        cardScopeType == 0
                            ?
                            (<Select
                                size={'default'}
                                multiple={true}
                                showSearch={true}
                                value={cardScopeIDs}
                                className={`${styles.linkSelectorRight} advancedDetailClassJs`}
                                getPopupContainer={() => document.querySelector('.advancedDetailClassJs')}
                                onChange={(val) => {
                                    this.handleCardScopeList({
                                        cardScopeIDs: val,
                                    });
                                }}
                            >
                                {
                                    cardInfo.map(type => <Option key={type.cardTypeID} value={type.cardTypeID}>{type.cardTypeName}</Option>)

                                }
                            </Select>)
                            :
                            (<BaseHualalaModal
                                outLabel={'卡等级'} //   外侧选项+号下方文案
                                outItemName="cardLevelName" //   外侧已选条目选项的label
                                outItemID="cardLevelID" //   外侧已选条目选项的value
                                innerleftTitle={'全部卡类'} //   内部左侧分类title
                                innerleftLabelKey={'cardTypeName'}//   内部左侧分类对象的哪个属性为分类label
                                leftToRightKey={'cardTypeLevelList'} // 点击左侧分类，的何种属性展开到右侧
                                innerRightLabel="cardLevelName" //   内部右侧checkbox选项的label
                                innerRightValue="cardLevelID" //   内部右侧checkbox选项的value
                                innerBottomTitle={'已选卡等级'} //   内部底部box的title
                                innerBottomItemName="cardLevelName" //   内部底部已选条目选项的label
                                itemNameJoinCatName={'cardTypeName'} // item条目展示名称拼接类别名称
                                treeData={cardInfo} // 树形全部数据源【{}，{}，{}】
                                data={boxData} // 已选条目数组【{}，{}，{}】】,编辑时向组件内传递值
                                onChange={(value) => {
                                    // 组件内部已选条目数组【{}，{}，{}】,向外传递值
                                    const _value = value.map(level => level.cardLevelID)
                                    this.handleCardScopeList({
                                        cardScopeIDs: _value,
                                    });
                                }}
                            />)
                    }
                </FormItem>
                {
                    cardScopeIDs.length === 0 ? <p style={{ color: 'orange', marginLeft: 110 }}>不选择默认全选</p> : null
                }
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
                {promotionType !== 'RECOMMEND_FOOD' && (this.state.userSetting === 'CUSTOMER_ONLY' || this.state.userSetting === 'CUSTOMER_SHOP_ACTIVATE' || this.state.userSetting === 'CUSTOMER_CARD_TYPE') ? this.renderCardLeval() : null}
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
        groupCardTypeList: state.sale_mySpecialActivities_NEW.getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
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
        fetchShopCardLevel: (opts) => {
            dispatch(fetchShopCardLevel(opts));
        },
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedPromotionDetailSetting);

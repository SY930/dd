/**
 * @Author: chenshuang
 * @Date:   2017-03-30T14:17:50+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T17:27:56+08:00
 */


import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Radio, Button, Icon, Checkbox, Tooltip } from 'antd';
import { is, fromJS } from 'immutable';
import styles from '../ActivityPage.less';
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
    MONEY_OPTIONS
} from '../../../redux/actions/saleCenterNEW/types.js';
import { fetchShopCardLevel, queryTagDetailList, queryAllTagGroupList } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import BaseHualalaModal from './BaseHualalaModal';
import PriceInput from "../common/PriceInput";
import ShareRuleBox from './ShareRuleBox';
import EditBoxForRole from './EditBoxForRole';
import EditBoxForRoleRetail from './EditBoxForRoleRetail'
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { checkAuthLicense } from '../../../helpers/util';
import { injectIntl } from '../IntlDecor';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@injectIntl()
class AdvancedPromotionDetailSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            promotionList: {},
            mutexPromotions: [],
            mutexSubjects: [],
            selectedRole: [],
            userSetting: '0',
            subjectType: '0',
            blackListRadio: '0',
            display: 'none',
            cardScopeType: 0,
            cardInfo: [],
            cardScopeIDs: [],
            userSettingOPtios: [],
            isTotalLimited: '0',
            crmCardTypeIDs: '',
            cardBalanceLimitType: 0,


            ruleUseType: '0',

            mutexActivityId: [],
            sharedAndOverlieActivityId: [],
            sharedAndNotOverlieActivityId: [],
            mutexActivityType: [],
            sharedAndOverlieType: [],
            sharedAndNotOverlieType: [],
            executionRoleType: '1',
        };

        this.renderPaymentSetting = this.renderPaymentSetting.bind(this);
        this.renderUserSetting = this.renderUserSetting.bind(this);
        this.renderUserRules = this.renderUserRules.bind(this);
        this.renderExcludedPromotionSelection = this.renderExcludedPromotionSelection.bind(this);
        this.onPromotionChange = this.onPromotionChange.bind(this);

    }
    componentDidMount() {

        const data = { groupID: this.props.user.accountInfo.groupID }
        let initShopsIDs = this.props.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS();
        const { crmCardTypeIDs } = this.props.user.accountInfo;
        let shopsIDs = this.props.user.accountInfo.dataPermissions.shopList;
        shopsIDs = shopsIDs[0] instanceof Object ? shopsIDs.map(shop => shop.shopID) : shopsIDs;
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;

        // 格式转换  统一字符串  拼接
        if (initShopsIDs.length) {
            let [shops] = initShopsIDs
            if (typeof shops == 'string') {
                data.shopIDs = initShopsIDs.join()
            } else {
                let [{ shopID = '' }] = initShopsIDs
                data.shopIDs = shopID
            }
        } else {
            data.shopIDs = shopsIDs.join()
        }

        if (crmCardTypeIDs) {
            data.shopIDs = '';
            this.setState({ crmCardTypeIDs });
        }
        if (promotionType != '2030') {
            data.cardScheme = '1'
        }
        this.props.fetchShopCardLevel({ data })
        this.props.fetchTagList({
            groupID: this.props.user.accountInfo.groupID,
            pageNo: 1,
            pageSize: 10000,
        })
        // 获取会员等级信息
        const { groupCardTypeList = fromJS([]) } = this.props;
        let ciflist = groupCardTypeList.toJS();
        if (crmCardTypeIDs) {
            ciflist = groupCardTypeList.toJS().filter(x => {
                return crmCardTypeIDs.split(',').includes(x.cardTypeID);
            })
        }
        this.setState({
            cardInfo: ciflist,
        })
        const $promotionDetail = this.props.promotionDetailInfo.get('$promotionDetail');
        let userSetting = $promotionDetail.get('userSetting');
        const subjectType = $promotionDetail.get('subjectType');
        const cardBalanceLimitType = $promotionDetail.get('cardBalanceLimitType');
        const customerUseCountLimit = $promotionDetail.get('customerUseCountLimit') ? $promotionDetail.get('customerUseCountLimit') : 0;
        const isTotalLimited = customerUseCountLimit == 0 ? '0' : '1';
        const blackList = $promotionDetail.get('blackList');
        let userSettingOPtios = CLIENT_CATEGORY

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
            customerUseCountLimit,
            isTotalLimited,
            cardBalanceLimitType: cardBalanceLimitType || 0,
        }, () => {
            this.props.setPromotionDetail({
                userSetting: this.state.userSetting,
            })
        });

        const $promotionDetailInfo = this.props.myActivities.get('$promotionDetailInfo').toJS();
        if ($promotionDetailInfo.data && $promotionDetailInfo.data.promotionInfo) {
            const mutexActivityId = $promotionDetailInfo.data.promotionInfo.mutexActivityId
            const mutexActivityType = $promotionDetailInfo.data.promotionInfo.mutexActivityType
            const sharedAndNotOverlieActivityId = $promotionDetailInfo.data.promotionInfo.sharedAndNotOverlieActivityId
            const sharedAndNotOverlieType = $promotionDetailInfo.data.promotionInfo.sharedAndNotOverlieType
            const sharedAndOverlieActivityId = $promotionDetailInfo.data.promotionInfo.sharedAndOverlieActivityId
            const sharedAndOverlieType = $promotionDetailInfo.data.promotionInfo.sharedAndOverlieType
            const ruleUseType = $promotionDetailInfo.data.promotionInfo.ruleUseType
            const executionRoleType = $promotionDetailInfo.data.promotionInfo.executionRoleType || '1'
            this.setState({
                mutexActivityId,
                mutexActivityType,
                sharedAndNotOverlieActivityId,
                sharedAndNotOverlieType,
                sharedAndOverlieActivityId,
                sharedAndOverlieType,
                ruleUseType,
                executionRoleType,
            })
            this.props.setPromotionDetail({
                mutexActivityId,
                mutexActivityType,
                sharedAndNotOverlieActivityId,
                sharedAndNotOverlieType,
                sharedAndOverlieActivityId,
                sharedAndOverlieType,
                ruleUseType,
                executionRoleType,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        let { userSetting, subjectType, crmCardTypeIDs } = this.state;
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
            let ciflist = _groupCardTypeList.toJS();
            const cardScopeIDs = this.state.cardScopeIDs
            if (crmCardTypeIDs) {
                ciflist = _groupCardTypeList.toJS().filter(x => {
                    return crmCardTypeIDs.split(',').includes(x.cardTypeID);
                })
            }
            const { cardScopeType } = this.state
            let currentCardScopeIDs = []
            // 当适用店铺减少后，在此过滤调卡类别或卡等级，后期标签也可以再次处理， 标签cardScopeType为2
            if (cardScopeType == 0) {
                currentCardScopeIDs = cardScopeIDs.filter(v => ciflist.find(item => item.cardTypeID == v))
            } else if (cardScopeType == 1) {
                currentCardScopeIDs = cardScopeIDs.filter(v => ciflist.find(item =>
                    item.cardTypeLevelList && item.cardTypeLevelList.find(cardLevelItem => cardLevelItem.cardLevelID == v)))
            }

            this.setState({
                cardInfo: ciflist,
                cardScopeIDs: currentCardScopeIDs
            }, () => {
                this.props.setPromotionDetail({
                    userSetting: this.state.userSetting,
                    cardScopeList: currentCardScopeIDs.length === 0
                        ? undefined
                        : currentCardScopeIDs.map((cardScopeID) => {
                            return {
                                cardScopeType,
                                cardScopeID,
                            }
                        })
                })
            })
        }
       
        // 第二步店铺更改重新获取卡类卡等级，并且重置已选
        if (!is(this.props.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']), nextProps.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']))) {
            // 新建
            let shopsIDs = this.props.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS();
            let _shopsIDs = nextProps.promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS();
            shopsIDs = shopsIDs[0] instanceof Object ? shopsIDs.map(shop => shop.shopID) : shopsIDs
            _shopsIDs = _shopsIDs[0] instanceof Object ? _shopsIDs.map(shop => shop.shopID) : _shopsIDs
            // 
            let shopsIDs1 = this.props.user.accountInfo.dataPermissions.shopList;
            shopsIDs1 = shopsIDs1[0] instanceof Object ? shopsIDs1.map(shop => shop.shopID) : shopsIDs1

            if (!is(fromJS(_shopsIDs), fromJS(shopsIDs))) {
                const data = { groupID: this.props.user.accountInfo.groupID }
                if (_shopsIDs.length) {
                    data.shopIDs = _shopsIDs.join(',')
                } else {
                    data.shopIDs = shopsIDs1.join()
                }
                if(promotionType != '2030'){
                    data.cardScheme = '1'
                }
                this.props.fetchShopCardLevel({ data })
            }
        }
    }

    renderUserSetting() {
        // 产品授权
        let { authStatus } = checkAuthLicense(this.props.specialPromotion.AuthLicenseData)
        return (
            <FormItem
                label={SALE_LABEL.k5m3on8w}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >

                <Select
                    size={'default'}
                    value={this.state.userSetting}
                    disabled={!authStatus}
                    className={`${styles.linkSelectorRight} advancedDetailClassJs`}
                    getPopupContainer={(node) => node.parentNode}
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

    renderUserRules() {
        return (
            <div style={{ position: 'relative', zIndex: this.props.promotionDetailInfo.get('onlyModifyShop')? '100' : 'auto' }}>
                <FormItem
                    label={'互斥叠加规则'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >

                    <RadioGroup value={String(this.state.ruleUseType)} onChange={(e) => {
                        this.setState({ ruleUseType: e.target.value })
                        this.props.setPromotionDetail({ ruleUseType: e.target.value })
                    }}>
                        <Radio key={'0'} value={'0'}>{'使用系统规则'}</Radio>
                        <Radio key={'1'} value={'1'}>{'单独配置活动规则'}</Radio>
                    </RadioGroup>
                </FormItem>
                <div style={{ marginLeft: 120 }}>
                    {this.state.ruleUseType == '0' && <a onClick={() => {
                        if (HUALALA.ENVIRONMENT === 'production-release') {
                            window.open('http://zhytest.hualala.com/meta/2/2002606')
                        } else {
                            window.open('http://zhytest.hualala.com/meta/2/2002606')
                        }

                    }}>查看系统规则</a>}

                    {this.state.ruleUseType == '1' && <div>
                        <div style={{ marginTop: 10 }}>与其他活动互斥</div>
                        <div style={{ marginTop: 10, marginLeft: 20, display: this.state.mutexActivityId.length > 0 || this.state.mutexActivityType.length > 0 ? 'block' : 'none' }}>已添加{this.state.mutexActivityId.length}个活动，{this.state.mutexActivityType.length}个类型</div>
                        <div style={{ marginTop: 10, marginLeft: 20 }}>
                            <a onClick={() => {
                                this.setState({ modalVisible: true, modalTitle: '与其他活动互斥' })
                            }}>添加</a>
                        </div>
                        <div style={{ marginTop: 10 }}>与其他活动共享</div>
                        <div style={{ marginTop: 10, marginLeft: 20, display: this.state.sharedAndNotOverlieActivityId.length > 0 || this.state.sharedAndNotOverlieType.length > 0 ? 'block' : 'none' }}>已添加{this.state.sharedAndNotOverlieActivityId.length}个活动，{this.state.sharedAndNotOverlieType.length}个类型</div>
                        <div style={{ marginTop: 10, marginLeft: 20 }}>
                            <a onClick={() => {
                                this.setState({ modalVisible: true, modalTitle: '与其他活动共享' })
                            }}>添加</a>
                        </div>
                        <div style={{ marginTop: 10 }}>与其他活动共享叠加</div>
                        <div style={{ marginTop: 10, marginLeft: 20, display: this.state.sharedAndOverlieActivityId.length > 0 || this.state.sharedAndOverlieType.length > 0 ? 'block' : 'none' }}>已添加{this.state.sharedAndOverlieActivityId.length}个活动，{this.state.sharedAndOverlieType.length}个类型</div>
                        <div style={{ marginTop: 10, marginLeft: 20 }}>
                            <a onClick={() => {
                                this.setState({ modalVisible: true, modalTitle: '与其他活动共享叠加' })
                            }}>添加</a>
                        </div>
                    </div>
                    }
                </div>

            </div>
        )
    }

    onPromotionChange(val) {


        let activityIdList = val.activityIdList.map(item => { return item })

        let activityTypeList = val.activityTypeList.map(item => { return item })

        if (val.title == '与其他活动互斥') {
            this.setState({ mutexActivityId: activityIdList, mutexActivityType: activityTypeList })
            this.props.setPromotionDetail({
                mutexActivityId: activityIdList,
                mutexActivityType: activityTypeList,
            });
        } else if (val.title == '与其他活动共享') {
            this.setState({ sharedAndNotOverlieActivityId: activityIdList, sharedAndNotOverlieType: activityTypeList })
            this.props.setPromotionDetail({
                sharedAndNotOverlieActivityId: activityIdList,
                sharedAndNotOverlieType: activityTypeList,
            });
        } else {
            this.setState({ sharedAndOverlieActivityId: activityIdList, sharedAndOverlieType: activityTypeList })
            this.props.setPromotionDetail({
                sharedAndOverlieActivityId: activityIdList,
                sharedAndOverlieType: activityTypeList
            });
        }
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

    handleChangeBizType = ({ target }) => {
        this.setState({
            executionRoleType: target.value,
        })
        this.props.setPromotionDetail({
            executionRoleType: target.value,
        })
    }


    renderExcludedPromotionSelection() {
        return (
            <FormItem
                label=''
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {this.state.modalVisible &&
                    <ShareRuleBox
                        orgs={this.props.orgs}
                        giftType={this.props.giftType}
                        bizType={this.props.bizType}
                        modalTitle={this.state.modalTitle}
                        mutexActivityId={this.state.mutexActivityId}
                        mutexActivityType={this.state.mutexActivityType}
                        sharedAndNotOverlieActivityId={this.state.sharedAndNotOverlieActivityId}
                        sharedAndNotOverlieType={this.state.sharedAndNotOverlieType}
                        sharedAndOverlieActivityId={this.state.sharedAndOverlieActivityId}
                        sharedAndOverlieType={this.state.sharedAndOverlieType}
                        onChange={(val) => {
                            this.onPromotionChange(val)
                        }}
                        closeModal={() => {
                            this.setState({ modalVisible: false })
                        }} />}
            </FormItem>
        )
    }

    handleCustomerUseCountLimitChange = (value) => {
        this.setState({
            customerUseCountLimit: value.number,
        })
        this.props.setPromotionDetail({
            customerUseCountLimit: value.number,
        });
    }
    handleIsTotalLimitedChange = (value) => {
        this.setState({
            isTotalLimited: value,
            customerUseCountLimit: 0,
        })
        this.props.setPromotionDetail({
            customerUseCountLimit: 0,
        });
    }
    renderParticipateLimit() {
        return (
            <div style={{ height: '40px', paddingLeft: 45, marginTop: '8px' }} className={styles.flexContainer}>
                <div style={{ lineHeight: '28px', marginRight: '16px' }}>
                    {SALE_LABEL.k6hhu9c3}
                </div>
                <div style={{ lineHeight: '28px', marginRight: '14px' }}>
                    {'每人每天可参与次数'}
                </div>
                <div style={{ width: '300px' }}>
                    <Col span={this.state.isTotalLimited == 0 ? 24 : 12}>
                        <Select onChange={this.handleIsTotalLimitedChange}
                            value={String(this.state.isTotalLimited)}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            <Option key="0" value={'0'}>{SALE_LABEL.k5dn26n4}</Option>
                            <Option key="1" value={'1'}>{SALE_LABEL.k5kp4vhr}</Option>
                        </Select>
                    </Col>
                    <Col span={this.state.isTotalLimited == 0 ? 0 : 2}></Col>
                    {
                        this.state.isTotalLimited == 1 ?
                            <Col span={10}>
                                <FormItem
                                    style={{ marginTop: -6 }}
                                    validateStatus={this.state.customerUseCountLimit % 1 == 0 && this.state.customerUseCountLimit > 0 && this.state.customerUseCountLimit < 1000 ? 'success' : 'error'}
                                    help={this.state.customerUseCountLimit % 1 == 0 && this.state.customerUseCountLimit > 0 && this.state.customerUseCountLimit < 1000 ? null : SALE_LABEL.k6hhu9sr}
                                >
                                    <PriceInput
                                        addonAfter={SALE_LABEL.k5kms0pc}
                                        maxNum={999}
                                        value={{ number: this.state.customerUseCountLimit }}
                                        onChange={this.handleCustomerUseCountLimitChange}
                                        modal="int"
                                    />
                                </FormItem>
                            </Col> : null
                    }
                </div>
            </div>
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

    handleCardBalanceLimitType = (opts) => {
        this.setState(opts, () => {
            const { cardBalanceLimitType } = this.state
            this.props.setPromotionDetail({
                cardBalanceLimitType: cardBalanceLimitType,
            })
        })
    }

    renderCardLeval = () => {
        const { intl } = this.props;
        const k5m3oq98 = intl.formatMessage(SALE_STRING.k5m3oq98);
        const k5m4pxa1 = intl.formatMessage(SALE_STRING.k5m4pxa1);
        const { cardInfo = [], cardScopeIDs = [], cardScopeType, cardBalanceLimitType } = this.state;
        const boxData = [];
        const cardLevelData = cardInfo.filter(item => item.cardScheme === 0);
        cardScopeIDs.forEach((id) => {
            cardLevelData.forEach((cat) => {
                cat.cardTypeLevelList.forEach((level) => {
                    if (level.cardLevelID === id) {
                        boxData.push(level)
                    }
                })
            })
        })
        const { tagList } = this.props
        return (
            <div>
                <FormItem
                    label={SALE_LABEL.k5m3oq0w}
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
                        <Radio key={0} value={0}>{k5m3oq98}</Radio >
                        <Radio key={1} value={1}>{k5m4pxa1}</Radio >
                    </RadioGroup >
                </FormItem>
                {


                    <FormItem
                        label={'适用' + (cardScopeType == 0 ? k5m3oq98 : k5m4pxa1)}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {
                            cardScopeType == 0
                                ?
                                (<Select
                                    size={'default'}
                                    notFoundContent={SALE_LABEL.k5m4pxqp}
                                    multiple={true}
                                    showSearch={true}
                                    value={cardScopeIDs}
                                    dropdownClassName={`${styles.dropdown}`}
                                    className={`${styles.linkSelectorRight} advancedDetailClassJs`}
                                    getPopupContainer={(node) => node.parentNode}
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
                                    outLabel={k5m4pxa1} //   外侧选项+号下方文案
                                    outItemName="cardLevelName" //   外侧已选条目选项的label
                                    outItemID="cardLevelID" //   外侧已选条目选项的value
                                    innerleftTitle={SALE_LABEL.k5m4pyfq} //   内部左侧分类title
                                    innerleftLabelKey={'cardTypeName'}//   内部左侧分类对象的哪个属性为分类label
                                    leftToRightKey={'cardTypeLevelList'} // 点击左侧分类，的何种属性展开到右侧
                                    innerRightLabel="cardLevelName" //   内部右侧checkbox选项的label
                                    innerRightValue="cardLevelID" //   内部右侧checkbox选项的value
                                    innerBottomTitle={SALE_LABEL.k5m4py7e} //   内部底部box的title
                                    innerBottomItemName="cardLevelName" //   内部底部已选条目选项的label
                                    itemNameJoinCatName={'cardTypeName'} // item条目展示名称拼接类别名称
                                    treeData={cardLevelData} // 树形全部数据源【{}，{}，{}】
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

                }
                {
                    cardScopeIDs.length === 0 ? <p style={{ color: 'orange', marginLeft: 110 }}>{SALE_LABEL.k5m4pxz2}</p> : null
                }
            </div>
        )
    }

    renderPaymentSetting() {
        return (
            <FormItem
                label={'金额核算'}
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
                    {MONEY_OPTIONS
                        .map((type) => {
                            return <Radio key={type.value} value={type.value}>{type.name}</Radio >
                        })}
                </RadioGroup >
            </FormItem>
        )
    }

    renderRoleOptions = () => {
        console.log(this.state.executionRoleType, 'this.state.executionRoleType')
        return (
            <Row>
                <FormItem
                    label={SALE_LABEL.k5m3opsk}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup name="radiogroup" defaultValue={"1"} onChange={this.handleChangeBizType} value={`${this.state.executionRoleType}`}>
                        <Radio value={'1'}>餐饮</Radio>
                        <Radio value={'2'}>零售</Radio>
                    </RadioGroup>
                </FormItem>
                <Col span={17} offset={4}>
                    {
                        this.state.executionRoleType == '1' ?
                            <EditBoxForRole
                                onChange={(val) => {
                                    this.onRoleChange(val)
                                }}
                            /> :
                            <EditBoxForRoleRetail
                                onChange={(val) => {
                                    this.onRoleChange(val)
                                }}
                            />
                    }
                </Col>
            </Row>

        )
    }

    render() {
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const _stash = promotionType == '3010' || promotionType == '3020';
        const $promotionScope = this.props.promotionScopeInfo.get('$scopeInfo')
        return (
            <div>
                {this.renderUserSetting()}
                {this.state.userSetting == '1' ? this.renderCardLeval() : null}
                {this.state.userSetting == '1' ? this.renderParticipateLimit() : null}
                {
                    this.props.payLimit ?
                        this.renderPaymentSetting()
                        : null
                }
                {this.renderUserRules()}
                {this.renderExcludedPromotionSelection()}
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

        myActivities: state.sale_myActivities_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        birthdayLimit: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail', 'birthdayLimit'], 0),
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        groupCardTypeList: state.sale_mySpecialActivities_NEW.getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
        tagList: state.sale_mySpecialActivities_NEW.toJS().tagList,
        tagGroupList: state.sale_mySpecialActivities_NEW.toJS().tagGroupList,
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
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
        fetchTagList: (opt) => {
            dispatch(queryTagDetailList(opt))
        },
        fetchTagGroupList: (opt) => {
            dispatch(queryAllTagGroupList(opt))
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedPromotionDetailSetting);

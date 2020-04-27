/**
 * @Author: chenshuang
 * @Date:   2017-03-30T14:17:50+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T17:27:56+08:00
 */


import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Radio, Button, Icon, Checkbox } from 'antd';
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
} from '../../../redux/actions/saleCenterNEW/types.js';
import { fetchShopCardLevel, queryTagDetailList, queryAllTagGroupList } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import EditBoxForPromotion from './EditBoxForPromotion';
import EditBoxForRole from './EditBoxForRole';
import BaseHualalaModal from './BaseHualalaModal';
import PriceInput from "../common/PriceInput";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

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
        };

        this.renderUserSetting = this.renderUserSetting.bind(this);
        this.renderPaymentSetting = this.renderPaymentSetting.bind(this);
        this.renderExcludedPromotionSelection = this.renderExcludedPromotionSelection.bind(this);
        this.onPromotionChange = this.onPromotionChange.bind(this);
        this.onSubjectChange = this.onSubjectChange.bind(this);
        this.renderRoleOptions = this.renderRoleOptions.bind(this);
        this.renderExcludedPromotionBlackList = this.renderExcludedPromotionBlackList.bind(this);
        this.handleBlackListRadioChange = this.handleBlackListRadioChange.bind(this);
    }
    componentDidMount() {
        const data = { groupID: this.props.user.accountInfo.groupID }
        let shopsIDs = this.props.user.accountInfo.dataPermissions.shopList;
        shopsIDs = shopsIDs[0] instanceof Object ? shopsIDs.map(shop => shop.shopID) : shopsIDs
        data.shopIDs = shopsIDs.join(',');
        this.props.fetchShopCardLevel({ data })
        this.props.fetchTagList({
            groupID: this.props.user.accountInfo.groupID,
            pageNo: 1,
            pageSize: 10000,
        })
        // 获取会员等级信息
        const { groupCardTypeList = fromJS([]) } = this.props
        this.setState({
            cardInfo: groupCardTypeList.toJS(),
        })
        const $promotionDetail = this.props.promotionDetailInfo.get('$promotionDetail');
        let userSetting = $promotionDetail.get('userSetting');
        const subjectType = $promotionDetail.get('subjectType');
        const customerUseCountLimit = $promotionDetail.get('customerUseCountLimit') ? $promotionDetail.get('customerUseCountLimit') : 0;
        const isTotalLimited = customerUseCountLimit == 0 ? '0' : '1';
        const blackList = $promotionDetail.get('blackList');
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        let userSettingOPtios = []
        if (promotionType === '2070' || promotionType === '1080') {
            userSettingOPtios = CLIENT_CATEGORY_ADD_UP;
        } else if (promotionType == '3010') {
            userSettingOPtios = this.props.stashSome ? CLIENT_CATEGORY_RETURN_GIFT.slice(1) : CLIENT_CATEGORY_RETURN_GIFT
        } else if (promotionType == '3020') {
            userSettingOPtios = CLIENT_CATEGORY_RETURN_POINT
        } else {
            userSettingOPtios = CLIENT_CATEGORY
        }
        if ((promotionType == '2070' || promotionType == '1080') && userSetting == '0') {
            userSetting = '1';
        }
        if (promotionType == '3010' && this.props.stashSome) {
            userSetting = '1';
        }
        if (promotionType == '3020') {
            userSetting = '1';
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
            customerUseCountLimit,
            isTotalLimited,
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
        if (promotionType === '3010' && this.props.stashSome !== nextProps.stashSome) {
            this.setState({
                userSetting: nextProps.stashSome ? '1' : '0',
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

    renderPaymentSetting() {
        return (
            <FormItem
                label={SALE_LABEL.k5m3onh8}
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
    renderBirthdayLimit() {
        const { birthdayLimit } = this.props;
        return (
            <FormItem
                label={SALE_LABEL.k6hhu8vf}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <div style={{ paddingTop: 6 }}>
                    <Checkbox
                        checked={!!birthdayLimit}
                        onChange={e => this.props.setPromotionDetail({
                            birthdayLimit: +e.target.checked,
                        })}
                    >
                        {SALE_LABEL.k6hhu93r}
                    </Checkbox>
                </div>
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
                    finalShowName: promotion.finalShowName || SALE_LABEL.k5m3onpk,
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
    renderExcludedPromotionBlackList = () => {
        const { intl } = this.props;
        const k5m3oo68 = intl.formatMessage(SALE_STRING.k5m3oo68);
        const k5m3opbw = intl.formatMessage(SALE_STRING.k5m3opbw);
        const tip = (
            <div style={{ display: this.state.display, height: 330, width: 460 }} className={styles.tip}>
    <div><p style={{ marginBottom: 10 }}>{SALE_LABEL.k5m3onxw}</p></div>
                <Row style={{ height: '72px' }}>
                    <Col span={3} style={{ marginTop: -7 }}>{k5m3oo68}:</Col>
        <Col span={20}>{SALE_LABEL.k5m3ooek}<span style={{ color: '#222222' }}>{SALE_LABEL.k5m6e4er}</span>，{SALE_LABEL.k5m6e4n3}<span style={{ color: '#222222' }}>{SALE_LABEL.k5m6e46f}</span></Col>
                </Row>
                <Row style={{ height: '72px' }}>
                    <Col span={3} style={{ marginTop: -7 }}>{k5m3opbw}:</Col>
        <Col span={20}>{SALE_LABEL.k5m3ooek}<span style={{ color: '#222222' }}>{SALE_LABEL.k5m6e46f}</span>，{SALE_LABEL.k5m6e4n3}<span style={{ color: '#222222' }}>{SALE_LABEL.k5m6e4er}</span></Col>
                </Row>
                <Row style={{ height: '72px' }}>
        <Col span={3} style={{ marginTop: -7 }}><span style={{ color: '#ed5664' }}>{SALE_LABEL.k5m6e3pr}</span>:</Col>
        <Col span={20}>{SALE_LABEL.k5m3oomw}</Col>
                </Row>
                <div style={{ marginRight: 14 }}>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={() => {
                                this.setState({ display: 'none' });
                            }}
                        >{SALE_LABEL.k5m3oov8}
                        </Button>
                    </div>
                </div>
            </div>
        );
        return (
            <FormItem
                label={SALE_LABEL.k5m3onxw}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <RadioGroup value={this.state.blackListRadio} onChange={this.handleBlackListRadioChange}>
        <Radio key={'0'} value={'0'}>{k5m3oo68}</Radio>
        <Radio key={'1'} value={'1'}>{k5m3opbw}</Radio>
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
    handleIsTotalLimitedChange = (value) => {
        this.setState({
            isTotalLimited: value,
            customerUseCountLimit: 0,
        })
        this.props.setPromotionDetail({
            customerUseCountLimit: 0,
        });
    }
    renderExcludedPromotionSelection() {
        return (
            <FormItem
                label={this.state.blackListRadio == '1' ? SALE_LABEL.k5m3op3k : SALE_LABEL.k5m3opk8}
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
    handleCustomerUseCountLimitChange = (value) => {
        this.setState({
            customerUseCountLimit: value.number,
        })
        this.props.setPromotionDetail({
            customerUseCountLimit: value.number,
        });
    }
    renderParticipateLimit() {
        return (
            <div style={{height: '40px', paddingLeft: 45, marginTop: '8px'}} className={styles.flexContainer}>
                    <div style={{lineHeight: '28px', marginRight: '16px'}}>
                        {SALE_LABEL.k6hhu9c3}
                    </div>
                    <div style={{lineHeight: '28px', marginRight: '14px'}}>
                        {SALE_LABEL.k6hhu9kf}
                    </div>
                    <div style={{width: '300px'}}>
                        <Col  span={this.state.isTotalLimited == 0 ? 24 : 12}>
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
                                        validateStatus={this.state.customerUseCountLimit%1 == 0 && this.state.customerUseCountLimit > 0 && this.state.customerUseCountLimit < 1000 ? 'success' : 'error'}
                                        help={this.state.customerUseCountLimit%1 == 0 && this.state.customerUseCountLimit > 0 && this.state.customerUseCountLimit < 1000 ? null : SALE_LABEL.k6hhu9sr}
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

    renderRoleOptions() {
        return (

            <FormItem
                label={SALE_LABEL.k5m3opsk}
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
        const { intl } = this.props;
        const k5m3oq98 = intl.formatMessage(SALE_STRING.k5m3oq98);
        const k5m4pxa1 = intl.formatMessage(SALE_STRING.k5m4pxa1);

        const { cardInfo = [], cardScopeIDs = [], cardScopeType } = this.state;
        const boxData = []
        cardScopeIDs.forEach((id) => {
            cardInfo.forEach((cat) => {
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
                        {
                            this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType']) == '2020' ?
                        <Radio key={2} value={2}>{SALE_LABEL.k5m4pxid}</Radio > : null
                        }
                    </RadioGroup >
                </FormItem>
                {
                    cardScopeType === 2 ?
                    (
                        <FormItem
                            label={SALE_LABEL.k5m4pxid}
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                           <Select
                                size={'default'}
                                notFoundContent={SALE_LABEL.k5m4pxqp}
                                multiple={true}
                                showSearch={true}
                                value={cardScopeIDs}
                                className={`${styles.linkSelectorRight} advancedDetailClassJs`}
                                getPopupContainer={(node) => node.parentNode}
                                onChange={(val) => {
                                    this.handleCardScopeList({
                                        cardScopeIDs: val,
                                    });
                                }}
                            >
                                {
                                    tagList.map(type => <Option key={type.itemID} value={type.itemID}>{type.tagName}</Option>)

                                }
                            </Select>
                        </FormItem>
                    ):
                    (
                        <FormItem
                            label={SALE_LABEL.k5m6e3y3 + cardScopeType == 0 ? k5m3oq98 : k5m4pxa1 }
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
                    )
                }
                {
    cardScopeIDs.length === 0 ? <p style={{ color: 'orange', marginLeft: 110 }}>{SALE_LABEL.k5m4pxz2}</p> : null
                }
            </div>
        )
    }

    render() {
        const $promotionDetail = this.props.promotionDetailInfo.get('$promotionDetail');
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const _stash = promotionType == '3010' || promotionType == '3020';
        const $promotionScope = this.props.promotionScopeInfo.get('$scopeInfo');
        return (
            <div>
                {this.renderUserSetting($promotionDetail)}
                {promotionType !== '5010' && (this.state.userSetting == '1' || this.state.userSetting == '3' || this.state.userSetting == '4') ? this.renderCardLeval() : null}
                {
                    this.props.payLimit ?
                        this.renderPaymentSetting($promotionDetail)
                        : null
                }
                { promotionType === '3010' && this.renderParticipateLimit()}
                { promotionType === '3020' && this.renderBirthdayLimit()}
                {_stash ? null : this.renderExcludedPromotionBlackList()}
                {_stash ? null : this.renderExcludedPromotionSelection()}
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
        birthdayLimit: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail', 'birthdayLimit'], 0),
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        groupCardTypeList: state.sale_mySpecialActivities_NEW.getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
        tagList: state.sale_mySpecialActivities_NEW.toJS().tagList,
        tagGroupList: state.sale_mySpecialActivities_NEW.toJS().tagGroupList,
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

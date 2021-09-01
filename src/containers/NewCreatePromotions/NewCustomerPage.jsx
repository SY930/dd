/**
 *
 * @description 营销活动（新） 入口文件
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import registerPage from '../../../index';
import { NEW_SALE_BOX, SALE_CENTER_PAYHAVEGIFT } from "../../constants/entryCodes";
import { axiosData, checkAuthLicense } from '../../helpers/util';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';
import selfStyle from './NewCustomerPage.less';
import newPic from './assets/new.png';
import moment from 'moment'
import { avaHouseKeeperGroups, avaIntelligentGiftRuleGroups } from './_avaGroupConfig'

import {
    Modal,
    message
} from 'antd';
import {
    NEW_CUSTOMER_PROMOTION_TYPES,
    FANS_INTERACTIVITY_PROMOTION_TYPES,
    REPEAT_PROMOTION_TYPES,
    LOYALTY_PROMOTION_TYPES,
    SALE_PROMOTION_TYPES,
    ONLINE_PROMOTION_TYPES,
    CRM_PROMOTION_TYPES,
    HOUSEKEEPER_TYPES,
} from 'constants/promotionType';
import NewPromotionCard from "./NewPromotionCard";
const limitedTypes = [
    '67',
    '68',
]
const UNRELEASED_PROMOTION_TYPES = [
]
import {
    saleCenterCheckExist,
    saleCenterResetDetailInfoAC as saleCenterResetSpecialDetailInfoAC,
    saleCenterSetSpecialBasicInfoAC,
    saleCenterSetSpecialBasicInfoCardGroupID,
    saleCenterSaveCreateMemberGroupParams,
    getAuthLicenseData
} from "../../redux/actions/saleCenterNEW/specialPromotion.action";
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
    saleCenterResetDetailInfoAC as saleCenterResetBasicDetailInfoAC
} from "../../redux/actions/saleCenterNEW/promotionDetailInfo.action";
import {
    saleCenterResetBasicInfoAC,
    saleCenterSetBasicInfoAC
} from "../../redux/actions/saleCenterNEW/promotionBasicInfo.action";
import { saleCenterResetScopeInfoAC } from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import { resetOccupiedWeChatInfo } from "../../redux/actions/saleCenterNEW/queryWeixinAccounts.action";
import { toggleIsUpdateAC } from "../../redux/actions/saleCenterNEW/myActivities.action";
import { checkPermission } from "../../helpers/util";
import { BASIC_PROMOTION_CREATE, SPECIAL_PROMOTION_CREATE } from "../../constants/authorityCodes";
import SpecialActivityMain from '../SpecialPromotionNEW/activityMain';
import {
    BASIC_PROMOTION_CREATE_DISABLED_TIP,
    isBrandOfHuaTianGroupList,
    isHuaTian,
    SPECIAL_PROMOTION_CREATE_DISABLED_TIP,
} from "../../constants/projectHuatianConf";
import BasicActivityMain from '../SaleCenterNEW/activityMain';
import { axios } from '@hualala/platform-base';
import { getStore } from '@hualala/platform-base'
import Chou2Le from "../PromotionV3/Chou2Le";   // 抽抽乐
import BlindBox from "../PromotionV3/BlindBox";   // 盲盒
import PassWordCoupon from "../PromotionV3/PassWordCoupon";   // 口令领券
import { jumpPage, closePage } from '@hualala/platform-base';

import { setThemeClass } from '../../utils/index'
const activityList = [
    '80', '66', '81', 'housekeeper', 'intelligentGiftRule', '82'
]
@registerPage([NEW_SALE_BOX], {
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class NewCustomerPage extends Component {

    state = {
        whiteList: [],
        basicModalVisible: false,
        basicIndex: 0,
        specialModalVisible: false,
        specialIndex: 0,
        currentCategoryIndex: 0,
        v3visible: false,       // 第三版活动组件是否显示
        curKey: '',             //当前活动入口值
        authLicenseData: {},
        houseKeepStatus:false,//是否有流失唤醒
        gentGiftStatus:false,//是否有智能发券
    }

    componentDidMount() {
        this.getWhite();
        this.fromCrmJump();
        this.getHouseKeepActivityAuthStatus('MEMBER_MARKET_PLAN');
        this.getHouseKeepActivityAuthStatus('CRM_VOUCHER_AUTOMATIC_ISSUANCE');
        this.props.getAuthLicenseData({ productCode: 'HLL_CRM_Marketingbox' }).then((res) => {
            this.setState({ authLicenseData: res })
        });

    }
    componentWillReceiveProps() {
        // todo:上线放开
        this.fromCrmJump();
    }
    getQueryVariable() {
        const search = window.decodeURIComponent(window.location.search)
        var query = search.substr(1)
        query = query.split('&')
        var params = {}
        for (let i = 0; i < query.length; i++) {
            let q = query[i].split('=')
            if (q.length === 2) {
                params[q[0]] = q[1]
            }
        }
        return params
    }
    fromCrmJump() {
        const {
            from,
            type,
            gmID,
            totalMembers,
            groupMembersName,
            groupID,
            mfrGrades,
            awakenTip,
            RValue,
        } = this.getQueryVariable()
        console.log("🚀 ~ file: NewCustomerPage.jsx ~ line 140 ~ NewCustomerPage ~ fromCrmJump ~ this.getQueryVariable()", this.getQueryVariable())
        // 测试使用
        // const  {
        //     from = 'rfm',
        //     type,
        //     gmID,
        //     totalMembers,
        //     groupMembersName,
        //     groupID = '1155' ,
        //     levelKey = 'LH',
        //     levelType = '0',
        //     monetaryType = '0',
        //     reportMonth = '2020-05',
        //     createBy = 'wenjie'
        // } = this.getQueryVariable()



        if (from === 'rfm') {
            const item = CRM_PROMOTION_TYPES[53];
            this.handleNewPromotionCardClick(item);
            this.props.setSpecialPromotionCardGroupID(`${groupMembersName} -- 【共${totalMembers}人】`);
            this.props.saveRFMParams({
                groupID,
                mfrGrades,
                awakenTip,
                RValue,
            })
            this.clearUrl();

        } if(from === 'giftInfo'){
            if(!type) return;
            const item = NEW_CUSTOMER_PROMOTION_TYPES.filter((val) => {
                return val.key == type;
            })
            this.handleNewPromotionCardClick(item[0]);
            this.clearUrl();
        }else {
            const saleID = type;
            if (!saleID) {
                return;
            }
            const item = CRM_PROMOTION_TYPES[saleID];
            this.handleNewPromotionCardClick(item);
            this.props.setSpecialPromotionCardGroupID(gmID);
            this.clearUrl();
        }

    }
    clearUrl() {
        var { href } = window.location;
        var [valiable] = href.split('?');
        window.history.pushState(null, null, valiable);
    }
    getWhite() {
        axiosData(
            'specialPromotion/queryOpenedEventTypes.ajax',
            {},
            { needThrow: true },
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then(data => {
            const { eventTypeInfoList = [] } = data;
            this.setState({ whiteList: eventTypeInfoList });
        })
    }
    //验证集团是否参加管家活动
    getHouseKeepActivityAuthStatus = async (param) => {
        const state = getStore().getState();
        const { groupID } = state.user.get('accountInfo').toJS();
        const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', '', '/api/v1/universal?'];
        const method = '/messageSendService/queryMsgConfig.ajax';
        const params = { service, type, data: { groupID,shopID:groupID,messageCode: param }, method };
        const response = await axios.post(url + method, params);
        const { code, message: msg,data } = response;
        if (code === '000') {
            const { authConfig:{authStatus} } = data;
            if(param == 'CRM_VOUCHER_AUTOMATIC_ISSUANCE' && authStatus == 'AUTHORIZED'){
                this.setState({
                    gentGiftStatus:true
                })
            }
            if(param == 'MEMBER_MARKET_PLAN' && authStatus == 'AUTHORIZED'){
                this.setState({
                    houseKeepStatus:true
                })
            }
            return true;
        }
        message.error(msg);
    }
    onClickOpen = async (eventWay) => {
        const state = getStore().getState();
        const { groupID } = state.user.get('accountInfo').toJS();
        const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'alipay/', '/api/v1/universal?'];
        const method = '/specialPromotion/freeTrialOpen.ajax';
        const params = { service, type, data: { eventWay, groupID }, method };
        const response = await axios.post(url + method, params);
        const { code, message: msg } = response;
        if (code === '000') {
            message.success('开通成功，欢迎使用！')
            this.getWhite();
            return;
        }
        message.error(msg);
    }

    // 点击营销卡片处理函数
    handleNewPromotionCardClick(promotionEntity) {
        const { key, isSpecial } = promotionEntity;
        if (HUALALA.ENVIRONMENT === 'production-release' && UNRELEASED_PROMOTION_TYPES.includes(`${key}`)) {
            return message.success(SALE_LABEL.k6316gwc);//活动尚未开放
        }
        if (isSpecial) {
            const specialIndex = this.props.saleCenter.get('characteristicCategories').toJS().findIndex(promotion => promotion.key === key);
            this.handleSpecialPromotionCreate(specialIndex, promotionEntity)
        } else {
            const basicIndex = this.props.saleCenter.get('activityCategories').toJS().findIndex(promotion => promotion.key === key);
            this.handleBasicPromotionCreate(basicIndex, promotionEntity)
        }
    }

    // 创建基础营销
    handleBasicPromotionCreate(index, promotionEntity) {
        if (isHuaTian(this.props.user.accountInfo.groupID)) {
            message.warning(BASIC_PROMOTION_CREATE_DISABLED_TIP);
            return;
        }
        if (!checkPermission(BASIC_PROMOTION_CREATE)) {
            message.warn(SALE_LABEL.k5nh24u9);
            return;
        }
        const key = promotionEntity.key;
        const opts = {
            _groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
        };
        this.props.fetchFoodCategoryInfo({ ...opts });
        this.props.fetchFoodMenuInfo({ ...opts });
        this.props.toggleIsBasicUpdate(true);
        this.props.setBasicPromotionType({
            promotionType: key,
        });
        this.setBasicModalVisible(true);
        this.setState({
            basicIndex: index,
        });
        // if (activityList.includes(key)) {
        //     setTimeout(() => {
        //         jumpPage({ menuID: SALE_CENTER_PAYHAVEGIFT, typeKey: key })
        //     }, 100);
        //     return closePage(SALE_CENTER_PAYHAVEGIFT)
        // }
    }
    setBasicModalVisible(basicModalVisible) {
        this.setState({ basicModalVisible, });
        if (!basicModalVisible) {
            this.props.saleCenterResetBasicBasicInfo();
            this.props.saleCenterResetBasicScopeInfo();
            this.props.saleCenterResetBasicDetailInfo();
        }
    }

    // 创建特色营销
    handleSpecialPromotionCreate(index, activity) {
        // 唤醒送礼 品牌不可创建
        if ('63' === activity.key && isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)) {
            message.warning(SPECIAL_PROMOTION_CREATE_DISABLED_TIP);
            return;
        }
        if (!checkPermission(SPECIAL_PROMOTION_CREATE)) {
            message.warn(SALE_LABEL.k5nh24u9);
            return;
        }
        const key = activity.key;
        const { user } = this.props;
        this.setState({
            specialIndex: index,
        });
        this.props.toggleIsSpecialUpdate(true);
        this.props.setSpecialPromotionType({
            eventWay: key,
        });
        // 完善资料送礼只能创建一次
        // if (key === '60') {
        //     if (isHuaTian()) {
        //         return message.warning(SPECIAL_PROMOTION_CREATE_DISABLED_TIP);
        //     }
        //     this.props.saleCenterCheckSpecialExist({
        //         eventWay: key,
        //         data: {
        //             groupID: user.accountInfo.groupID,
        //             eventWay: key,
        //         },
        //         success: (val) => {
        //             if (key === '60' && val.serviceCode === 1) {
        //                 message.warning(SALE_LABEL.k6316h4o);
        //             } else {
        //                 this.setSpecialModalVisible(true);
        //                 this.props.setSpecialPromotionType({
        //                     eventName: activity.title,
        //                 });
        //             }
        //         },
        //         fail: () => {
        //             message.error(SALE_LABEL.k5dmw1z4);
        //         },
        //     });
        //     return;
        // }
        if (activityList.includes(key)) {
            setTimeout(() => {
                jumpPage({ menuID: SALE_CENTER_PAYHAVEGIFT, typeKey: key })
            }, 100);
            return closePage(SALE_CENTER_PAYHAVEGIFT)
        }
        this.setSpecialModalVisible(true);
    }
    setSpecialModalVisible(specialModalVisible) {
        this.setState({ specialModalVisible });
        if (!specialModalVisible) {
            this.props.saleCenterResetSpecailDetailInfo();
        }
    }
    renderBasicPromotionModal() {
        const promotionType = this.props.saleCenter.get('activityCategories').toJS()[this.state.basicIndex].title;
        const { intl } = this.props;
        const create = intl.formatMessage(COMMON_STRING.create);
        const title = <p>{create} {promotionType}</p>;
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={title}
                maskClosable={false}
                footer={false}
                style={{
                    top: 20,
                }}
                width={1000}
                visible={this.state.basicModalVisible}
                onOk={() => this.setBasicModalVisible(false)}
                onCancel={() => this.setBasicModalVisible(false)}
            >
                { this.state.basicModalVisible && <BasicActivityMain
                    index={this.state.basicIndex}
                    isNew={true}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.setBasicModalVisible(false)
                        }
                    }}
                />}
            </Modal>
        );
    }
    renderSpecialPromotionModal() {
        const { title: promotionType } = this.props.saleCenter.get('characteristicCategories').toJS()[this.state.specialIndex];
        const { intl } = this.props;
        const create = intl.formatMessage(COMMON_STRING.create);
        const title = <p>{create} {promotionType}</p>;
        return (
            <Modal
                wrapClassName={'progressBarModal'}
                title={title}
                maskClosable={false}
                footer={false}
                style={{
                    top: 20,
                }}
                width={1000}
                visible={this.state.specialModalVisible}
                onOk={() => this.setSpecialModalVisible(false)}
                onCancel={() => this.setSpecialModalVisible(false)}
            >
                {this.state.specialModalVisible ? <SpecialActivityMain
                    index={this.state.specialIndex}
                    isNew={true}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.setSpecialModalVisible(false);
                        }
                    }}
                /> : null}
            </Modal>
        );
    }

    //** 第三版 重构 抽抽乐活动 点击事件 */
    onV3Click = (key) => {
        if (key) this.setState({ curKey: key })
        this.setState(ps => ({ v3visible: !ps.v3visible }));
    }

    //产品授权-集团授权信息
    checkAuth = (allMenu, category) => {
        const { currentCategoryIndex } = this.state;
        let { authStatus } = checkAuthLicense(this.state.authLicenseData)
        // authStatus = true;
        if (!authStatus) {
            category = category.filter(item => (item.list == FANS_INTERACTIVITY_PROMOTION_TYPES || item.list == SALE_PROMOTION_TYPES || item.title == '最新活动'))
        }
        let displayList = currentCategoryIndex === 0 ? category.slice(1) : [category[currentCategoryIndex - (!authStatus ? 0 : 1)]];
        // 未授权   只留  粉丝互动-随机立减 和 促进销量
        if (!authStatus) {
            displayList = displayList.filter(item => (item.title == '粉丝互动' || item.title == '促进销量'))
            displayList.map(item => {
                if (item.title == '粉丝互动') {
                    let info = item.list.filter(item => item.key == '2030')
                    item.list = info
                }
            })
            // 
            allMenu = allMenu.filter(item => (item == '粉丝互动' || item == '促进销量' || item == '全部活动'))
        }
        return { displayList, allMenu }
    }

    // 管家活动-依据集团权限-返回活动入口
    filterMenuByGroup = (displayList = [], allMenu = []) => {
        const state = getStore().getState();
        const { groupID } = state.user.get('accountInfo').toJS();
        const { houseKeepStatus,gentGiftStatus } = this.state;
        // let keeperFlag = avaHouseKeeperGroups.includes(groupID)
        // let intelligentFlag = avaIntelligentGiftRuleGroups.includes(groupID)
        // 管家活动列表是否为空
        let isKeeperEmpty = false

        displayList = displayList.map((item) => {
            if (item.title == '管家活动') {
                let { list = [] } = item
                let data = list

                if (!houseKeepStatus) {
                    data = data.filter(item => item.key != 'housekeeper')
                }
                if (!gentGiftStatus) {
                    data = data.filter(item => item.key != 'intelligentGiftRule')
                }
                item.list = data
                isKeeperEmpty = data.length <= 0
            }
            return item
        })

        if (isKeeperEmpty) {
            allMenu = allMenu.filter(item => item != '管家活动')
            displayList = displayList.filter(item => item.title != '管家活动')
        }

        return { displayList, allMenu }
    }

    render() {
        const { whiteList, v3visible, curKey } = this.state;
        const state = getStore().getState();
        const { groupID } = state.user.get('accountInfo').toJS();
        const { intl } = this.props;
        const k6316hto = intl.formatMessage(SALE_STRING.k6316hto);
        const k6316hd0 = intl.formatMessage(SALE_STRING.k6316hd0);
        const k6316iac = intl.formatMessage(SALE_STRING.k6316iac);
        const k6316hlc = intl.formatMessage(SALE_STRING.k6316hlc);
        const k6316iio = intl.formatMessage(SALE_STRING.k6316iio);
        const k6316i20 = intl.formatMessage(SALE_STRING.k6316i20);
        const k5eng042 = intl.formatMessage(SALE_STRING.k5eng042);
        let ALL_PROMOTION_CATEGORIES = [
            {
                title: '最新活动',
                list: NEW_CUSTOMER_PROMOTION_TYPES.concat(FANS_INTERACTIVITY_PROMOTION_TYPES, REPEAT_PROMOTION_TYPES, LOYALTY_PROMOTION_TYPES, SALE_PROMOTION_TYPES, ONLINE_PROMOTION_TYPES).filter(item => item.isNew && item.key != 67 && item.key != 68),
            },
            // {
            //     title: '热门活动',
            //     list: NEW_CUSTOMER_PROMOTION_TYPES.concat(FANS_INTERACTIVITY_PROMOTION_TYPES, REPEAT_PROMOTION_TYPES, LOYALTY_PROMOTION_TYPES, SALE_PROMOTION_TYPES, ONLINE_PROMOTION_TYPES).filter((item) => { return item.isHot && item.key != 67 && item.key != 68}),
            // },
            {
                title: k6316hto,
                list: NEW_CUSTOMER_PROMOTION_TYPES,
            },
            {
                title: k6316hd0,
                list: FANS_INTERACTIVITY_PROMOTION_TYPES,
            },
            {
                title: k6316iac,
                list: REPEAT_PROMOTION_TYPES,
            },
            {
                title: k6316hlc,
                list: LOYALTY_PROMOTION_TYPES,
            },
            {
                title: k6316iio,
                list: SALE_PROMOTION_TYPES,
            },
            {
                title: '管家活动',
                list: HOUSEKEEPER_TYPES,
            },
        ]
        let allMenus = [
            '全部活动',
            <span style={{ position: 'relative' }}><img style={{ position: 'absolute', left: -19, top: 4, width: 16 }} src={newPic} />最新活动</span>,
            // <span style={{position: 'relative'}}><img style={{position: 'absolute', left: -17, top: 4}} src={hot}/>热门活动</span>,
            ...(ALL_PROMOTION_CATEGORIES.slice(1)).map(item => item.title),
        ];
        const { currentCategoryIndex } = this.state;
        // const displayList = currentCategoryIndex === 0 ? ALL_PROMOTION_CATEGORIES.slice(1) : [ALL_PROMOTION_CATEGORIES[currentCategoryIndex - 1]];

        // 插件授权状态--营销盒子大礼包
        let { authPluginStatus } = checkAuthLicense(this.state.authLicenseData, 'HLL_CRM_Marketingbox')

        /**
         * 页面活动列表显示过滤
         */
        // auth-插件授权-列表显示过滤
        var { displayList, allMenu } = this.checkAuth(allMenus, ALL_PROMOTION_CATEGORIES)
        // 管家活动-列表显示过滤
        var { displayList, allMenu } = this.filterMenuByGroup(displayList, allMenu)
        const speController = groupID == '295896'
        //集团id：295896 
        // 开通桌边砍活动
        return (
            <div className={selfStyle.newDiv}>
                <div className={selfStyle.titleArea}>营销活动</div>
                <div className={selfStyle.grayBar}></div>
                <div className={selfStyle.menuArea}>
                    {
                        allMenu.map((title, index) => (
                            <div
                                onClick={() => this.setState({ currentCategoryIndex: index })}
                                className={`${selfStyle.menuItem} ${index === currentCategoryIndex ? selfStyle.selectedMenuItem : ''}`}
                            >
                                {title}
                            </div>
                        ))
                    }
                </div>
                <div className={selfStyle.contentArea}>
                    {
                        displayList.map(({ title, list }) => (
                            <div>
                                <div className={selfStyle.contentTitle}>{title}</div>
                                <div className={selfStyle.cardWrapper}>
                                    {
                                        list.filter(item => !item.isOffline || (speController && item.key == '67')).map((item, index) => (
                                            <NewPromotionCard
                                                size="special"
                                                key={item.key}
                                                promotionEntity={item}
                                                onCardClick={this.handleNewPromotionCardClick.bind(this)}
                                                index={index}
                                                whiteList={whiteList}
                                                text={item.text}
                                                onClickOpen={this.onClickOpen}
                                                onV3Click={() => { this.onV3Click(item.key) }}
                                                authPluginStatus={authPluginStatus}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                {this.renderBasicPromotionModal()}
                {this.renderSpecialPromotionModal()}
                { (v3visible && curKey == '78') && <Chou2Le onToggle={this.onV3Click} />}
                { (v3visible && curKey == '79') && <BlindBox onToggle={this.onV3Click} />}
                { (v3visible && curKey == '83') && <PassWordCoupon onToggle={this.onV3Click} />}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        saleCenter: state.sale_saleCenter_NEW,
        user: state.user.toJS(),
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        // 特色营销actions
        setSpecialPromotionType: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        saleCenterResetSpecailDetailInfo: (opts) => {
            dispatch(saleCenterResetSpecialDetailInfoAC(opts));
            dispatch(resetOccupiedWeChatInfo());
        },
        saleCenterCheckSpecialExist: (opts) => {
            dispatch(saleCenterCheckExist(opts));
        },
        toggleIsSpecialUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        // 基础营销actions
        setBasicPromotionType: (opts) => {
            dispatch(saleCenterSetBasicInfoAC(opts));
        },
        saleCenterResetBasicBasicInfo: (opts) => {
            dispatch(saleCenterResetBasicInfoAC(opts));
        },
        saleCenterResetBasicScopeInfo: (opts) => {
            dispatch(saleCenterResetScopeInfoAC(opts));
        },
        saleCenterResetBasicDetailInfo: (opts) => {
            dispatch(saleCenterResetBasicDetailInfoAC(opts));
        },
        toggleIsBasicUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },
        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        },
        setSpecialPromotionCardGroupID: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoCardGroupID(opts));
        },
        saveRFMParams: (opts) => {
            dispatch(saleCenterSaveCreateMemberGroupParams(opts))
        },
        getAuthLicenseData: (opts) => {
            return dispatch(getAuthLicenseData(opts))
        }
    }
}

export default NewCustomerPage

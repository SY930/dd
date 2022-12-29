/**
 *
 * @description 营销活动（新） 入口文件
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import registerPage from '../../../index';
import { NEW_ON_SALE_ACTIVITY_BOX } from "../../constants/entryCodes";
import { axiosData, checkAuthLicense, getRetailMenuID, isRetailMenuID } from '../../helpers/util';
import { COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';
import selfStyle from './NewSalePage.less';
import moment from 'moment'

import {
    Modal,
    message
} from 'antd';
import {
    SALE_PROMOTION_TYPES,
} from 'constants/promotionType';
import NewSaleCard from "./NewSaleCard";
const UNRELEASED_PROMOTION_TYPES = [
]
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterSetSpecialBasicInfoCardGroupID,
    saleCenterSaveCreateMemberGroupParams,
    getAuthLicenseData,
    saleCenterSetSpecialActivityInfoByForce,
    saleCenterSetJumpOpenCardParams, 
    saleCenterSetJumpSendGiftParams,
} from "../../redux/actions/saleCenterNEW/specialPromotion.action";
import {
    fetchSpecialDetailAC, 
} from '../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
    saleCenterResetDetailInfoAC as saleCenterResetBasicDetailInfoAC,
    getMallGoodsAndCategories,
} from "../../redux/actions/saleCenterNEW/promotionDetailInfo.action";
import {
    saleCenterResetBasicInfoAC,
    saleCenterSetBasicInfoAC 
} from "../../redux/actions/saleCenterNEW/promotionBasicInfo.action";
import { saleCenterResetScopeInfoAC } from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import { toggleIsUpdateAC } from "../../redux/actions/saleCenterNEW/myActivities.action";
import { checkPermission } from "../../helpers/util";
import { BASIC_PROMOTION_CREATE } from "../../constants/authorityCodes";
import BasicActivityMain from '../SaleCenterNEW/activityMain';
import {
    BASIC_PROMOTION_CREATE_DISABLED_TIP, // 基础
    isHuaTian, // 基础
} from "../../constants/projectHuatianConf";
import { axios, getStore } from '@hualala/platform-base';
import ActivityMain from '../WeChat2Mall/WeChatMaLLActivityMain'; // 秒杀 基础
import {
    specialPromotionBasicDataAdapter,
} from '../../redux/actions/saleCenterNEW/types';


const CONTAIN_GROUPID_SHOW = ['317964', '189702']; // 拼团秒杀只针对茶百道显示
const REDUCE_SHIPPING_GROUPID = ['11157', '189702', '89447', '28007'] // 配送费减免仅针对白名单集团开发


//周黑鸭需求
import { isZhouheiya, RetailMenuID } from '../../constants/WhiteList';

@registerPage([NEW_ON_SALE_ACTIVITY_BOX], {
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class NewOnSaleActivityPage extends Component {

    state = {
        whiteList: [],
        basicModalVisible: false,
        basicIndex: 0,
        // specialModalVisible: false,
        specialIndex: 0,
        currentCategoryIndex: 0,
        v3visible: false,       // 第三版活动组件是否显示
        curKey: '',             //当前活动入口值
        authLicenseData: {},
        houseKeepStatus: false,//是否有流失唤醒
        gentGiftStatus: false,//是否有智能发券
        isJumpNew: true,
        ifJumpSetData: false,
        ifJumpSelfDefine: false,
        currentPlatformIndex: 0,
        sceneMap: {0: '', 1: 'app', 2: 'pos', 3: 'wx'},
    }

    componentDidMount() {
        this.getWhite();
        this.props.getAuthLicenseData({ productCode: 'HLL_CRM_Marketingbox' }).then((res) => {
            this.setState({ authLicenseData: res })
        });
    }
    componentWillReceiveProps(nextProps) {
        // todo:上线放开
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
            // this.fromCrmJump();
        }
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

    // 权益卡
    handleSuccessData = (response = {}) => {
        const _serverToRedux = false;
        if (response === undefined || response.data === undefined) {
            message.error(`请求回来的数据有误`);
            return null;
        }
        response.data.cardGroupID = '权益卡有效会员'
        response.data.cardLevelIDList = []
        const {
            ifJumpSetData
        } = this.state
        if (!ifJumpSetData) {
            this.props.setSpecialPromotionType(specialPromotionBasicDataAdapter(response, _serverToRedux));
            this.setState({
                ifJumpSetData: true,
            })
        }

    }

    failFn = () => {
        message.error('查询活动失败')
    }
    fromCrmJump() {
        const {
            from = '',
        } = this.getQueryVariable()
        const state = getStore().getState();
         if (from === 'giftInfo') {
           
        } else if (from === 'scenePut') {
           
        } else {
           
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
    handleNewPromotionCardClick(promotionEntity = {}, ifskip) {
        const { key, isSpecial } = promotionEntity;
        if (HUALALA.ENVIRONMENT === 'production-release' && UNRELEASED_PROMOTION_TYPES.includes(`${key}`)) {
            return message.success(SALE_LABEL.k6316gwc);//活动尚未开放
        }
            const basicIndex = this.props.saleCenter.get('activityCategories').toJS().findIndex(promotion => promotion.key === key);
            this.handleBasicPromotionCreate(basicIndex, promotionEntity)
        // }
    }

    // 创建基础营销
    handleBasicPromotionCreate(index, promotionEntity = {}) {
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
    }

    setBasicModalVisible(basicModalVisible) {
        this.setState({ basicModalVisible, });
        if (!basicModalVisible) {
            this.props.saleCenterResetBasicBasicInfo();
            this.props.saleCenterResetBasicScopeInfo();
            this.props.saleCenterResetBasicDetailInfo();
        }
    }

    renderBasicPromotionModal() {
        const promotionType = this.props.saleCenter.get('activityCategories').toJS()[this.state.basicIndex] && this.props.saleCenter.get('activityCategories').toJS()[this.state.basicIndex].title;
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
                {this.state.basicModalVisible && <BasicActivityMain
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

    // 秒杀活动
    renderWeChat2MallModal() {
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={'新建秒杀活动'}
                footer={false}
                width={1000}
                visible={true}
                onCancel={this.onV3Click}
            >
                <ActivityMain
                    index={0}
                    isNew={true}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.onV3Click()
                        }
                    }}
                />
            </Modal>
        )
    }

    // 请求菜品
    queryWeChat2Mall = (key) => {
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
    }

    //** 第三版 重构 抽抽乐活动 点击事件 */
    onV3Click = (key) => {
        if (key) this.setState({ curKey: key })
        if (key === '10072') {
            this.queryWeChat2Mall(key)
        }
        this.setState(ps => ({ v3visible: !ps.v3visible }));
    }

    //产品授权-集团授权信息
    checkAuth = (category = []) => {
        const { currentCategoryIndex } = this.state;
        let { authStatus } = checkAuthLicense(this.state.authLicenseData)
        // authStatus = true;
        let displayList = category.length ? [category[currentCategoryIndex]] : [];
        // 未授权   只留促进销量
        if (!authStatus) {
            displayList = (displayList || []).filter(item => (item.title == '促进销量'))
        }

        return { displayList }
    }

    // 管家活动-依据集团权限-返回活动入口
    filterMenuByGroup = (displayList = []) => {
        const { currentPlatformIndex: cPIdx, sceneMap } = this.state;
        if (sceneMap[cPIdx]) {
            displayList = (displayList || []).map((item) => {
                item.list = (item.list || []).filter((itm) => (itm.signs || []).includes(sceneMap[cPIdx]))
                return { ...item }
            })
        }
        return { displayList }
    }

    render() {
        const { whiteList, v3visible, curKey, currentPlatformIndex } = this.state;
        const state = getStore().getState();
        const { groupID } = state.user.get('accountInfo').toJS();
        const { intl } = this.props;
        const k6316iio = intl.formatMessage(SALE_STRING.k6316iio);
        let salePromotionType = REDUCE_SHIPPING_GROUPID.includes(String(groupID)) ? SALE_PROMOTION_TYPES : SALE_PROMOTION_TYPES.filter(item => item.title !== '配送费减免')
        let ALL_PROMOTION_CATEGORIES = [
            {
                title: k6316iio,
                list: CONTAIN_GROUPID_SHOW.includes(String(groupID)) ? salePromotionType : salePromotionType.filter(item => !item.filter),
            },
        ]
        
        //周黑鸭需求
        if (isZhouheiya(groupID)) {
            ALL_PROMOTION_CATEGORIES = [
                {
                    title: k6316iio,
                    list: salePromotionType.filter(item => item.isZhy),
                }]
        }

        // 零售展示的活动
        if (isRetailMenuID()) {
            ALL_PROMOTION_CATEGORIES = [
                {
                    title: k6316iio,
                    list: salePromotionType.filter(item => item.menuID && item.menuID.includes(getRetailMenuID())),
                }]
        }


        // 插件授权状态--营销盒子大礼包
        let { authPluginStatus } = checkAuthLicense(this.state.authLicenseData, 'HLL_CRM_Marketingbox')

        /**
         * 页面活动列表显示过滤
         */
        // auth-插件授权-列表显示过滤
        var { displayList } = this.checkAuth(ALL_PROMOTION_CATEGORIES)
        // 管家活动-列表显示过滤
        var { displayList } = this.filterMenuByGroup(displayList)
        const speController = groupID == '295896'
        //集团id：295896 
        // 开通桌边砍活动
        return (
            <div className={selfStyle.newDiv}>
                <div className={selfStyle.titleArea} style={{ justifyContent: 'start'}}>促销活动
                <div className={selfStyle.platformArea}>
                        <span className={selfStyle.platformTitle}>应用平台</span>
                        <div className={selfStyle.platformBox}>
                        {
                            [{name: '全部', value: 0}, {name: '小程序', value: 'app'}, {name: 'POS', value: 'pos'}, {name: 'H5餐厅', value: 'wx'}].map((item, index) => (
                                <div onClick={() => { this.setState({currentPlatformIndex: index })}} className={`${selfStyle.platformItem} ${index === currentPlatformIndex ? selfStyle.selectedItem : ''} ${index === currentPlatformIndex + 1 ? selfStyle.removeLine : ''}`}><span>{item.name}</span></div>
                            ))
                        }
                        </div>
                    </div>
                </div>
                <div className={selfStyle.grayBar}></div>
                <div className={selfStyle.contentArea} style={{ paddingLeft: 20 }}>
                    {
                        (displayList || []).map(({ title, list }) => (
                            <div>
                                <div className={selfStyle.cardWrapper}>
                                    {
                                        list.filter(item => !item.isOffline || (speController && item.key == '67')).map((item, index) => (
                                            <NewSaleCard
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
                {(v3visible && curKey == '10072') && this.renderWeChat2MallModal()}
            </div >
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
        setSpecialPromotionInfo: (opts) => {
            dispatch(saleCenterSetSpecialActivityInfoByForce(opts));
        },
        saleCenterSetJumpOpenCardParams: (opts) => {
            dispatch(saleCenterSetJumpOpenCardParams(opts));
        },
        saleCenterSetJumpSendGiftParams: (opts) => {
            dispatch(saleCenterSetJumpSendGiftParams(opts));
        },
        saveRFMParams: (opts) => {
            dispatch(saleCenterSaveCreateMemberGroupParams(opts))
        },
        getAuthLicenseData: (opts) => {
            return dispatch(getAuthLicenseData(opts))
        },
        getMallGoodsAndCategories: (opts) => {
            dispatch(getMallGoodsAndCategories(opts))
        },
        fetchSpecialDetail: (opts) => {
            return dispatch(fetchSpecialDetailAC(opts))
        }
    }
}

export default NewOnSaleActivityPage

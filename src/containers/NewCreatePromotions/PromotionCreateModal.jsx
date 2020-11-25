import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    saleCenterCheckExist,
    saleCenterResetDetailInfoAC as saleCenterResetSpecialDetailInfoAC,
    saleCenterSetSpecialBasicInfoAC
} from "../../redux/actions/saleCenterNEW/specialPromotion.action";
import {NEW_SALE_BOX,SALE_CENTER_PAYHAVEGIFT} from "../../constants/entryCodes";
import {
    Modal,
    message
} from 'antd';
import {resetOccupiedWeChatInfo} from "../../redux/actions/saleCenterNEW/queryWeixinAccounts.action";
import {toggleIsUpdateAC} from "../../redux/actions/saleCenterNEW/myActivities.action";
import SpecialActivityMain from '../SpecialPromotionNEW/activityMain';
import BasicActivityMain from '../SaleCenterNEW/activityMain';
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
    saleCenterResetDetailInfoAC as saleCenterResetBasicDetailInfoAC
} from "../../redux/actions/saleCenterNEW/promotionDetailInfo.action";
import {
    saleCenterResetBasicInfoAC,
    saleCenterSetBasicInfoAC
} from "../../redux/actions/saleCenterNEW/promotionBasicInfo.action";
import {saleCenterResetScopeInfoAC} from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import NewPromotionCard from "./NewPromotionCard";
import {checkPermission} from "../../helpers/util";
import {BASIC_PROMOTION_CREATE, SPECIAL_PROMOTION_CREATE} from "../../constants/authorityCodes";
import {
    BASIC_PROMOTION_CREATE_DISABLED_TIP,
    isBrandOfHuaTianGroupList,
    isHuaTian,
    SPECIAL_PROMOTION_CREATE_DISABLED_TIP,
} from "../../constants/projectHuatianConf";
import {
    NEW_CUSTOMER_PROMOTION_TYPES,
    FANS_INTERACTIVITY_PROMOTION_TYPES,
    REPEAT_PROMOTION_TYPES,
    LOYALTY_PROMOTION_TYPES,
    SALE_PROMOTION_TYPES,
    ONLINE_PROMOTION_TYPES,
} from '../../constants/promotionType';
import selfStyle from './style.less'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';
import { axiosData } from '../../helpers/util';
import { axios } from '@hualala/platform-base';
import { getStore } from '@hualala/platform-base'
import Chou2Le from "../PromotionV3/Chou2Le";   // 抽抽乐
import BlindBox from "../PromotionV3/BlindBox";   // 抽抽乐
import { jumpPage, closePage } from '@hualala/platform-base';

// 跳转到带装修的活动设置页面
const activityList = [
    '80', '66', '81'
]

const UNRELEASED_PROMOTION_TYPES = [
]
@injectIntl()
class PromotionCreateModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            basicModalVisible: false,
            basicIndex: 0,
            specialModalVisible: false,
            specialIndex: 0,
            currentCategoryIndex: 0,
            whiteList: [],
            v3visible: false,       // 第三版活动组件是否显示
        };
        this.handleNewPromotionCardClick = this.handleNewPromotionCardClick.bind(this);
    }
    componentDidMount() {
        this.getWhite();
    }
    getWhite(){
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
    setBasicModalVisible(basicModalVisible) {
        this.setState({ basicModalVisible });
        if (!basicModalVisible) {
            this.props.saleCenterResetBasicBasicInfo();
            this.props.saleCenterResetBasicScopeInfo();
            this.props.saleCenterResetBasicDetailInfo();
        }
    }

    setSpecialModalVisible(specialModalVisible) {
        this.setState({ specialModalVisible });
        if (!specialModalVisible) {
            this.props.saleCenterResetSpecailDetailInfo();
        }
    }

    handleNewPromotionCardClick(promotionEntity) {
        const { key, isSpecial} = promotionEntity;
        if (HUALALA.ENVIRONMENT === 'production-release' && UNRELEASED_PROMOTION_TYPES.includes(`${key}`)) {
            return message.success(SALE_LABEL.k6316gwc);
        }
        if (isSpecial) {
            const specialIndex = this.props.saleCenter.get('characteristicCategories').toJS().findIndex(promotion => promotion.key === key);
            this.handleSpecialPromotionCreate(specialIndex, promotionEntity)
        } else {
            const basicIndex = this.props.saleCenter.get('activityCategories').toJS().findIndex(promotion => promotion.key === key);
            this.handleBasicPromotionCreate(basicIndex, promotionEntity)
        }
    }

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
        if(activityList.includes(key)) {
            setTimeout(() => {
                jumpPage({ menuID: SALE_CENTER_PAYHAVEGIFT, typeKey: key})
                this.props.onCancel()
            }, 100);
            return closePage(SALE_CENTER_PAYHAVEGIFT)
         }
        this.setSpecialModalVisible(true);
    }

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
    }

    renderSpecialPromotionModal() {
        const promotionType = this.props.saleCenter.get('characteristicCategories').toJS()[this.state.specialIndex].title;
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
    //** 第三版 重构 抽抽乐活动 点击事件 */
    onV3Click = (key) => {
        if(key) this.setState({curKey: key})
        this.setState(ps => ({ v3visible: !ps.v3visible }));
    }
    renderModalContent() {
        const {whiteList, v3visible, curKey} = this.state;
        const { intl } = this.props;
        const k6316hto = intl.formatMessage(SALE_STRING.k6316hto);
        const k6316hd0 = intl.formatMessage(SALE_STRING.k6316hd0);
        const k6316iac = intl.formatMessage(SALE_STRING.k6316iac);
        const k6316hlc = intl.formatMessage(SALE_STRING.k6316hlc);
        const k6316iio = intl.formatMessage(SALE_STRING.k6316iio);

        const k6316i20 = intl.formatMessage(SALE_STRING.k6316i20);
        const k5eng042 = intl.formatMessage(SALE_STRING.k5eng042);
        const ALL_PROMOTION_CATEGORIES = [
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
                title: k6316i20,
                list: ONLINE_PROMOTION_TYPES,
            },
        ]
        const allMenu = [
            k5eng042,
            ...ALL_PROMOTION_CATEGORIES.map(item => item.title),
        ];
        const { currentCategoryIndex } = this.state;
        const displayList = currentCategoryIndex === 0 ? ALL_PROMOTION_CATEGORIES : [ALL_PROMOTION_CATEGORIES[currentCategoryIndex - 1]];
        return (
            <div className={[selfStyle.flexWrapper, selfStyle.contentWrapper].join(' ')}>
                <div className={selfStyle.menuArea}>
                    {
                        allMenu.map((title, index) => (
                            <div
                                onClick={() => this.setState({currentCategoryIndex: index})}
                                className={`${selfStyle.menuItem} ${index === currentCategoryIndex ? selfStyle.selectedMenuItem : ''}`}
                            >
                                {title}
                            </div>
                        ))
                    }
                </div>
                <div className={selfStyle.contentArea}>
                    {
                        displayList.map(({title, list}) => (
                            <div>
                                <div className={selfStyle.contentTitle}>{title}</div>
                                <div className={selfStyle.cardWrapper}>
                                    {
                                        list.filter(item => !item.isOffline).map((item, index) => (
                                            <NewPromotionCard
                                                size="small"
                                                key={item.key}
                                                promotionEntity={item}
                                                onCardClick={this.handleNewPromotionCardClick}
                                                index={index}
                                                whiteList={whiteList}
                                                onClickOpen={this.onClickOpen}
                                                onV3Click={()=>{this.onV3Click(item.key)}}
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
                {(v3visible && curKey == '78') && (<Chou2Le onToggle={this.onV3Click} />)}
                {(v3visible && curKey == '79') && (<BlindBox onToggle={this.onV3Click} />)}
            </div>
        )
    }

    render() {
        const { onCancel } = this.props;
        return (
            <Modal
                title={SALE_LABEL.k6316ir0}
                footer={false}
                width={900}
                visible={true}
                onCancel={onCancel}
            >
                {this.renderModalContent()}
            </Modal>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionCreateModal)

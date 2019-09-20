import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    saleCenterCheckExist,
    saleCenterResetDetailInfoAC as saleCenterResetSpecialDetailInfoAC,
    saleCenterSetSpecialBasicInfoAC
} from "../../redux/actions/saleCenterNEW/specialPromotion.action";
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

const ALL_PROMOTION_CATEGORIES = [
    {
        title: '会员拉新',
        list: NEW_CUSTOMER_PROMOTION_TYPES.filter(item => item.key != 67 && item.key != 68),
    },
    {
        title: '粉丝互动',
        list: FANS_INTERACTIVITY_PROMOTION_TYPES,
    },
    {
        title: '促进复购',
        list: REPEAT_PROMOTION_TYPES,
    },
    {
        title: '会员关怀',
        list: LOYALTY_PROMOTION_TYPES,
    },
    {
        title: '促进销量',
        list: SALE_PROMOTION_TYPES,
    },
    {
        title: '线上营销',
        list: ONLINE_PROMOTION_TYPES,
    },
]

const UNRELEASED_PROMOTION_TYPES = [
]

class PromotionCreateModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            basicModalVisible: false,
            basicIndex: 0,
            specialModalVisible: false,
            specialIndex: 0,
            currentCategoryIndex: 0,
        };
        this.handleNewPromotionCardClick = this.handleNewPromotionCardClick.bind(this);
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
            return message.success('活动尚未开放，敬请期待');
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
            message.warn('您没有新建活动的权限，请联系管理员');
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
        if (key === '60') {
            if (isHuaTian()) {
                return message.warning(SPECIAL_PROMOTION_CREATE_DISABLED_TIP);
            }
            this.props.saleCenterCheckSpecialExist({
                eventWay: key,
                data: {
                    groupID: user.accountInfo.groupID,
                    eventWay: key,
                },
                success: (val) => {
                    if (key === '60' && val.serviceCode === 1) {
                        message.warning('您已创建过完善资料送礼,不能重复添加!');
                    } else {
                        this.setSpecialModalVisible(true);
                        this.props.setSpecialPromotionType({
                            eventName: activity.title,
                        });
                    }
                },
                fail: () => {
                    message.error('检查失败!');
                },
            });
            return;
        }
        this.setSpecialModalVisible(true);
    }

    handleBasicPromotionCreate(index, promotionEntity) {
        if (isHuaTian(this.props.user.accountInfo.groupID)) {
            message.warning(BASIC_PROMOTION_CREATE_DISABLED_TIP);
            return;
        }
        if (!checkPermission(BASIC_PROMOTION_CREATE)) {
            message.warn('您没有新建活动的权限，请联系管理员');
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
        return (
            <Modal
                wrapClassName={'progressBarModal'}
                title={`创建${promotionType}活动`}
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
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={(promotionType || '').endsWith('活动') ? `创建${promotionType}` : `创建${promotionType}活动`}
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

    renderModalContent() {
        const allMenu = [
            '全部',
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
                                        list.map((item, index) => (
                                            <NewPromotionCard
                                                size="small"
                                                key={item.key}
                                                promotionEntity={item}
                                                onCardClick={this.handleNewPromotionCardClick}
                                                index={index}
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
            </div>
        )
    }

    render() {
        const { onCancel } = this.props;
        return (
            <Modal
                title="创建活动"
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
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
import styles from '../GiftNew/GiftAdd/Crm.less';
import styles1 from '../SaleCenterNEW/ActivityPage.less';
import NewPromotionCard from "./NewPromotionCard";
import {checkPermission} from "../../helpers/util";
import {BASIC_PROMOTION_CREATE, SPECIAL_PROMOTION_CREATE} from "../../constants/authorityCodes";
import {
    BASIC_PROMOTION_CREATE_DISABLED_TIP,
    isBrandOfHuaTianGroupList,
    isHuaTian,
    SPECIAL_PROMOTION_CREATE_DISABLED_TIP,
} from "../../constants/projectHuatianConf";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

const UNRELEASED_PROMOTION_TYPES = [
]

@injectIntl()
class BasePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            basicModalVisible: false,
            basicIndex: 0,
            specialModalVisible: false,
            specialIndex: 0,
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
        this.setSpecialModalVisible(true);
    }

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

    render() {
        const { promotions, whiteList } = this.props;
        return (
            <div style={{
                backgroundColor: '#F3F3F3',
                height: '100%'
            }}>
                <div className="layoutsTool" style={{height: '79px'}}>
                    <div className={styles1.headerWithBgColor}>
                        <div className={styles1.customHeader}>
                            {this.props.categoryTitle}
                        </div>
                    </div>
                </div>
                <div
                    className={styles.flexPageWrap}
                    style={{
                        height: 'calc(100% - 79px)',
                        padding: '10px 30px 30px 30px',
                    }}
                >
                    {promotions.map((item, index) => (
                        <NewPromotionCard
                            key={item.key}
                            promotionEntity={item}
                            onCardClick={this.handleNewPromotionCardClick}
                            index={index}
                            whiteList={whiteList}
                        />
                    ))}
                </div>
                {this.renderBasicPromotionModal()}
                {this.renderSpecialPromotionModal()}
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BasePage)

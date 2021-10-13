/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-28T09:30:53+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: NewActivity.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-05T15:22:34+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


import React from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import { Modal, Row, Col, message, Button } from 'antd';
import { checkPermission, checkAuthLicense } from '../../helpers/util';
import {
    NEW_CUSTOMER_PROMOTION_TYPES,
    FANS_INTERACTIVITY_PROMOTION_TYPES,
    REPEAT_PROMOTION_TYPES,
    LOYALTY_PROMOTION_TYPES,
    SALE_PROMOTION_TYPES,
} from '../../constants/promotionType'
import {
    getAuthLicenseData
} from "../../redux/actions/saleCenterNEW/specialPromotion.action";
import styles from './ActivityPage.less'
import ActivityMain from './activityMain';
import WeChatMaLLActivityMain from '../WeChat2Mall/WeChatMaLLActivityMain'; // 秒杀
import Authority from './../../components/common/Authority';
import {
    saleCenterResetBasicInfoAC,
    saleCenterSetBasicInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import {
    saleCenterResetScopeInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import {
    saleCenterResetDetailInfoAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    toggleIsUpdateAC,
} from '../../redux/actions/saleCenterNEW/myActivities.action';
import {
    ACTIVITY_CATEGORIES,
} from '../../redux/actions/saleCenterNEW/types';
import { jumpPage, getStore } from '@hualala/platform-base'
import {
    SALE_CENTER_PAGE,
    SALE_CENTER_PAGE_SHOP,
} from "../../constants/entryCodes";
import NewPromotionCard from "../NewCreatePromotions/NewPromotionCard";
import {BASIC_PROMOTION_CREATE} from "../../constants/authorityCodes";
import {
    isGroupOfHuaTianGroupList, BASIC_PROMOTION_CREATE_DISABLED_TIP,
    isHuaTian
} from "../../constants/projectHuatianConf";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

const CONTAIN_GROUPID_SHOW = ['317964', '189702']; // 拼团秒杀只针对茶百道显示

const allBasicActivitiesArr = [
    ...NEW_CUSTOMER_PROMOTION_TYPES,
    ...FANS_INTERACTIVITY_PROMOTION_TYPES,
    ...REPEAT_PROMOTION_TYPES,
    ...LOYALTY_PROMOTION_TYPES,
    ...SALE_PROMOTION_TYPES,
].filter(item => !item.isSpecial);
const allBasicActivitiesMap = allBasicActivitiesArr.reduce((acc, curr) => {
    acc[curr.key] = curr;
    return acc;
}, {});

const Immutable = require('immutable');
function mapStateToProps(state) {
    return {
        saleCenter: state.sale_saleCenter_NEW,
        user: state.user.toJS(),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionType: (opts) => {
            dispatch(saleCenterSetBasicInfoAC(opts));
        },
        saleCenterResetBasicInfo: (opts) => {
            dispatch(saleCenterResetBasicInfoAC(opts));
        },
        saleCenterResetScopeInfo: (opts) => {
            dispatch(saleCenterResetScopeInfoAC(opts));
        },
        saleCenterResetDetailInfo: (opts) => {
            dispatch(saleCenterResetDetailInfoAC(opts));
        },
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },
        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        },
        getAuthLicenseData: (opts) => {
            return dispatch(getAuthLicenseData(opts))
        },
    };
}
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class NewActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1Visible: false,
            index: 0,
            promotionType: 0,
            contentHeight: document.documentElement.clientHeight || document.body.clientHeight,
            curKey: '',             //当前活动入口值
            v3visible: false,
        };

        this.renderActivityButtons = this._renderActivityButtons.bind(this);
        this.onButtonClicked = this._onButtonClicked.bind(this);
        this.renderModal = this._renderModal.bind(this);
        this.clear = this.clear.bind(this);
        this.setModal1Visible = this.setModal1Visible.bind(this);
        this.onWindowResize = throttle(this.onWindowResize.bind(this), 100);
    }
    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
        this.props.getAuthLicenseData({productCode: 'HLL_CRM_Marketingbox'}).then((res) => {
            this.setState({authLicenseData: res})
        });
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }
    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').getBoundingClientRect().height - 40;
        this.setState({ contentHeight });
    }

    onV3Click = (key) => {
        if (key) this.setState({ curKey: key })
        if (key === '10072') {
            this.queryWeChat2Mall(key)
        }
        this.setState(ps => ({ v3visible: !ps.v3visible }));
    }

    // 请求菜品
    queryWeChat2Mall = (key) => {
        const opts = {
            _groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
        };
        this.props.fetchFoodCategoryInfo({ ...opts });
        this.props.fetchFoodMenuInfo({ ...opts });
        this.props.toggleIsUpdate(true);
        this.props.setPromotionType({
            promotionType: key,
        });
    }

    setModal1Visible(modal1Visible) {
        this.setState({ modal1Visible });
        if (!modal1Visible) {
            this.props.saleCenterResetBasicInfo();
            this.props.saleCenterResetScopeInfo();
            this.props.saleCenterResetDetailInfo();
        }
    }

    clear() {
        this.setState({ modal1Visible : false });
    }

    render() {
        const headerClasses = `${styles.headerWithBgColor}`;
        const { v3visible, curKey } = this.state;
        return (
            <Row className="layoutsContainer">
                <Col span={24} style={{padding: 0}} className="layoutsHeader">
                    <div style={{height: '79px', backgroundColor: '#F3F3F3'}}>
                        <div className={headerClasses}>
                            <span  className={styles.customHeader}>
                                {COMMON_LABEL.create} {SALE_LABEL.k5m4q17q}
                            </span>
                            <span className={styles.jumpToCreateNew}>
                                <Button
                                    type="ghost"
                                    icon="rollback"
                                    onClick={
                                        () => {
                                            const menuID = this.props.user.menuList.find(tab => tab.entryCode === (this.props.user.shopID > 0 ? SALE_CENTER_PAGE_SHOP : SALE_CENTER_PAGE)).menuID;
                                            menuID && jumpPage({ menuID })
                                        }
                                    }>{SALE_LABEL.k5nh24lx}</Button>
                            </span>
                        </div>
                    </div>
                </Col>
                <Col
                    span={24}
                    className="layoutsContent"
                    style={{
                        overflow: 'auto',
                        height: this.state.contentHeight || 800,
                        padding: '10px 30px 30px 30px',
                    }}
                >
                    {this.renderActivityButtons()}
                    {this.renderModal()}
                    { (v3visible && curKey == '10072') && this.renderWeChat2MallModal() }
                </Col>
            </Row>
        );
    }

    handleCardClick = (index, activity) => {
        if (isHuaTian(this.props.user.accountInfo.groupID)) {
            message.warning(BASIC_PROMOTION_CREATE_DISABLED_TIP);
            return;
        }
        this.props.toggleIsUpdate(true);
        this.onButtonClicked(index, activity);
    }

    


    _renderActivityButtons() {
        const state = getStore().getState();
        const { groupID } = state.user.get('accountInfo').toJS();
        const ACTIVITY_CATEGORIES_FILTER = CONTAIN_GROUPID_SHOW.includes(String(groupID)) ? ACTIVITY_CATEGORIES : ACTIVITY_CATEGORIES.filter(item => !item.filter)
        return (
            <div
                className={styles.scrollableMessageContainer}
                style={{
                    marginBottom: 20
                }}
            >
                {ACTIVITY_CATEGORIES_FILTER.filter(item => !item.isOffline).map((activity, index) => {
                return (
                    <div
                        key={`NewActivity${index}`}
                    >
                        <Authority rightCode={BASIC_PROMOTION_CREATE}>
                            <NewPromotionCard
                                key={activity.key}
                                promotionEntity={allBasicActivitiesMap[activity.key]}
                                onCardClick={() => {
                                   this.handleCardClick(index, activity)
                                }}
                                index={index}
                                onV3Click={() => { this.onV3Click(activity.key) }}
                            />
                        </Authority>
                    </div>
                );
            })}
            </div>
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
                <WeChatMaLLActivityMain
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

    _renderModal() {
        const { intl } = this.props;
        const create = intl.formatMessage(COMMON_STRING.create);
        let index = ACTIVITY_CATEGORIES.findIndex(item => item.key == this.state.promotionType);
        const promotionType = ACTIVITY_CATEGORIES[index >= 0 ? index : 0].title || '';
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
                visible={this.state.modal1Visible}
                onOk={() => this.setModal1Visible(false)}
                onCancel={() => this.setModal1Visible(false)}
            >
                { this.state.modal1Visible && <ActivityMain
                    index={index}
                    steps={this.props.steps}
                    isNew={true}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.setModal1Visible(false)
                        }
                    }}
                />}
            </Modal>
        );
    }

    _onButtonClicked(index, activity) {
        if (!checkPermission("marketing.jichuyingxiaoxin.create")) {
            message.warn(SALE_LABEL.k5nh24u9);
            return;
        }
        const opts = {
            _groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
        };
        /** 已经不用此页面新建活动了, 所以不需要加华天的定制化参数 */
        this.props.fetchFoodCategoryInfo({ ...opts });
        /** 已经不用此页面新建活动了, 所以不需要加华天的定制化参数 */
        this.props.fetchFoodMenuInfo({ ...opts });
        // save the promotionType to redux
        this.props.setPromotionType({
            promotionType: activity.key,
        });
        this.setState({
            updateModalVisible: true,
            currentPromotionID: arguments[1].promotionIDStr,
        });
        this.setModal1Visible(true);
        this.setState({
            index,
            promotionType: activity.key
        });
    }
}


export default NewActivity;

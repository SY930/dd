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
import { checkPermission } from '../../helpers/util';
import {
    NEW_CUSTOMER_PROMOTION_TYPES,
    FANS_INTERACTIVITY_PROMOTION_TYPES,
    REPEAT_PROMOTION_TYPES,
    LOYALTY_PROMOTION_TYPES,
    SALE_PROMOTION_TYPES,
} from '../../constants/promotionType'
import styles from './ActivityPage.less'

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

if (process.env.__CLIENT__ === true) {
    require('../../components/common/components.less');
}

import { ActivityLogo } from './ActivityLogo/ActivityLogo';
import ActivityMain from './activityMain';
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
import { jumpPage } from '@hualala/platform-base'
import {
    SALE_CENTER_PAGE,
    SALE_CENTER_PAGE_SHOP,
} from "../../constants/entryCodes";
import NewPromotionCard from "../NewCreatePromotions/NewPromotionCard";
import {BASIC_PROMOTION_CREATE} from "../../constants/authorityCodes";

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
    };
}
@connect(mapStateToProps, mapDispatchToProps)
class NewActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1Visible: false,
            index: 0,
            contentHeight: document.documentElement.clientHeight || document.body.clientHeight,
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
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !Immutable.is(Immutable.fromJS(this.state), Immutable.fromJS(nextState))
        // return true
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }
    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').getBoundingClientRect().height - 40;
        this.setState({ contentHeight });
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
        return (
            <Row className="layoutsContainer">
                <Col span={24} className="layoutsHeader">
                    <div className="layoutsTool">
                        <div className="layoutsToolLeft">
                            <h1>新建基础营销</h1>
                            <Button
                                type="ghost"
                                icon="rollback"
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '150px',
                                }}
                                onClick={
                                    () => {
                                        const menuID = this.props.user.menuList.find(tab => tab.entryCode === (this.props.user.shopID > 0 ? SALE_CENTER_PAGE_SHOP : SALE_CENTER_PAGE)).menuID;
                                        menuID && jumpPage({ menuID })
                                    }
                                }>返回列表</Button>
                        </div>
                    </div>
                </Col>
                <Col span={24} className="layoutsLineBlock"></Col>
                <Col span={24} className="layoutsContent" style={{ overflow: 'auto', height: this.state.contentHeight || 800 }}>

                    {this.renderActivityButtons()}

                    {this.renderModal()}
                </Col>
            </Row>

        );
    }


    _renderActivityButtons() {
        const activities = this.props.saleCenter.get('activityCategories').toJS();
        return (
            <div
                className={styles.scrollableMessageContainer}
                style={{
                    marginBottom: 20
                }}
            >
                {activities.map((activity, index) => {
                return (
                    <div
                        key={`NewActivity${index}`}
                        style={{
                            display: (this.props.user.shopID > 0 && activity.key === '5010') ?
                                'none' : 'block',
                        }}
                    >
                        <Authority rightCode={BASIC_PROMOTION_CREATE}>
                            <NewPromotionCard
                                key={activity.key}
                                promotionEntity={allBasicActivitiesMap[activity.key]}
                                onCardClick={() => {
                                    this.props.toggleIsUpdate(true);
                                    this.onButtonClicked(index, activity);
                                }}
                                index={index}
                            />
                            {/*<ActivityLogo index={index}　tags={activity.tags} titletext={activity.title} example={activity.example} spantext={activity.text} />*/}
                        </Authority>
                    </div>
                );
            })}
            </div>
        );
    }

    _renderModal() {
        const promotionType = this.props.saleCenter.get('activityCategories').toJS()[this.state.index].title;
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={(promotionType || '').endsWith('活动') ? `创建${promotionType}` : `创建${promotionType}活动`}
                maskClosable={false}
                footer={false}
                style={{
                    top: 20,
                }}
                width="924px"
                visible={this.state.modal1Visible}
                onOk={() => this.setModal1Visible(false)}
                onCancel={() => this.setModal1Visible(false)}
            >
                { this.state.modal1Visible && <ActivityMain
                    index={this.state.index}
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
            message.warn('您没有新建活动的权限，请联系管理员');
            return;
        }
        const opts = {
            _groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
        };
        this.props.fetchFoodCategoryInfo({ ...opts });
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
        });
    }
}


export default NewActivity;

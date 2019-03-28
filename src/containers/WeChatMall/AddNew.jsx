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
import registerPage from '../../index';
import styles from '../SaleCenterNEW/ActivityPage.less'
import { jumpPage } from '@hualala/platform-base'
import {
    Modal,
    Row,
    Col,
    message,
    Button,
} from 'antd';
import { checkPermission } from '../../helpers/util';
import { saleCenter_NEW as sale_saleCenter_NEW } from '../../redux/reducer/saleCenterNEW/saleCenter.reducer';

import { ActivityLogo } from '../SaleCenterNEW/ActivityLogo/ActivityLogo';
import ActivityMain from './WeChatMaLLActivityMain';
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
import {WECHAT_MALL_CREATE, WECHAT_MALL_LIST} from "../../constants/entryCodes";
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
@registerPage([WECHAT_MALL_CREATE], {
    // sale_promotionBasicInfo_NEW,
    // sale_promotionDetailInfo_NEW,
    // sale_promotionScopeInfo_NEW,
    // sale_fullCut_NEW,
    // sale_myActivities_NEW,
    sale_saleCenter_NEW,
})
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
    }

    clear() {
        this.setState({ modal1Visible : false });
    }

    render() {
        return (
            <Row className="layoutsContainer">
                <Col span={24} style={{padding: 0}} className="layoutsHeader">
                    <div style={{height: '79px', backgroundColor: '#F3F3F3'}}>
                        <div className={styles.headerWithBgColor}>
                            <span  className={styles.customHeader}>
                                新建商城活动&nbsp;&nbsp;
                                <Button
                                    type="ghost"
                                    icon="rollback"
                                    onClick={
                                        () => {
                                            const menuID = this.props.user.menuList.find(tab => tab.entryCode === WECHAT_MALL_LIST).menuID
                                            menuID && jumpPage({ menuID })
                                        }
                                    }>返回列表</Button>
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
                        padding: 30,
                    }}>
                    <ul>
                        {this.renderActivityButtons()}
                    </ul>
                    {this.state.modal1Visible ? this.renderModal() : null}
                </Col>
            </Row>

        );
    }


    _renderActivityButtons() {
        const saleCenter = this.props.saleCenter;
        return (
            saleCenter.get('weChatMallPromotions').map((activity, index) => {
                return (
                    <li
                        onClick={() => {
                            this.props.toggleIsUpdate(true);
                            this.onButtonClicked(index, activity);
                        }}
                        key={`NewActivity${index}`}
                        style={{
                            listStyle: 'none',
                        }}
                    >
                        <Authority rightCode={BASIC_PROMOTION_CREATE}>
                            <ActivityLogo index={index}　tags={activity.get('tags')} titletext={activity.get('title')} example={activity.get('example')} spantext={activity.get('text')} />
                        </Authority>
                    </li>
                );
            }).toJS()
        );
    }

    _renderModal() {
        const promotionType = this.props.saleCenter.get('weChatMallPromotions').toJS()[this.state.index].title;

        return (
            <Modal

                wrapClassName="progressBarModal"
                title={`创建${promotionType}活动`}
                maskClosable={false}
                footer={false}
                style={{
                    top: 20,
                }}
                width={1000}
                visible={this.state.modal1Visible}
                onOk={this.clear}
                onCancel={this.clear}
            >
                <ActivityMain
                    index={this.state.index}
                    steps={this.props.steps}
                    eventWay="7010" // 暂时写死 以后有新活动再改
                    isNew={true}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.setModal1Visible(false)
                        }
                    }}
                />
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
        /*this.props.setPromotionType({
            promotionType: activity.get('key'),
        });*/
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

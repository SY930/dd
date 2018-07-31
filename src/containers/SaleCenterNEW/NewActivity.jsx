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
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').offsetHeight - 40;
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
                    <ul>
                        {this.renderActivityButtons()}
                    </ul>
                    {this.renderModal()}
                </Col>
            </Row>

        );
    }


    _renderActivityButtons() {
        const saleCenter = this.props.saleCenter;
        return (


                    saleCenter.get('activityCategories').map((activity, index) => {
                        return (
                            <li
                                onClick={() => {
                                    this.props.toggleIsUpdate(true);
                                    this.onButtonClicked(index, activity);
                                }}
                                key={`NewActivity${index}`}
                                style={{
                                    listStyle: 'none',
                                    display: (this.props.user.shopID > 0 && activity.get('key') === 'RECOMMEND_FOOD') ?
                                        'none' : 'block',
                                }}
                            >
                                <Authority rightCode="marketing.jichuyingxiaoxin.create">
                                    <ActivityLogo index={index}　tags={activity.get('tags')} titletext={activity.get('title')} example={activity.get('example')} spantext={activity.get('text')} />
                                </Authority>
                            </li>
                        );
                    }).toJS()



        );
    }

    _renderModal() {
        const promotionType = this.props.saleCenter.get('activityCategories').toJS()[this.state.index].title;
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={`创建${promotionType}活动`}
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
            promotionType: activity.get('key'),
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

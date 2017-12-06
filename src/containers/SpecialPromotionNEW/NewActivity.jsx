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
import { Modal, Row, Col, message } from 'antd';

import { ActivityLogo } from '../SaleCenterNEW/ActivityLogo/ActivityLogo';
import ActivityMain from './activityMain';
import Authority from './../../components/common/Authority';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterCheckExist,
    saleCenterResetDetailInfoAC,
} from '../../redux/actions/saleCenterNEW/specialPromotion.action'

import {
    toggleIsUpdateAC,
} from '../../redux/actions/saleCenterNEW/myActivities.action';

if (process.env.__CLIENT__ === true) {
    // require('../../../client/components.less');
}


function mapStateToProps(state) {
    return {
        saleCenter: state.saleCenter_NEW,
        user: state.user.toJS(),
        specialPromotion: state.specialPromotion_NEW.toJS(),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionType: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        saleCenterResetDetailInfo: (opts) => {
            dispatch(saleCenterResetDetailInfoAC(opts));
        },
        saleCenterCheckExist: (opts) => {
            dispatch(saleCenterCheckExist(opts));
        },
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
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
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    setModal1Visible(modal1Visible) {
        this.setState({ modal1Visible });
        // TODO: uncomment the bottom
        if (!modal1Visible) {
            this.props.saleCenterResetDetailInfo();
        }
    }
    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }
    onWindowResize() {
        const contentHeight = document.documentElement.clientHeight || document.body.clientHeight;
        this.setState({ contentHeight })
    }
    componentWillReceiveProps(nextProps) {

    }

    render() {
        const contentHeight = this.state.contentHeight - 170;
        return (
            <Row className="layoutsContainer">
                <Col span={24} className="layoutsHeader">
                    <div className="layoutsTool">
                        <div className="layoutsToolLeft">
                            <h1>新建特色营销</h1>
                        </div>
                    </div>
                </Col>
                <Col span={24} className="layoutsLineBlock"></Col>
                <Col span={24} className="layoutsContent" style={{ overflowY: 'auto', height: contentHeight }}>
                    {this.renderActivityButtons()}
                    {this.renderModal()}
                </Col>
            </Row>

        );
    }


    _renderActivityButtons() {
        const saleCenter = this.props.saleCenter;
        const characteristicCategories = saleCenter.get('characteristicCategories');
        // TODO: only push 3 promotion to the release branch

        // characteristicCategories = characteristicCategories.slice(0, 3);

        const logos = characteristicCategories.map((activity, index) => {
            return (<li
                onClick={() => {
                    this.props.toggleIsUpdate(true)
                    this.onButtonClicked(index, activity)
                }}
                key={`NewActivity${index}`}
                style={{ listStyle: 'none' }}
            >
                <Authority rightCode="marketing.teseyingxiaoxin.create">
                    <ActivityLogo index={index} titletext={activity.get('title')} example={activity.get('example')} spantext={activity.get('text')} />
                </Authority>
            </li>)
        }).toJS();
        return (
            <div>
                {logos}
            </div>

        );
    }

    _renderModal() {
        const promotionType = this.props.saleCenter.get('characteristicCategories').toJS()[this.state.index].title;
        return (
            <Modal
                wrapClassName={'progressBarModal'}
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
                {this.state.modal1Visible ? (
                    <ActivityMain
                        index={this.state.index}
                        steps={this.props.steps}
                        isNew={true}
                        callbackthree={(arg) => {
                            if (arg == 3) {
                                this.setModal1Visible(false);
                            }
                        }}
                    />)
                    : null}
            </Modal>
        );
    }

    /**
     * [_onButtonClicked description] 点击创建活动事件按钮
     * @param  {int} index  对应活动的index
     * @param  {array} activity 所有活动的列表
     */
    _onButtonClicked(index, activity) {
        const { user } = this.props;
        this.setState({
            index,
        });
        this.props.setPromotionType({
            eventWay: activity.get('key'),
        });
        // 生日和开卡,完善资料送礼只能创建一次
        // if(activity.get('key') == '51' || activity.get('key')== '52' || activity.get('key')== '60'){
        // if(activity.get('key')== '52' || activity.get('key')== '60'){
        if (activity.get('key') === '60') {
            this.props.saleCenterCheckExist({
                eventWay: activity.get('key'),
                data: {
                    groupID: user.accountInfo.groupID,
                    eventWay: activity.get('key'),
                },
                success: (val) => {
                    if (activity.get('key') === '51' && val.serviceCode === 1) {
                        message.warning('您已创建过生日赠送,不能重复添加!');
                    } else if (activity.get('key') === '52' && val.serviceCode === 1) {
                        message.warning('您已创建过开卡赠送,不能重复添加!');
                    } else if (activity.get('key') === '60' && val.serviceCode === 1) {
                        message.warning('您已创建过完善资料送礼,不能重复添加!');
                    } else {
                        this.setModal1Visible(true);
                        this.props.setPromotionType({
                            // eventWay: activity.get('key'),
                            eventName: activity.get('title'),
                        });
                    }
                },
                fail: () => {
                    message.error('检查失败!');
                },
            })
        } else {
            this.setModal1Visible(true);
        }
    }
}

export default NewActivity;

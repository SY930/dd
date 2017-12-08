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
import {Modal, Row, Col} from 'antd';

if (process.env.__CLIENT__ === true) {
    require('../../components/common/components.less');
}

import {ActivityLogo} from "./ActivityLogo/ActivityLogo";
import ActivityMain from "./activityMain";
import {
    saleCenterResetBasicInfoAC,
    saleCenterSetBasicInfoAC
} from '../../redux/actions/saleCenter/promotionBasicInfo.action';
import {
    saleCenterResetScopeInfoAC
} from '../../redux/actions/saleCenter/promotionScopeInfo.action';
import {
    saleCenterResetDetailInfoAC
} from '../../redux/actions/saleCenter/promotionDetailInfo.action';

class NewActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1Visible: false,
            index: 0
        };

        this.renderActivityButtons = this._renderActivityButtons.bind(this);
        this.onButtonClicked = this._onButtonClicked.bind(this);
        this.renderModal = this._renderModal.bind(this);
    }

    setModal1Visible(modal1Visible) {
        this.setState({modal1Visible});
        // TODO: uncomment the bottom
        if(!modal1Visible) {
            this.props.saleCenterResetBasicInfo();
            this.props.saleCenterResetScopeInfo();
            this.props.saleCenterResetDetailInfo();
        }
    }

    render() {
        return (
            <Row className="layoutsContainer">
                <Col span={24} className="layoutsHeader">
                    <div className="layoutsTool">
                        <div className="layoutsToolLeft">
                            <h1>新建基础营销</h1>
                        </div>
                    </div>
                </Col>
                <Col span={24} className="layoutsLineBlock"></Col>
                <Col span={24} className="layoutsContent">
                    <div style={{height: '100%'}}>
                        {this.renderActivityButtons()}
                        {this.renderModal()}
                    </div>
                </Col>
            </Row>

        );
    }


    _renderActivityButtons(){
        let saleCenter = this.props.saleCenter;
        return (
            <div className="clearfix" style={{overflowY:'auto',height:'92%'}}>
                {
                    saleCenter.get("activityCategories").map((activity, index)=>{
                        return (
                            <li
                                onClick= {() => this.onButtonClicked(index, activity)}
                                key={`NewActivity${index}`}
                                style={{listStyle:'none'}}
                            >
                                <ActivityLogo index={index} titletext={activity.get("title")} example={activity.get("example")} spantext={activity.get("text")}/>
                            </li>
                        );
                    }).toJS()
                }
            </div>

        );
    }

    _renderModal(){
        let promotionType = this.props.saleCenter.get("activityCategories").toJS()[this.state.index].title;

        return (
            <Modal

                wrapClassName = 'progressBarModal'
                title={`创建${promotionType}活动`}
                maskClosable={false}
                footer={false}
                style={{
                  top: 20
                }}
                width="924px"
                visible={this.state.modal1Visible}
                onOk={() => this.setModal1Visible(false)}
                onCancel={() => this.setModal1Visible(false)}>
                {this.state.modal1Visible ? (
                    <ActivityMain
                        index={this.state.index}
                        steps={this.props.steps}
                        isNew={true}
                        callbackthree={(arg) => {
                            if(arg == 3){
                                this.setModal1Visible(false);
                            }
                        }}
                    />)
                    : null}
            </Modal>
        );
    }

    _onButtonClicked(index, activity){
        this.setModal1Visible(true);
        this.setState({
            index:index
        });
        // save the promotionType to redux
        this.props.setPromotionType({
            promotionType: activity.get('key')
        });
    }

}

function mapStateToProps(state) {
    return {
        saleCenter: state.sale_old_saleCenter
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionType: (opts)=>{
            dispatch(saleCenterSetBasicInfoAC(opts));
        },
        saleCenterResetBasicInfo: (opts)=>{
            dispatch(saleCenterResetBasicInfoAC(opts));
        },
        saleCenterResetScopeInfo: (opts)=>{
            dispatch(saleCenterResetScopeInfoAC(opts));
        },
        saleCenterResetDetailInfo: (opts)=>{
            dispatch(saleCenterResetDetailInfoAC(opts));
        },
    };
}

export default connect( mapStateToProps, mapDispatchToProps)(NewActivity);

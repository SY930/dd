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
import {Modal, Row, Col, message} from 'antd';

if (process.env.__CLIENT__ === true) {
    require('../../components/common/components.less');
}

import {ActivityLogo} from "../SaleCenter/ActivityLogo/ActivityLogo";
import ActivityMain from "./activityMain";
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterCheckExist,
    saleCenterResetDetailInfoAC
} from '../../redux/actions/saleCenter/specialPromotion.action'

class NewActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1Visible: false,
            index: 0,
        };

        this.renderActivityButtons = this._renderActivityButtons.bind(this);
        this.onButtonClicked = this._onButtonClicked.bind(this);
        this.renderModal = this._renderModal.bind(this);
    }

    setModal1Visible(modal1Visible) {
        this.setState({modal1Visible});
        // TODO: uncomment the bottom
        if(!modal1Visible) {
            this.props.saleCenterResetDetailInfo();
        }
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
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
                <Col span={24} className="layoutsContent" >
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
        let characteristicCategories = saleCenter.get("characteristicCategories");

        // TODO: only push 3 promotion to the release branch

        //characteristicCategories = characteristicCategories.slice(0, 3);

        let logos = characteristicCategories.map((activity, index)=>{
            return <li
                onClick= {() => this.onButtonClicked(index, activity)}
                key={`NewActivity${index}`}
                style={{listStyle:'none'}}
            >
                <ActivityLogo index={index} titletext={activity.get("title")} example={activity.get("example")} spantext={activity.get("text")}/>
            </li>
        }).toJS();
        return (
            <div className="clearfix" style={{overflowY:'auto',height:'92%'}}>
                { logos }
            </div>

        );
    }

    _renderModal(){
        let promotionType = this.props.saleCenter.get("characteristicCategories").toJS()[this.state.index].title;

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

    /**
     * [_onButtonClicked description] 点击创建活动事件按钮
     * @param  {int} index  对应活动的index
     * @param  {array} activity 所有活动的列表
     */
    _onButtonClicked(index, activity){
        let {user } = this.props;
        this.setState({
            index:index
        });
        this.props.setPromotionType({
            eventWay: activity.get('key'),
        });
        //生日和开卡只能创建一次
        if(activity.get('key') == '51' || activity.get('key')== '52'){
            this.props.saleCenterCheckExist({
                eventWay: activity.get('key'),
                data:{
                    groupID:user.accountInfo.groupID
                },
                success:(val)=>{
                    if(activity.get('key') == '51' && val.serviceCode =='1'){
                        message.warning('您已创建过生日赠送,不能重复添加!');
                    }else if( activity.get('key') == '52' && val.serviceCode =='1'){
                        message.warning('您已创建过开卡赠送,不能重复添加!');
                    }else{
                        this.setModal1Visible(true);
                        this.props.setPromotionType({
                            // eventWay: activity.get('key'),
                            eventName : activity.get('title')
                        });
                    }
                },
                fail:()=>{
                    message.error('检查失败!');
                }
            })
        }else{
            this.setModal1Visible(true);
        }


    }

}

function mapStateToProps(state) {
    return {
        saleCenter: state.saleCenter,
        user: state.user.toJS(),
        specialPromotion :state.specialPromotion.toJS()
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionType: (opts)=>{
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        saleCenterResetDetailInfo: (opts)=>{
            dispatch(saleCenterResetDetailInfoAC(opts));
        },
        saleCenterCheckExist: (opts)=>{
            dispatch(saleCenterCheckExist(opts));
        },
    };
}

export default connect( mapStateToProps, mapDispatchToProps)(NewActivity);

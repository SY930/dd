import React, { Component } from 'react';
import { render } from 'react-dom';
import { Row, Col, Switch, Modal, Form, Input, Button } from 'antd';
import BaseForm from '../../../components/common/BaseForm';
import Authority from '../../../components/common/Authority';
import BaseInfo from './BaseInfo';
import { ProfileSetting } from './ProfileSetting';
import CrmBatchRecharge from './CrmBatchRecharge';
import * as utils from '../../../helpers/util';
import Cfg from '../../../constants/CrmOperationCfg';
// import { baseInfoData } from './Data';
import _ from 'lodash';
import { fetchData } from '../../../helpers/util';

const FormItem = Form.Item;
export default class CrmOperationDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.basicForm = null;
        this.handleSubmitFn = null;
        this.data = {};
        this.state = {
            visible:this.props.visible,
            transWay: 'false',
            invoiceFlag: 'false',
            useVisible: false,
            deferTypeFlag: '1',
            loading: false,
            adjustmentType: '40',
            // rechargeType: 'false',
        }
    }

    componentDidMount() {
      // this.loadRecords();
    }
    componentWillReceiveProps(nextProps) {
        [this.basicForm].forEach(form => {
            form && form.resetFields();
        });
        const { visible = false } = nextProps;
        this.setState({
            visible,
            transWay: 'false',
        });
    }
    setVisible = () => {
        this.setState({
            visible:false,
            loading: false,
        },() => {
            this.props.callbackVisible(false);
        });
    }
    setConfirmLoadingTrue = () => {
        this.setState({
            loading: true,
        })
    }
    setConfirmLoadingFalse = () => {
        this.setState({
            loading: false,
        })
    }
    componentWillUnmount() {
    // this.props.callback && this.props.callback(this.data);
    // this.props.data = [];
    }

    handleOk = _.throttle(() => {
        const { baseInfoData, type } = this.props;
        type == 'resetPassword'?
        fetchData('crmOperationResetCardPWD', {cardTypeID: baseInfoData.cardTypeID, cardID: baseInfoData.cardID},
        null, {path:'data'}).then(data => {
            this.setVisible();
        }):
        this.handleSubmitFn(this.setConfirmLoadingTrue, this.setVisible, this.setConfirmLoadingFalse);
    }, 3000, { trailing: false });

    getRightCodeByType = () => {
        const { type } = this.props;
        switch(type){
            case 'resetPassword':
                return 'crm.huiyuankachongzhi.mima';
            case 'modifyPassWord':
                return 'crm.huiyuankagaimima.mima';
            case 'adjustQuota':
                return 'crm.huiyuankaguazhangedu.tiaozhang';
            case 'batchPostpone':
                return 'crm.huiyuankapiliangyanqi.yanqi';
            case 'postpone':
                return 'crm.huiyuankayanqi.yanqi';
            case 'adjustment':
                // const { adjustmentType } = this.state;
                // return adjustmentType;
                const { adjustmentType } = this.state;
                if(adjustmentType == '40'){
                    return 'crm.huiyuankachuzhitiaozhang.tiaozhang';
                } else {
                    return 'crm.huiyuankaxiaofeitiaozhang.tiaozhang';
                }
            case 'consumption':
                return 'crm.huiyuankaxiaofei.xiaofei';
            case 'change':
                return 'crm.huiyuankahuanka.huanka';
            case 'cancelled':
                return 'crm.huiyuankazhuxiao.zhuxiao';
            case 'freeze':
                return 'crm.huiyuankadongjie.dongjie';
            case 'lose':
                return 'crm.huiyuankaguashi.guashi';
            case 'active':
                return 'crm.huiyuankajihuo.jihuo';
            case 'recede':
                return 'crm.huiyuankatuikuan.tuikuan';
            case 'recharge':
                const { transWay } = this.state;
                if(transWay == 'true') {
                    return 'crm.huiyuantaocanchongzhi.chongzhi'
                } else {
                    return 'crm.huiyuanrenyichongzhi.chongzhi';
                }
            case 'batchRecharge':
                return 'crm.huiyuankapiliangchongzhi.chongzhi';
            case 'batchMake':
                return 'crm.huiyuankapiliangzhika.zhika';
        }
    }
    displayContent = type => {
        switch(type) {
            case 'batchRecharge':
                return <Row>
                    <Col span={24} >
                        <CrmBatchRecharge
                            type={this.props.type}
                            getSubmitFn={fn => this.handleSubmitFn = fn}
                        />
                    </Col>
                    </Row>
        case 'batchMake':
            return <Row>
                <Col span={24} >
                    <CrmBatchRecharge
                        type={this.props.type}
                        getSubmitFn={fn => this.handleSubmitFn = fn}
                    />
                </Col>
            </Row>
        // 退款
        case 'recharge':
        case 'recede':
        case 'active':
        case 'freeze':
        case 'lose':
        case 'cancelled':
        case 'change':
        case 'consumption':
        case 'postpone':
        case 'adjustment':
        case 'adjustQuota':
        case 'modifyPassWord':
        case 'invoice':
            return <Row>
                <Col span={24} >
                    <BaseInfo data={this.props.baseInfoData}/>
                </Col>
                <Col span={24} >
                    <ProfileSetting
                        type={this.props.type}
                        getSubmitFn={fn => this.handleSubmitFn = fn}
                        shopsData={this.props.shopsData}
                        baseInfoData={this.props.baseInfoData}
                        transWay={this.state.transWay}
                        invoiceFlag={this.state.invoiceFlag}
                        useVisible={this.state.useVisible}
                        deferTypeFlag={this.state.deferTypeFlag}
                        uuid={this.props.uuid}
                        callbackTransType={value => {
                            this.setState({ adjustmentType: value });
                        }}
                        transTypeParent={this.state.adjustmentType}
                        // rechargeParent={this.state.transWay}
                        // callbackRechargeType={value => {
                        //     this.setState({ transWay: value });
                        // }}
                    />
                </Col>
            </Row>
        case 'batchPostpone':
          return <Row>
           <Col span={24} >
                <ProfileSetting
                    type={this.props.type}
                    getSubmitFn={fn => this.handleSubmitFn = fn}
                    shopsData={this.props.shopsData}
                    baseInfoData={this.props.baseInfoData}
                    deferTypeFlag={this.state.deferTypeFlag}
                />
              </Col>
          </Row>
        case 'resetPassword':
          return <Row>
             <Col span={24} >
                <BaseInfo data={this.props.baseInfoData}/>
              </Col>
          </Row>
      }
    }
    render() {
        const { type='recharge' } = this.props;
        const title = Cfg.operationTypeCfg.filter(item => {
            if(item.type == type) return item.describe;
        });
        return (
            <div>
              <Modal
                    style={{top:30}}
                    title = {`${title.length > 0 ? title[0].name : ''}`}
                    maskClosable={false}
                    width={'500px'}
                    visible={this.state.visible}
                    onCancel={() => this.setState({visible:false,},()=>{
                        this.props.callbackVisible(false);
                    })}
                    key={type}
                    footer={[
                        <Button key="crmOperationCancel" onClick={() => this.setState({visible:false},()=>{this.props.callbackVisible(false);})} type="ghost">取消</Button>,
                        <Authority key="crmOperationSave" rightCode={`${this.getRightCodeByType()}`}>
                            <Button   onClick={() => this.handleOk()} type="primary" loading={this.state.loading}>{`${this.props.type == 'resetPassword' ? '重置' : '完成'}`}</Button>
                        </Authority>,
                        // <Button onClick={() => this.handleOk()} type="primary" loading={this.state.loading}>{`${this.props.type == 'resetPassword' ? '重置' : '完成'}`}</Button>
                    ]}
                >
                {this.displayContent(type)}
              </Modal>
            </div>
        );
    }
}

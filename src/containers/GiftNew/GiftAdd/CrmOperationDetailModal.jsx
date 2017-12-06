import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {Row, Col, Modal, Button} from 'antd';
import Authority from '../../../components/common/Authority';
import BaseInfo from './BaseInfo';
import ProfileSetting from './ProfileSetting';
import CrmBatchRecharge from './CrmBatchRecharge';
import Cfg from '../../../constants/CrmOperationCfg_dkl';
import _ from 'lodash';
import {fetchData} from '../../../helpers/util';
import {
    FetchCrmOperationCardInfo,
    FetchCrmOperationUuid,
    UpdateDetailModalVisible,
    UpdateDetailModalLoading,
} from '../../../redux/actions/crmNew/crmOperation.action';

class CrmOperationDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.basicForm = null;
        this.handleSubmitFn = null;
        this.data = {};
        this.state = {
            visible: false,
            transWay: 'false',
            invoiceFlag: 'false',
            useVisible: false,
            deferTypeFlag: '1',
            loading: false,
            adjustmentType: '40',
            baseInfoData: {},
            // rechargeType: 'false',
        }
    }

    componentDidMount() {
        // this.loadRecords();
        const {detailVisible, detailLoading} = this.props;
        this.setState({
            visible: detailVisible,
            loading: detailLoading,
        });
    }

    componentWillReceiveProps(nextProps) {
        [this.basicForm].forEach(form => {
            form && form.resetFields();
        });
        const {detailVisible, cardInfo, shopStores, detailLoading} = nextProps;
        const _cardInfo = cardInfo.toJS();
        const _shopStores = shopStores.toJS();
        this.setState({
            visible: detailVisible,
            loading: detailLoading,
            transWay: 'false',
            baseInfoData: _cardInfo,
        });
    }

    // setVisible = () => {
    //     this.setState({
    //         visible: false,
    //         loading: false,
    //     }, () => {
    //         // this.props.callbackVisible(false);
    //     });
    // }
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
        const {type} = this.props;
        type === 'resetPassword' ?
            this.proResetPassword() :
            this.handleSubmitFn();
    }, 3000, {trailing: false});

    proResetPassword = () => {
        const {baseInfoData} = this.state;
        const {UpdateDetailModalLoading, UpdateDetailModalVisible} = this.props;
        UpdateDetailModalLoading({loading: true});
        fetchData('crmOperationResetCardPWD_dkl', {cardTypeID: baseInfoData.cardTypeID, cardID: baseInfoData.cardID},
            null, {path: 'data'}).then(data => {
            UpdateDetailModalVisible({visible: false});
            UpdateDetailModalLoading({loading: false});
        }).catch(error => {
            UpdateDetailModalVisible({visible: true});
            UpdateDetailModalLoading({visible: false});
        })
    }
    getRightCodeByType = () => {
        const {type} = this.props;
        switch (type) {
            case 'resetPassword':
                return 'crm.huiyuankachongzhixin.mima';
            case 'modifyPassWord':
                return 'crm.huiyuankagaimimaxin.mima';
            case 'adjustQuota':
                return 'crm.huiyuankaguazhangeduxin.tiaozhang';
            case 'batchPostpone':
                return 'crm.huiyuankapiliangyanqixin.yanqi';
            case 'postpone':
                return 'crm.huiyuankayanqixin.yanqi';
            case 'adjustment': {
                const {adjustmentType} = this.state;
                if (adjustmentType == '40') {
                    return 'crm.huiyuankachuzhitiaozhangxin.tiaozhang';
                } else {
                    return 'crm.huiyuankaxiaofeitiaozhangxin.tiaozhang';
                }
            }
            case 'consumption':
                return 'crm.huiyuankaxiaofeixin.xiaofei';
            case 'change':
                return 'crm.huiyuankahuankaxin.huanka';
            case 'cancelled':
                return 'crm.huiyuankazhuxiaoxin.zhuxiao';
            case 'freeze':
                return 'crm.huiyuankadongjiexin.dongjie';
            case 'lose':
                return 'crm.huiyuankaguashixin.guashi';
            case 'active':
                return 'crm.huiyuankajihuoxin.jihuo';
            case 'recede':
                return 'crm.huiyuankatuikuanxin.tuikuan';
            case 'recharge':
                const {transWay} = this.state;
                if (transWay == 'true') {
                    return 'crm.huiyuantaocanchongzhixin.chongzhi'
                } else {
                    return 'crm.huiyuanrenyichongzhixin.chongzhi';
                }
            case 'batchRecharge':
                return 'crm.huiyuankapiliangchongzhixin.chongzhi';
            case 'batchMake':
                return 'crm.huiyuankapiliangzhikaxin.zhika';
            default:
                return 'crm.huiyuankakaifapiaoxin.fapiao';
        }
    }
    displayContent = type => {
        switch (type) {
            case 'batchRecharge':
                return <Row>
                    <Col span={24}>
                        <CrmBatchRecharge
                            type={this.props.type}
                            getSubmitFn={fn => this.handleSubmitFn = fn}
                        />
                    </Col>
                </Row>
            case 'batchMake':
                return <Row>
                    <Col span={24}>
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
                    <Col span={24}>
                        <BaseInfo data={this.state.baseInfoData} type={this.props.type}/>
                    </Col>
                    <Col span={24}>
                        <ProfileSetting
                            type={this.props.type}
                            getSubmitFn={fn => this.handleSubmitFn = fn}
                            transWay={this.state.transWay}
                            invoiceFlag={this.state.invoiceFlag}
                            useVisible={this.state.useVisible}
                            deferTypeFlag={this.state.deferTypeFlag}
                            uuid={this.props.uuid}
                            callbackTransType={value => {
                                this.setState({adjustmentType: value});
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
                    <Col span={24}>
                        <ProfileSetting
                            type={this.props.type}
                            getSubmitFn={fn => this.handleSubmitFn = fn}
                            deferTypeFlag={this.state.deferTypeFlag}
                        />
                    </Col>
                </Row>
            case 'resetPassword':
                return <Row>
                    <Col span={24}>
                        <BaseInfo data={this.state.baseInfoData}/>
                    </Col>
                </Row>
            default:
                return null;
        }
    }
    handleCancel = () => {
        const {UpdateDetailModalVisible} = this.props;
        UpdateDetailModalVisible({visible: false});
    }

    render() {
        const {type = 'recharge'} = this.props;
        const title = Cfg.operationTypeCfg.filter(item => {
            if (item.type == type) return item.describe;
        });
        return (
            <div>
                <Modal
                    style={{top: 30}}
                    title={`${title.length > 0 ? title[0].name : ''}`}
                    maskClosable={false}
                    width={'500px'}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    key={type}
                    footer={[
                        <Button key="crmOperationCancel" onClick={this.handleCancel} type="ghost">取消</Button>,
                        <Authority key="crmOperationSave" rightCode={`${this.getRightCodeByType()}`}>
                            <Button onClick={() => this.handleOk()} type="primary"
                                    loading={this.state.loading}>{`${this.props.type == 'resetPassword' ? '重置' : '完成'}`}</Button>
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

function mapStateToProps(state) {
    return {
        cardInfo: state.crmOperation_dkl.get('cardInfo'),
        detailVisible: state.crmOperation_dkl.get('detailVisible'),
        shopStores: state.crmOperation_dkl.get('shopStores'),
        detailLoading: state.crmOperation_dkl.get('detailLoading'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateDetailModalVisible: (opts) => dispatch(UpdateDetailModalVisible(opts)),
        FetchCrmOperationCardInfo: (opts) => dispatch(FetchCrmOperationCardInfo(opts)),
        FetchCrmOperationUuid: (opts) => dispatch(FetchCrmOperationUuid(opts)),
        UpdateDetailModalLoading: (opts) => dispatch(UpdateDetailModalLoading(opts)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CrmOperationDetailModal);

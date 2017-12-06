import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {Row, Col, Modal, Button} from 'antd';
import Authority from '../../../components/common/Authority';
import BaseForm from '../../../components/common/BaseForm';
import styles from './SearchModal.less';
import Cfg from '../../../constants/CrmOperationCfg_dkl';
import _ from 'lodash';
import {
    FetchCrmOperationCardInfo,
    FetchCrmOperationUuid,
    UpdateSearchModalVisible,
    UpdateDetailModalVisible,
    FetchCrmOperationShop,
} from '../../../redux/actions/saleCenterNEW/crmOperation.action';

class SearchModal extends React.Component {
    constructor(props) {
        super(props);
        this.basicForm = null;
        this.data = {};
        this.state = {
            loading: false,
            visible: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.basicForm && this.basicForm.resetFields();
        const {searchVisible} = nextProps;
        if (this.state.visible !== searchVisible) {
            this.setState({
                visible: searchVisible,
            });
        }
    }

    handleSubmit = _.throttle(() => {
        this.basicForm.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) return;
            this.setState({loading: true});
            const {FetchCrmOperationCardInfo, FetchCrmOperationUuid, UpdateDetailModalVisible, UpdateSearchModalVisible} = this.props;
            FetchCrmOperationCardInfo({
                ...basicValues,
                sourceWay: 0,
                sourceType: 60,
            }).then(data => {
                UpdateSearchModalVisible({visible: false});
                UpdateDetailModalVisible({visible: true});
                const { FetchCrmOperationShop } = this.props;
                FetchCrmOperationShop({
                    cardTypeID: data.cardTypeID,
                    cardID: data.cardID
                });
                if(this.props.type === 'recharge'){
                    FetchCrmOperationUuid({});
                }
                this.setState({loading: false});
            }).catch(err => {
                this.setState({loading: false});
            });
        });
    }, 3000, {trailing: false});

    handleCancel = () => {
        const {UpdateSearchModalVisible} = this.props;
        UpdateSearchModalVisible({visible: false});
    }

    onKeyDown = (e) => {
        const keyCode = e.keyCode;
        switch (keyCode) {
            case 13 :
                this.handleSubmit();
                break;
            default:
                break;
        }
    }

    render() {
        const basicFormKeys = [{
            col: {span: 22},
            keys: ['cardNO']
        }];
        const data = {};
        const title = Cfg.operationTypeCfg.filter(item => {
            if (item.type == this.props.type) return item.describe;
        });
        const formItems = {
            cardNO: {
                type: 'text',
                label: '会员检索',
                labelCol: {span: 8},
                wrapperCol: {span: 13},
                placeholder: '请输入会员卡号',
                rules: [{
                    required: true, message: '请输入会员卡号'
                }],
                props: {
                    onKeyDown: e => this.onKeyDown(e),
                },
            },
        };
        return (
            <div className={styles.modalWrap}>
                <Modal

                    title={`${title.length > 0 ? title[0].name : ''}`}
                    maskClosable={false}
                    width={'500px'}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    wrapClassName={styles.searchModalWrap}
                    footer={[
                        <Button key="crmOperationCancel" onClick={this.handleCancel}
                                type="ghost">取消</Button>,
                        <Authority key="crmOperationSerach" rightCode="crm.kehuziliaoxin.query">
                            <Button onClick={this.handleSubmit} type="primary" loading={this.state.loading}>检索</Button>
                        </Authority>
                    ]}
                >
                    <Row>
                        <Col span={24}>
                            <BaseForm
                                getForm={form => this.basicForm = form}
                                formItems={formItems}
                                formData={data}
                                formKeys={basicFormKeys}
                                onChange={this.handleFormChange}
                                // disabledKeys={disabledArray}
                            />
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        searchVisible: state.crmOperation_dkl.get('searchVisible'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        FetchCrmOperationCardInfo: (opts) => dispatch(FetchCrmOperationCardInfo(opts)),
        FetchCrmOperationUuid: (opts) => dispatch(FetchCrmOperationUuid(opts)),
        UpdateSearchModalVisible: (opts) => dispatch(UpdateSearchModalVisible(opts)),
        UpdateDetailModalVisible: (opts) => dispatch(UpdateDetailModalVisible(opts)),
        FetchCrmOperationShop: (opts) => dispatch(FetchCrmOperationShop(opts)),
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchModal);

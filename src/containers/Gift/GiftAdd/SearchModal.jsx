import React, { Component } from 'react'
import { render } from 'react-dom'
import { Row, Col, Switch, Modal, Form, Input, Button } from 'antd';
import Authority from '../../../components/common/Authority';
import BaseForm from '../../../components/common/BaseForm';
import styles from './styles/SearchModal.less';
import { fetchData } from '../../../helpers/util';
import Cfg from '../../../constants/CrmOperationCfg';
import _ from 'lodash';

const FormItem = Form.Item;
export default class SearchModal extends React.Component {
    constructor(props) {
        super(props);
        this.basicForm = null;
        this.data = {};
        this.state = {
            loading: false,
        };
    }
    componentWillReceiveProps(nextProps) {
        this.basicForm && this.basicForm.resetFields();
        const { visible = false } = nextProps;
        if(this.state.visible !== visible) {
            this.setState({
                visible
            });
        }
    }
    handleSubmit = _.throttle(() => {
        this.basicForm.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) return;
            this.setState({ loading: true });
            this.props.callbackVisible(true, false);
            if(this.props.type == 'recharge'){
                fetchData('getCardInfo', { ...basicValues }, null, {path:'data'}).then(data => {
                    this.props.callbackBaseInfo(data);
                    return fetchData('getCrmOperationShops', { cardTypeID: data.cardTypeID, cardID: data.cardID }, null, {path:'data.cardUseShops'});
                }).then(data => {
                    const cardUseShops = data || [];
                    this.props.callbackShopData(cardUseShops);
                    return fetchData('crmOperationUUID', {}, null, {path: 'data'});
                }).then(data => {
                    this.props.callbackUUID(data);
                    this.setState({ loading: false });
                }).catch(err => {
                    this.setState({ loading: false });
                });
            } else {
                fetchData('getCardInfo', { ...basicValues }, null, {path:'data'}).then(data => {
                    this.props.callbackBaseInfo(data);
                    return fetchData('getCrmOperationShops', { cardTypeID: data.cardTypeID, cardID: data.cardID }, null, {path:'data.cardUseShops'});
                }).then(data => {
                    const cardUseShops = data || [];
                    this.props.callbackShopData(cardUseShops);
                    this.setState({ loading: false });
                }).catch(err => {
                    this.setState({ loading: false });
                });
            }
        });
    }, 3000, { trailing: false });
    render() {
        const basicFormKeys = [{
            col: { span: 22 },
            keys: ['cardNO']
        }];
        const data = {};
        const title = Cfg.operationTypeCfg.filter(item => {
            if(item.type == this.props.type) return item.describe;
        });
        //console.log('title', title);
        const formItems = {
          cardNO: {
            type: 'text',
            label: '会员检索',
            labelCol:  { span: 8 },
            wrapperCol:  { span: 13 },
            placeholder:'请输入会员卡号',
            rules: [{
                required: true, message: '请输入会员卡号'
            }]
          }
        };
        return (
            <div className={styles.modalWrap}>
                <Modal
                    key={Math.random()}
                    title = {`${title.length > 0 ? title[0].name : ''}`}
                    maskClosable={false}
                    width={'500px'}
                    visible={this.props.visible}
                    onCancel={() => this.props.callbackVisible(false, false)}
                    wrapClassName={styles.searchModalWrap}
                    footer={[
                        <Button key="crmOperationCancel" onClick={() => this.props.callbackVisible(false, false)} type="ghost">取消</Button>,
                        <Authority key="crmOperationSerach" rightCode="crm.kehuziliao.query">
                            <Button  onClick={this.handleSubmit} type="primary" loading={this.state.loading}>检索</Button>
                        </Authority>
                    ]}
                >
                <Row>
                    <Col span={24}>
                        <BaseForm getForm={form => this.basicForm = form}
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

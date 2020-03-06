import React, { PureComponent as Component } from 'react';
import BaseForm from 'components/common/BaseForm';
import { Button, message } from 'antd';
import { pFormKeys, pFormItems, formItemLayout, pFormKeys2 } from '../Common';
import styles from './index.less';
import { getPhoneValid, putSendTicket } from '../AxiosFactory';
import AccountNoSelector from "containers/SpecialPromotionNEW/common/AccountNoSelector";
import MsgSelector from "containers/SpecialPromotionNEW/common/MsgSelector";

export default class PresentForm extends Component {
    state = {
        customerID: '',
        accountNo: '',
        smsTemplate: '',
        accountNo: '',
        formKeys: pFormKeys,
    };
    /* 点击查询把参数传给父组件 */
    onSend = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { customerID } = this.state;
                const { ids } = this.props;
                const { } = v;
                const obj = { sourceWay: !1, sourceType: '10' };
                const params = {...ids, customerID, ...v, ...obj };
                putSendTicket(params).then((flag) => {
                    flag && message.success('发送成功');
                });
            }
        });
    }
    /** form */
    onChange = (key, value) => {
        const { setFieldsValue } = this.form;
        if (key==='cellNo'){
            if(value[10]) {
                const { ids } = this.props;
                const params = { ...ids, customerMobile: value };
                getPhoneValid(params).then(x => {
                    x && this.setState({ customerID: x });
                });
            }
        }
        if(key==='smsGate'){
            let formKeys = pFormKeys;
            if(['1', '3', '4'].includes(value)) {
                formKeys = pFormKeys2;
            }
            this.setState({ formKeys });
        }
        if(key==='accountNo'){
            this.setState({
                accountNo: value.accountNo,
                availableSmsCount: value.smsCount,
            }, () => {
                setFieldsValue({ 'accountNo': value.accountNo });
            });
        }
        if(key==='smsTemplate'){
            let msg = value || '';
            if (/(\[会员姓名])|(\[先生\/女士])/g.test(msg)) {
                message.warning('请选择不含 [会员姓名] [先生/女士] 的模板');
                msg = '';
            }
            this.setState({ smsTemplate: msg }, () => {
                setFieldsValue({ 'smsTemplate': msg });
            });
        }
    }
    /* 获取form对象 */
    onGetForm = (form) => {
        this.form = form;
    }
    /* 整理formItems对象 */
    resetFormItems = () => {
        const { smsTemplate: msg, accountNo: acc } = this.state;
        console.log('accountNo', acc);
        const btnProp = { type: 'primary', onClick: this.onSend };
        const { q, accountNo, smsTemplate, ...other } = pFormItems;
        const render = () => (<div className={styles.sendBtn}><Button {...btnProp}>发送</Button></div>);
        const render1 = d => d()(<AccountNoSelector autoFetch={!0} />);
        const render2 = d => d()(<MsgSelector selectedMessage={msg} />);
        return {
            ...other,
            accountNo: {...accountNo, render: render1 },
            smsTemplate: {...smsTemplate, render: render2, onChange: this.onMessageChange},
            q: { ...q, render },
        };
    }
    render() {
        const { formKeys } = this.state;
        const formItems = this.resetFormItems();
        return (
            <div className={styles.presentForm}>
                <BaseForm
                    getForm={this.onGetForm}
                    formItems={formItems}
                    formKeys={formKeys}
                    onChange={this.onChange}
                    formItemLayout={formItemLayout}
                />
            </div>
        );
    }
}

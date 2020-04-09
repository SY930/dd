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
                const obj = { sourceWay: false, sourceType: '10' };
                const params = {...ids, customerID, ...v, ...obj };
                putSendTicket(params).then((flag) => {
                    if(flag) {
                        message.success('发送成功');
                        this.form.setFieldsValue({ cellNo: '' });
                    }
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
        const { num = 0 } = this.props;
        const noLimit = num < 0 ? '不限制' : num;
        const btnProp = { type: 'primary', onClick: this.onSend };
        const { q, c, sendCount, accountNo, smsTemplate, ...other } = pFormItems;
        const render = () => (<div className={styles.sendBtn}><Button {...btnProp}>发送</Button></div>);
        const render1 = d => d()(<AccountNoSelector autoFetch={true} />);
        const render2 = d => d()(<MsgSelector selectedMessage={msg} />);
        const render3 = () => (<p>{noLimit}</p>);
        const rules = [{
            required: true,
            validator: (rule, value, callback) => {
                if(!(/^\d+$/.test(value))){
                    return callback('请输入数字');
                }
                if (+value < 1) {
                    return callback('最小1，最大不能超过剩余库存');
                }
                if(+num > 0 && +value > +num){
                    return callback('最小1，最大不能超过剩余库存');
                }
                if(+value > 50){
                    return callback('最大不能超过50');
                }
                return callback();
            },
        }];
        return {
            ...other,
            accountNo: { ...accountNo, render: render1 },
            smsTemplate: { ...smsTemplate, render: render2, onChange: this.onMessageChange},
            sendCount: { ...sendCount, rules },
            q: { ...q, render },
            c: { ...c, render: render3 },
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

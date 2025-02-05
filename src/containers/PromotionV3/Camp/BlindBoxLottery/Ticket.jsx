import React, { PureComponent as Component } from 'react';
import { Checkbox, Radio } from 'antd'
import BaseForm from 'components/common/BaseForm';
import TicketBag from '../TicketBag';
import MutliGift from './MutliGift';
import css from './style.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const typeOpts= [
    { label: '独立优惠券', value: '1' },
    { label: '券包', value: '2' },
];
const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 22 },
};
const formKeys = ['isTicket', 'type', 'gift', 'bag'];
const formItems = {
    isTicket: {
        type: 'checkbox',
        label: '',
        options: [{ label:'赠送优惠券', value: 1 }],
        defaultValue: [1],
    },
    type: {
        type: 'radioButton',
        label: '',
        options: typeOpts,
        defaultValue: '1',
    },
    gift: {
        type: 'custom',
        label: '',
        render: () => (<p/>),
        defaultValue: [],
    },
    bag: {
        type: 'custom',
        label: '',
        render: () => (<p/>),
        defaultValue: [],
    },
};
class Ticket extends Component {

    state = {
        newFormKeys: formKeys,
    }

    /** 表单内容变化时的监听 */
    onFormChange = (key, val) => {
        let newFormKeys = ['isTicket'];
        const { value, onChange } = this.props;
        if(key==='isTicket') {
            if(val[0]){
                newFormKeys = ['isTicket', 'type', 'gift'];
                if(this.form) {
                    this.form.setFieldsValue({type: '1'});
                }
            }
            this.setState({ newFormKeys });
        }
        if(key==='type') {
            newFormKeys = ['isTicket', 'type', 'gift'];
            if(val === '2'){
                newFormKeys = ['isTicket', 'type', 'bag'];
            }
            this.setState({ newFormKeys });
        }
        onChange({ [key]: val });
    }
    /** 得到form */
    getForm = (form) => {
        this.form = form;
    }
    resetFormItems() {
        const { gift, bag, ...others } = formItems;
        const render = d => d()(<MutliGift />);
        const render2 = d => d()(<TicketBag />);
        return {
            ...others,
            gift: { ...gift, render },
            bag: { ...bag, render: render2 },
        }
    }
    render() {
        const { newFormKeys } = this.state;
        const { formData } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div className={css.ticketBox}>
                <BaseForm
                    getForm={this.getForm}
                    formItems={newFormItems}
                    formKeys={newFormKeys}
                    onChange={this.onFormChange}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}

export default Ticket

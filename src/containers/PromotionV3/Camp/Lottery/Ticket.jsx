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
    },
    bag: {
        type: 'custom',
        label: '',
        render: () => (<p/>),
    },
};
class Ticket extends Component {

    state = {
        newFormKeys: formKeys,
    }

    // componentDidMount() {
    // }
    // onChange = ({ target }) => {
    //     const { checked } = target;
    // }
    // onRadioChange = ({ target }) => {
    //     const { value } = target;
    // }
    /** 表单内容变化时的监听 */
    onFormChange = (key, value) => {
        console.log(key, value);
        let newFormKeys = ['isTicket'];
        if(key==='isTicket') {
            if(value[0]){
                newFormKeys = ['isTicket', 'type', 'gift'];
                if(this.form) {
                    this.form.setFieldsValue({type: '1'});
                }
            }
            this.setState({ newFormKeys });
        }
        if(key==='type') {
            newFormKeys = ['isTicket', 'type', 'gift'];
            if(value === '2'){
                newFormKeys = ['isTicket', 'type', 'bag'];
            }
            this.setState({ newFormKeys });
        }
        this.props.onChange({ [key]: value });
    }
    /** 得到form */
    getForm = (form) => {
        this.form = form;
    }
    resetFormItems() {
        const { options } = this.state;
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
                {/* <Checkbox onChange={this.onChange}>赠送优惠券</Checkbox>
                <p>
                    <RadioGroup defaultValue={1} onChange={this.onRadioChange}>
                        <RadioButton value={1}>独立优惠券</RadioButton>
                        <RadioButton value={2}>券包</RadioButton>
                    </RadioGroup>
                </p>
                {

                } */}
                {/* <TicketBag />
                <MutliGift /> */}
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

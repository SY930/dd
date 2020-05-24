import React, { PureComponent as Component } from 'react';
import BaseForm from 'components/common/BaseForm';
import css from './style.less';

const formKeys = ['isPoint', 'presentValue', 'cardTypeID'];
const formItems = {
    isPoint: {
        type: 'checkbox',
        label: '',
        options: [{ label:'赠送积分', value: 1 }],
        defaultValue: [],
    },
    presentValue: {
        type: 'text',
        label: '',
        surfix: '积分',
        rules: [{
            pattern: /^(([1-9]\d{0,5})|0)(\.\d{0,2})?$/,
            message: '请输入0~100000数字，支持两位小数',
        }],
    },
    cardTypeID: {
        type: 'combo',
        label: '充值到会员卡',
        options: [],
    },
};

class Point extends Component {
    state = {
        newFormKeys: formKeys,
    }
    /** 表单内容变化时的监听 */
    onFormChange = (key, value) => {
        if(key==='isPoint') {
            let newFormKeys = ['isPoint'];
            if(value[0]){
                newFormKeys = formKeys;
            }
            this.setState({ newFormKeys });
        }
        this.props.onChange({ [key]: value });
    }
    /** 得到form */
    getForm = (node) => {
        this.form = node;
    }
    getCardOpts(){
        const { cardList } = this.props;
        return cardList.map(x => {
            const { cardTypeName, cardTypeID } = x;
            return { label: cardTypeName, value: cardTypeID };
        });
    }
    resetFormItems() {
        const { cardTypeID, ...others } = formItems;
        const options = this.getCardOpts();
        return {
            ...others,
            cardTypeID: { ...cardTypeID, options },
        }
    }
    render() {
        const { newFormKeys } = this.state;
        const { formData } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div className={css.pointBox}>
                <BaseForm
                    getForm={this.getForm}
                    formItems={newFormItems}
                    formKeys={newFormKeys}
                    onChange={this.onFormChange}
                    formData={formData || {}}
                    layout="inline"
                />
            </div>
        )
    }
}

export default Point

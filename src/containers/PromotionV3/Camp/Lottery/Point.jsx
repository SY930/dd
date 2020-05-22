import React, { PureComponent as Component } from 'react';
import BaseForm from 'components/common/BaseForm';
import css from './style.less';

const formKeys = ['isPoint', 'point', 'vipCard'];
const formItems = {
    isPoint: {
        type: 'checkbox',
        label: '',
        options: [{ label:'赠送积分', value: 1 }],
    },
    point: {
        type: 'text',
        label: '',
        surfix: '积分',
    },
    vipCard: {
        type: 'combo',
        label: '充值到会员卡',
        options: [],
    },
};

class Point extends Component {
    state = {
        newFormKeys: formKeys,
        options: [],
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
    resetFormItems() {
        const { options } = this.state;
        const { vipCard, ...others } = formItems;
        return {
            ...others,
            vipCard: { ...vipCard, options },
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

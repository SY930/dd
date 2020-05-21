import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys2, formItems2, formItemLayout } from './Common';
import { postStock } from './AxiosFactory';
import ShopSelector from 'components/ShopSelector';
import css from './style.less';

class Step2 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        brands: [],     // 选中的品牌，用来过滤店铺
    };

    onChange = (key, value) => {
        console.log(key, value);
        if(key === 'a') {
            this.setState({ brands: value });
        }
    }
    /** formItems 重新设置 */
    resetFormItems() {
        const { brands } = this.state;
        const render = d => d()(<ShopSelector brandList={brands} />);
        const { c, ...other } = formItems2;
        return {
            ...other,
            c: { ...c, render },
        };
    }
    render() {
        const { } = this.state;
        const { formData, getForm, form } = this.props;
        console.log('form2', form);
        const newFormItems = this.resetFormItems();
        return (
            <div>
                <BaseForm
                    getForm={getForm}
                    formItems={newFormItems}
                    formKeys={formKeys2}
                    onChange={this.onChange}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}
export default Step2

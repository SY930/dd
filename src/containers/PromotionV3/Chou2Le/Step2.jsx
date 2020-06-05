import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys2, formItems2, formItemLayout } from './Common';
import ShopSelector from 'components/ShopSelector';
import css from './style.less';

class Step2 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        brands: [],     // 选中的品牌，用来过滤店铺
    };

    onChange = (key, value) => {
        if(key === 'brandList') {
            this.setState({ brands: value });
        }
    }
    getBrandOpts() {
        const { brandList } = this.props;
        return brandList.map(x => {
            const { brandID, brandName } = x;
            return { label: brandName, value: brandID };
        });
    }
    /** formItems 重新设置 */
    resetFormItems() {
        const { brands } = this.state;
        const render = d => d()(<ShopSelector brandList={brands} />);
        const options = this.getBrandOpts();
        const { shopIDList, brandList, ...other } = formItems2;
        return {
            ...other,
            shopIDList: { ...shopIDList, render },
            brandList: { ...brandList, options },
        };
    }
    render() {
        const { } = this.state;
        const { formData, getForm, form } = this.props;
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

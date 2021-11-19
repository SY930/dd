import React, { PureComponent as Component } from 'react';
import BaseForm from 'components/common/BaseForm';
import ShopSelector from 'components/ShopSelector';
import { formKeys2, formItems2, formItemLayout } from './Common';
import { isFilterShopType } from '../../../helpers/util'

class Step2 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        brands: [], // 选中的品牌，用来过滤店铺
        scenes: [], // 应用场景
    };

    onChange = (key, value) => {
        if (key === 'brandList') {
            this.setState({ brands: value });
        }
        if (key === 'sceneList') {
            this.setState({ scenes: value })
        }
    }
    getBrandOpts() {
        const { brandList = [] } = this.props;
        return brandList.map((x) => {
            const { brandID, brandName } = x;
            return { label: brandName, value: brandID };
        });
    }
    getScenceList = () => {
        const { sceneList = [] } = this.props;
        return sceneList.map((x) => {
            const { brandID, brandName } = x;
            return { label: brandName, value: brandID };
        });
    }
    /** formItems 重新设置 */
    resetFormItems() {
        const { brands } = this.state;
        const render = d => d()(<ShopSelector filterParm={isFilterShopType() ? { productCode: 'HLL_CRM_License' } : {}} brandList={brands} />);
        const options = this.getBrandOpts();
        const optionsScenceList = this.getScenceList();
        const { shopIDList, brandList, sceneList } = formItems2;
        return {
            sceneList: { ...sceneList, optionsScenceList },
            shopIDList: { ...shopIDList, render },
            brandList: { ...brandList, options },
        };
    }
    render() {
        // const { formKeys2 } = this.state;
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

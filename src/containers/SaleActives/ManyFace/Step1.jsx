
import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux'
import BaseForm from 'components/common/BaseForm';
import { Checkbox, Radio } from 'antd';
import ShopSelector from 'components/ShopSelector';
import { getPromotionShopSchema } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { formKeys1, formItems1, formItemLayout } from './Common';
import { isFilterShopType, axiosData } from '../../../helpers/util'
import css from './style.less';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const optionsPalace = [{ label: '堂食点餐页', value: '1' },
    { label: '外卖点餐页', value: '2' }, { label: '自提点餐页', value: '3' }, { label: '支付完成页', value: '4' }];
const DF = 'YYYYMMDD';

class Step1 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        newFormKeys: formKeys1,
        brands: [], // 选中的品牌，用来过滤店铺
        scenes: [], // 应用场景
        // filterShop: [], // 过滤掉活动正在进行中绑定的店铺
    };

    componentDidMount() {
        this.props.getShopSchemaInfo({ groupID: this.props.user.accountInfo.groupID });
    }

    onChange = (key, value) => {
        // const { form1 } = this.props
        if (key === 'clientType') {
            this.props.onChangeForm(key, value)
        }
        if (key === 'sceneList') {
            this.props.onChangeForm(key, value)
        }
    }

    /** formItems 重新设置 */
    resetFormItems() {
        const { formData = {}, type } = this.props;

        // const render3 = d => d()(<EveryDay type={cycleType} />);
        const { clientType, sceneList, shopIDList, placement, ...other } = formItems1;
        const render = d => d()(<ShopSelector
            filterParm={isFilterShopType() ? { productCode: 'HLL_CRM_License' } : {}}
            // brandList={brands}
        />);
        const renderScene = (d, form) => {
            return form.getFieldValue('clientType') === '1' ? d({})(
                <RadioGroup > <Radio value={'1'}>弹窗海报</Radio> </RadioGroup>
            ) : d({})(
                <RadioGroup > <Radio value={'1'}>弹窗海报</Radio> <Radio value={'2'}>banner广告</Radio> </RadioGroup>
            )
        }

        const renderPlacement = (d, form) => {
            return form.getFieldValue('clientType') === '2' ? d({})(
                <CheckboxGroup options={optionsPalace} />
            ) : null
        }
        return {
            ...other,
            clientType,
            sceneList: { ...sceneList, render: renderScene },
            shopIDList: { ...shopIDList, render },
            placement: { ...placement, render: renderPlacement },
        };
    }
    render() {
        const { newFormKeys } = this.state;
        const { formData, getForm } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div className={css.step1}>
                <BaseForm
                    getForm={getForm}
                    formItems={newFormItems}
                    formKeys={newFormKeys}
                    onChange={this.onChange}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.toJS(),
        specialPromotionInfo: state.sale_specialPromotion_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        shopSchema: state.sale_shopSchema_New.get('shopSchema'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getShopSchemaInfo: opts => dispatch(getPromotionShopSchema(opts)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Step1);

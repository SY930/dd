import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Radio } from 'antd';
import moment from 'moment';
// import { Form } from 'antd';
import BaseForm from 'components/common/BaseForm';
import ShopSelector from 'components/ShopSelector';
import { formKeys2, formItems2, formItemLayout } from './Common';
import { getPromotionShopSchema } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { isFilterShopType, axiosData } from '../../../helpers/util'

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
// const optiosH5 = [{ label: '点餐页弹窗海报图', value: '1' }];
// const optiosApp2 = [{ label: '点餐页弹窗海报图', value: '1', disabled: false }, { label: '点餐页广告图（即将上线）', value: '2', disabled: true }];
const optionsPalace = [{ label: '堂食点餐页', value: '1' },
    { label: '外卖点餐页', value: '2' }, { label: '自提点餐页', value: '3' }, { label: '支付完成页', value: '4' }];

const DF = 'YYYYMMDD';
class Step2 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        brands: [], // 选中的品牌，用来过滤店铺
        scenes: [], // 应用场景
        filterShop: [], // 过滤掉活动正在进行中绑定的店铺
    };

    componentDidMount() {
        this.props.getShopSchemaInfo({ groupID: this.props.user.accountInfo.groupID });
        // this.loadShopSchema();
    }

    componentWillReceiveProps(nextProps) {
        const { formData1 } = nextProps
        const { eventRange } = formData1;
        const newEventRange = this.formatEventRange(eventRange);
        if (newEventRange.eventStartDate) {
            const param = {
                eventStartDate: newEventRange.eventStartDate,
                eventEndDate: newEventRange.eventEndDate,
                eventWay: '85',
            }
            axiosData(
                '/specialPromotion/queryAvailableShopIDInfo.ajax',
                { ...param },
                {},
                { path: 'shopIDList' },
                'HTTP_SERVICE_URL_PROMOTION_NEW'
            ).then((res) => {
                this.setState({
                    filterShop: res ? res : [],
                })
            })
        }
    }

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

    formatEventRange = (eventRange) => {
        const [sd, ed] = eventRange;
        const eventStartDate = moment(sd).format(DF);
        const eventEndDate = moment(ed).format(DF);
        return { eventStartDate, eventEndDate };
    }

    /** formItems 重新设置 */
    resetFormItems = () => {
        // const originTreeData = this.props.shopSchema.toJS();
        const shopData = this.props.shopSchema.toJS().shops;
        const filterShopData = shopData.filter(item => this.state.filterShop.indexOf(item.shopID) < 0);
        // originTreeData.shops = filterShopData;
        const { brands } = this.state;
        const { shopIDList, sceneList, clientType, placement } = formItems2;
        const render = d => d()(<ShopSelector
            filterParm={isFilterShopType() ? { productCode: 'HLL_CRM_License' } : {}}
            brandList={brands}
            canUseShops={filterShopData.map(shop => shop.shopID)}
        // schemaData={originTreeData}
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
            clientType,
            sceneList: { ...sceneList, render: renderScene },
            shopIDList: { ...shopIDList, render },
            placement: { ...placement, render: renderPlacement },
        };
    }
    render() {
        // const { formKeys2 } = this.state;
        const { formData, getForm } = this.props;
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
        // setSpecialBasicInfo: (opts) => {
        //     dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        // },
        getShopSchemaInfo: opts => dispatch(getPromotionShopSchema(opts)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Step2);

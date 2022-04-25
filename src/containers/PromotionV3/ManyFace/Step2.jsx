import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
// import { Form } from 'antd';
import BaseForm from 'components/common/BaseForm';
import ShopSelector from 'components/ShopSelector';
import { formKeys2, formItems2, formItemLayout } from './Common';
import { getPromotionShopSchema } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { isFilterShopType, axiosData } from '../../../helpers/util'

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
    resetFormItems() {
        // const originTreeData = this.props.shopSchema.toJS();
        const shopData = this.props.shopSchema.toJS().shops;
        const filterShopData = shopData.filter(item => this.state.filterShop.indexOf(item.shopID) < 0);
        // originTreeData.shops = filterShopData;
        const { brands } = this.state;
        const render = d => d()(<ShopSelector
            filterParm={isFilterShopType() ? { productCode: 'HLL_CRM_License' } : {}}
            brandList={brands}
            canUseShops={filterShopData.map(shop => shop.shopID)}
        // schemaData={originTreeData}
        />);
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

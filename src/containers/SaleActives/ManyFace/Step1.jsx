
import React, { PureComponent as Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux'
import BaseForm from 'components/common/BaseForm';
import { Checkbox, Radio, Select } from 'antd';
import ShopSelector from 'components/ShopSelector';
import { getPromotionShopSchema } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { formKeys1, formItems1, formItemLayout, KEY1, KEY2 } from './Common';
import { getMpAppList } from './AxiosFactory';
import { isFilterShopType } from '../../../helpers/util'
import css from './style.less';

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const optionsPalace = [{ label: '堂食点餐页', value: 1 },
    { label: '外卖点餐页', value: 2 }, { label: '自提点餐页', value: 3 }, { label: '支付完成页', value: 4 }];
const optionsPalaceBanner = [{ label: '堂食点餐页', value: 11 },
    { label: '外卖点餐页', value: 12 }, { label: '自提点餐页', value: 13 }, { label: '支付完成页', value: 14 }];
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
        this.getLaunchSceneApp()
    }

    onChange = (key, value) => {
        if (key === 'triggerSceneList') {
            this.props.onChangeForm(key, value)
        }else if(key == 'tagLst'){
            if(this.props.form1){
                const { setFieldsValue } = this.props.form1;
                setFieldsValue({
                    tagLst: value
                })
            }
        }
    }

    getLaunchSceneApp = () => {
        getMpAppList().then((res) => {
            this.setState({
                mpAppList: res,
            })
        })
    }

    handleChangeScene = ({ target }) => {
        this.props.onChangeForm('sceneList', target.value)
    }

    handleChangeClientType = ({ target }) => {
        this.props.onChangeForm('clientType', target.value)
    }

    resetFormKeys = () => {
        const { form1 } = this.props;
        const { newFormKeys } = this.state;
        if (form1 && form1.getFieldValue('clientType') === '1') {
            return [...KEY1, ...KEY2]
        }
        return newFormKeys
    }

    /** formItems 重新设置 */
    resetFormItems() {
        const { formData = {}, occupyShopList } = this.props;

        // const render3 = d => d()(<EveryDay type={cycleType} />);
        const { clientType, sceneList, shopIDList, triggerSceneList, launchSceneList, ...other } = formItems1;
        const render = (d, form) => {
            const { sceneList: sLst } = form.getFieldsValue()
            if (sLst == '1' || sLst == '2') {
                return d()(<ShopSelector
                    filterParm={isFilterShopType() ? { productCode: 'HLL_CRM_License' } : {}}
                    occupyShopList={occupyShopList} // 被占用的店铺需要高亮显示
                    // brandList={brands}
                />);
            }
            return null
        }
        const renderScene = (d, form) => {
            return form.getFieldValue('clientType') === '1' ? d({})(
                <RadioGroup > <Radio value={'1'}>弹窗海报</Radio> </RadioGroup>
            ) : d({
                onChange: this.handleChangeScene,
            })(
                <RadioGroup> <Radio value={'1'}>弹窗海报</Radio> <Radio value={'2'}>banner广告</Radio><Radio value={'21'}>开屏页</Radio><Radio value={'22'}>首页</Radio></RadioGroup>
            )
        }

        const renderTriggerSceneList = (d, form) => {
            const opt = form.getFieldValue('sceneList') === '1' ? optionsPalace : optionsPalaceBanner;
            return form.getFieldValue('clientType') === '2' &&
                ['1', '2'].includes(form.getFieldValue('sceneList'))
                ? d({
                    inititalValue: [1],
                })(
                    <CheckboxGroup options={opt} />
                ) : null
        }
        const renderClientType = (d) => {
            return d({
                onChange: this.handleChangeClientType,
            })(
                <RadioGroup >
                    <Radio value={'2'} disabled={formData.clientType == '1'}>小程序3.0</Radio>
                    <Radio value={'1'} disabled={true}>H5餐厅 (暂时不支持新增和修改)</Radio>
                </RadioGroup>
            )
        }
        return {
            ...other,
            clientType: { ...clientType, render: renderClientType },
            sceneList: { ...sceneList, render: renderScene },
            shopIDList: { ...shopIDList, render },
            triggerSceneList: { ...triggerSceneList, render: renderTriggerSceneList },
            launchSceneList: { ...launchSceneList, render: this.renderLaunchSceneList },
        };
    }


    renderLaunchSceneList = (d, form) => {
        const { mpAppList } = this.state;
        const { sceneList } = form.getFieldsValue()
        if (['21', '22'].includes(sceneList)) {
            return (
                d({})(
                    <Select>
                        {(mpAppList || []).map(({ appID, nickName }) => (<Option key={appID} value={appID}>{nickName}</Option>))}
                    </Select>)
            )
        }
        return null
    }

    render() {
        let { formData, getForm, isView } = this.props;
        formData = {
            ...formData,
            eventCode: isView ? formData.eventCode : formData.eventCode ? formData.eventCode : `YX${moment(new Date()).format('YYYYMMDDHHmmss')}`
        }
        const newFormItems = this.resetFormItems();
        const formKeys = this.resetFormKeys()
        return (
            <div className={css.step1}>
                <BaseForm
                    getForm={getForm}
                    formItems={newFormItems}
                    formKeys={formKeys}
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

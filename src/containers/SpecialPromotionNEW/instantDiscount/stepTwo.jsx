/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-15T10:50:38+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Checkbox,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import { getPromotionShopSchema } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';

import styles from '../../SaleCenterNEW/ActivityPage.less';
import ShopSelector from '../../../components/ShopSelector';
import Immutable from 'immutable';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import { axios } from '@hualala/platform-base';




const CheckboxGroup = Checkbox.Group;
@injectIntl
class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const $shopIDList = props.specialPromotionInfo.getIn(['$eventInfo', 'shopIDList']);
        const supportOrderTypes = props.specialPromotionInfo.getIn(['$eventInfo', 'supportOrderTypes']);
        this.state = {
            shopIDList: Immutable.List.isList($shopIDList) ? $shopIDList.toJS().map(idNumber => `${idNumber}`) : [],
            supportOrderTypes: supportOrderTypes ? supportOrderTypes.split(',') : ['0'],
            isRequire: true,
        }
        this.supportOrderTypesOptions = [
            {
                label: `${this.props.intl.formatMessage(STRING_SPE.dk46d3h15k0292)}`,
                value: '0',
            },
            {
                label: `${this.props.intl.formatMessage(STRING_SPE.dojx5odc71156)}`,
                value: '1',
                disabled: true,
            },

            {
                label: `${this.props.intl.formatMessage(STRING_SPE.d5672419c827282)}`,
                value: '2',
                disabled: true,
            },
            {
                label: `${this.props.intl.formatMessage(STRING_SPE.d2b1c1c9d952380)}`,
                value: '3',
                disabled: true,
            },
            {
                label: `${this.props.intl.formatMessage(STRING_SPE.d5672419c8284177)}`,
                value: '4',
                disabled: true,
            },
        ];
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.props.getShopSchemaInfo({groupID: this.props.user.accountInfo.groupID});
        this.loadShopSchema();
    }

    handleSubmit = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
        });
        if (flag) {
            const {
                supportOrderTypes,
                shopIDList,
            } = this.state;
            this.props.setSpecialBasicInfo({
                supportOrderTypes: supportOrderTypes.join(','),
                shopIDList,
                shopRange: shopIDList.length > 0 ? 1 : 2,
            });
        }
        return flag;
    }

    handleShopChange = (v) => {
        this.setState({
            shopIDList: v,
            shopStatus: v.length > 0,
        })
    }
    handleSupportOrderTypesChange = (v) => {
        this.setState({
            supportOrderTypes: v,
        })
    }
    async loadShopSchema() {
        const { data } = await axios.post('/api/shopapi/schema',{});
        const { shops } = data;
        this.countIsRequire(shops);
    }
    countIsRequire(shopList){
        const { shopSchema, specialPromotionInfo } = this.props;
        const { size } = shopSchema.getIn(['shops']);       // 总店铺数
        const eventInfo = specialPromotionInfo.getIn(['$eventInfo']).toJS();
        const oldShops = eventInfo.shopIDList || []; // 存储的店铺数
        const isOld = eventInfo.itemID; // 有这个id 表明是 编辑数据
        const { length } = shopList;
        // a 新建营销活动，先获取此集团的所有店铺数据，如果此用户为全部店铺权限，表单内店铺组件非必选
        // 如果用户权限为某几个店铺的权限，组件为必选项。
        // b 编辑活动，全部店铺权限用户非必选
        // 店铺受限用户，首先判断历史数据是否是全部店铺的数据，如果是，店铺组件为非必选。
        // 反之，店铺为必选，用户必选一个用户权限之内的店铺选项。
        if(!isOld){
            if(length<size){
                this.setState({ isRequire: true });
            }
        } else {
            if(oldShops[0] && length<size){
                this.setState({ isRequire: true });
            }
        }
    }
    render() {
        const { isRequire, shopStatus } = this.state;
        return (
            <div>
                <Form.Item
                    label={this.props.intl.formatMessage(STRING_SPE.d1qe5qoek8559)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        this.props.form.getFieldDecorator('message', {
                            rules: [
                                { required: true, message: `${this.props.intl.formatMessage(STRING_SPE.d31f03ecfb86215)}` },
                            ],
                            initialValue: this.state.supportOrderTypes,
                            onChange: this.handleSupportOrderTypesChange
                        })(
                            <CheckboxGroup
                                options={this.supportOrderTypesOptions}
                            />
                        )
                    }
                </Form.Item>
                <Form.Item
                    label={this.props.intl.formatMessage(STRING_SPE.db60a0b75aca181)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={isRequire}
                    validateStatus={shopStatus ? 'success' : 'error'}
                    help={shopStatus ? null : '店铺不能为空'}
                >
                    <ShopSelector
                        value={this.state.shopIDList}
                        onChange={this.handleShopChange}
                        // schemaData={this.props.shopSchema.toJS()}
                    />
                </Form.Item>
            </div>

        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user.toJS(),
        specialPromotionInfo: state.sale_specialPromotion_NEW,
        shopSchema: state.sale_shopSchema_New.get('shopSchema'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        getShopSchemaInfo: opts => dispatch(getPromotionShopSchema(opts)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));

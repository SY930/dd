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





const CheckboxGroup = Checkbox.Group;
@injectIntl
class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const $shopIDList = props.specialPromotionInfo.getIn(['$eventInfo', 'shopIDList']);
        const supportOrderTypes = props.specialPromotionInfo.getIn(['$eventInfo', 'supportOrderTypes']);
        this.state = {
            shopIDList: Immutable.List.isList($shopIDList) ? $shopIDList.toJS().map(idNumber => `${idNumber}`) : [],
            supportOrderTypes: supportOrderTypes ? supportOrderTypes.split(',') : ['0']
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
        })
    }
    handleSupportOrderTypesChange = (v) => {
        this.setState({
            supportOrderTypes: v,
        })
    }

    render() {
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

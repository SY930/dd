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
import ShopSelector from "../../../components/common/ShopSelector";
import Immutable from 'immutable';

const supportOrderTypesOptions = [
    {
        label: '堂食',
        value: '0',
    },
    {
        label: '外送',
        value: '1',
        disabled: true,
    },
    
    {
        label: '自提',
        value: '2',
        disabled: true,
    },
    {
        label: '闪吃',
        value: '3',
        disabled: true,
    },
    {
        label: '预定',
        value: '4',
        disabled: true,
    }, 
];

const CheckboxGroup = Checkbox.Group;

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const $shopIDList = props.specialPromotionInfo.getIn(['$eventInfo', 'shopIDList']);
        const supportOrderTypes = props.specialPromotionInfo.getIn(['$eventInfo', 'supportOrderTypes']);
        this.state = {
            shopIDList: Immutable.List.isList($shopIDList) ? $shopIDList.toJS() : [],
            supportOrderTypes: supportOrderTypes ? supportOrderTypes.split(',') : ['0']
        }
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
                    label="适用业务"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        this.props.form.getFieldDecorator('message', {
                            rules: [
                                { required: true, message: '请选择适用业务类型' },
                            ],
                            initialValue: this.state.supportOrderTypes,
                            onChange: this.handleSupportOrderTypesChange
                        })(
                            <CheckboxGroup
                                options={supportOrderTypesOptions}
                            />
                        )
                    }    
                </Form.Item>
                <Form.Item
                    label="适用店铺"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <ShopSelector
                        value={this.state.shopIDList}
                        onChange={this.handleShopChange}
                        schemaData={this.props.shopSchema.toJS()}
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

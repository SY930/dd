import React, { PureComponent as Component } from "react";
import BaseForm from "components/common/BaseForm";
import ShopSelector from "components/ShopSelector";
import { isFilterShopType } from "../../../../helpers/util";
import { baseFormItems, formItemLayout, baseFormKeys } from "../common";
import { Select } from "antd";
import moment from 'moment';
const Option = Select.Option;
class BasicInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: baseFormKeys,
            shopStatus: true,
        };
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    onChangeBasicForm = (key, value) => {};
    isArray  = (object) => {
        return object && typeof object==='object' &&
                Array == object.constructor;
    }
    /** 获取会员卡类型 */
    getGroupCardTypeOpts (){
        const { groupCardTypeList } = this.props;
        let cardTypeList = [];
        if(groupCardTypeList && this.isArray(groupCardTypeList)){
            cardTypeList = groupCardTypeList.filter((i)=>i.isActive);
        }
        
        return cardTypeList.map(x => {
            const { cardTypeID, cardTypeName, isActive } = x;
            return { label: cardTypeName, value: cardTypeID };
        });
    }
    resetFormItems = () => {
        const { shopIDList, settleUnitID, cardTypeID } = baseFormItems;
        const { settlesOpts } = this.props;
        const defaultCardOpts = this.getGroupCardTypeOpts();
        const renderSettleOpts = d => d()(<Select
            showSearch={true}
            allowClear={true}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
            {
                settlesOpts.map((type, index) =>
                    <Option key={index} value={String(type.value)} >{type.label}</Option>
                )
            }
        </Select>);
        const renderDefaultCard = d => d()(<Select
            showSearch={true}
            allowClear={true}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
            {
                defaultCardOpts.map((type, index) =>
                    <Option key={index} value={String(type.value)} >{type.label}</Option>
                )
            }
        </Select>);
        
        return {
            ...baseFormItems,
            shopIDList: {
                ...shopIDList,
                render: (d) =>
                    d()(
                        <ShopSelector
                            filterParm={
                                isFilterShopType("95")
                                    ? { productCode: "HLL_CRM_License" }
                                    : {}
                            }
                            // canUseShops={canUseShops}
                            // disabled={canUseShops.length <= 0}
                            onChange={this.editBoxForShopsChange}
                        />
                    ),
            },
            settleUnitID: { 
                ...settleUnitID,
                render: renderSettleOpts
            },
            cardTypeID: {
                ...cardTypeID,
                render: renderDefaultCard
            },
        };
    };
    render() {
        let { formData, getForm, isView } = this.props;
        const { formKeys } = this.state;
        formData = {
            ...formData,
            eventCode: isView ? formData.eventCode : formData.eventCode ? formData.eventCode : `YX${moment(new Date()).format('YYYYMMDDHHmmss')}`
        }
        return (
            <div style={{ width: 800, marginBottom: 16 }}>
                <BaseForm
                    getForm={getForm}
                    formItems={this.resetFormItems()}
                    formKeys={formKeys}
                    onChange={this.onChangeBasicForm}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        );
    }
}

export default BasicInfoForm;

import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message, Form, Select, Icon, Tooltip } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys21, formKeys22, formItems2, keys1, keys2, formItemLayout } from './Common';
import TimeLimit from '../Camp/TimeLimit';
import MpList from '../Camp/MpList';
import css from './style.less';

class Step2 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        groupCardTypeList: [],     // 选中的品牌，用来过滤店铺
        newFormKeys: [...formKeys22],
    };
    getGroupCardTypeOpts() {
        const { groupCardTypeList = [] } = this.props;
        return groupCardTypeList.map(x => {
            const { cardTypeID, cardTypeName } = x;
            return { label: cardTypeName, value: cardTypeID };
        });
    }
    getMpOpts() {
        const { mpList = [] } = this.props;
        return mpList.map(x => {
            const { mpID, mpName } = x;
            return { label: mpName, value: mpID };
        });
    }
    getSettleUnitInfoOpts() {
        const { settleUnitInfoList = [] } = this.props;
        return settleUnitInfoList.map(x => {
            const { settleUnitID, settleUnitName } = x;
            return { label: settleUnitName, value: settleUnitID };
        });
    }
    /** formItems 重新设置 */
    resetFormItems() {
        let {formData} = this.props
        let {userCount} = formData
        const disable = (userCount > 0);
        const { defaultCardType, mpIDList, joinCount, settleUnitID, ...other } = formItems2;
        const render = d => d()(<TimeLimit decorator={d} />);
        const mpOptions = this.getMpOpts();
        const mpRender = d => d()(<MpList options={mpOptions} decorator={d} />);
        const cardOptions = this.getGroupCardTypeOpts();
        const settleOptions = this.getSettleUnitInfoOpts();
        const cardRender = d => d()(<Select
            style={{width: 280}}
            showSearch={true}
            allowClear={true}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
            {
                cardOptions.map((type, index) =>
                    <Option key={index} value={String(type.value)} >{type.label}</Option>
                )
            }
        </Select>);
        return {
            ...other,
            mpIDList: {...mpIDList, render: mpRender},
            // participateRule: {...participateRule, disabled: disable},
            joinCount: {...joinCount, render},
            defaultCardType: {...defaultCardType, render:cardRender},
            settleUnitID: {...settleUnitID, options: settleOptions},
        };
    }
    render() {
        const { newFormKeys } = this.state;
        const { formData, getForm, form } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div>
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
export default Step2

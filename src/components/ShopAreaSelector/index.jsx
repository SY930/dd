import React, { Component } from 'react';
import { Form, message, Select, Radio } from 'antd';
import { axios } from '@hualala/platform-base';
import ShopSelector from '../../components/ShopSelector';
import { SALE_LABEL } from 'i18n/common/salecenter';
import { ENUM, RADIO_OPTIONS } from './config';
import styles from './index.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 选择店铺或区域
 */
export default class ShopAreaSelector extends Component {
    state = {
        areaList: [],
    }

    componentDidMount() {
        if (this.props.typeList.includes(ENUM.AREA)) {
            this.fetchAreaList();
        }
    }

    fetchAreaList = async () => {
        const response = await axios.post('/api/v1/universal?', {
            type: 'post',
            data: {
                orgTypeID: '13', // 区域
                isActive: '1',
                groupID: this.props.groupID,
            },
            method: '/orgapi/selectOrgs.svc',
            service: 'HTTP_SERVICE_URL_ORG',
        });
        const { code, message: msg, data = {} } = response;
        if (code === '000') {
            const { records = [] } = data;
            this.setState({ areaList: records });
            return;
        }
        message.error(msg);
    }

    onChangeRadio = (e) => {
        const radioValue = e.target.value;
        this.props.onChange({
            list: [],
            radioValue,
        })
    }

    onChangeIDList = (list) => {
        const { value } = this.props;
        this.props.onChange({
            ...value,
            list,
            otherRes: this.props.formatRes && typeof this.props.formatRes === 'function' ? this.props.formatRes({
                areaList: this.state.areaList,
                // brandList: this.props.brandList,
            }) : undefined,
        })
    }


    render() {
        const { typeList, radioLabel, labelCol, wrapperCol, radioRequire, value = {},
            firstLabel, firstRequired, firstValidateStatus, firstHelp, firstTips,
            secondLabel, secondRequired, secondValidateStatus, secondHelp, secondTips,
            brandList = [], filterParm, filterShopIds,
        } = this.props;

        const { areaList } = this.state;

        const { radioValue, list = [] } = value;

        return (
            <div>
                {
                    typeList.length > 1 &&
                    <FormItem
                        label={radioLabel}
                        labelCol={labelCol}
                        wrapperCol={wrapperCol}
                        required={radioRequire}
                    >
                        <RadioGroup onChange={this.onChangeRadio} value={radioValue}>
                            {
                                RADIO_OPTIONS.map(item => (
                                    <Radio key={item.value} value={item.value}>{item.label}</Radio>
                                ))
                            }
                        </RadioGroup>
                    </FormItem>
                }
                {
                    typeList.includes(ENUM.SHOP) && (typeList.length === 1 || radioValue === ENUM.SHOP) &&
                    <FormItem
                        label={firstLabel || SALE_LABEL.k5dlggak}
                        className={styles.FormItemStyle}
                        labelCol={labelCol}
                        wrapperCol={wrapperCol}
                        required={firstRequired}
                        validateStatus={firstValidateStatus}
                        help={firstHelp}
                    >
                        <ShopSelector
                            value={list}
                            brandList={brandList}
                            onChange={this.onChangeIDList}
                            filterParm={filterParm}
                            filterShopIds={filterShopIds}
                            groupID={this.props.groupID}
                        />
                        {firstTips}
                    </FormItem>
                }
                {
                    typeList.includes(ENUM.AREA) && (typeList.length === 1 || radioValue === ENUM.AREA) &&
                    <FormItem
                        label={secondLabel || SALE_LABEL.k5dlggak}
                        labelCol={labelCol}
                        wrapperCol={wrapperCol}
                        required={secondRequired}
                        validateStatus={secondValidateStatus}
                        help={secondHelp}
                    >
                        <Select
                            multiple={true}
                            style={{ width: '100%' }}
                            placeholder="请选择区域"
                            value={list}
                            onChange={this.onChangeIDList}
                            showSearch={true}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                areaList.map(item => (
                                    <Option key={item.orgID} value={item.orgID}>{item.orgName}</Option>
                                ))
                            }
                        </Select>
                        {secondTips}
                    </FormItem>
                }
            </div>
        )
    }
}

ShopAreaSelector.defaultProps = {
    typeList: [ENUM.SHOP, ENUM.AREA],
    radioLabel: '店铺范围',
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
    radioRequire: false,
    firstValidateStatus: 'success',
    secondValidateStatus: 'success',
    secondLabel: '适用区域',
};
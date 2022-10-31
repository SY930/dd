import React, { PureComponent as Component } from 'react';
import { Modal, TreeSelect } from 'antd';
import _ from 'lodash';
// import { BaseForm } from '@hualala/platform-components';
import BaseForm from 'components/common/BaseForm';
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from './giftType';
const formKeys1 = ['presentType','giftItemID', 'giftCount', 'effectType', 'countType', 'giftEffectTimeHours', 'giftValidUntilDayCount'];
const formKeys2 = ['presentType','giftItemID', 'giftCount', 'effectType', 'rangeDate'];
const formKeys3 = ['presentType','giftItemID', 'giftCount'];
const formItems = {
    // presentType:{
    //     type: 'radio',
    //     label: '礼品属性',
    //     defaultValue: '1',
    //     options: [
    //         { label: '餐饮券', value: '1' },
    //         { label: '零售券', value: '8' },
    //     ],
    // },
    giftItemID: {
        type: 'custom',
        label: '礼品名称',
        rules: ['required'],
        render: null,
    },
    // giftCount: {
    //     type: 'text',
    //     label: '礼品数量',
    //     surfix: '个',
    //     rules: [{
    //         required: true,
    //         validator: (rule, value, callback) => {
    //             if (!/^\d+$/.test(value)) {
    //                 return callback('请输入数字');
    //             }
    //             if (+value < 1 || +value > 500) {
    //                 return callback('大于0，限制500个');
    //             }
    //             return callback();
    //         },
    //     }],
    // },
    effectType: {
        type: 'radio',
        label: '生效方式',
        defaultValue: '1',
        options: [
            { label: '相对有效期', value: '1' },
            { label: '固定有效期', value: '2' },
        ],
    },
    countType: {
        type: 'radio',
        label: '相对有效期',
        defaultValue: '0',
        options: [
            { label: '按小时', value: '0' },
            { label: '按天', value: '1' },
        ],
    },
    giftEffectTimeHours: {
        type: 'combo',
        label: '生效时间',
        options: SALE_CENTER_GIFT_EFFICT_TIME,
        defaultValue: '0',
    },
    giftValidUntilDayCount: {
        type: 'text',
        label: '有效天数',
        surfix: '天',
        // rules: ['required', 'numbers'],
        rules: [{
            required: true,
            validator: (rule, value, callback) => {
                if (!/^\d+$/.test(value)) {
                    return callback('请输入数字');
                }
                if (+value < 1) {
                    return callback('请输入大于0的数字');
                }
                if (+value > 730) {
                    return callback('有效天数最长730天');
                }
                return callback();
            },
        }],
    },
    rangeDate: {
        type: 'datepickerRange',
        label: '固定有效期',
        rules: ['required'],
    },
};
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13 },
}
export default class GiftModal extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        options: SALE_CENTER_GIFT_EFFICT_TIME, // 生效时间下拉框
        formKeys: formKeys1,
        giftData:this.props.giftData
    };
    /* 表单提交 */
    onOk = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { onClose, onPost, treeData } = this.props;
                let obj = v
                obj.giftID = obj.giftItemID
                treeData.forEach((item) => {
                    if(Array.isArray(item.children)) {
                        item.children.forEach((every) => {
                            if(every.value == obj.giftItemID) {
                                obj.giftName = every.label
                            }
                        })
                    }
                })
                onPost(obj);
                onClose();
            }
        });
    }
    /** 表单内容变化时的监听 */
    onFormChange = (key, value) => {
        const {giftData} = this.state;
        if (key === 'effectType') {
            if (value == '1') {
                if(giftData.presentType == 8){
                    this.setState({ formKeys: formKeys3 });
                }else{
                    this.setState({ formKeys: formKeys1 });
                }
            } else {
                this.setState({ formKeys: formKeys2 });
            }
        }
        if (key === 'presentType') {
            if(giftData.presentType != value){
                this.form.setFieldsValue({giftItemID:undefined,giftCount:undefined})
            }
            if (value == '1') {
                if(giftData.effectType == '1' || !giftData.effectType){
                    this.setState({ formKeys: formKeys1 });
                }else{
                    this.setState({ formKeys: formKeys2 });
                }
            } else if(value == '8'){
                this.setState({ formKeys: formKeys3 });
            }
            this.props.onChangePresentType(value);
        }
        if (key === 'countType') {
            const options = (value === '0') ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY;
            this.setState({ options },() => {
                this.form.setFieldsValue({ 'giftEffectTimeHours':giftData && giftData.giftEffectTimeHours && giftData.giftEffectTimeHours !== '0'  ? giftData.giftEffectTimeHours : value });
            });
        }
        
    }
    /** 得到form */
    getForm = (node) => {
        this.form = node;
    }
    resetFormItems() {
        const { options } = this.state;
        const { treeData } = this.props;
        const { giftItemID, giftEffectTimeHours } = formItems;
        const render = d => d()(
            <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择礼品名称"
                showSearch={true}
                treeNodeFilterProp="label"
                allowClear={true}
            />);
        return {
            ...formItems,
            giftItemID: { ...giftItemID, render },
            giftEffectTimeHours: { ...giftEffectTimeHours, options },
        }
    }
    parseGiftData = (gift, index, ifStatus) => {
        const jj = _.mapValues(gift, (value, key) => {
            const _key = key.split('_')[0];
            switch (_key) {
                case 'presentType':
                case 'giftID':
                case 'giftEffectTimeHours':
                case 'giftValidUntilDayCount':
                case 'effectType':
                case 'giftCount':
                case 'giftType':
                    return value = value && String(value);
                default:
                    return value !== undefined ? value : '';
            }
        });
        const keys = _.keys(gift);
        if (keys.length > 0) {
            const _index = keys[0].split('_')[1];
            if (!jj[`fixedTime_${_index}`]) {
                // 没有fixedTime_时，需要加一下
                jj[`fixedTime_${_index}`] = jj[`effectTime_${_index}`] && [Moment(String(jj[`effectTime_${_index}`]), 'YYYYMMDDhhmmss'), Moment(String(jj[`validUntilDate_${_index}`]), 'YYYYMMDDhhmmss')];
                // jj[`fixedTime_${_index}`] = [Moment('20160505105051','YYYYMMDDhhmmss'), Moment()];
            } 
            if(jj[`propEffectType_${_index}`] == 3){
                //按天
                jj[`effectType_${_index}`] = '1';
                jj[`relativeEffectType_${_index}`] = '2';
                jj[`dayEffectTime_${_index}`] = jj[`giftEffectTimeHours_${_index}`];
                jj[`hourEffectTime_${_index}`] ='';
            }else if(jj[`propEffectType_${_index}`] == 1) {
                //按小时
                jj[`relativeEffectType_${_index}`] = '1';
                jj[`hourEffectTime_${_index}`] = jj[`giftEffectTimeHours_${_index}`];
                jj[`dayEffectTime_${_index}`] ='';
            }
        }
        // if(ifStatus){
        //     const { data } = this.state;
        //     data[index] = jj;
        //     this.setState({
        //         data,
        //     })
        // }
        return jj;
    }
    render() {
        const { formKeys,giftData } = this.state;
        const { onClose,isEdit } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <Modal
                title={isEdit ? "编辑优惠券" : "添加优惠券"}
                visible={true}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={onClose}
            >
                <BaseForm
                    getForm={this.getForm}
                    formItems={newFormItems}
                    formData={this.parseGiftData(giftData)}
                    formKeys={formKeys}
                    onChange={this.onFormChange}
                    formItemLayout={formItemLayout}
                />
            </Modal>
        )
    }
}

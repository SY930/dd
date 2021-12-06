import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin,message } from 'antd';
import FilterSelector from '../../components/common/FilterSelector';
import { ACCOUNTLIST } from './Config';
export const FILTERS = [{
    name: 'basicPromotion',
    key: 'basicType',
    label: '基础营销活动',
    options:[
        {value: '2020',label: '折扣'},
        {value: '1010',label: '特价菜'},
        {value: '4010',label: '团购活动'},
        {value: '1050',label: '第二份打折'},
        {value: '1070',label: '加价换购'},
        // {value: '5010',label: '菜品推荐'},
        // {value: '5020',label: '会员专属菜'},
        {value: '1090',label: '加价升级换新'},
        {value: '2010',label: '满减/每满减'},
        {value: '2030',label: '随机立减'},
        {value: '1030',label: '满赠/每满赠'},
        {value: '1020',label: '买赠'},
        {value: '1060',label: '买三免一'},
        {value: '2040',label: '买减/买折'},
        {value: '2050',label: '组合减免/折扣'},
        {value: '1040',label: '搭赠'},
        {value: '2080',label: '低价促销'},
        {value: '1080',label: '累计次数赠送'},
        {value: '2070',label: '累计次数减免'},
        {value: '1021',label: '称重买赠'},
        {value: '10071',label: '拼团活动'},
    ]
}, {
    name: 'hllCoupon',
    key: 'couponType',
    label: '哗啦啦优惠券',
    options:[
        {value: '10',label: '代金券'},
        {value: '20',label: '菜品优惠券'},
        {value: '21',label: '菜品兑换券'},
        {value: '111',label: '折扣券'},
        {value: '110',label: '买赠券'},
        {value: '22',label: '配送券'},
    ] 
}, {
    name: 'membershipRight',
    key: 'rightType',
    label: '会员权益',
    options:[
        {value: '-10',label: '会员价'},
        {value: '-20',label: '会员折扣'},
    ]
}];

class PromotionSelectorModal extends Component {
    state = {
        loading: false,
        options: null,
        filters: FILTERS,
    }

    selected = this.props.defaultValue
    groupName = null;
  
    handleGroupNameChange = (value = {}) => {
        if (value) {
            this.groupName = value
        }
    }
    handleChange = (values) => {
        this.selected = values;
        this.props.onChange(values);
    }

    handleFilterKeyChange = (filterKey) => {
        const curFilter = this.state.filters.find(filter => filter.key === filterKey);
        
    }

    handleOk = () => {
        const { groupID,shareRuleType } = this.props;
        console.log(ACCOUNTLIST,'ACCOUNTLIST============')
        if(ACCOUNTLIST.indexOf(groupID) > -1 && shareRuleType == '0'){
            if(this.selected && this.selected.length > 500){
                message.warning('最多选择500个活动')
                return
            }
        }else{
            if(this.selected && this.selected.length > 100){
                message.warning('最多选择100个活动')
                return
            }
        }
        
        this.props.onOk(this.selected);
    }

    render() {
        let finalOptions = [];
        const { defaultValue,filterArr } = this.props;
        const { loading, filters } = this.state;
        let options = this.props.options || [];
        finalOptions = options.filter(item => {
            return filterArr.indexOf(item.value) < 0;

        })
        return (
            <Modal
                {...this.props}
                onOk={this.handleOk}
                maskClosable={false}
            >
                <Spin spinning={loading} delay={500}>
                    <FilterSelector
                        title="活动"
                        doGroup={true}
                        options={finalOptions}
                        filters={filters}
                        isPromotion={true}
                        defaultValue={defaultValue}
                        onChange={this.handleChange}
                        onFilterKeyChange={this.handleFilterKeyChange}
                        onGroupNameChange={this.handleGroupNameChange}
                    />
                </Spin>
            </Modal>
        );
    }
}

PromotionSelectorModal.defaultProps = {
    title: '选择活动',
    width: 700,
    options: [],
    filters: [],
    defaultValue: [],
    onChange() { },
    onOk() { },
    onCancel() { },
};

PromotionSelectorModal.propTypes = {
    // /** 模态框的标题 */
    title: PropTypes.string,
    // /** 模态框宽度 */
    width: PropTypes.number,
    /** 可选择的所有项 */
    options: PropTypes.arrayOf(PropTypes.any),
    /** 过滤器 */
    filters: PropTypes.arrayOf(PropTypes.any),
    /** 已选择的选项 */
    defaultValue: PropTypes.arrayOf(PropTypes.string),
    /** 已选择的项发生改变时的回调函数 */
    onChange: PropTypes.func,
    /** 点击模态框确定按钮时的回调函数 */
    onOk: PropTypes.func,
    // /** 点击模态框取消按钮时的回调函数 */
    onCancel: PropTypes.func,
};

export default PromotionSelectorModal;

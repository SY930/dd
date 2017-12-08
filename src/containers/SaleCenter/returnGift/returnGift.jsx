/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-23T17:02:39+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: returnGift.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-06T23:07:35+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React from 'react';
import {connect} from 'react-redux';

import { DatePicker, Radio ,Form, Select, TreeSelect  } from 'antd';
import styles from '../ActivityPage.less';
import PriceInput from '../common/PriceInput';
import _ from 'lodash';

var Moment = require('moment');

if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less');
}
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
import {
    saleCenterSetPromotionDetailAC,
    fetchGiftListInfoAC
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';

import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME
} from '../../../redux/actions/saleCenter/types';


const type = [
    {key: 0, value: '0', name: '相对有效期'},
    {key: 1, value: '1', name: '固定有效期'}
];

const VALIDATE_TYPE = Object.freeze([{
    key: 0, value: '0', name: '相对有效期'},
{key: 1, value: '1', name: '固定有效期'}]);


const defaultData = {
    stageAmount: {
        value: null,
        validateStatus: 'success',
        msg: null,
    },
    giftNum: {
        value: 1,
        validateStatus: 'success',
        msg: null
    },

    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'success',
        msg: null
    },
    // 使用张数
    giftMaxNum: {
        value: 1,
        validateStatus: 'success',
        msg: null,
    },

    giftValidType: '0',

    giftEffectiveTime: {
        value: 0,
        validateStatus: 'success',
        msg: null
    },

    giftValidDays: {
        value: 1,
        validateStatus: 'success',
        msg: null,
    }
};

class ReturnGift extends React.Component {

    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            flag: {
                0:'0',
                1:'0',
                2:'0',
            },
            giftTreeData:[],
            defaultValue:null,
            data:{
                0:{
                    stageAmount:null,
                    giftNum:0,
                    giftName:null,
                    giftItemID:null,
                    giftMaxNum:0,
                    giftValidType:'0',
                    giftEffectiveTime:0,
                    giftValidDays:0,
                }
            },
            infos:this.props.value || [JSON.parse(JSON.stringify(defaultData))],
            maxCount: this.props.maxCount || 3,
        };

        this.renderItems = this.renderItems.bind(this);
        this.renderBlockHeader = this.renderBlockHeader.bind(this);
        this.handleStageAmountChange = this.handleStageAmountChange.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.getGiftValue = this.getGiftValue.bind(this);
        this.handleGiftChange = this.handleGiftChange.bind(this);
        this.handleGiftMaxNumChange = this.handleGiftMaxNumChange.bind(this);
        this.handleValidateTypeChange = this.handleValidateTypeChange.bind(this);
        this.renderValidOptions = this.renderValidOptions.bind(this);
        this.handleGiftValidDaysChange = this.handleGiftValidDaysChange.bind(this);
        this.handleRangePickerChange = this.handleRangePickerChange.bind(this);
        this.handleGiftEffectiveTimeChange = this.handleGiftEffectiveTimeChange.bind(this);
        this.proGiftTreeData = this.proGiftTreeData.bind(this);
    }

    componentDidMount(){
        // 第一次加载需将默认值传给父组件
        if(Object.keys(this.props.value).length>0){
            this.setState({
                infos:this.props.value || [JSON.parse(JSON.stringify(defaultData))],
            }, ()=>{
                if(this.props.value === null) {
                    this.props.onChange && this.props.onChange(this.state.infos);
                }
            });
        }


        this.props.fetchGiftListInfo({
            groupID : this.props.user.accountInfo.groupID
        });
    }
    componentWillReceiveProps(nextProps){
        if(this.props.maxCount !== nextProps.maxCount){
            this.setState({
                infos: [JSON.parse(JSON.stringify(defaultData))],
                maxCount: nextProps.maxCount
            });
        }

        if (nextProps.value){
            this.setState({
                infos:nextProps.value || [JSON.parse(JSON.stringify(defaultData))],
            });
        }


        if(nextProps.promotionDetailInfo.getIn(["$giftInfo", "initialized"])){
            let giftInfo = nextProps.promotionDetailInfo.getIn(["$giftInfo", "data"]).toJS();

            this.setState({giftTreeData: this.proGiftTreeData(giftInfo)});
        }

    }
    proGiftTreeData(giftTypes){
        let _giftTypes = _.filter(giftTypes, giftItem => giftItem.giftType != 90 && giftItem.giftType != 80);
        let treeData = [];
        _giftTypes.map((gt,idx)=>{
            treeData.push({
                label: _.find(SALE_CENTER_GIFT_TYPE,{value:String(gt.giftType)}).label,
                key: gt.giftType,
                children:[]
            });
            gt.crmGifts.map((gift)=>{
                treeData[idx].children.push({
                    label: gift.giftName,
                    value: gift.giftItemID+','+gift.giftName,
                    key: gift.giftItemID
                });

            });
        });
        return treeData = _.sortBy(treeData,'key');
    }
    remove(index){
        let _infos = this.state.infos;
        _infos.splice(index, 1);
        this.setState({
            infos: _infos
        },()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    add(){
        let _infos = this.state.infos;
        _infos.push(JSON.parse(JSON.stringify(defaultData)));
        this.setState({
            infos: _infos
        },()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    render() {
        return (
            <div>
                {this.renderItems()}
            </div>
        );
    }



    renderItems(){
        return this.state.infos.map((info, index) => {
            return (
                <div className={styles.addGrade} key={index}>
                    <div className="Category-top">
                        <span className={styles.CategoryTitle}>{`礼品${index+1}`}</span>
                        {this.renderBlockHeader(index)}
                    </div>

                    <div className="Category-body">
                        <FormItem
                            className={styles.FormItemStyle}
                            labelCol={{span:0}}
                            wrapperCol={{span:24}}
                            validateStatus={info.stageAmount.validateStatus}
                            help={info.stageAmount.msg}>
                            <PriceInput
                                 addonBefore={this.state.maxCount == 1?'消费每满':'消费满'}
                                 value={{number: info.stageAmount.value}}
                                 onChange={(val) => this.handleStageAmountChange(val, index)}
                                 addonAfter='元'
                                 modal="float"
                            />

                        </FormItem>

                        <FormItem
                            validateStatus={info.giftNum.validateStatus}
                            help={info.giftNum.msg}>
                            <PriceInput
                                addonBefore="返券"
                                addonAfter="张"
                                modal="int"
                                value={{number: info.giftNum.value}}
                                onChange={(val)=>{this.handleCouponNumberChange(val, index);}} />
                        </FormItem>

                        <FormItem validateStatus={info.giftInfo.validateStatus}
                            help={info.giftInfo.msg}

                            >
                            <span className={styles.formLabel}>请选择礼品</span>
                            <TreeSelect className={styles.selectTree}
                                        treeData={this.state.giftTreeData}
                                        placeholder="请选择礼品"
                                         size='default'
                                        dropdownStyle={{ maxHeight: 400, overflowY: 'scroll' }}
                                        onChange={(value)=>{
                                            this.handleGiftChange(value, index);
                                        }}
                                        value={this.getGiftValue(index)}
                            />
                        </FormItem>
                        {
                            this.state.maxCount === 1?
                            <FormItem  className={styles.FormItemStyle}  labelCol={{span:0}}
                                       wrapperCol={{span:24}}
                                       validateStatus={info.giftMaxNum.validateStatus}
                                       help={info.giftMaxNum.msg}>
                               <PriceInput
                                   addonBefore="最多使用"
                                   addonAfter="张"
                                   modal="int"
                                   value={{number: info.giftMaxNum.value}}
                                   onChange={(val)=>{this.handleGiftMaxNumChange(val, index);}} />
                            </FormItem>:null
                        }

                        <FormItem
                            label="生效方式"
                            className={styles.FormItemStyle}
                            labelCol={{span:6}} wrapperCol={{span:17}}
                            >
                            <RadioGroup
                                value={info.giftValidType}
                                onChange={(val)=>this.handleValidateTypeChange(val,index)}>
                                {
                                    VALIDATE_TYPE.map((item, index)=> {
                                        return <Radio value={item.value} key={index}>{item.name}</Radio>
                                    })
                                }
                            </RadioGroup>
                        </FormItem>

                        {this.renderValidOptions(info,index)}
                    </div>

                </div>
            );
        });
    }

    //相对有效期 OR 固定有效期
    renderValidOptions(info, index){
        if(info.giftValidType === '0') {
            return (
                <div>
                    <FormItem label="相对有效期" className={styles.FormItemStyle}  labelCol={{span:6}}
                              wrapperCol={{span:18}}>
                        <Select size='default' value={
                            typeof this.state.infos[index].giftEffectiveTime.value =='object'?
                             '0':
                            `${this.state.infos[index].giftEffectiveTime.value}`
                        }
                                onChange={(val)=>{this.handleGiftEffectiveTimeChange(val, index)}}
                        >
                            {
                                SALE_CENTER_GIFT_EFFICT_TIME
                                    .map((item, index)=>{
                                        return (<Option value={item.value} key={index}>{item.label}</Option>);
                                    })
                            }
                        </Select>
                    </FormItem>


                    <FormItem
                        className={[styles.FormItemStyle,styles.priceInputSingle].join(' ')}
                        labelCol={{span:6}}
                        wrapperCol={{span:18}}
                        label={'有效天数'}
                        validateStatus={info.giftValidDays.validateStatus}
                        help={info.giftValidDays.msg}
                        >


                       <PriceInput
                           addonBefore=""
                           addonAfter="天"
                           modal="int"
                           value={{number: info.giftValidDays.value}}
                           onChange={(val)=>{this.handleGiftValidDaysChange(val, index);}} />
                    </FormItem>
                </div>
            );
        } else {
            let pickerProps = {
                showTime: true,
                format: "YYYY-MM-DD HH:mm:ss",
                onChange: (date, dateString)=>{
                    this.handleRangePickerChange(date, dateString, index);
                }
            };
            if(typeof info.giftEffectiveTime.value=='object'){
                pickerProps.value = info.giftEffectiveTime.value;
            }
            return (
                <FormItem label="固定有效期" className={styles.FormItemStyle}  labelCol={{span:6}}
                      wrapperCol={{span:18}}
                      required={true}
                      validateStatus={info.giftEffectiveTime.validateStatus}
                      help={info.giftEffectiveTime.msg}
                  >
                    <RangePicker {...pickerProps} />
                </FormItem>
            );
        }
    }

    //固定有效时间改变
    handleRangePickerChange(date, dateString, index){
        let _infos = this.state.infos;
        _infos[index].giftEffectiveTime.value = date;

        if(date === null || date === undefined) {
            _infos[index].giftEffectiveTime.validateStatus = 'error',
            _infos[index].giftEffectiveTime.msg = '请输入有效时间'
        }
        this.setState({
            infos: _infos
        }, ()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }
    //有效天数
    handleGiftValidDaysChange(val, index){
        let _infos = this.state.infos;
        _infos[index].giftValidDays.value = val.number;
        let _value = parseInt(val.number);
        if (_value > 0) {
            _infos[index].giftValidDays.validateStatus = 'success';
            _infos[index].giftValidDays.msg = null;
        } else {
            _infos[index].giftValidDays.validateStatus = 'error';
            _infos[index].giftValidDays.msg = "有效天数必须大于0";
        }
        this.setState({
            infos:_infos
        },()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }
    //相对有效时间改变
    handleGiftEffectiveTimeChange(val, index){
        let _infos = this.state.infos;
        _infos[index].giftEffectiveTime.value = val;
        this.setState({
            infos: _infos
        }, ()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        });

    }
    //类型改变
    handleValidateTypeChange(e, index){
        let _infos = this.state.infos;
        _infos[index].giftValidType = e.target.value;

        this.setState({
            infos: _infos
        }, ()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    getGiftValue(index){
        if (this.state.infos[index].giftInfo.giftItemID === null ||
            this.state.infos[index].giftInfo.giftName === null) {
                return null;
            }
        return [this.state.infos[index].giftInfo.giftItemID, this.state.infos[index].giftInfo.giftName].join(',');
    }

    handleGiftChange(value, index){
        if(value){
            const newValue = value.split(',');
            let _infos = this.state.infos;
            _infos[index].giftInfo.giftName = newValue[1];
            _infos[index].giftInfo.giftItemID = newValue[0];
            _infos[index].giftInfo.validateStatus = 'success';
            _infos[index].giftInfo.msg = null;
            this.setState({
                infos: _infos
            }, ()=>{
                this.props.onChange && this.props.onChange(this.state.infos);
            });

        }else{
            let _infos = this.state.infos;
            _infos[index].giftInfo.giftName = null;
            _infos[index].giftInfo.giftItemID = null;
            _infos[index].giftInfo.validateStatus = 'error';
            _infos[index].giftInfo.msg = "必须选择礼券";
            this.setState({
                infos: _infos
            }, ()=>{
                this.props.onChange && this.props.onChange(this.state.infos);
            });
        }

    }

    handleStageAmountChange(value, index){
        let _infos = this.state.infos;
        _infos[index].stageAmount.value = value.number;
        let _value = parseFloat(value.number);
        if (_value > 0) {
            _infos[index].stageAmount.validateStatus = 'success';
            _infos[index].stageAmount.msg = null;
        } else {
            _infos[index].stageAmount.validateStatus = 'error';
            _infos[index].stageAmount.msg = "消费金额必须大于0";
        }
        this.setState({
            infos:_infos
        }),()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        };
    }

    handleCouponNumberChange(value, index){
        //
        let _infos = this.state.infos;
        _infos[index].giftNum.value = value.number;

        let _value = parseInt(value.number);
        if (_value > 0) {
            _infos[index].giftNum.validateStatus = 'success';
            _infos[index].giftNum.msg = null;
        } else {
            _infos[index].giftNum.validateStatus = 'error';
            _infos[index].giftNum.msg = "返券数量必须大于等于1";
        }
        this.setState({
            infos:_infos
        },()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    handleGiftMaxNumChange(value, index){
        let _infos = this.state.infos;
        _infos[index].giftMaxNum.value = value.number;

        let _value = parseInt(value.number);
        if (_value > 0) {
            _infos[index].giftMaxNum.validateStatus = 'success';
            _infos[index].giftMaxNum.msg = null;
        } else {
            _infos[index].giftMaxNum.validateStatus = 'error';
            _infos[index].giftMaxNum.msg = "返券数量必须大于等于1";
        }
        this.setState({
            infos:_infos
        },()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    renderBlockHeader(index){
        let _length = this.state.infos.length;
        if(this.state.maxCount == 1){
            return null;
        }
        // 不是最后一个
        if(index === 0 && _length === 1){
            return (<span className="Category-add" onClick={this.add}>添加礼品</span>);
        }else if (index < _length - 1) {
            return null;
        }else if (index == _length-1 && _length == this.state.maxCount) {
            return (<span className="Category-add" onClick={() => this.remove(index)}>删除</span>)
        }else if (index == _length-1 && _length < this.state.maxCount) {
            return (
                <span>
                  <span className="Category-add" onClick={() => this.remove(index)}>删除</span>
                  <span className="Category-add" onClick={this.add}>添加礼品</span>
                </span>
            );
        }
    }
}

const mapStateToProps = (state)=> {
    return {
        promotionDetailInfo: state.promotionDetailInfo,
        user:state.user.toJS()
    };
};

const mapDispatchToProps = (dispatch)=> {
    return {
        setPromotionDetail: (opts)=> {
            dispatch(saleCenterSetPromotionDetailAC(opts));
        },

        fetchGiftListInfo: (opts)=>{
            dispatch(fetchGiftListInfoAC(opts));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ReturnGift));

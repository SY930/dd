

import React from 'react';
import {connect} from 'react-redux';

import { DatePicker, Radio ,Form, Select, TreeSelect  } from 'antd';
import styles from '../../SaleCenter/ActivityPage.less';
import PriceInput from '../../SaleCenter/common/PriceInput';
import {
    fetchGiftListInfoAC
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';
import _ from 'lodash';

if (process.env.__CLIENT__ === true) {
    require('../../../components/common/components.less');
}
const FormItem = Form.Item;
const Option = Select.Option;

import {saleCenterSetSpecialBasicInfoAC} from '../../../redux/actions/saleCenter/specialPromotion.action'
import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME
} from '../../../redux/actions/saleCenter/types';


const defaultData = {
    //礼品数量
    giftCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    //礼品ID和name
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'success',
        msg: null
    },
    //礼品生效时间
    giftEffectiveTime: {
        value: '0',
        validateStatus: 'success',
        msg: null
    },
    //礼品有效期
    giftValidDays: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },

    giftOdds: {
        value: '',
        validateStatus: 'success',
        msg: null,
    }
};

class AddGifts extends React.Component {

    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            giftTreeData:[],
            infos: this.props.value || [JSON.parse(JSON.stringify(defaultData))],
            maxCount: this.props.maxCount || 3,
        };

        this.renderItems = this.renderItems.bind(this);
        this.renderBlockHeader = this.renderBlockHeader.bind(this);
        this.handleGiftCountChange = this.handleGiftCountChange.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.getGiftValue = this.getGiftValue.bind(this);
        this.handleGiftChange = this.handleGiftChange.bind(this);
        this.handleGiftValidDaysChange = this.handleGiftValidDaysChange.bind(this);
        this.handleGiftEffectiveTimeChange = this.handleGiftEffectiveTimeChange.bind(this);
        this.proGiftTreeData = this.proGiftTreeData.bind(this);
    }

    componentDidMount(){

        // 第一次加载需将默认值传给父组件
        this.setState({
            infos:this.props.value || [JSON.parse(JSON.stringify(defaultData))],
        }, ()=>{
            if(this.props.value === null) {
                this.props.onChange && this.props.onChange(this.state.infos);
            }
        });

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

        if (this.props.value != nextProps.value){
            this.setState({
                infos:nextProps.value
            });
        }

        if(nextProps.promotionDetailInfo.getIn(["$giftInfo", "initialized"])){
            let giftInfo = nextProps.promotionDetailInfo.getIn(["$giftInfo", "data"]).toJS();

            this.setState({giftTreeData: this.proGiftTreeData(giftInfo)});
        }

    }
    proGiftTreeData(giftTypes){
        let _giftTypes = _.filter(giftTypes, giftItem => giftItem.giftType != 90);
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
        //当有人领取礼物后，礼物不可编辑，加蒙层
       let userCount=this.props.specialPromotion.toJS().$eventInfo.userCount;//当有人领取礼物后，礼物不可编辑，加蒙层
        return (
            <div className={styles.giftWrap}>
                {this.renderItems()}
                <div className={userCount>0?styles.opacitySet:null}></div>
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
                        {/*礼品名称*/}
                        <FormItem validateStatus={info.giftInfo.validateStatus}
                                  help={info.giftInfo.msg}
                                  className={styles.FormItemStyle}
                        >
                            <span className={styles.formLabel}>礼品名称</span>
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
                        {/*礼品个数*/}
                        <FormItem
                            className={styles.FormItemStyle}
                            labelCol={{span:0}}
                            wrapperCol={{span:24}}
                            validateStatus={info.giftCount.validateStatus}
                            help={info.giftCount.msg}>
                            <PriceInput
                                addonBefore={'礼品个数'}
                                value={{number: info.giftCount.value}}
                                onChange={(val) => this.handleGiftCountChange(val, index)}
                                addonAfter='个'
                                modal="int"
                            />

                        </FormItem>
                        {/*生效时间*/}
                        <FormItem className={[styles.FormItemStyle,styles.littleSelect].join(' ')} >
                            <span className={styles.formLabel}>生效时间</span>
                            <Select size='default' value={`${this.state.infos[index].giftEffectiveTime.value}`}
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
                        {/*有效天数*/}
                        <FormItem
                            className={styles.FormItemStyle}
                            validateStatus={info.giftValidDays.validateStatus}
                            help={info.giftValidDays.msg}
                        >
                            <PriceInput
                                addonBefore="有效天数"
                                addonAfter="天"
                                modal="int"
                                value={{number: info.giftValidDays.value}}
                                onChange={(val)=>{this.handleGiftValidDaysChange(val, index);}} />
                        </FormItem>
                        {/*中奖比率*/}
                        {
                            this.props.type == '20'?
                                (
                                    <FormItem
                                        className={styles.FormItemStyle}
                                        validateStatus={info.giftOdds.validateStatus}
                                        help={info.giftOdds.msg}
                                    >
                                        <PriceInput
                                            addonBefore="中奖比率"
                                            addonAfter="%"
                                            modal="float"
                                            value={{number: info.giftOdds.value}}
                                            onChange={(val)=>{this.handleGiftOddsChange(val, index);}} />
                                    </FormItem>
                                ):null
                        }

                    </div>

                </div>
            );
        });
    }

    handleGiftOddsChange(val, index){
        let _infos = this.state.infos;
        _infos[index].giftOdds.value = val.number;
        let _value = parseFloat(val.number);
        if (_value > 0 && _value <= 100) {
            _infos[index].giftOdds.validateStatus = 'success';
            _infos[index].giftOdds.msg = null;
        } else {
            _infos[index].giftOdds.validateStatus = 'error';
            _infos[index].giftOdds.msg = "中奖比率必须在0~100之间";
        }
        this.setState({
            infos:_infos
        },()=>{
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

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

    handleGiftEffectiveTimeChange(val, index){
        let _infos = this.state.infos;
        _infos[index].giftEffectiveTime.value = val;
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

        } else {
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

    handleGiftCountChange(value, index){
        let _infos = this.state.infos;
        _infos[index].giftCount.value = value.number;
        let _value = parseFloat(value.number);
        if (_value > 0 && _value < 6) {
            _infos[index].giftCount.validateStatus = 'success';
            _infos[index].giftCount.msg = null;
        } else {
            _infos[index].giftCount.validateStatus = 'error';
            _infos[index].giftCount.msg = "品个数必须是1-5之间的值";
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
        promotionDetailInfo:state.promotionDetailInfo,
        specialPromotion: state.specialPromotion,
        user:state.user.toJS()
    };
};

const mapDispatchToProps = (dispatch)=> {
    return {
        setSpecialBasicInfo:(opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchGiftListInfo: (opts)=>{
            dispatch(fetchGiftListInfoAC(opts));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddGifts));

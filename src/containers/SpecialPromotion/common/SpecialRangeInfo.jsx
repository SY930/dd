import React from 'react'
import {Input, Form, Checkbox, Radio, Select,Row} from 'antd';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import { connect } from 'react-redux'

import styles from '../../SaleCenter/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import {WrappedAdvancedTimeSetting} from '../../SaleCenter/common/AdvancedTimeSetting';
import PriceInput from '../../../containers/SaleCenter/common/PriceInput';

import {
    saleCenterSetSpecialBasicInfoAC
} from '../../../redux/actions/saleCenter/specialPromotion.action'
import {fetchSpecialCardLevel} from '../../../redux/actions/saleCenter/mySpecialActivities.action'
var Immutable = require("immutable");

const FormItem = Form.Item;

class SpecialRangeInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            cardInfo:[],
            joinRange:[],
            joinCount:'0',
            rewardOnly: 1,          //是否用于打赏
            deductPoints: 0,        //扣减积分数
            sendPoints: 0,          //赠送积分数
            countCycleDays:0,       //参与周期
            partInTimes:0,          //最大参与次数
            partInTimesNoValid:0,     //最大参与次数(限制次数不限制周期使用)
            isVipBirthdayMonth:'0',   //是否本月生日才能使用
            cardLevelID:'0',           //会员等级
            maxPartInPerson:'',           //最大参与人数
            maxPartInPersonStatus: 'success'
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleJoinCountChange = this.handleJoinCountChange.bind(this); // radioChange
        this.handleJoinRangeChange = this.handleJoinRangeChange.bind(this); //checkBoxChange
        this.handleSelectChange = this.handleSelectChange.bind(this);       //会员等级change
        this.handleVipBirthdayMonthChange = this.handleVipBirthdayMonthChange.bind(this);
        this.onPartInTimesChange = this.onPartInTimesChange.bind(this);
        this.onCountCycleDaysChange = this.onCountCycleDaysChange.bind(this);
        this.onPartInTimesNoValidChange = this.onPartInTimesNoValidChange.bind(this);
        this.onSendPointsChange = this.onSendPointsChange.bind(this);
        this.onDeductPointsChange = this.onDeductPointsChange.bind(this);
        this.onMaxPartInPersonChange = this.onMaxPartInPersonChange.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.renderJoinRange = this.renderJoinRange.bind(this);
        this.renderJoinCount = this.renderJoinCount.bind(this);

    }

    componentDidMount() {
        let user = this.props.user;
        let opts = {
            _groupID: user.accountInfo.groupID,
            _role:user.accountInfo.roleType,
            _loginName:user.accountInfo.loginName,
            _groupLoginName:user.accountInfo.groupLoginName,
        };
        this.props.fetchSpecialCardLevel({
            data:opts
        });
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: this.handleSubmit,
            cancel: undefined
        });
        if(this.props.specialPromotion.get('$eventInfo').size > 20){
            let specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
            let joinRange = [],joinCount = '0',partInTimesNoValidName;
            //判断CheckBox的值

            if(specialPromotion.rewardOnly != '0'){
                joinRange.push('0');
            }
            if(parseFloat(specialPromotion.deductPoints) != '0'){
                joinRange.push('1');
            }
            if(parseFloat(specialPromotion.sendPoints) != '0'){
                joinRange.push('2');
            }
            //判断Radio的值
            if(specialPromotion.countCycleDays!= '0'){
                joinCount = '2';
                partInTimesNoValidName = 'partInTimes';
            }else if(specialPromotion.partInTimes!= '0'){
                joinCount = '1';
                partInTimesNoValidName = 'partInTimesNoValid';
            }
            this.setState({
                joinRange,
                joinCount,
                rewardOnly: specialPromotion.rewardOnly,          //是否用于打赏
                deductPoints: specialPromotion.deductPoints,        //扣减积分数
                sendPoints: specialPromotion. sendPoints,          //赠送积分数
                countCycleDays: specialPromotion.countCycleDays,       //参与周期
                [partInTimesNoValidName]: specialPromotion.partInTimes,          //最大参与次数
                isVipBirthdayMonth: `${specialPromotion.isVipBirthdayMonth}`,   //是否本月生日才能使用
                cardLevelID: specialPromotion.cardLevelID,           //会员等级
                maxPartInPerson:specialPromotion.maxPartInPerson

            })
        }


    };

    componentWillReceiveProps(nextProps) {
        // 是否更新
        if(this.props.specialPromotion.get('$eventInfo') != nextProps.specialPromotion.get('$eventInfo')&&
            nextProps.specialPromotion.get('$eventInfo').size > 20){
            let specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            let joinRange = [],joinCount = '0',partInTimesNoValidName;

            //判断CheckBox的值
            if(specialPromotion.rewardOnly != '0'){
                joinRange.push('0');
            }
            if(parseFloat(specialPromotion.deductPoints) != '0'){
                joinRange.push('1');
            }
            if(parseFloat(specialPromotion.sendPoints) != '0'){
                joinRange.push('2');
            }
            //判断Radio的值
            if(specialPromotion.countCycleDays!= '0'){
                joinCount = '2';
                partInTimesNoValidName = 'partInTimes';
            }else if(specialPromotion.partInTimes!= '0'){
                joinCount = '1';
                partInTimesNoValidName = 'partInTimesNoValid';
            }
            this.setState({
                joinRange,
                joinCount,
                rewardOnly: specialPromotion.rewardOnly,          //是否用于打赏
                deductPoints: specialPromotion.deductPoints,        //扣减积分数
                sendPoints: specialPromotion. sendPoints,          //赠送积分数
                countCycleDays: specialPromotion.countCycleDays,       //参与周期
                [partInTimesNoValidName]: specialPromotion.partInTimes,          //最大参与次数
                isVipBirthdayMonth: `${specialPromotion.isVipBirthdayMonth}`,   //是否本月生日才能使用
                cardLevelID: specialPromotion.cardLevelID,           //会员等级
                maxPartInPerson:specialPromotion.maxPartInPerson
            })

        }
        //获取会员等级信息
        if(nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data){
            if(nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo &&
                nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data &&
                nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data.groupCardTypeList){
                this.setState({
                    cardInfo:nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data.groupCardTypeList
                })
            }else{
                this.setState({
                    cardInfo:[]
                })
            }

        }

    };

    handleSubmit(){
        let {
            joinRange,
            joinCount,
            rewardOnly,          //是否用于打赏
            deductPoints,        //扣减积分数
            sendPoints,          //赠送积分数

            countCycleDays,       //参与周期
            partInTimes,          //最大参与次数
            partInTimesNoValid,   //最大参与次数
            isVipBirthdayMonth,   //是否本月生日才能使用
            cardLevelID,           //会员等级
            maxPartInPerson,           //参与人数
            maxPartInPersonStatus
        } = this.state;
        let opts = {
            rewardOnly,
            isVipBirthdayMonth,
            cardLevelID,
            maxPartInPerson
        };
        let nextFlag = true;
        if(this.props.type == '22' && (maxPartInPerson == '' || maxPartInPerson == null)){
            nextFlag =false;
            maxPartInPersonStatus = 'error';
            this.setState({maxPartInPersonStatus})
        }
        //由于redux里面存的可能是所有字段,所以修改的时候需要把之前设置过,现在要取消的东西初始化

        if(nextFlag){
            if(joinRange.indexOf('0') != -1){
                opts.rewardOnly = '1';
            }else{
                opts.rewardOnly = '0';
            }
            if(joinRange.indexOf('1') != -1){
                opts.deductPoints = deductPoints;
            }else{
                opts.deductPoints = '0';
            }
            if(joinRange.indexOf('2') != -1){
                opts.sendPoints = sendPoints;
            }else{
                opts.sendPoints = '0';
            }
            if(joinCount == '2'){
                opts.countCycleDays = countCycleDays;
                opts.partInTimes = partInTimes;
            }
            if(joinCount == '1'){
                opts.countCycleDays = '0';
                opts.partInTimes = partInTimesNoValid;
            }
            if(joinCount == '0'){
                opts.countCycleDays = '0';
                opts.partInTimes = '0';
            }
            this.props.setSpecialBasicInfo(opts);
        }
        return nextFlag;
    }


    //参与范围
    renderJoinRange(){
        const options = [
            { label: '仅用于打赏活动', value: '0' },
            { label: '参与活动扣积分', value: '1' },
            { label: '参与活动赠积分', value: '2' },
        ];
        const optionTwo = [
            { label: '参与活动扣积分', value: '1' },
            { label: '参与活动赠积分', value: '2' },
        ];
        return (
            <div>
                <FormItem label="参与范围" className={styles.noPadding}  labelCol={{span:4}}
                          wrapperCol={{span:20}}>
                </FormItem>
                <FormItem label="" className={styles.noPadding}
                          wrapperCol={{span:17,offset:4}} >
                    <CheckboxGroup options={this.props.type == '30' || this.props.type == '22'? optionTwo:options} value={this.state.joinRange} onChange={this.handleJoinRangeChange} />
                    <div className={styles.deduct}>
                        <PriceInput addonBefore={'扣除积分'}
                                    addonAfter={'分'}
                                    disabled={this.state.joinRange.indexOf('1') === -1}
                                    value={{number:this.state.deductPoints}}
                                    defaultValue = {{number:this.state.deductPoints}}
                                    onChange = {this.onDeductPointsChange}
                        />
                    </div>
                    <div className={styles.add}>
                        <PriceInput addonBefore={'赠送积分'}
                                    addonAfter={'分'}
                                    disabled={this.state.joinRange.indexOf('2') === -1}
                                    value={{number:this.state.sendPoints}}
                                    defaultValue = {{number:this.state.sendPoints}}
                                    onChange = {this.onSendPointsChange}
                        />
                    </div>
                </FormItem>
            </div>
        );
    }

    renderJoinCount(){
        const radioStyle = {
            display: 'block',
            height: '32px',
            lineHeight: '32px',
        };
        return (
            <div>
                <FormItem label="参与次数" className={styles.noPadding}  labelCol={{span:4}}
                          wrapperCol={{span:20}}>
                </FormItem>
                <FormItem label="" className={styles.noPadding}
                          wrapperCol={{span:17,offset:4}} >
                    <RadioGroup value={this.state.joinCount} onChange={this.handleJoinCountChange}>
                        <Radio style={radioStyle} value={'0'}>不限次数</Radio>
                        <Radio style={radioStyle} value={'1'}>限制次数</Radio>
                        <div className={styles.priceWrapper}>
                            <PriceInput addonBefore={'可参与'}
                                        addonAfter={'次'}
                                        disabled={this.state.joinCount.indexOf('1') === -1}
                                        value={{number:this.state.partInTimesNoValid}}
                                        defaultValue = {{number:this.state.partInTimesNoValid}}
                                        onChange = {this.onPartInTimesNoValidChange}
                            />
                        </div>
                        <Radio style={radioStyle} value={'2'}>限制参与次数的周期</Radio>
                        <div className={styles.addTwo}>
                            <div style={{width:'70%',display:'inline-block'}}>
                                <PriceInput addonBefore={'同一用户'}
                                            addonAfter={'天,可参与'}
                                            disabled={this.state.joinCount.indexOf('2') === -1}
                                            value={{number:this.state.countCycleDays}}
                                            defaultValue = {{number:this.state.countCycleDays}}
                                            onChange = {this.onCountCycleDaysChange}
                                />
                            </div>

                            <div style={{width:'30%',display:'inline-block',position: 'relative', left: '-1px'}}>
                                <PriceInput addonBefore={''}
                                            addonAfter={'次'}
                                            disabled={this.state.joinCount.indexOf('2') === -1}
                                            value={{number:this.state.partInTimes}}
                                            defaultValue = {{number:this.state.partInTimes}}
                                            onChange = {this.onPartInTimesChange}
                                />
                            </div>

                        </div>
                    </RadioGroup>
                </FormItem>
            </div>
        );
    }
    //会员等级Option
    renderOptions(){

        let cardInfo = this.state.cardInfo;
        let options = [
            <Option key={`-1`} value={'-1'}>不限</Option>,
            <Option key={`0`} value={'0'}>全部会员</Option>
        ];
        options = options.concat(cardInfo.map((cardType) =>{
            return cardType.cardTypeLevelList.map((card, index) =>{
                return (
                    <Option key={`${index+1}`} value={card.cardLevelID}>{`${cardType.cardTypeName} - ${card.cardLevelName}`}</Option>
                )
            })
        }));
        return options;
    }

    onPartInTimesChange(value){
        this.setState({
            partInTimes: value.number
        })
    }
    onPartInTimesNoValidChange(value){
        this.setState({
            partInTimesNoValid: value.number
        })
    }

    onCountCycleDaysChange(value){
        this.setState({
            countCycleDays: value.number
        })
    }

    onSendPointsChange(value){
        this.setState({
            sendPoints: value.number
        })
    }

    onDeductPointsChange(value){
        this.setState({
            deductPoints: value.number
        })
    }

    onMaxPartInPersonChange(value){
        if(value.number == '' || value.number ==null){
            this.setState({
                maxPartInPerson: value.number,
                maxPartInPersonStatus: 'error'
            })
        }else{
            this.setState({
                maxPartInPerson: value.number,
                maxPartInPersonStatus: 'success'
            })
        }

    }

    handleSelectChange(val){
        this.setState({
            cardLevelID: val
        })
    }
    handleJoinRangeChange(val){
        this.setState({
            joinRange:val
        });
    }

    handleJoinCountChange(e){
        this.setState({
            joinCount:e.target.value
        });
    }
    handleVipBirthdayMonthChange(e){
        this.setState({
            isVipBirthdayMonth:e.target.value
        });
    }
    render(){
        return (
            <Form>
                {this.renderJoinRange()}
                {this.renderJoinCount()}

                <FormItem label="顾客范围" className={styles.FormItemStyle} labelCol={{span:4}}
                          wrapperCol={{span:17}} >
                    <Select  size="default" value={this.state.cardLevelID} onChange={this.handleSelectChange}>
                        {this.renderOptions()}
                    </Select>
                </FormItem>

                <FormItem label="其他限制" className={styles.noPadding}
                          wrapperCol={{span:17}} labelCol={{span:4}}>
                    <RadioGroup onChange={this.handleVipBirthdayMonthChange} value={this.state.isVipBirthdayMonth}>
                        <Radio value={'0'}>不限制</Radio>
                        <Radio value={'1'}>仅限本月生日的会员参与</Radio>
                    </RadioGroup>
                </FormItem>

                {
                    this.props.type == '22'?

                        <FormItem label="最大报名人数" className={styles.noPadding}
                                  wrapperCol={{span:17}} labelCol={{span:4}}
                                  validateStatus={this.state.maxPartInPersonStatus}
                                  help={this.state.maxPartInPersonStatus == 'success'?null:'请输入最大报名人数'}>
                            <PriceInput addonBefore={''}
                                        addonAfter={''}
                                        modal="int"
                                        placeholder = '请输入最大报名人数'
                                        value={{number:this.state.maxPartInPerson}}
                                        defaultValue = {{number:this.state.maxPartInPerson}}
                                        onChange = {this.onMaxPartInPersonChange}
                            />
                        </FormItem>
                        :null
                }

            </Form>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        promotionBasicInfo:state.sale_old_promotionBasicInfo,
        saleCenter: state.sale_old_saleCenter,
        user:state.user.toJS(),
        specialPromotion: state.sale_old_specialPromotion,
        mySpecialActivities: state.sale_old_mySpecialActivities.toJS()
    }
};

const mapDispatchToProps = (dispatch) =>{
    return {
        setSpecialBasicInfo:(opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchSpecialCardLevel:(opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(SpecialRangeInfo));

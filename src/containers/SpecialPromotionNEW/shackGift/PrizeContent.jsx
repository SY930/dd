import style from './LotteryThirdStep.less'
import { DatePicker, Radio, Form, Select, Input, Icon, Checkbox } from 'antd';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import ExpandTree from '../common/ExpandTree';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const VALIDATE_TYPE = Object.freeze([{
    key: 0, value: '1', name: '相对有效期',
},
{ key: 1, value: '2', name: '固定有效期' }]);
import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME,
    SALE_CENTER_GIFT_EFFICT_DAY,
} from '../../../redux/actions/saleCenterNEW/types';
export default class PrizeContent extends React.Component {
    getGiftValue = (index) => {
        const { info, filteredGiftInfo, handleGiftChange } = this.props;
        const tempArr = _.sortBy(filteredGiftInfo, 'index');
        if (info.giveCouponXXXXX.value.giftInfo.giftItemID == null ||
            info.giveCouponXXXXX.value.giftInfo.giftName == null) {
                if(tempArr.length){
                    handleGiftChange([tempArr[0].crmGifts[0].giftItemID, tempArr[0].crmGifts[0].giftName].join(','),index);
                    return[tempArr[0].crmGifts[0].giftItemID, tempArr[0].crmGifts[0].giftName].join(',');
                }
                return null;
        }
        return [info.giveCouponXXXXX.value.giftInfo.giftItemID, info.giveCouponXXXXX.value.giftInfo.giftName].join(',');
    }
    ChangeCheckBoxOne = (e) => {
        const { handleGivePointsXXXXXChange, index} =this.props;
        handleGivePointsXXXXXChange(e, index);
    }
    ChangeCheckBoxTwo = (e) => {
        const { handleGiveCouponXXXXXChange, index} =this.props;
        handleGiveCouponXXXXXChange(e, index);
    }
    getCardTypeValue = (index) => {
        const { cardTypeArr, info, handleCardXXXXXChange, } = this.props;
        if(info.givePointsXXXXX.value.cardXXXXX.value){
            return info.givePointsXXXXX.value.cardXXXXX.value;
        }
        if(cardTypeArr.length){
            handleCardXXXXXChange(cardTypeArr[0].cardTypeID, index);
            return cardTypeArr[0].cardTypeID
        }
        return '';
    }
    // 相对有效期 OR 固定有效期
    renderValidOptions = (info, index) => {
        const { handleGiftValidDaysChange, handleDependTypeXXXXXChange, handleGiftEffectiveTimeChange, handleRangePickerChange  } =this.props;
        const a = info.giveCouponXXXXX.value.giftValidDays.value 
        if (info.giveCouponXXXXX.value.effectType != '2') {
            return (
                <div>
                    <FormItem
                        wrapperCol={{ span: 12 }}
                        className={style.FormItemSecondStyle}
                        validateStatus={info.giveCouponXXXXX.value.giftValidDays.validateStatus}
                        help={info.giveCouponXXXXX.value.giftValidDays.msg}
                    > 
                        <PriceInput
                            addonBefore=""
                            addonAfter="天"
                            maxNum={10}
                            modal="int"
                            value={{ number: info.giveCouponXXXXX.value.giftValidDays.value }}
                            onChange={(val) => {handleGiftValidDaysChange(val, index); }}
                        />
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 12 }}
                        className={style.FormItemSecondStyle}
                        validateStatus={info.giveCouponXXXXX.value.giftEffectiveTime.validateStatus}
                        help={info.giveCouponXXXXX.value.giftEffectiveTime.msg}
                    > 
                        <div className={style.labelSecondDiv}>
                            <span>生效时间</span>
                        </div>
                        <Select 
                            className={style.LittleSelect}
                            size="default"
                            value={info.giveCouponXXXXX.value.dependTypeXXXXX == '1' ? '1' : '3'}
                            onChange={(val) => {handleDependTypeXXXXXChange(val, index); }}
                        >
                            <Option value='1' key={1}>按小时</Option>
                            <Option value='3' key={3}>按天</Option>
                        </Select>
                        <Select
                            size="default"
                            className={style.middleSelect}
                            value={
                                typeof info.giveCouponXXXXX.value.giftEffectiveTime.value === 'object' ?
                                    '0' :
                                    `${info.giveCouponXXXXX.value.giftEffectiveTime.value}`
                            }
                            onChange={(val) => { handleGiftEffectiveTimeChange(val, index) }}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                (info.giveCouponXXXXX.value.dependTypeXXXXX == '1' ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY)
                                    .map((item, index) => {
                                        return (<Option value={item.value} key={index}>{item.label}</Option>);
                                    })
                            }
                        </Select> 
                    </FormItem>
                </div>
            );
        }
        const pickerProps = {
            showTime: false,
            format: 'YYYY-MM-DD',
            onChange: (date, dateString) => {
                handleRangePickerChange(date, dateString, index);
            },
        };
        if (typeof info.giveCouponXXXXX.value.giftEffectiveTime.value === 'object') {
            pickerProps.value = info.giveCouponXXXXX.value.giftEffectiveTime.value;
        }
        const disabledDate = (current) => {
            // Can not select days before today
            return current && current.format('YYYYMMDD') < this.props.specialPromotion.getIn(['$eventInfo', 'eventStartDate']);
        }
        return (
            <FormItem
                wrapperCol={{ span: 12 }}
                className={style.FormItemSecondStyle}
                required={true}
                validateStatus={info.giveCouponXXXXX.value.giftEffectiveTime.validateStatus}
                help={info.giveCouponXXXXX.value.giftEffectiveTime.msg}
            >   
                <div className={style.labelSecondDiv}>
                    <span>固定有效期</span>
                </div> 
                <RangePicker
                    {...pickerProps}
                    disabledDate={this.props.type == '70' ? disabledDate : null}
                />
            </FormItem>
        );
    }
    render () {
        const { 
                info, 
                filteredGiftInfo, 
                handleGiftChange, 
                index, 
                toggleFun, 
                changeDisArr,
                handleGiftCountChange,
                handleValidateTypeChange,
                handleGiftOddsChange,
                disArr,
                handleGivePointsValueXXXXXChange,
                cardTypeArr,
                handleCardXXXXXChange,
        } = this.props;
        let addonBefore = '礼品总数:';
        return (
            <div className = {style.formDiv}>
                    <Form className={style.addGrade} key={index}>
                        <div className={style.CategoryBody}>
                            <div className={style.paleRed}>
                                {/* 中奖比率 */}
                                <FormItem
                                    wrapperCol={{ span: 6 }}
                                    className={style.FormItemStyle}
                                    validateStatus={info.giftOdds.validateStatus}
                                    help={info.giftOdds.msg}
                                > 
                                    <div className={style.labelDiv}>
                                        <span className={style.requiredIcon}>*</span>
                                        <span>中奖概率</span>
                                    </div> 
                                    <PriceInput
                                        className={style.giftOdds}
                                        addonAfter="%"
                                        modal="float"
                                        value={{ number: info.giftOdds.value }}
                                        onChange={(val) => {handleGiftOddsChange(val, index);}}
                                    />
                                </FormItem>
                            </div>
                            {/* 赠送积分 */}
                            <FormItem
                                wrapperCol={{ span: 24 }}
                                className={style.noLabelFormItemStyle}
                                validateStatus={info.givePointsXXXXX.validateStatus}
                                help={info.givePointsXXXXX.msg}
                            >  
                                <Checkbox 
                                    checked={JSON.stringify(info.givePointsXXXXX.value) == "{}" ? false : true}
                                    onChange={this.ChangeCheckBoxOne}
                                />
                                <span>赠送积分</span>
                                {JSON.stringify(info.givePointsXXXXX.value) == "{}" ?
                                    null :  
                                    <div className={style.paleRed}>
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={info.givePointsXXXXX.value.givePointsValueXXXXX.validateStatus}
                                            help={info.givePointsXXXXX.value.givePointsValueXXXXX.msg}
                                        > 
                                            <div className={style.labelSecondDiv}>
                                                <span>赠送积分</span>
                                            </div> 
                                            <PriceInput
                                                addonAfter="积分"
                                                modal="float"
                                                value={{ number: info.givePointsXXXXX.value.givePointsValueXXXXX.value }}
                                                onChange={(val) => {handleGivePointsValueXXXXXChange(val, index);}}
                                            />
                                        </FormItem>
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={info.givePointsXXXXX.value.cardXXXXX.validateStatus}
                                            help={info.givePointsXXXXX.value.cardXXXXX.msg}
                                        > 
                                            <div className={style.labelSecondDiv}>
                                                <span>充值到会员卡</span>
                                            </div> 
                                            <Select
                                                showSearch={true}
                                                value={this.getCardTypeValue(index)}
                                                onChange={(val) => {handleCardXXXXXChange(val, index)}}
                                            >
                                                {
                                                    cardTypeArr.map((value) => {
                                                        return (
                                                            <Option key={value.cardTypeID} value={value.cardTypeID}>{value.cardTypeName}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                    </div>   
                                }
                            </FormItem>
                            {/* 赠送优惠券 */}
                            <FormItem
                                wrapperCol={{ span: 24 }}
                                className={style.noLabelFormItemStyle}
                                validateStatus={info.giveCouponXXXXX.validateStatus}
                                help={info.giveCouponXXXXX.msg}
                            >  
                                <Checkbox 
                                    checked={info.giveCouponXXXXX.value.isOn}
                                    onChange={this.ChangeCheckBoxTwo}
                                />
                                <span>赠送优惠券</span>
                                {!(info.giveCouponXXXXX.value.isOn) ?
                                    null :  
                                    <div className={style.paleRed}>
                                        {/* 优惠券名称 */}
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={info.giveCouponXXXXX.value.giftInfo.validateStatus}
                                            help={info.giveCouponXXXXX.value.giftInfo.msg}
                                        > 
                                            <div className={style.labelSecondDiv}>
                                                <span>优惠券名称</span>
                                            </div> 
                                            <ExpandTree
                                                idx={index}
                                                value={this.getGiftValue(index)}
                                                //debugger 这里没有值默认选第一个的逻辑应该在确认数据之后写
                                                data={_.sortBy(filteredGiftInfo, 'index')}
                                                onChange={(value) => {
                                                    handleGiftChange(value, index);
                                                }}
                                                onClick={(value,index) => {
                                                    changeDisArr(value,index);
                                                }}
                                                disArr={disArr || []}
                                            >
                                                <Input
                                                    value={(this.getGiftValue(index) || '').split(',')[1]}
                                                    className="input_click"
                                                    onClick={() => { toggleFun(index); }}
                                                />
                                                <Icon
                                                    type="down"
                                                    style={{ position: 'absolute', top: 10, left: 252 }}
                                                    className="input_click"
                                                    onClick={() => { toggleFun(index); }}
                                                />
                                            </ExpandTree>
                                        </FormItem>
                                        {/* 礼品个数 */}
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={info.giveCouponXXXXX.value.giftCount.validateStatus}
                                            help={info.giveCouponXXXXX.value.giftCount.msg}
                                        > 
                                            <div className={style.labelSecondDiv}>
                                                <span>礼品数量</span>
                                            </div> 
                                            <PriceInput
                                                addonBefore={addonBefore}
                                                maxNum={10}
                                                value={{ number: info.giveCouponXXXXX.value.giftCount.value }}
                                                onChange={val => handleGiftCountChange(val, index)}
                                                addonAfter="张"
                                                modal="int"
                                            />
                                        </FormItem>
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                        > 
                                            <div className={style.labelSecondDiv}>
                                                <span>有效期限</span>
                                            </div> 
                                            <RadioGroup
                                                className={style.radioMargin}
                                                value={info.giveCouponXXXXX.value.effectType == '2' ? '2' : '1'}
                                                onChange={val => handleValidateTypeChange(val, index)}
                                            >
                                                {
                                                    VALIDATE_TYPE.map((item, index) => {
                                                        return <Radio value={item.value} key={index}>{item.name}</Radio>
                                                    })
                                                }
                                            </RadioGroup>
                                        </FormItem>
                                        {this.renderValidOptions(info, index)}
                                    </div>   
                                }
                            </FormItem>
                            {/* ....... */}                       
                            {/* ....... */}

                        </div>

                    </Form>
            </div>
        )
    }
}
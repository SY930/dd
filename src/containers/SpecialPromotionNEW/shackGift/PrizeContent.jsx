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
export default class PrizeContent extends React.Component {
    getGiftValue = (index) => {
        const { info } = this.props;
        if (info.giveCouponXXXXX.value.giftInfo.giftItemID === null ||
            info.giveCouponXXXXX.value.giftInfo.giftName === null) {
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
    getCardTypeValue = () => {
        const { cardTypeArr, info } = this.props;
        if(info.givePointsXXXXX.value.cardXXXXX.value){
            return info.givePointsXXXXX.value.cardXXXXX.value;
        }
        if(cardTypeArr.length){
            return cardTypeArr[0].cardTypeID
        }
        return '';
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
        let validateStatus = info.giveCouponXXXXX.value.giftCount.validateStatus;
        let addonBefore = '礼品总数:';
        let help = info.giveCouponXXXXX.value.giftCount.msg;
        let valueNuber = info.giveCouponXXXXX.value.giftCount.value;
        let onChangeFunc = handleGiftCountChange;
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
                                                value={this.getCardTypeValue()}
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
                                {info.giveCouponXXXXX.value.isOn ?
                                    null :  
                                    <div className={style.paleRed}>
                                        {/* 礼品名称 */}
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={info.giveCouponXXXXX.value.giftInfo.validateStatus}
                                            help={info.giveCouponXXXXX.value.giftInfo.msg}
                                        > 
                                            <div className={style.labelSecondDiv}>
                                                <span>礼品名称</span>
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
                                                    style={{ position: 'absolute', top: 10, left: 265 }}
                                                    className="input_click"
                                                    onClick={() => { toggleFun(index); }}
                                                />
                                            </ExpandTree>
                                        </FormItem>
                                        {/* 礼品个数 */}
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={validateStatus}
                                            help={help}
                                        > 
                                            <div className={style.labelSecondDiv}>
                                                <span>礼品数量</span>
                                            </div> 
                                            <PriceInput
                                                addonBefore={addonBefore}
                                                maxNum={10}
                                                value={{ number: valueNuber }}
                                                onChange={val => onChangeFunc(val, index)}
                                                addonAfter="张"
                                                modal="int"
                                            />
                                        </FormItem>
                                    </div>   
                                }
                            </FormItem>
                            {/* ....... */}
                            <FormItem
                                className={style.FormItemStyle}
                            >
                                <span className={style.formLabel}>生效方式:</span>
                                <RadioGroup
                                    className={style.radioMargin}
                                    value={info.effectType == '2' ? '2' : '1'}
                                    onChange={val => handleValidateTypeChange(val, index)}
                                >
                                    {
                                        VALIDATE_TYPE.map((item, index) => {
                                            return <Radio value={item.value} key={index}>{item.name}</Radio>
                                        })
                                    }
                                </RadioGroup>
                            </FormItem>
                            {/* 有效期这里先注掉看效果 */}
                            {/* {this.renderValidOptions(info, index)} */}
                            {/* ....... */}

                        </div>

                    </Form>
            </div>
        )
    }
}
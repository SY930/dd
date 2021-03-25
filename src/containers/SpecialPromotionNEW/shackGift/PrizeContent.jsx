import style from './LotteryThirdStep.less'
import { DatePicker, Radio, Form, Select, Input, Icon, Checkbox, Row, Col } from 'antd';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import CropperUploader from 'components/common/CropperUploader'
import ExpandTree from '../common/ExpandTree';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const RangePicker = DatePicker.RangePicker;
import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME,
    SALE_CENTER_GIFT_EFFICT_DAY,
} from '../../../redux/actions/saleCenterNEW/types';

import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import { SALE_STRING } from 'i18n/common/salecenter';
import TicketBag from '../../BasicModules/TicketBag';

@injectIntl
export default class PrizeContent extends React.Component {
    constructor(props) {
        super(props);
        this.VALIDATE_TYPE = Object.freeze([{
            key: 0, value: '1', name: `${this.props.intl.formatMessage(STRING_SPE.d142vrmqvc0114)}`,
        },
        { key: 1, value: '2', name: `${this.props.intl.formatMessage(STRING_SPE.d7h7ge7d1001237)}` }]);
        this.state = {
            typeValue: '0',
            item: {},
            bag: '',
        }
    }
    componentWillReceiveProps(np) {
        if (np.info.giveCoupon.value.item) {
            const { typeValue: tv } = this.state;
            const { typeValue, item = {} } = np.info.giveCoupon.value;
            this.setState({ typeValue, bag: [item] });
            if (!typeValue) {
                this.setState({ typeValue: tv });
            }
        }
    }
    getGiftValue = (index) => {
        const { info, filteredGiftInfo, handleGiftChange } = this.props;
        const tempArr = _.sortBy(filteredGiftInfo, 'index');
        if (info.giveCoupon.value.giftInfo.giftItemID == null ||
            info.giveCoupon.value.giftInfo.giftName == null) {
            if (tempArr.length) {
                handleGiftChange([tempArr[0].crmGifts[0].giftItemID, tempArr[0].crmGifts[0].giftName].join(','), index);
                return [tempArr[0].crmGifts[0].giftItemID, tempArr[0].crmGifts[0].giftName].join(',');
            }
            return null;
        }
        return [info.giveCoupon.value.giftInfo.giftItemID, info.giveCoupon.value.giftInfo.giftName].join(',');
    }
    ChangeCheckBoxOne = (e) => {
        const { handleGivePointsChange, index } = this.props;
        handleGivePointsChange(e, index);
    }
    ChangeCheckBoxTwo = (e) => {
        const { handleGiveCouponChange, index } = this.props;
        handleGiveCouponChange(e, index);
    }
    ChangeCheckBoxThree = (e) => {
        const { handleGiveRedPacketChange, index } = this.props;
        handleGiveRedPacketChange(e, index);
    }
    getCardTypeValue = (index) => {
        const { cardTypeArr, info, handleCardChange, } = this.props;
        if (info.givePoints.value.card.value) {
            return info.givePoints.value.card.value;
        }
        if (cardTypeArr.length) {
            handleCardChange(cardTypeArr[0].cardTypeID, index);
            return cardTypeArr[0].cardTypeID
        }
        return '';
    }
    // 相对有效期 OR 固定有效期
    renderValidOptions = (info, index) => {
        const { handleGiftValidDaysChange, handleDependTypeChange, handleGiftEffectiveTimeChange, handleRangePickerChange } = this.props;
        const a = info.giveCoupon.value.giftValidDays.value
        if (info.giveCoupon.value.effectType != '2') {
            return (
                <div>
                    <FormItem
                        // wrapperCol={{ span: 12 }}
                        className={style.FormItemSecondStyle}
                        validateStatus={info.giveCoupon.value.giftValidDays.validateStatus}
                        help={info.giveCoupon.value.giftValidDays.msg}
                    >
                        <div className={style.labelSecondDiv}>
                            <span>有效天数</span>
                        </div>
                        <PriceInput
                            addonAfter={this.props.intl.formatMessage(STRING_SPE.d1kgda4ea3a2945)}
                            maxNum={5}
                            modal="int"
                            value={{ number: info.giveCoupon.value.giftValidDays.value }}
                            onChange={(val) => { handleGiftValidDaysChange(val, index); }}
                        />
                    </FormItem>
                    <FormItem
                        // wrapperCol={{ span: 12 }}
                        className={style.FormItemSecondStyle}
                        validateStatus={info.giveCoupon.value.giftEffectiveTime.validateStatus}
                        help={info.giveCoupon.value.giftEffectiveTime.msg}
                    >
                        <div className={style.labelSecondDiv}>
                            <span>{this.props.intl.formatMessage(STRING_SPE.d21647400695b034)}</span>
                        </div>
                        <Select
                            className={style.LittleSelect}
                            size="default"
                            value={info.giveCoupon.value.dependType == '1' ? '1' : '3'}
                            onChange={(val) => { handleDependTypeChange(val, index); }}
                        >
                            <Option value='1' key={1}>{this.props.intl.formatMessage(STRING_SPE.d1qe2ar9n925113)}</Option>
                            <Option value='3' key={3}>{this.props.intl.formatMessage(STRING_SPE.d1e04rqggt261)}</Option>
                        </Select>
                        <Select
                            size="default"
                            className={style.middleSelect}
                            value={
                                typeof info.giveCoupon.value.giftEffectiveTime.value === 'object' ?
                                    '0' :
                                    `${info.giveCoupon.value.giftEffectiveTime.value}`
                            }
                            onChange={(val) => { handleGiftEffectiveTimeChange(val, index) }}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                (info.giveCoupon.value.dependType == '1' ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY)
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
        if (typeof info.giveCoupon.value.giftEffectiveTime.value === 'object') {
            pickerProps.value = info.giveCoupon.value.giftEffectiveTime.value;
        }
        const disabledDate = (current) => {
            // Can not select days before today
            return current && current.format('YYYYMMDD') < this.props.specialPromotion.getIn(['$eventInfo', 'eventStartDate']);
        }
        return (
            <FormItem
                wrapperCol={{ span: 24 }}
                className={style.FormItemSecondStyle}
                required={true}
                validateStatus={info.giveCoupon.value.giftEffectiveTime.validateStatus}
                help={info.giveCoupon.value.giftEffectiveTime.msg}
            >
                <div className={style.labelSecondDiv}>
                    <span>{this.props.intl.formatMessage(STRING_SPE.d7h7ge7d1001237)}</span>
                </div>
                <RangePicker
                    {...pickerProps}
                    disabledDate={this.props.type == '70' ? disabledDate : null}
                />
            </FormItem>
        );
    }
    onTypeChange = ({ target }) => {
        this.setState({ typeValue: target.value });
        const { onBagChange, index } = this.props;
        onBagChange(null, index);
    }
    onBagChange = (item) => {
        const { onBagChange, index } = this.props;
        onBagChange(item, index);
        if (item) {
            this.setState({ bag: [item] });
            return;
        }
        this.setState({ bag: null });
    }
    render() {
        const {
            info,
            filteredGiftInfo,
            handleGiftChange,
            index,
            toggleFun,
            changeDisArr,
            handleGiftCountChange,
            handleGiftTotalCountChange,
            handleValidateTypeChange,
            handleGiftOddsChange,
            handleGiftImgChange,
            disArr,
            handleGivePointsValueChange,
            handleGiveRedPacketValueChange,
            handleGiveRedPacketIDChange,
            handleShareImgChangne,
            handleShareTitleChange,
            cardTypeArr,
            redPacketArr,
            handleCardChange,
            disabled,
            groupID,
        } = this.props;
        const { typeValue, bag } = this.state;
        return (
            <div style={{ position: 'relative' }}>
                {
                    disabled && <div className={style.disabledModal}></div>
                }
                <div className={style.formDiv}>
                    <Form className={style.addGrade} key={index}>
                        <div className={style.CategoryBody}>
                            {/* 奖品图片 giftConfImagePath */}
                            <FormItem
                                label="奖品图片"
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <Row>
                                    <Col span={6} >
                                        <CropperUploader
                                            className={style.uploadCom}
                                            width={120}
                                            height={110}
                                            cropperRatio={200 / 200}
                                            limit={2048}
                                            allowedType={['image/png', 'image/jpeg']}
                                            value={info.giftConfImagePath.value}
                                            uploadTest='上传图片'
                                            onChange={value => handleGiftImgChange(value, index)}
                                        />
                                    </Col>
                                    <Col span={18} className={style.grayFontPic} >
                                        <p style={{ position: 'relative', top: 20, left: 70, }}>图片建议尺寸200*200像素<br />支持格式jpg、png，大小不超过2M</p>
                                    </Col>
                                </Row>
                            </FormItem>
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
                                        <span>{this.props.intl.formatMessage(STRING_SPE.d21647400695b1248)}</span>
                                    </div>
                                    <PriceInput
                                        className={style.giftOdds}
                                        addonAfter="%"
                                        modal="float"
                                        maxNum={3}
                                        value={{ number: info.giftOdds.value }}
                                        onChange={(val) => { handleGiftOddsChange(val, index); }}
                                    />
                                </FormItem>
                            </div>
                            <div className={style.paleRed}>
                                {/* 奖品总数 */}
                                <FormItem
                                    wrapperCol={{ span: 6 }}
                                    className={style.FormItemStyle}
                                    validateStatus={info.giftTotalCount.validateStatus}
                                    help={info.giftTotalCount.msg}
                                >
                                    <div className={style.labelDiv}>
                                        <span className={style.requiredIcon}>*</span>
                                        <span>奖品总数</span>
                                    </div>
                                    <PriceInput
                                        className={style.giftOdds}
                                        addonAfter="份"
                                        // modal="float"
                                        maxNum={9}
                                        value={{ number: info.giftTotalCount.value }}
                                        onChange={(val) => { handleGiftTotalCountChange(val, index); }}
                                    />
                                </FormItem>
                            </div>
                            {/* 赠送积分 */}
                            <FormItem
                                style={{ padding: 0 }}
                                wrapperCol={{ span: 24 }}
                                className={style.noLabelFormItemStyle}
                                validateStatus={info.givePoints.validateStatus}
                                help={info.givePoints.msg}
                            >
                                <Checkbox
                                    checked={JSON.stringify(info.givePoints.value) == "{}" ? false : true}
                                    onChange={this.ChangeCheckBoxOne}
                                />
                                <span>{this.props.intl.formatMessage(STRING_SPE.dk46b2bc3b1333)}</span>
                                {JSON.stringify(info.givePoints.value) == "{}" ?
                                    null :
                                    <div className={style.paleRed}>
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={info.givePoints.value.givePointsValue.validateStatus}
                                            help={info.givePoints.value.givePointsValue.msg}
                                        >
                                            <div className={style.labelSecondDiv}>
                                                <span>{this.props.intl.formatMessage(STRING_SPE.dk46b2bc3b1333)}</span>
                                            </div>
                                            <PriceInput
                                                addonAfter={this.props.intl.formatMessage(STRING_SPE.d16hh3h4b8b2184)}
                                                modal="float"
                                                maxNum={6}
                                                value={{ number: info.givePoints.value.givePointsValue.value }}
                                                onChange={(val) => { handleGivePointsValueChange(val, index); }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={info.givePoints.value.card.validateStatus}
                                            help={info.givePoints.value.card.msg}
                                        >
                                            <div className={style.labelSecondDiv}>
                                                <span>{this.props.intl.formatMessage(STRING_SPE.d2b1c76536683246)}</span>
                                            </div>
                                            <Select
                                                showSearch={true}
                                                value={this.getCardTypeValue(index)}
                                                onChange={(val) => { handleCardChange(val, index) }}
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
                                style={{ padding: 0 }}
                                className={style.noLabelFormItemStyle}
                            >
                                <Checkbox
                                    checked={info.giveCoupon.value.isOn}
                                    onChange={this.ChangeCheckBoxTwo}
                                />
                                <span>{this.props.intl.formatMessage(STRING_SPE.dd5aa6c59a74233)}</span>
                                {!(info.giveCoupon.value.isOn) ?
                                    null :
                                    <div>
                                        <RadioGroup onChange={this.onTypeChange} value={typeValue} >
                                            <RadioButton value={'0'}>独立优惠券</RadioButton>
                                            <RadioButton value={'1'}>券包</RadioButton>
                                        </RadioGroup>
                                        {typeValue === '1' ?
                                            <TicketBag groupID={groupID} bag={bag} onChange={this.onBagChange} /> :
                                            <div className={style.giftBox}>
                                                {/* 优惠券名称 */}
                                                <FormItem
                                                    // wrapperCol={{ span: 12 }}
                                                    className={style.FormItemSecondStyle}
                                                    validateStatus={info.giveCoupon.value.giftInfo.validateStatus}
                                                    help={info.giveCoupon.value.giftInfo.msg}
                                                >
                                                    <div className={style.labelSecondDiv}>
                                                        <span>{this.props.intl.formatMessage(STRING_SPE.dojyd1ldi5200)}</span>
                                                    </div>
                                                    <ExpandTree
                                                        idx={index}
                                                        value={this.getGiftValue(index)}
                                                        // 这里没有值默认选第一个的逻辑应该在确认数据之后写
                                                        data={_.sortBy(filteredGiftInfo, 'index')}
                                                        onChange={(value) => {
                                                            handleGiftChange(value, index);
                                                        }}
                                                        onClick={(value, index) => {
                                                            changeDisArr(value, index);
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
                                                            style={{ position: 'absolute', top: 10, left: 280 }}
                                                            className="input_click"
                                                            onClick={() => { toggleFun(index); }}
                                                        />
                                                    </ExpandTree>
                                                </FormItem>
                                                {/* 礼品个数 */}
                                                <FormItem
                                                    // wrapperCol={{ span: 12 }}
                                                    className={style.FormItemSecondStyle}
                                                    validateStatus={info.giveCoupon.value.giftCount.validateStatus}
                                                    help={info.giveCoupon.value.giftCount.msg}
                                                >
                                                    <div className={style.labelSecondDiv}>
                                                        <span>礼品个数</span>
                                                    </div>
                                                    <PriceInput
                                                        maxNum={9}
                                                        disabled={true}
                                                        value={{ number: info.giveCoupon.value.giftCount.value || '1' }}
                                                        onChange={val => handleGiftCountChange(val, index)}
                                                        addonAfter={this.props.intl.formatMessage(SALE_STRING.k5f3y5ml)}
                                                        modal="int"
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    // wrapperCol={{ span: 12 }}
                                                    className={style.FormItemSecondStyle}
                                                >
                                                    <div className={style.labelSecondDiv}>
                                                        <span>{this.props.intl.formatMessage(STRING_SPE.d2c8gi45an648)}</span>
                                                    </div>
                                                    <RadioGroup
                                                        className={style.radioMargin}
                                                        value={info.giveCoupon.value.effectType == '2' ? '2' : '1'}
                                                        onChange={val => handleValidateTypeChange(val, index)}
                                                    >
                                                        {
                                                            this.VALIDATE_TYPE.map((item, index) => {
                                                                return <Radio value={item.value} key={index}>{item.name}</Radio>
                                                            })
                                                        }
                                                    </RadioGroup>
                                                </FormItem>
                                                {this.renderValidOptions(info, index)}
                                            </div>
                                        }
                                    </div>
                                }
                            </FormItem>
                            {/* 赠送红包 */}
                            <FormItem
                                style={{ padding: 0 }}
                                wrapperCol={{ span: 24 }}
                                className={style.noLabelFormItemStyle}
                            >
                                <Checkbox
                                    checked={info.giveRedPacket.isOn}
                                    onChange={this.ChangeCheckBoxThree}
                                />
                                <span>{this.props.intl.formatMessage(STRING_SPE.k6hk34239480)}</span>
                                {info.giveRedPacket.isOn ?
                                    <div className={style.paleRed}>
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={info.giveRedPacket.redPacketID.validateStatus}
                                            help={info.giveRedPacket.redPacketID.msg}
                                        >
                                            <div className={style.labelSecondDiv}>
                                                <span>{this.props.intl.formatMessage(STRING_SPE.k6hk34239480)}</span>
                                            </div>
                                            <Select
                                                value={info.giveRedPacket.redPacketID.value}
                                                onChange={(val) => { handleGiveRedPacketIDChange(val, index) }}
                                            >
                                                {
                                                    redPacketArr.map((item) => {
                                                        return (
                                                            <Option key={item.giftItemID} value={item.giftItemID}>{item.giftName}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                            className={style.FormItemSecondStyle}
                                            validateStatus={info.giveRedPacket.redPacketValue.validateStatus}
                                            help={info.giveRedPacket.redPacketValue.msg}
                                        >
                                            <div className={style.labelSecondDiv}>
                                                <span>{this.props.intl.formatMessage(STRING_SPE.k6hk34239sdgsfg)}</span>
                                            </div>
                                            <PriceInput
                                                addonAfter={this.props.intl.formatMessage(STRING_SPE.da8omhe07g2195)}
                                                modal="float"
                                                maxNum={3}
                                                value={{ number: info.giveRedPacket.redPacketValue.value }}
                                                onChange={(val) => { handleGiveRedPacketValueChange(val, index); }}
                                            />
                                        </FormItem>
                                    </div> : null
                                }
                            </FormItem>
                            <div className={style.separate}><h3 style={{ display: 'inline-block', marginLeft: 0 }}>分享设置</h3> <span>（仅支持自定义小程序分享文案和图片，H5为默认设置 ）</span></div>
                            {/* shareTitle */}
                            <FormItem
                                label="分享标题"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                // validateStatus={info.shareTitle.validateStatus}
                                // help={infoshareTitle.msg}
                            >
                                <Input
                                    value={info.shareTitle.value}
                                    onChange={(e) => { handleShareTitleChange(e, index); }}
                                />
                            </FormItem>
                            {/* 分享图片 shareImagePath */}
                            <FormItem
                                label="分享图片"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                // validateStatus={info.shareImagePath.validateStatus}
                                // help={info.shareImagePath.msg}
                            >
                                <Row>
                                    <Col span={6} >
                                        <CropperUploader
                                            className={style.uploadCom}
                                            width={120}
                                            height={110}
                                            cropperRatio={200 / 200}
                                            limit={2048}
                                            allowedType={['image/png', 'image/jpeg']}
                                            value={info.shareImagePath.value}
                                            uploadTest='上传图片'
                                            onChange={value => handleShareImgChangne(value, index)}
                                        />
                                    </Col>
                                    <Col span={18} className={style.grayFontPic} >
                                        <p style={{ position: 'relative', top: 20, left: 70, }}>小程序分享图<br />图片建议尺寸：1044*842<br />支持PNG、JPG格式，大小不超过2M</p>
                                    </Col>
                                </Row>
                            </FormItem>
                            {/* ....... */}
                            {/* ....... */}
                            {
                                info.giveCoupon.validateStatus === 'error' && (
                                    <div style={{ color: '#f04134', lineHeight: 1.5 }}>{info.giveCoupon.msg}</div>
                                )
                            }
                        </div>

                    </Form>
                </div>
            </div>

        )
    }
}

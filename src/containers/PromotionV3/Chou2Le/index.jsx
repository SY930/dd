import React, { PureComponent as Component } from 'react';
import { Modal, Steps, Button, message } from 'antd';
import { jumpPage, closePage } from '@hualala/platform-base';
import moment from 'moment';
import { getAccountInfo, getBrandList, putEvent, getEvent, postEvent, getShopList } from './AxiosFactory';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import style from 'components/basic/ProgressBar/ProgressBar.less';
import css from './style.less';
import { TF, DF, imgURI } from './Common';
import { getTicketList } from '../Camp/TicketBag/AxiosFactory';
import {isFilterShopType} from '../../../helpers/util'

const Step = Steps.Step;
class Chou2Le extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        current: 1,
        formData1: {},      // 第1步的表单原始数据，也是用来回显baseform的数据
        formData2: {},      // 第2步的表单原始数据
        formData3: {},      // 第3步的表单原始数据
        form: null,
        brandList: [],
        bagList: [],
        shops: [],
    };
    componentDidMount() {
        getBrandList().then(list => {
            this.setState({ brandList: list });
        });
        getShopList().then(list => {
            this.setState({ shops: list });
        });
        this.getEventDetail();
    }
    getEventDetail() {
        const { id } = this.props;
        if(id) {
            getEvent({ itemID: id }).then(obj => {
                const { data, gifts = [], timeList } = obj;
                const formData1 = this.setData4Step1(data, timeList);
                const formData2 = this.setData4Step2(data);
                this.setState({ formData1, formData2 });
                getTicketList({ couponPackageType: '2' }).then((obj) => {
                    const { list } = obj;
                    const formData3 = this.setData4Step3(data, gifts, list);
                    this.setState({ formData3 });
                });
            });

        }

    }
    // 回显需要重写整理的数据
    setData4Step1(data, times) {
        const { eventStartDate: sd, eventEndDate: ed, validCycle, smsGate: sms } = data;
        const eventRange = [moment(sd), moment(ed)];
        let timsObj = {};
        const TF = 'HH:mm';
        if(times) {
            const timeList = times.map(x => {
                const { startTime, endTime } = x;
                const st = moment(startTime, TF);
                const et = moment(endTime, TF);
                return { startTime: st, endTime: et };
            });
            timsObj = { timeList };
        }
        let cycleType = '';
        if(validCycle) {
            // 根据["w1", "w3", "w5"]获取第一个字符
            [cycleType] = validCycle[0];
        }
        return { ...data, eventRange, ...timsObj, smsGate: `${sms}`, advMore: true, cycleType };
    }
    setData4Step2(data) {
        const { brandList: blist, orderTypeList: olist, shopIDList: slist } = data;
        const brandList = blist ? blist.split(',') : [];
        const orderTypeList = olist ? olist.split(',') : [];
        const shopIDList = slist ? slist.map(x=>`${x}`) : [];
        return { brandList, orderTypeList , shopIDList };
    }
    setData4Step3(data, gifts, list) {
        const { consumeType: stype, userCount, consumeTotalAmount, launchSceneList = [{}] } = data;
        // 
        let [{sceneType = '2', eventID}] = launchSceneList
        const lottery = [];
        gifts.forEach((x, i) => {
            const { presentType, giftOdds, sortIndex, giftTotalCount} = x;
            const index = sortIndex - 1;
            const type = `${presentType}`;  // 组件要string类型的
            let newItem = { isPoint: false, isTicket: false, isCardVal: false, presentType: '1', giftList: [],  bagList: [], ...lottery[index] };
            if(presentType === 2) {   // 积分
                const { presentValue, cardTypeID = '' } = x;
                newItem = { ...newItem, presentValue, cardTypeID, isPoint: true };
            }
            // 券包
            if(presentType === 4) {
                const { giftID } = x;
                const bag = list.find(b=>b.couponPackageID === giftID);
                newItem = { ...newItem, bagList: [bag], isTicket: true, presentType: type };
            }
            if (presentType === 5) { // 卡值
                const { presentValue, cardTypeID = '' } = x;
                newItem = { ...newItem, cardValue: presentValue, cardValueTypeID: cardTypeID, isCardVal: true }; // 回显数据联调时改为后端回来的数据
            }
            // 礼品
            if(presentType === 1) {
                const newGiftList = newItem.giftList;
                const { effectType, effectTime, validUntilDate, giftEffectTimeHours: hours, giftID, ...others } = x;
                let rangeDate = [];
                if(effectTime) {
                    const st = moment(effectTime, DF);
                    const et = moment(validUntilDate, DF);
                    rangeDate = [ st, et ];
                }
                let countType = '0';
                let etype = effectType;
                if(effectType === 3) {
                    countType = '1';
                    etype = '1';
                }
                const giftList = [...newGiftList, {id: giftID, giftID, effectType: `${etype}`, giftEffectTimeHours: `${hours}`, countType, rangeDate, ...others }];
                newItem = { ...newItem, giftList, isTicket: true, presentType: type };
            }
            lottery[index] = { id: `${sortIndex}`, giftOdds,giftTotalCount, userCount, ...newItem };
        });
        // console.log('lottery', lottery);
        return { consumeType: `${stype}`, sceneType: `${sceneType}`, eventID, consumeTotalAmount, lottery };
    }
    /** 得到form, 根据step不同，获得对应的form对象 */
    onSetForm = (form) => {
        this.setState({ form });
    }
    /* 1-2表单 */
    onGoStep2 = () => {
        const { form } = this.state;
        form.validateFields((e, v) => {
            if (!e) {
                const {  validCycle, cycleType } = v;
                // console.log('vvv', v);
                // 根据周期类型删除曾选择的缓存垃圾数据
                let cycleObj = {};
                if(cycleType) {
                    const cycle = validCycle.filter(x => (x[0] === cycleType));
                    cycleObj = { validCycle: cycle };
                }
                const formData1 = { ...v, ...cycleObj };
                this.setState({ formData1 });
                this.onGoNext();
            }
        });
    }
    /* 2-3表单 */
    onGoStep3 = () => {
        const { form } = this.state;
        form.validateFields((e, v) => {
            if (!e) {
                this.setState({ formData2: v });
                this.onGoNext();
            }
        });
    }
    /* 3表单提交 */
    onGoDone = () => {
        const { form } = this.state;
        form.validateFields((e, v) => {
            if (!e) {
                const { lottery } = v;
                const isChecked = lottery.every(x=>{
                    return x.isPoint || x.isTicket || x.isCardVal;
                });
                if(!isChecked) {
                    message.error('赠送积分或优惠券或者赠送卡值，必选一项');
                    return;
                }
                const isGift = lottery.every(x=>{
                    if(x.isTicket && x.presentType === '1') {
                        return x.giftList.every(g=>{
                            if(g.effectType === '1'){
                                return g.giftID && g.giftCount && g.giftValidUntilDayCount;
                            } else {
                                return g.giftID && g.giftCount && g.rangeDate;
                            }
                        })
                    }
                    return true;
                });
                if(!isGift) {
                    message.error('礼品项必填');
                    return;
                }
                const isBag = lottery.every(x=>{
                    if(x.isTicket && x.presentType === '4') {
                        return x.bagList[0];
                    }
                    return true;
                });
                if(!isBag) {
                    message.error('券包项必选');
                    return;
                }
                const formData3 = this.setStep3Data(v);
                this.onSubmit(formData3);
            }
        });
    }
    onSubmit = (formData3) => {
        const { groupID } = getAccountInfo();
        const { formData1 } = this.state;
        const { id } = this.props;
        const { timeList, eventRange, ...others1 } = formData1;
        const newTimeList = this.formatTimeList(timeList);
        const newEventRange = this.formatEventRange(eventRange);
        const step2Data = this.setStep2Data();
        const { gifts, sceneType, ...others3 } = formData3;
        // 投放场景数据
        let {formData3: {eventID = ''}} = this.state
        let launchSceneList = [{groupID, eventID, sceneType}]

        const event = { ...others1, ...others3, ...newEventRange, ...step2Data, eventWay: '78', launchSceneList };
        if(id) {
            const itemID = id;
            const allData = { timeList: newTimeList, event: {...event, itemID}, gifts };
            postEvent(allData).then(x => {
                if(x) {
                    this.onToggle();
                    closePage();
                    jumpPage({ pageID: '1000076003'});
                }
            });
            return;
        }
        const allData = { timeList: newTimeList, event, gifts };
        putEvent({...allData}).then(x => {
            if(x) {
                this.onToggle();
                closePage();
                jumpPage({ pageID: '1000076003'});
            }
        })
    }
    // 提交前需要整理的数据
    setStep2Data() {
        const { formData2, shops } = this.state;
        let { brandList, orderTypeList, shopIDList } = formData2;
        const bList = brandList.join();
        const oList = orderTypeList.join();
        // "shopRange": 店铺范围 1：部分店铺 ,  2：全部店铺，后端需要的数据
        const shopRange = shopIDList[0] ? '1' : '2';
        // 授权门店过滤
        if(isFilterShopType('78')){
            shopIDList = shopIDList.filter((item) => shops.some(i => i.shopID == item))
        }
        return { brandList: bList, orderTypeList: oList, shopIDList, shopRange };
    }
    setStep3Data(formData) {
        const { lottery, consumeTotalAmount, consumeType, sceneType } = formData;
        const gifts = [];   // 后端要的专属key名
        lottery.forEach((x, i) => {
            const { giftOdds, isPoint, isTicket, presentType, isCardVal,giftTotalCount } = x;
            const sortIndex = i + 1;       // 后端要的排序
            const rawObj =  { sortIndex, giftOdds, giftTotalCount,presentType };    // 基础数据
            if(isPoint){
                const { presentValue, cardTypeID } = x;
                const obj = { ...rawObj, presentType: '2', presentValue, cardTypeID };
                gifts.push(obj);
            }
            if(isTicket){
                const { bagList, giftList } = x;
                // 1 独立优惠券，4 券包
                if(presentType === '1') {
                    giftList.forEach(x => {
                        const { rangeDate, countType, effectType: etype, giftTotalCount, ...others } = x;
                        const rangeObj = this.formatRangeDate(rangeDate);
                        let effectType = etype;
                        if(etype === '1' && countType === '1') {
                            effectType = '3';
                        }
                        const obj = { ...others, ...rawObj, ...rangeObj, effectType };
                        gifts.push(obj);
                    });
                } else {
                    bagList.forEach(x => {
                        const { couponPackageID } = x;
                        const obj = { ...rawObj, giftID: couponPackageID };
                        gifts.push(obj);
                    });
                }
            }
            if (isCardVal) {
                const { cardValue, cardValueTypeID } = x;
                const obj = { ...rawObj, presentType: '5', presentValue: cardValue, cardTypeID: cardValueTypeID }; // 联调时要改成后端要的数据
                gifts.push(obj);
            }
        });
        return { consumeTotalAmount, consumeType, sceneType, gifts };
    }
    formatTimeList(list) {
        if(!list){ return []}
        const times = [];
        list.forEach(x => {
            const { startTime, endTime } = x;
            if(startTime && endTime){
                const st = moment(startTime).format(TF);
                const et = moment(endTime).format(TF);
                times.push({ startTime: st, endTime: et })
            }
        });
        return times;
    }
    formatRangeDate(rangeDate) {
        if(!rangeDate){
            return {}
        }
        const [start, end] = rangeDate;
        const effectTime = start.format(DF);
        const validUntilDate = end.format(DF);
        return { effectTime, validUntilDate };
    }
    formatEventRange(eventRange) {
        const [sd, ed] = eventRange;
        const eventStartDate = moment(sd).format(DF);
        const eventEndDate = moment(ed).format(DF);
        return { eventStartDate, eventEndDate };
    }
    // formatExcludedDate(excludedDate) {
    //     if(!excludedDate){ return []}
    //     return excludedDate.map(x => {
    //         return moment(x).format(DF);
    //     });
    // }
    onToggle = () => {
        this.props.onToggle();
    }
    onGoNext = () => {
        this.setState(ps => ({ current: ps.current + 1 }));
        this.onSetForm(null);
    }
    onGoPrev = () => {
        const { current, form } = this.state;
        // 没保存就点上一步
        if(current === 2) {
            this.setState({
                formData2: form.getFieldsValue(),
            })
        }
        if(current === 3) {
            this.setState({
                formData3: form.getFieldsValue(),
            })
        }
        this.setState(ps => ({ current: ps.current - 1 }));
        this.onSetForm(null);
    }
    renderFooter(current) {
        const { view } = this.props;
        const btn0 = (<Button key="0" onClick={this.onToggle}>取消</Button>);
        const btn1 = (<Button key="1" type="primary" onClick={this.onGoPrev}>上一步</Button>);
        const btn2 = (<Button key="2" type="primary" onClick={this.onGoStep2}>下一步</Button>);
        const btn3 = (<Button key="3" type="primary" onClick={this.onGoStep3}>下一步</Button>);
        const btn4 = (<Button key="4" type="primary" onClick={this.onGoDone}>完成</Button>);
        const step1 = ([ btn0, btn2 ]);
        const step2 = ([ btn0, btn1, btn3 ]);
        let step3 = ([ btn0, btn1, btn4 ]);
        if(view) {
            step3 = ([ btn0, btn1 ]);   // 查看模式无完成功能
        }
        return { 1: step1, 2: step2, 3: step3 }[current];
    }
    render() {
        const { current, formData1, formData2, formData3, form } = this.state;
        const { brandList } = this.state;
        const footer = this.renderFooter(current);
        return (
            <Modal
                title="下单抽抽乐"
                visible={true}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={this.onToggle}
                footer={footer}
                width={1000}
            >
                <ul className={css.mainBox}>
                    <li className={css.left}>
                        <h3 className={css.logo}>下单抽抽乐</h3>
                        <p className={css.gray}>下单后抽取礼品，促进下次消费</p>
                        {current === 3 ?
                            <dl className={css.desc}>
                                <dt>活动说明：</dt>
                                <dd>1. 同一活动时间，同一门店有多个下单抽抽乐活动，活动会执行哪个？</dd>
                                <dd className={css.gray}>优先执行顺序：执行场景为配置【适用业务】的活动>配置【活动时段】的活动>配置【活动周期】的活动>配置【活动日期】的活动。</dd>
                                <dd>2. 活动使用注意事项：如果奖品不希望被抽中，则可以设置中奖概率为0.如果用户一定要抽中任一产品，则可以设置奖品总计中奖概率为100%。</dd>
                            </dl> :
                            <img src={imgURI + "basicdoc/30c95df1-04bf-4b67-b1f1-0a650d8a311b.png"} width="80%" />
                        }
                    </li>
                    <li className={css.right}>
                        <div className={css.stepBox}>
                            <Steps current={current-1} className={style.ProgressBar}>
                                <Step title="基本信息" />
                                <Step title="活动范围" />
                                <Step title="活动内容" />
                            </Steps>
                        </div>
                        {current === 1 &&
                            <Step1
                                form={form}
                                getForm={this.onSetForm}
                                formData={formData1}
                            />
                        }
                        {current === 2 &&
                            <Step2
                                form={form}
                                getForm={this.onSetForm}
                                formData={formData2}
                                brandList={brandList}
                            />
                        }
                        {current === 3 &&
                            <Step3
                                form={form}
                                getForm={this.onSetForm}
                                formData={formData3}
                            />
                        }
                    </li>
                </ul>
            </Modal>
        )
    }
}
export default Chou2Le

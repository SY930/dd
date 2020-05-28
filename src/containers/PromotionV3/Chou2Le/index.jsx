import React, { PureComponent as Component } from 'react';
import { Modal, Steps, Button } from 'antd';
import moment from 'moment';
import { getBrandList, putEvent, getEvent } from './AxiosFactory';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import style from 'components/basic/ProgressBar/ProgressBar.less';
import css from './style.less';
import { TF, DF } from './Common';

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
    };
    componentDidMount() {
        getBrandList().then(list => {
            this.setState({ brandList: list });
        });
        this.getEventDetail();
    }
    getEventDetail() {
        const { id } = this.props;
        if(id) {
            getEvent({ itemID: id }).then(obj => {
                const { data, gifts, timeList } = obj;
                const newStep1 = this.setData4Step1(data, timeList);
                const newStep2 = this.setData4Step2(data);
                const newLottery = this.setData4Step3(gifts);
                const formData3 = { ...data, lottery: newLottery };
                this.setState({ formData1: newStep1, formData2: newStep2, formData3 });
            });
        }

    }
    // 回显需要重写整理的数据
    setData4Step1(data, times) {
        const { eventStartDate: sd, eventEndDate: ed, validCycle } = data;
        const eventRange = [moment(sd), moment(ed)];
        let timsObj = {};
        if(times) {
            const timeList = times.map(x => {
                const { startTime, endTime } = x;
                const st = moment(startTime);
                const et = moment(endTime);
                return { startTime: st, endTime: et };
            });
            timsObj = { timeList, advMore: true };
        }
        let cycleType = '';
        if(validCycle) {
            // 根据["w1", "w3", "w5"]获取第一个字符
            [cycleType] = validCycle[0];
        }
        return { ...data, eventRange, ...timsObj, cycleType };
    }
    setData4Step2(data) {
        const { brandList: blist, orderTypeList: olist, shopIDList: slist } = data;
        const brandList = blist ? blist.split(',') : [];
        const orderTypeList = olist ? olist.split(',') : [];
        const shopIDList = slist ? slist.map(x=>`${x}`) : [];
        return { brandList, orderTypeList , shopIDList };
    }
    setData4Step3(gifts) {
        const lottery = [];
        gifts.forEach((x, i) => {
            const idx = i + 1;
            if(idx === x.sortIndex) {
                let [pointObj, ticketObj] = [{},{}];
                const { presentType, giftOdds } = x;
                const id = x.itemID;
                if(presentType === 2) {   // 积分
                    const { presentValue, cardTypeID } = x;
                    pointObj = { presentValue, cardTypeID, isPoint: true };
                }
                // 券包 和 礼品
                if([1, 4].includes(presentType)) {
                    const type = `${presentType}`;  // 组件要string类型的
                    ticketObj = { ...x, isTicket: true, presentType: type };
                }
                const allGift = { id, giftOdds, ...pointObj, ...ticketObj };
                lottery.push(allGift);
            }
        });
        console.log('lottery', lottery);
        return lottery;
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
                const formData3 = this.setStep3Data(v);
                this.onSubmit(formData3);
            }
        });
    }
    onSubmit = (formData3) => {
        const { formData1 } = this.state;
        const { timeList, eventRange, excludedDate, ...others1 } = formData1;
        const newTimeList = this.formatTimeList(timeList);
        const newEventRange = this.formatEventRange(eventRange);
        const newExcludedDate = this.formatExcludedDate(excludedDate);
        const step2Data = this.setStep2Data();
        const { gifts, ...others3 } = formData3;
        const event = { ...others1, ...others3, ...newEventRange,
            excludedDate: newExcludedDate, ...step2Data, eventWay: '78' };
        const allData = { timeList: newTimeList, event, gifts };
        console.log('allData', allData);
        putEvent({...allData}).then(x => {
            if(x) {
                this.onToggle();
            }
        })
    }
    // 提交前需要整理的数据
    setStep2Data() {
        const { formData2 } = this.state;
        const { brandList, orderTypeList, shopIDList } = formData2;
        const bList = brandList.join();
        const oList = orderTypeList.join();
        // "shopRange": 店铺范围 1：部分店铺 ,  2：全部店铺，后端需要的数据
        const shopRange = shopIDList[0] ? '1' : '2';
        return { brandList: bList, orderTypeList: oList, shopIDList, shopRange };
    }
    setStep3Data(formData) {
        const { lottery, consumeTotalAmount, consumeType } = formData;
        const gifts = [];   // 后端要的专属key名
        lottery.forEach((x, i) => {
            const { giftOdds, isPoint, isTicket, presentType } = x;
            const sortIndex = i + 1;       // 后端要的排序
            const rawObj =  { sortIndex, giftOdds, presentType };    // 基础数据
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
                        const obj = { ...rawObj, ...x };
                        gifts.push(obj);
                    });
                } else {
                    bagList.forEach(x => {
                        const obj = { ...rawObj, ...x };
                        gifts.push(obj);
                    });
                }
            }
        });
        return { consumeTotalAmount, consumeType, gifts };
    }
    formatTimeList(list) {
        if(!list){ return []}
        return list.map(x => {
            const { startTime, endTime } = x;
            const st = moment(startTime).format(TF);
            const et = moment(endTime).format(TF);
            return { startTime: st, endTime: et };
        });
    }
    formatEventRange(eventRange) {
        const [sd, ed] = eventRange;
        const eventStartDate = moment(sd).format(DF);
        const eventEndDate = moment(ed).format(DF);
        return { eventStartDate, eventEndDate };
    }
    formatExcludedDate(excludedDate) {
        if(!excludedDate){ return []}
        return excludedDate.map(x => {
            return moment(x).format(DF);
        });
    }
    onToggle = () => {
        this.props.onToggle();
    }
    onGoNext = () => {
        this.setState(ps => ({ current: ps.current + 1 }));
        this.onSetForm(null);
    }
    onGoPrev = () => {
        this.setState(ps => ({ current: ps.current - 1 }));
        this.onSetForm(null);
    }
    renderFooter(current) {
        const btn0 = (<Button key="0" onClick={this.onToggle}>取消</Button>);
        const btn1 = (<Button key="1" type="primary" onClick={this.onGoPrev}>上一步</Button>);
        const btn2 = (<Button key="2" type="primary" onClick={this.onGoStep2}>下一步</Button>);
        const btn3 = (<Button key="3" type="primary" onClick={this.onGoStep3}>下一步</Button>);
        const btn4 = (<Button key="4" type="primary" onClick={this.onGoDone}>完成</Button>);
        const step1 = ([ btn0, btn2 ]);
        const step2 = ([ btn0, btn1, btn3 ]);
        const step3 = ([ btn0, btn1, btn4 ]);
        return { 1: step1, 2: step2, 3: step3 }[current];
    }
    render() {
        const { current, formData1, formData2, formData3, form } = this.state;
        const { brandList } = this.state;
        const footer = this.renderFooter(current);
        return (
            <Modal
                title="新建下单抽抽乐"
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
                        <dl className={css.desc}>
                            <dt>活动说明：</dt>
                            <dd>1. 同一活动时间，同一门店有多个下单抽抽乐活动，活动会执行哪个？</dd>
                            <dd className={css.gray}>优先执行顺序：执行场景为配置【适用业务】的活动>配置【活动时段】的活动>配置【活动周期】的活动>配置【活动日期】的活动。</dd>
                            <dd>2. 活动使用注意事项：如果奖品不希望被抽中，则可以设置中奖概率为0.如果用户一定要抽中任一产品，则可以设置奖品总计中奖概率为100%。</dd>
                        </dl>
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
                                formData={{}}
                            />
                        }
                    </li>
                </ul>
            </Modal>
        )
    }
}
export default Chou2Le

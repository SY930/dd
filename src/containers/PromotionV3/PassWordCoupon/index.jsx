import React, { PureComponent as Component } from 'react';
import { Modal, Steps, Button, message } from 'antd';
import { jumpPage, closePage } from '@hualala/platform-base';
import moment from 'moment';
import { getBrandList, putEvent, getEvent, postEvent, getGroupCardTypeList, getWechatMpList, getSettleList } from './AxiosFactory';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import style from 'components/basic/ProgressBar/ProgressBar.less';
import css from './style.less';
import { TF, DF, imgURI } from './Common';

const Step = Steps.Step;
class PassWordCoupon extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        current: 1,
        formData1: {},      // 第1步的表单原始数据，也是用来回显baseform的数据
        formData2: {},      // 第2步的表单原始数据
        formData3: {},      // 第3步的表单原始数据
        form: null,
        groupCardTypeList: [],
        mpList: [],
        settleUnitInfoList: [],
        authLicenseData: {},
    };
    componentDidMount() {
        getGroupCardTypeList().then(list => {
            this.setState({ groupCardTypeList: list });
        })
        getWechatMpList().then(list => {
            this.setState({ mpList: list });
        })
        getSettleList().then(list => {
            this.setState({ settleUnitInfoList: list });
        })

        this.getEventDetail();
    }

    getEventDetail() {
        const { id } = this.props;
        if(id) {
            getEvent({ itemID: id }).then(obj => {
                const { data, gifts = [] } = obj;
                const formData1 = this.setData4Step1(data);
                const formData2 = this.setData4Step2(data);
                this.setState({ formData1, formData2 });
                const formData3 = this.setData4Step3(data, gifts);
                this.setState({ formData3 });
            });
        }
    }
    
    /***
     * 回显数据
     */
    setData4Step1(data) {
        let { eventStartDate: sd, eventEndDate: ed, smsGate } = data;
        const eventRange = [moment(sd), moment(ed)];
        smsGate = `${smsGate}`
        
        return { ...data, eventRange, smsGate };
    }

    setData4Step2(data) {
        let { mpIDList, presentValue, settleUnitID, countCycleDays, partInTimes, defaultCardType, autoRegister ,userCount} = data;
        // 参与条件
        let presentValue1 = 0;
        let presentValue2 = 0;
        settleUnitID = ''
        
        // 参与次数
        let joinCount = {}
        if(partInTimes == '0' && countCycleDays == '0'){
            joinCount = {
                joinCount: '0'
            }
        }else if(partInTimes != '0' && countCycleDays == '0'){
            joinCount = {
                joinCount: '1',
                partInTimesNoValid: partInTimes
            }
        }else{
            joinCount = {
                joinCount: '2',
                partInTimes,
                countCycleDays
            }
        }
        return { mpIDList, presentValue1, presentValue2, settleUnitID: (settleUnitID | 0), joinCount, defaultCardType, autoRegister: `${autoRegister}`,userCount };
    }
    setData4Step3(data, gifts) {
        const { eventImagePath, shareTitle, shareSubtitle, shareImagePath, restaurantShareImagePath, userCount} = data;

        // let needShow = gifts.some(item => item.needShow > 0) ? 1 : 0
        // this.setState({needShow})

        const lottery = [];
        gifts.forEach((x, i) => {
            const { presentType, participateMark, sortIndex,giftTotalCount } = x;
            const index = sortIndex - 1;
            const type = `${presentType}`;  // 组件要string类型的
            let newItem = { presentType: '1', giftList: [],  bagList: [], ...lottery[index] };
            if(presentType === 2) {   // 积分
                const { presentValue, cardTypeID = '', ...others } = x;
                newItem = { ...others, ...newItem, presentValue, cardTypeID };
            }
            // 礼品
            if(presentType === 1) {
                const newGiftList = newItem.giftList;
                const { effectType, effectTime, validUntilDate, giftEffectTimeHours: hours, giftID, ...others } = x;
                let rangeDate = [];
                if(effectTime) {
                    const st = effectTime != '0' ? moment(effectTime, DF) : moment(new Date());
                    const et = validUntilDate != '0' ? moment(validUntilDate, DF) : moment(new Date());
                    rangeDate = [ st, et ];
                }
                let countType = '0';
                let etype = effectType;
                if(effectType === 3) {
                    countType = '1';
                    etype = '1';
                }
                const giftList = [...newGiftList, { ...others, id: giftID, giftID, effectType: `${etype}`, giftEffectTimeHours: `${hours}`, countType, rangeDate }];
                newItem = { ...newItem, giftList, presentType: type };
            }
            lottery[index] = { id: `${sortIndex}`, participateMark, giftTotalCount,userCount, ...newItem };
        });

        // 明盒礼品
        // let openLottery = {};
        // gifts.filter(item => item.needShow > 0).forEach((x, i) => {
        //     const { presentType, sortIndex } = x;
        //     const type = `${presentType}`;  // 组件要string类型的
        //     let newItem = { isPoint: false, isTicket: false, presentType: '1', giftList: [], ...openLottery};
        //     if(presentType == 2) {   // 积分
        //         const { presentValue, ...others } = x;
        //         newItem = { ...others, ...newItem, presentValue, isPoint: true };
        //     }
        //     // 礼品
        //     if(presentType === 1) {
        //         const newGiftList = newItem.giftList;
        //         const { effectType, effectTime, validUntilDate, giftEffectTimeHours: hours, giftID, ...others } = x;
        //         let rangeDate = [];
        //         if(effectTime) {
        //             const st = effectTime != '0' ? moment(effectTime, DF) : moment(new Date());
        //             const et = validUntilDate != '0' ? moment(validUntilDate, DF) : moment(new Date());
        //             rangeDate = [ st, et ];
        //         }
        //         let countType = '0';
        //         let etype = effectType;
        //         if(effectType === 3) {
        //             countType = '1';
        //             etype = '1';
        //         }
        //         const giftList = [...newGiftList, {...others, id: giftID, giftID, effectType: `${etype}`, giftEffectTimeHours: `${hours}`, countType, rangeDate }];
        //         newItem = { ...newItem, giftList, isTicket: true, presentType: type };
        //     }
        //     openLottery = { id: `${sortIndex}`, userCount, ...newItem };
        // });

        // const defVal = { id: '1', presentValue: '',  presentType: '1', giftList: [{ id: '001', effectType: '1' }] };
        // openLottery = JSON.stringify(openLottery) == '{}' ? defVal : openLottery

        // const defaultShareTitle = 'duang!被一个盲盒砸中，看你手气了~';
        // let shareInfo = { type: '83', shareTitle: shareTitle || defaultShareTitle, shareSubtitle, restaurantShareImagePath, shareImagePath }
        return { lottery,userCount };
    }

    /***
     * 各步骤表单验证及数据获取
     */
    /* 1-2表单 */
    onGoStep2 = () => {
        const { form } = this.state;
        form.validateFields((e, v) => {
            if (!e) {
                const formData1 = { ...v };
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

    /* 第3步表单提交数据 */
    onGoDone = () => {
        const { form, formData2 } = this.state;
        const { defaultCardType } = formData2;
        form.validateFields((e, v) => {
            if (!e) {
                const { lottery } = v;
                const isGift = lottery.every(x=>{
                    if(x.presentType === '1') {
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
                const formData3 = this.setStep3Data(v);
                this.onSubmit(formData3);
            }
        });
    }

    // 提交
    onSubmit = (formData3) => {
        const { formData1 } = this.state;
        const { id } = this.props;
        const { eventRange, ...others1, } = formData1;
        const newEventRange = this.formatEventRange(eventRange);
        const step2Data = this.setStep2Data();
        const { gifts, ...others3,} = formData3;
        let event = { ...others1, ...others3, ...newEventRange, ...step2Data, eventWay: '83' };
        if(id) {
            const itemID = id;
            const allData = { event: {...event, itemID}, gifts };
            postEvent(allData).then(x => {
                if(x) {
                    this.onToggle();
                    closePage();
                    jumpPage({ pageID: '1000076003'});
                }
            });
            return;
        }
        const allData = { event, gifts };
        putEvent({...allData}).then(x => {
            if(x) {
                this.onToggle();
                closePage();
                jumpPage({ pageID: '1000076003'});
            }
        })
    }

    // 提交前数据
    setStep2Data() {
        const { formData2 } = this.state;
        const { mpIDList, presentValue1, presentValue2, settleUnitID, joinCount, defaultCardType, autoRegister } = formData2;
        // 参与条件
        let parm = {}
        // 参与次数
        let partInTimes = 0;
        let countCycleDays = 0;
        if(joinCount.joinCount == '0'){
            partInTimes = 0;
            countCycleDays = 0;
        }else if(joinCount.joinCount == '1'){
            partInTimes = joinCount.partInTimesNoValid;
            countCycleDays = 0;
        }else{
            partInTimes = joinCount.partInTimes;
            countCycleDays = joinCount.countCycleDays;
        }
        
        return { ...parm, partInTimes, autoRegister,countCycleDays, defaultCardType };
    }

    setStep3Data(formData) {
        let {formData2} = this.state
        // 注册卡类项  加入到积分礼品项中
        let { lottery } = formData;
        const gifts = [];   // 后端要的专属key名
        lottery.forEach((x, i) => {
            const { participateMark, giftTotalCount, presentType, giftList, ...others } = x;
            const sortIndex = i + 1;  
            const rawObj =  { sortIndex, participateMark, giftTotalCount,presentType };    // 基础数据

            if(presentType === '1') {
                giftList.forEach(x => {
                    const { rangeDate, countType, effectType: etype, giftTotalCount, ...others } = x;
                    const rangeObj = this.formatRangeDate(rangeDate);
                    let {effectTime, validUntilDate} = rangeObj
                    let effectType = etype;
                    if(etype === '1' && countType === '1') {
                        effectType = '3';
                    }
                    if(etype != '2'){
                        effectTime = '0'; 
                        validUntilDate = '0';
                    }
                    const obj = { ...others, ...rawObj, ...rangeObj, effectType, effectTime, validUntilDate, countType };
                    gifts.push(obj);
                });
            }
        });
        
        return { gifts };
    }

    // 
    formatRangeDate(rangeDate) {
        if(!rangeDate){
            return {}
        }
        const [start, end] = rangeDate;
        const effectTime = start.format(DF) || '0';
        const validUntilDate = end.format(DF) || '0';
        return { effectTime, validUntilDate };
    }

    formatEventRange(eventRange) {
        const [sd, ed] = eventRange;
        const eventStartDate = moment(sd).format(DF);
        const eventEndDate = moment(ed).format(DF);
        return { eventStartDate, eventEndDate };
    }

    // getNeedShow = (key) => {
    //     this.setState({needShow: key})
    // }
    
    /** 得到form, 根据step不同，获得对应的form对象 */
    onSetForm = (form) => {
        this.setState({ form });
    }
    
    onToggle = () => {
        this.props.onToggle();
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

    onGoNext = () => {
        this.setState(ps => ({ current: ps.current + 1 }));
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
        const { current, formData1, formData2, formData3, form,userCount } = this.state;
        const { groupCardTypeList, mpList, settleUnitInfoList } = this.state;
        const footer = this.renderFooter(current);
        return (
            <Modal
                title="口令领券"
                visible={true}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={this.onToggle}
                footer={footer}
                width={1000}
            >
                <ul className={css.mainBox}>
                    <li className={css.left}>
                        <h3 className={css.logo}>口令领券</h3>
                        <p className={css.gray}>用户输入口令密码后，可获得一张优惠券，同一个用户每个口令每天仅可以参与一次</p>
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
                                authLicenseData={this.state.authLicenseData}
                            />
                        }
                        {current === 2 &&
                            <Step2
                                form={form}
                                getForm={this.onSetForm}
                                formData={formData2}
                                groupCardTypeList={groupCardTypeList}
                                mpList={mpList}
                                settleUnitInfoList={settleUnitInfoList}
                            />
                        }
                        {current === 3 &&
                            <Step3
                                form={form}
                                getForm={this.onSetForm}
                                formData={formData3}
                                // userCount={userCount}
                                // getNeedShow={this.getNeedShow}
                            />
                        }
                    </li>
                </ul>
            </Modal>
        )
    }
}
export default PassWordCoupon
import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Steps, Button, message } from 'antd';
import { jumpPage, closePage } from '@hualala/platform-base';
import moment from 'moment';
import { getBrandList, putEvent, getEvent, postEvent, getGroupCardTypeList, getWechatMpList, getSettleList, getSceneList } from './AxiosFactory';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import {
    fetchFoodMenuInfoLightAC, fetchFoodCategoryInfoLightAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action'
import { isHuaTian } from '../../../constants/projectHuatianConf';
import style from 'components/basic/ProgressBar/ProgressBar.less';
import css from './style.less';

const Step = Steps.Step;
class ManyFace extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        current: 1,
        formData1: {}, // 第1步的表单原始数据，也是用来回显baseform的数据
        formData2: {}, // 第2步的表单原始数据
        formData3: {}, // 第3步的表单原始数据
        brandList: [],
        sceneList: [],
        form: null,
        authLicenseData: {},
    };
    componentDidMount() {
        this.getInitData();
        this.getEventDetail();
    }

    /** *
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
        const { form, formData2, needShow } = this.state;
        const { defaultCardType } = formData2;
        form.validateFields((e, v) => {
            if (!e) {
                const { eventImagePath, openLottery, lottery } = v;
                const isChecked = lottery.every(x => {
                    return x.isPoint || x.isTicket;
                });
                if (!isChecked) {
                    message.error('赠送积分或优惠券，必选一项');
                    return;
                }
                const isGift = lottery.every(x => {
                    if (x.isTicket && x.presentType === '1') {
                        return x.giftList.every(g => {
                            if (g.effectType === '1') {
                                return g.giftID && g.giftCount && g.giftValidUntilDayCount;
                            } else {
                                return g.giftID && g.giftCount && g.rangeDate;
                            }
                        })
                    }
                    return true;
                });
                if (!isGift) {
                    message.error('礼品项必填');
                    return;
                }

                if (needShow) {
                    let { giftList = [], isTicket, isPoint } = openLottery
                    if (isTicket) {
                        let isGiftOpen = giftList.every(g => {
                            if (g.effectType === '1') {
                                return g.giftID && g.giftCount && g.giftValidUntilDayCount;
                            } else {
                                return g.giftID && g.giftCount && g.rangeDate;
                            }
                        })
                        if (!isGiftOpen && giftList.length > 0) {
                            message.error('明盒礼品项必填');
                            return;
                        }
                    }
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
        const { gifts, eventImagePath, ...others3, } = formData3;
        const newEventImagePath = eventImagePath ? eventImagePath.url ? eventImagePath.url : eventImagePath : ''
        let event = { ...others1, ...others3, ...newEventRange, ...step2Data, eventWay: '79', eventImagePath: newEventImagePath };
        if (id) {
            const itemID = id;
            const allData = { event: { ...event, itemID }, gifts };
            postEvent(allData).then(x => {
                if (x) {
                    this.onToggle();
                    closePage();
                    jumpPage({ pageID: '1000076003' });
                }
            });
            return;
        }
        const allData = { event, gifts };
        putEvent({ ...allData }).then(x => {
            if (x) {
                this.onToggle();
                closePage();
                jumpPage({ pageID: '1000076003' });
            }
        })
    }

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
        if (current === 2) {
            this.setState({
                formData2: form.getFieldsValue(),
            })
        }
        if (current === 3) {
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

    getInitData = () => {
        const { fetchFoodCategoryLightInfo, fetchFoodMenuLightInfo, accountInfo, fetchPromotionScopeInfo } = this.props
        // getBrandList().then((list) => { // 获取品牌
        //     this.setState({ brandList: list });
        // });
        const groupID = accountInfo.get('groupID');
        // 获取菜品分类
        fetchFoodCategoryLightInfo({ groupID, shopID: this.props.user.shopID }); // 菜品分类轻量级接口
        fetchFoodMenuLightInfo({ groupID, shopID: this.props.user.shopID }); // 轻量级接口
        fetchPromotionScopeInfo({ groupID }) // 品牌
    }

    getEventDetail() {
        const { id } = this.props;
        // if(id) {
        //     getEvent({ itemID: id }).then(obj => {
        //         const { data, gifts = [] } = obj;
        //         const formData1 = this.setData4Step1(data);
        //         const formData2 = this.setData4Step2(data);
        //         this.setState({ formData1, formData2 });
        //         const formData3 = this.setData4Step3(data, gifts);
        //         this.setState({ formData3 });
        //     });
        // }
    }

    /** *
     * 回显数据
     */
    setData4Step1 = (data) =>{
        // let { eventStartDate: sd, eventEndDate: ed, smsGate } = data;
        // const eventRange = [moment(sd), moment(ed)];
        // smsGate = `${smsGate}`

        // return { ...data, eventRange, smsGate };
    }

    setData4Step2 = (data) => {

    }
    setData4Step3 = (data, gifts) =>{

    }

    // 提交前数据
    setStep2Data = () => {
        // const { formData2 } = this.state;
        // const { mpIDList, participateRule, presentValue1, presentValue2, settleUnitID, joinCount, defaultCardType, autoRegister } = formData2;
        // // 参与条件
        // let parm = {}
        // if (participateRule == '0') {
        //     parm = {}
        // } else if (participateRule == '1') {
        //     parm = {
        //         presentValue: presentValue1
        //     }
        // } else {
        //     parm = {
        //         presentValue: presentValue2,
        //         settleUnitID
        //     }
        // }
        // // 参与次数
        // let partInTimes = 0;
        // let countCycleDays = 0;
        // if (joinCount.joinCount == '0') {
        //     partInTimes = 0;
        //     countCycleDays = 0;
        // } else if (joinCount.joinCount == '1') {
        //     partInTimes = joinCount.partInTimesNoValid;
        //     countCycleDays = 0;
        // } else {
        //     partInTimes = joinCount.partInTimes;
        //     countCycleDays = joinCount.countCycleDays;
        // }

        // return { participateRule, ...parm, partInTimes, countCycleDays, defaultCardType };
    }

    setStep3Data = (formData) => {
        let { needShow, formData2 } = this.state
        // 注册卡类项  加入到积分礼品项中
        let { lottery, eventImagePath, openLottery, shareInfo } = formData;
        const gifts = [];   // 后端要的专属key名
        // 盲盒礼品
        lottery.forEach((x, i) => {
            const { giftOdds, giftTotalCount, isPoint, isTicket, presentType, giftList, ...others } = x;
            const sortIndex = i + 1;       // 后端要的排序
            const rawObj = { sortIndex, giftOdds, giftTotalCount, presentType, needShow: 0 };    // 基础数据
            if (isPoint) {
                const { presentValue } = x;
                const obj = { ...others, ...rawObj, presentType: '2', presentValue };
                gifts.push(obj);
            }
            if (isTicket) {
                const { giftList } = x;
                // 1 独立优惠券
                if (presentType === '1') {
                    giftList.forEach(x => {
                        const { rangeDate, countType, effectType: etype, giftTotalCount, ...others } = x;
                        const rangeObj = this.formatRangeDate(rangeDate);
                        let { effectTime, validUntilDate } = rangeObj
                        let effectType = etype;
                        if (etype === '1' && countType === '1') {
                            effectType = '3';
                        }
                        if (etype != '2') {
                            effectTime = '0';
                            validUntilDate = '0';
                        }
                        const obj = { ...others, ...rawObj, ...rangeObj, effectType, effectTime, validUntilDate, countType };
                        gifts.push(obj);
                    });
                }
            }
        });
        // 明盒礼品
        if (needShow) {
            const { isPoint, isTicket, presentType, giftList, ...others } = openLottery;
            const rawObj = { presentType, needShow: 1 };    // 基础数据
            if (isPoint) {
                const { presentValue } = openLottery;
                const obj = { ...rawObj, ...others, presentType: '2', presentValue };
                gifts.push(obj);
            }
            if (isTicket) {
                const { giftList } = openLottery;
                // 1 独立优惠券
                if (presentType === '1') {
                    giftList.forEach(x => {
                        const { rangeDate, countType, effectType: etype, giftTotalCount, ...others } = x;
                        const rangeObj = this.formatRangeDate(rangeDate);
                        let { effectTime, validUntilDate } = rangeObj
                        let effectType = etype;
                        if (etype === '1' && countType === '1') {
                            effectType = '3';
                        }
                        if (etype != '2') {
                            effectTime = '0';
                            validUntilDate = '0';
                        }
                        const obj = { ...rawObj, ...rangeObj, ...others, effectType, effectTime, validUntilDate };
                        gifts.push(obj);
                    });
                }
            }
        }

        return { eventImagePath, gifts, ...shareInfo };
    }

    getNeedShow = (key) => {
        this.setState({ needShow: key })
    }

    //
    formatRangeDate = (rangeDate) => {
        if (!rangeDate) {
            return {}
        }
        const [start, end] = rangeDate;
        const effectTime = start.format(DF) || '0';
        const validUntilDate = end.format(DF) || '0';
        return { effectTime, validUntilDate };
    }

    formatEventRange = (eventRange) => {
        const [sd, ed] = eventRange;
        const eventStartDate = moment(sd).format(DF);
        const eventEndDate = moment(ed).format(DF);
        return { eventStartDate, eventEndDate };
    }


    renderFooter(current) {
        const { view } = this.props;
        const btn0 = (<Button key="0" onClick={this.onToggle}>取消</Button>);
        const btn1 = (<Button key="1" type="primary" onClick={this.onGoPrev}>上一步</Button>);
        const btn2 = (<Button key="2" type="primary" onClick={this.onGoStep2}>下一步</Button>);
        const btn3 = (<Button key="3" type="primary" onClick={this.onGoStep3}>下一步</Button>);
        const btn4 = (<Button key="4" type="primary" onClick={this.onGoDone}>完成</Button>);
        const step1 = ([btn0, btn2]);
        const step2 = ([btn0, btn1, btn3]);
        let step3 = ([btn0, btn1, btn4]);
        if (view) {
            step3 = ([btn0, btn1]);   // 查看模式无完成功能
        }
        return { 1: step1, 2: step2, 3: step3 }[current];
    }
    render() {
        const { current, formData1, formData2, formData3, form, brandList, userCount } = this.state;
        const { groupCardTypeList, mpList, settleUnitInfoList } = this.state;
        const footer = this.renderFooter(current);
        return (
            <Modal
                title="千人千面"
                visible={true}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={this.onToggle}
                footer={footer}
                width={1000}
            >
                <ul className={css.mainBox}>
                    <li className={css.left}>
                        <h3 className={css.logo}>千人千面</h3>
                        <p className={css.gray}>可根据设置条件筛选用户，推送不同的营销活动</p>
                    </li>
                    <li className={css.right}>
                        <div className={css.stepBox}>
                            <Steps current={current - 1} className={style.ProgressBar}>
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
function mapStateToProps(state) {
    return {
        accountInfo: state.user.get('accountInfo'),
        user: state.user.toJS(),
        // params: state.sale_giftInfoNew.get('listParams'),
        // giftData: state.sale_giftInfoNew.get('giftSort'),
        // shopSchema: state.sale_shopSchema_New,
        // accountInfo: state.user.get('accountInfo'),
        // menuList: state.user.get('menuList'),
        // sharedGifts: state.sale_giftInfoNew.get('sharedGifts'),

        // // 商城商品及分类信息
        // goodCategories: state.sale_promotionDetailInfo_NEW.get('goodCategories').toJS(),
        // goods: state.sale_promotionDetailInfo_NEW.get('goods').toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchFoodMenuLightInfo: (opts, flag, id) => {
            dispatch(fetchFoodMenuInfoLightAC(opts, flag, id))
        },
        fetchFoodCategoryLightInfo: (opts, flag, id) => {
            dispatch(fetchFoodCategoryInfoLightAC(opts, flag, id))
        },
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ManyFace);

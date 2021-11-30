import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Steps, Button, message } from 'antd';
import { jumpPage, closePage, axios } from '@hualala/platform-base';
import moment from 'moment';
import _ from 'lodash';
import { getBrandList, putEvent, getEvent, postEvent, getGroupCardTypeList, getWechatMpList, getSettleList, getSceneList } from './AxiosFactory';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import {
    fetchFoodMenuInfoLightAC, fetchFoodCategoryInfoLightAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action'
import {
    saleCenterSetSpecialBasicInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
// import { isHuaTian } from '../../../constants/projectHuatianConf';
import style from 'components/basic/ProgressBar/ProgressBar.less';
import css from './style.less';

const Step = Steps.Step;
const DF = 'YYYYMMDD';
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
        // tagsList: [], // 会员标签的所有属性
        // tagCategories: [],
        // tagTypes: [],
        tagRuleDetails: [],
    };
    componentDidMount() {
        this.getInitData();
        this.searchCrmTag();
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
                // 保存redux第一步的日期数据
                const { eventRange } = v;
                const newEventRange = this.formatEventRange(eventRange);
                this.props.setSpecialBasicInfo({
                    ...formData1,
                    ...newEventRange,
                });
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
        const { form } = this.state;
        // const { defaultCardType } = formData2;

        form.validateFields((e, v) => {
            if (!e) {
                const { faceRule } = v;
                const faceData = _.cloneDeep(faceRule)
                let flag = false;
                // console.log("🚀 ~ file: index.jsx ~ line 82 ~ ManyFace ~ form.validateFields ~ faceData", faceData)
                faceRule.map((itm) => {
                    if (itm.conditionType == 2) {
                        if (!itm.conditionValue) {
                            flag = true;
                            // itm.validateStatus = 'error';
                            message.warn('请选择会员标签')
                            return null
                        }
                        if (!itm.targetValue) {
                            flag = true;
                            // itm.validateStatus = 'error';
                            message.warn('请选择会员标签属性')
                            return null
                        }
                        // if (!itm.)
                    }
                    if (!itm.triggerEventValue) {
                        flag = true;
                        // itm.validateStatus = 'error';
                        message.warn('请选择触发事件')
                        return null
                    }
                    if (_.isEmpty(itm.triggerEventCustomInfo)) {
                        flag = true;
                        // itm.validateStatus = 'error';
                        message.warn('请选择触发事件')
                        return null
                    }
                })
                if (flag) {
                    return
                }
                const formData3 = faceData.map((item) => {
                    if (item.triggerEventValue === 'customLink') {
                        item.triggerEventCustomInfo = item.triggerEventCustomInfo.value;
                    } else {
                        item.triggerEventCustomInfo = JSON.stringify(item.triggerEventCustomInfo)
                    }
                    return {
                        ...item,
                    }
                })

                this.onSubmit(formData3);
            }
        });
    }

    // 提交
    onSubmit = (formData3) => {
        const { formData1, formData2 } = this.state;
        const { id } = this.props;
        const { eventRange, ...others1 } = formData1;
        const newEventRange = this.formatEventRange(eventRange);
        // shopRange全部店铺和部分店铺的
        const event = { ...others1, ...newEventRange, ...formData2, eventWay: '85', shopRange: '1' };
        if (id) {
            const itemID = id;
            const allData = { event: { ...event, itemID }, eventConditionInfos: formData3 };
            postEvent(allData).then((x) => {
                if (x) {
                    this.onToggle();
                    closePage();
                    jumpPage({ pageID: '1000076003' });
                }
            });
            return;
        }
        const allData = { event, eventConditionInfos: formData3 };
        putEvent({ ...allData }).then((x) => {
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
        const groupID = accountInfo.get('groupID');
        // 获取菜品分类
        fetchFoodCategoryLightInfo({ groupID, shopID: this.props.user.shopID }); // 菜品分类轻量级接口
        fetchFoodMenuLightInfo({ groupID, shopID: this.props.user.shopID }); // 轻量级接口
        fetchPromotionScopeInfo({ groupID }) // 品牌
    }

    getEventDetail() {
        const { id } = this.props;
        if (id) {
            getEvent({ itemID: id }).then((obj) => {
                const { data, eventConditionInfos = [] } = obj;
                const formData1 = this.setData4Step1(data);
                const formData2 = this.setData4Step2(data);
                this.setState({ formData1, formData2 });
                const formData3 = this.setData4Step3(data, eventConditionInfos);
                this.setState({ formData3: { faceRule: formData3 } });
            });
        }
    }


    /** *
     * 回显数据
     */
    setData4Step1 = (data) => {
        let { eventStartDate: sd, eventEndDate: ed } = data;
        const eventRange = [moment(sd), moment(ed)];
        return { ...data, eventRange };
    }

    setData4Step2 = (data) => {
        const { shopIDList: slist } = data;
        const shopIDList = slist ? slist.map(x => `${x}`) : [];
        return { shopIDList };
    }
    setData4Step3 = (data, eventConditionInfos = []) => {
        let faceData = []
        if (eventConditionInfos.length) {
            faceData = eventConditionInfos.map((item) => {
                if (item.conditionType == '2') { // 会员标签
                    const everyTags = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == item.conditionValue)
                    item.everyTagsRule = everyTags.map((itm) => {
                        return {
                            ...itm,
                            label: itm.tagName,
                            value: itm.tagRuleID,
                        }
                    });
                } else {
                    item.everyTagsRule = [];
                }
                if (item.triggerEventValue === 'customLink') {
                    item.triggerEventCustomInfo = { value: item.triggerEventCustomInfo }
                } else  {
                    try {
                        item.triggerEventCustomInfo = JSON.parse(item.triggerEventCustomInfo)
                    } catch (error) {
                        item.triggerEventCustomInfo = {};
                    }
                }
                return { ...item }
            })
        // console.log("🚀 ~ file: index.jsx ~ line 193 ~ ManyFace ~ faceData", faceData)
        }
        return faceData
    }

    // 查询会员标签
    searchCrmTag = () => {
        const { accountInfo } = this.props;
        axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_CRM',
            method: '/tag/tagService_queryAllTagsByTagTypeID.ajax',
            type: 'post',
            data: { groupID: accountInfo.get('groupID'), tagTypeIDs: '1,2,3,5' },
        }).then((res) => {
            if (res.code === '000') {
                const { tagRuleDetails = [] } = res.data;
                this.setState({
                    tagRuleDetails, // 标签第三步特特征
                }, () => {
                    this.getEventDetail();
                })
            } else {
                message.error(res.data.message);
                this.getEventDetail();
            }
        })
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
        const { current, formData1, formData2, formData3, form, brandList } = this.state;
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
                        <h3 className={css.logo} style={{ background: '#BF8D65' }}>千人千面</h3>
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
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ManyFace);

import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Steps, Button, message, Icon } from 'antd';
import { jumpPage, closePage, axios } from '@hualala/platform-base';
import moment from 'moment';
import _ from 'lodash';
import { getBrandList, putEvent, getEvent, postEvent, searchAllActivity, searchAllMallActivity } from './AxiosFactory';
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
        allActivity: [],
        allMallActivity: [],
        formDataLen: 0, // 数据的长度
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
                this.setState({ formData2: v }, () => { this.onGoNext() });
            }
        });
    }

    /* 第3步表单提交数据 */
    onGoDone = () => {
        const { form, formData2 } = this.state;
        // console.log("🚀 ~ file: index.jsx ~ line 83 ~ ManyFace ~ formData2", formData2)
        // const { defaultCardType } = formData2;

        form.validateFields((e, v) => {
            if (!e) {
                const { faceRule } = v;
                const faceData = _.cloneDeep(faceRule)
                if (formData2.clientType == '1') {
                    this.onPreSubmitH5(faceData)
                } else {
                    this.onPreSubmitApp(faceData)
                }
            }
        });
    }

    onCheck = faceRule => (next) => {
        // console.log(faceRule, 'faceRule-------'); // TODO  历史数据小程序开卡去掉
        let flag = false;
        const range = faceRule.some((item) => !item.conditionType); // 会员范围不能为空
        if (range) {
            flag = true
            return message.warning('请选择会员范围')
        }
        faceRule.map((itm) => {
            if (itm.conditionType == 2 || itm.conditionType == 1) {  // 会员身份1， 会员标签2 会员群体3
                if (!itm.conditionValue) {
                    flag = true;
                    message.warn('请选择会员标签')
                    return null
                }
                if (!itm.targetValue) {
                    flag = true;
                    message.warn('请选择会员标签属性')
                    return null
                }
            }
            if (itm.conditionType == 3) { 
                if (!itm.conditionValue) {
                    flag = true;
                    message.warn('请选择会员群体属性')
                    return null
                }
            }
            if (!itm.triggerEventValue) {
                flag = true;
                message.warn('请选择触发事件')
                return null
            }
            if (_.isEmpty(itm.triggerEventCustomInfo)) {
                flag = true;
                message.warn('请选择触发事件')
                return null
            }
            if (itm.triggerEventValue === 'jumpToMiniApp') {
                const triggerEventCustomInfo  = JSON.parse(itm.triggerEventCustomInfo);
                const noAppID = triggerEventCustomInfo.every(cur => !cur.appID);
                if (noAppID) {
                    flag = true
                    message.warn('请填写appID')
                    return null
                }
            }
        })
        // console.log(flag, 'flag')
        if (flag) {
            return
        }
        next()
    }

    // TODO : 删除无用的key 回显处理。 校验处理
    // 小程序3.0
    onPreSubmitApp = (faceData) => {
        const formData3 = faceData.map((item) => {
            if (['miniAppPage', 'speedDial', 'customLink'].includes(item.triggerEventValue1)) {
                item.triggerEventCustomInfo = item.triggerEventCustomInfo1.value || '';
            } else if (['jumpToMiniApp'].includes(item.triggerEventValue1)) {
                item.triggerEventCustomInfo = JSON.stringify(item.triggerEventCustomInfoApp1)
            } else {
                item.triggerEventCustomInfo = JSON.stringify(item.triggerEventCustomInfo1)
            }
            item.triggerEventValue = item.triggerEventValue1;
            item.triggerEventName = item.triggerEventName1;
            item.clientType = '2'
            return {
                ...item,
            }
        })
        this.onCheck(formData3)(() => this.onSubmit(formData3))
        // this.onSubmit(formData3);
    }

    onPreSubmitH5 = (faceData) => {
        const formData3 = faceData.map((item) => {
            if (['customLink'].includes(item.triggerEventValue2)) {
                item.triggerEventCustomInfo = item.triggerEventCustomInfo2.value || '';
            } else {
                item.triggerEventCustomInfo = JSON.stringify(item.triggerEventCustomInfo2)
            }
            item.triggerEventName = item.triggerEventName2;
            item.triggerEventValue = item.triggerEventValue2;
            item.clientType = '1'
            return {
                ...item,
            }
        })
        this.onCheck(formData3)(() => this.onSubmit(formData3))
        // this.onSubmit(formData3);
    }

    // 提交
    onSubmit = (formData3) => {
        const { formData1, formData2, formDataLen } = this.state;
        const { id } = this.props;
        const { eventRange, ...others1 } = formData1;
        const newEventRange = this.formatEventRange(eventRange);
        // shopRange全部店铺和部分店铺的
        const event = { ...others1, ...newEventRange, ...formData2, eventWay: '85', shopRange: '1' };
        const eventConditionInfos = _.map(formData3, item =>
            (_.omit(item, ['triggerEventCustomInfo2', 'triggerEventValue2', 'triggerEventName2',
                'triggerEventCustomInfoApp1', 'everyTagsRule', 'isShowDishSelector', 'id',
                'triggerEventCustomInfo1', 'triggerEventValue1', 'triggerEventName1',
            ]))
        )
        const len = eventConditionInfos.length;
        // console.log(eventConditionInfos, 'eventConditionInfos')
        if (id) {
            const itemID = id;
            const allData = { event: { ...event, itemID, isActive: this.props.activeStatus }, eventConditionInfos };
            // 根据数据是否变化来判断是否弹窗
            postEvent(allData).then((x) => {
                if (x) {
                    if (formDataLen < len) {
                        this.onShowModle(x)
                        return
                    }
                    this.onToggle();
                    // closePage();
                    // jumpPage({ pageID: '1000076003' });
                }
            });
            return;
        }
        const allData = { event, eventConditionInfos };
        putEvent({ ...allData }).then((x) => {
            if (x) {
                // 跳转弹窗
                this.onShowModle(x)
            }
        })
    }
    onShowModle = (x) => {
        const _this = this;
        const id = this.props.id;
        const title = (<div> <span></span>设置成功</div>)
        Modal.confirm(({
            title,
            content: '你可以在【活动管理页】装修/查看/编辑你的活动，不装修则会展示默认图',
            okText: '马上去装修',
            cancelText: '先这样',
            iconType: 'check-circle',
            onOk() {
                _this.onToggle();
                // closePage();
                if (id) {
                    _this.props.handleDecorationStart({ itemID: id })
                    return
                }
                const menuID = _this.props.user.menuList.find(tab => tab.entryCode === '1000076003').menuID
                menuID && closePage(menuID)
                setTimeout(() => {
                    jumpPage({ pageID: '1000076003', from: 'manyFace', itemID: x.itemID });
                })
            },
            onCancel() {
                _this.onToggle();
                if (id) {
                    return
                }
                closePage();
                jumpPage({ pageID: '1000076003', from: 'create' });
            },
        }))
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
        const { fetchFoodCategoryLightInfo, fetchFoodMenuLightInfo, accountInfo, fetchPromotionScopeInfoAC } = this.props
        const groupID = accountInfo.get('groupID');
        // 获取菜品分类
        fetchFoodCategoryLightInfo({ groupID, shopID: this.props.user.shopID }); // 菜品分类轻量级接口
        fetchFoodMenuLightInfo({ groupID, shopID: this.props.user.shopID }); // 轻量级接口
        fetchPromotionScopeInfoAC({ groupID }) // 品牌

        // 获取商城和营销活动
        Promise.all([searchAllActivity(), searchAllMallActivity()]).then((data = []) => {
            this.setState({
                allActivity: data[0] || [],
                allMallActivity: data[1] || [],
            })
        }).catch(() => {
            this.setState({
                allActivity: [],
                allMallActivity: [],
            })
        })
    }

    getEventDetail() {
        const { id } = this.props;
        if (id) {
            getEvent({ itemID: id }).then((obj) => {
                const { data, eventConditionInfos = [] } = obj;
                const formData1 = this.setData4Step1(data);
                const formData2 = this.setData4Step2(data, eventConditionInfos);
                this.setState({ formData1, formData2, originClientType: data.clientType });
                const formData3 = this.setData4Step3(eventConditionInfos);
                this.setState({ formData3: { faceRule: formData3 }, formDataLen: formData3.length, isEdit: true });
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

    setData4Step2 = (data, eventConditionInfos) => {
        const { shopIDList: slist } = data;
        const clientType = eventConditionInfos[0] ? String(eventConditionInfos[0].clientType) : '1';
        const shopIDList = slist ? slist.map(x => `${x}`) : [];
        return { shopIDList, clientType };
    }
    setData4Step3 = (eventConditionInfos = []) => {
        let faceData = []
        if (eventConditionInfos.length) {
            const { clientType } = eventConditionInfos[0];
            // TODO: 区分h5 和 app (区分小程序 跳转小程序、活动、)
            if (clientType == '1') {
                faceData = this.setData4Step3H5(eventConditionInfos)
            } else {
                faceData = this.setData4Step3App(eventConditionInfos)
            }
        }
        // console.log(faceData, 'faceDatafaceData回显')
        return faceData
    }

    setData4Step3App = (faceData) => {
        const data = faceData.map((item) => {
            item.triggerEventName1 = item.triggerEventName;
            item.triggerEventValue1 = item.triggerEventValue;
            if (item.conditionType == '2') { // 会员标签
                const everyTags = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == item.conditionValue);
                item.everyTagsRule = (everyTags || []).map((itm) => {
                    return {
                        ...itm,
                        label: itm.tagName,
                        value: itm.tagRuleID,
                    }
                });
                if (item.everyTagsRule.length <= 0) {
                    message.warn(`${item.conditionName}标签属性已经不存在或者被删除了，请重新选择会员标签`)
                }
            } else {
                item.everyTagsRule = [];
            }
            if (['miniAppPage', 'speedDial', 'customLink'].includes(item.triggerEventValue)) {
                item.triggerEventCustomInfo1 = { value: item.triggerEventCustomInfo }
            } else if (item.triggerEventName === '小程序开卡') { // 兼容老数据的小程序开卡时间，其回显的值 置为空
                item.triggerEventValue1 = '';
            }  else if(['jumpToMiniApp'].includes(item.triggerEventValue)) {
                try {
                    item.triggerEventCustomInfoApp1 = JSON.parse(item.triggerEventCustomInfo)
                } catch (error) {
                    item.triggerEventCustomInfoApp1 = [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }];
                }
            } else {
                try {
                    item.triggerEventCustomInfo1 = JSON.parse(item.triggerEventCustomInfo)
                } catch (error) {
                    item.triggerEventCustomInfo1 = {};
                }
            }

            // console.log({ ...item, id: item.itemID, isShowDishSelector: false }, '----')
            return { ...item, id: item.itemID, isShowDishSelector: false }
        })
        // console.log(data, 'data---')
        return data;
    }

    setData4Step3H5 = (faceData) => {
        const data = faceData.map((item) => {
            if (item.conditionType == '2') { // 会员标签
                const everyTags = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == item.conditionValue);
                item.everyTagsRule = (everyTags || []).map((itm) => {
                    return {
                        ...itm,
                        label: itm.tagName,
                        value: itm.tagRuleID,
                    }
                });
                if (item.everyTagsRule.length <= 0) {
                    message.warn(`${item.conditionName}标签属性已经不存在或者被删除了，请重新选择会员标签`)
                }
            } else {
                item.everyTagsRule = [];
            }
            if (item.triggerEventValue === 'customLink') {
                item.triggerEventCustomInfo2 = { value: item.triggerEventCustomInfo }
            } else {
                try {
                    item.triggerEventCustomInfo2 = JSON.parse(item.triggerEventCustomInfo)
                } catch (error) {
                    item.triggerEventCustomInfo2 = {};
                }
            }
            item.triggerEventCustomInfoApp1 = [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }];
            item.triggerEventName2 = item.triggerEventName;
            item.triggerEventValue2 = item.triggerEventValue;

            return { ...item, id: item.itemID, isShowDishSelector: false }
        })
        return data;
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
                    tagRuleDetails, // 标签第三步特征
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
                                formData1={formData1}
                                formData={formData2}
                                brandList={brandList}
                            />
                        }
                        {current === 3 &&
                            <Step3
                                form={form}
                                clientType={formData2.clientType || ''}
                                originClientType={this.state.originClientType}
                                isEdit={this.state.isEdit}
                                getForm={this.onSetForm}
                                formData={formData3}
                                allActivity={this.state.allActivity}
                                allMallActivity={this.state.allMallActivity}
                                // handleDecorationStart={this.props.handleDecorationStart ? this.handleDecorationStart : () => {}}
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
        fetchPromotionScopeInfoAC: (opts) => {
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

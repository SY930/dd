
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Modal, Steps, Button, message, Icon } from 'antd';
import moment from 'moment';
import _ from 'lodash'
import { jumpPage, closePage, axios } from '@hualala/platform-base';
import Step1 from './Step1'
import Step2 from './Step2'
import {
    fetchFoodMenuInfoLightAC, fetchFoodCategoryInfoLightAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action'
import {
    saleCenterSetSpecialBasicInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
import { getEvent, searchAllActivity, searchAllMallActivity, postEvent, putEvent } from './AxiosFactory';
import { asyncParseForm } from '../../../helpers/util'
import styles from './ManyFace.less'

const DF = 'YYYYMMDD';
class ManyFace extends Component {
    constructor() {
        super()
        this.state = {
            formData1: {}, // 第1步的表单原始数据，也是用来回显baseform的数据
            formData2: {}, // 第2步的表单原始数据
            brandList: [],
            sceneList: [],
            form1: null,
            authLicenseData: {},
            tagRuleDetails: [],
            allActivity: [],
            allMallActivity: [],
            formDataLen: 0, // 数据的长度
            flag: false,
        }
    // this.formRef = null;
    // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getInitData();
        this.searchCrmTag();
        this.props.getSubmitFn(this.handleSubmit);
    }

    onSetForm1 = (form) => {
        this.setState({ form1: form });
    }


    onChangeForm = (key, value) => {
        const { form1 } = this.state
        if (value === '1' && key === 'clientType') {
            form1 && form1.setFieldsValue({ sceneList: '1' })
        }
        // if (key === 'sceneList') { }
        this.setState({
            // clientType: value, // 适用客户端
            flag: !this.state.flag,
            // 投放类型
        })
    }

    onCheckBannerApp = (faceRule) => {
        let flag = false;
        const range = faceRule.some(item => !item.conditionType); // 会员范围不能为空
        if (range) {
            flag = true
            return message.warning('请选择会员范围')
        }
        // faceRule.some(item => !item.)
        for (let i = 0; i < faceRule.length; i++) {
            const item = faceRule[i];
            if (item.conditionType == 2 || item.conditionType == 1) {  // 会员身份1， 会员标签2 会员群体3
                if (!item.conditionValue) {
                    flag = true;
                    message.warn('请选择会员标签')
                    break
                }
                if (!item.targetValue) {
                    flag = true;
                    message.warn('请选择会员标签属性')
                    break
                }
            }
            if (item.conditionType == 3) {
                if (!item.conditionValue) {
                    flag = true;
                    message.warn('请选择会员群体属性')
                    break
                }
            }
            const eventFlage = item.bannerApp1Ary.some(itm => _.isEmpty(itm.triggerEventCustomInfo) || itm.triggerEventCustomInfo === '{}' || item.triggerEventValue)
            if (eventFlage) {
                flag = true;
                message.warning('请选择触发事件~~')
                break;
            }
            const bannerImageFlage = item.bannerApp1Ary.some(itm => !itm.bannerImage)
            if (bannerImageFlage) {
                flag = true;
                message.warning('请上传活动图片')
                break;
            }
            // item.bannerApp1Ary.
            for (let j = 0; j < item.bannerApp1Ary.length; j++) {
                const curBanner = item.bannerApp1Ary[j]
                if (curBanner.triggerEventValue === 'jumpToMiniApp') {
                    const triggerEventCustomInfo = JSON.parse(curBanner.triggerEventCustomInfo);
                    const noAppID = triggerEventCustomInfo.every(cur => !cur.appID);
                    if (noAppID) {
                        flag = true
                        message.warn('请填写appID')
                        return null
                    }
                }
            }
        }
        // console.log(flag, 'flag')
        return flag;
    }


    onCheck = (faceRule) => {
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
            if (itm.triggerEventCustomInfo === '{}') {
                flag = true;
                message.warn('请选择触发事件~~')
                return null
            }
            if (itm.triggerEventValue === 'jumpToMiniApp') {
                const triggerEventCustomInfo = JSON.parse(itm.triggerEventCustomInfo);
                const noAppID = triggerEventCustomInfo.every(cur => !cur.appID);
                if (noAppID) {
                    flag = true
                    message.warn('请填写appID')
                    return null
                }
            }
            if (!itm.bannerImage) {
                flag = true;
                message.warn('请选上传图片')
                return null
            }
        })
        // console.log(flag, 'flag')
        return flag;
    }

    // 小程序3.0 banner
    onPreSubmitAppBanner = (faceData) => {
        console.log("🚀 ~ file: index.jsx ~ line 194 ~ ManyFace ~ faceData", faceData)
        const formData2 = faceData.map((item) => {
            item.bannerApp1Ary = item.bannerApp1Ary.map((itm) => {
                if (['miniAppPage', 'speedDial', 'customLink'].includes(itm.triggerEventValue1)) {
                    itm.triggerEventCustomInfo = itm.triggerEventCustomInfo1.value || '';
                } else if (['jumpToMiniApp'].includes(itm.triggerEventValue1)) {
                    itm.triggerEventCustomInfo = JSON.stringify(itm.triggerEventCustomInfoApp1)
                } else {
                    itm.triggerEventCustomInfo = JSON.stringify(itm.triggerEventCustomInfo1)
                }
                itm.triggerEventValue = itm.triggerEventValue1;
                itm.triggerEventName = itm.triggerEventName1;
                itm.bannerImage = itm.bannerApp1;
                return {
                    ...itm,
                }
            })
            item.bannerApp1Ary = _.map(item.bannerApp1Ary, bItem =>
                (_.omit(bItem, ['triggerEventCustomInfo2', 'triggerEventValue2', 'triggerEventName2',
                    'triggerEventCustomInfoApp1', 'everyTagsRule', 'isShowDishSelector', 'id',
                    'triggerEventCustomInfo1', 'triggerEventValue1', 'triggerEventName1', 'bannerApp1',
                ]))
            )
            item.clientType = '2'

            return {
                ...item,
            }
        })
        console.log(formData2, '<<<<formData2')
        return formData2
    }

    // 小程序3.0
    onPreSubmitApp = (faceData) => {
        console.log("🚀 ~ file: index.jsx ~ line 225 ~ ManyFace ~ faceData", faceData)
        const formData2 = faceData.map((item) => {
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
            item.bannerImage = item.bannerApp1;
            return {
                ...item,
            }
        })
        return formData2
    }

    onPreSubmitH5 = (faceData) => {
        const formData2 = faceData.map((item) => {
            if (['customLink'].includes(item.triggerEventValue2)) {
                item.triggerEventCustomInfo = item.triggerEventCustomInfo2.value || '';
            } else {
                item.triggerEventCustomInfo = JSON.stringify(item.triggerEventCustomInfo2)
            }
            item.triggerEventName = item.triggerEventName2;
            item.triggerEventValue = item.triggerEventValue2;
            item.clientType = '1'
            item.bannerImage = item.bannerApp1;
            return {
                ...item,
            }
        })
        return formData2
    }

    onSubmit = (values, formData2) => {
        const { itemID } = this.props
        const { eventRange, ...others1 } = values;
        const newEventRange = this.formatEventRange(eventRange);
        // shopRange全部店铺和部分店铺的
        const event = { ...others1, ...newEventRange, ...others1, eventWay: '85', shopRange: '1' };
        const eventConditionInfos = _.map(formData2, item =>
            (_.omit(item, ['triggerEventCustomInfo2', 'triggerEventValue2', 'triggerEventName2',
                'triggerEventCustomInfoApp1', 'everyTagsRule', 'isShowDishSelector', 'id',
                'triggerEventCustomInfo1', 'triggerEventValue1', 'triggerEventName1', 'bannerApp1',
            ]))
        )
        if (itemID) {
            const allData = { event: { ...event, itemID, isActive: this.props.activeStatus }, eventConditionInfos };
            postEvent(allData)
            return
        }
        const allData = { event, eventConditionInfos };
        putEvent({ ...allData })
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
  
    // TODO: //需要重新写
    getEventDetail() {
        const { id } = this.props;
        if (id) {
            getEvent({ itemID: id }).then((obj) => {
                // const { data, eventConditionInfos = [] } = obj;
                // const formData1 = this.setData4Step1(data);
                // const formData2 = this.setData4Step2(data, eventConditionInfos);
                // this.setState({ formData1, formData2, originClientType: data.clientType });
                // const formData3 = this.setData4Step3(eventConditionInfos);
                // this.setState({ formData3: { faceRule: formData3 }, formDataLen: formData3.length, isEdit: true });
            });
        }
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

  formatEventRange = (eventRange) => {
      const [sd, ed] = eventRange;
      const eventStartDate = moment(sd).format(DF);
      const eventEndDate = moment(ed).format(DF);
      return { eventStartDate, eventEndDate };
  }

  handleSubmit = (cb) => {
      const { form1, form2 } = this.state
      const forms = [form1, form2];
      asyncParseForm(forms)
          .then((result) => {
              // 验证通过后保存前需要把所选店铺下的所以存在的活动弹窗提醒下
              let flag = false;
              let formData2;
              const { values, error } = result;
              if (error) return null
              const { faceRule, clientType, sceneList } = values;
              const faceData = _.cloneDeep(faceRule);
              if (clientType == '2' && sceneList == '2') { // 小程序3.0 banner
                  formData2 = this.onPreSubmitAppBanner(faceData)
                  flag = this.onCheckBannerApp(formData2)
                  if (flag) { return null }
                  this.onSubmit(values, formData2)
                  return null
              } else if (clientType == '1') {
                  formData2 = this.onPreSubmitH5(faceData)
              } else {
                  formData2 = this.onPreSubmitApp(faceData)
              }
              flag = this.onCheck(formData2)
              if (flag) { return null }
              // TODO: 弹窗提醒
              this.onSubmit(values, formData2)
          })
  }


  render() {
      const { form1, form2, allActivity, allMallActivity } = this.state
      return (
          <div className={styles.formContainer}>
              <div>
                  <div
                      style={{
                          margin: '20px 0 10px 124px',
                      }}
                      className={styles.logoGroupHeader}
                  >基本信息</div>
                  <Step1
                      form={form1}
                      getForm={this.onSetForm1}
                      // formData={formData1}
                      authLicenseData={this.state.authLicenseData}
                      onChangeForm={this.onChangeForm}
                  />

                  <div
                      style={{
                          margin: '70px 0 10px 124px',
                      }}
                      className={styles.logoGroupHeader}
                  >使用规则</div>
                  <Step2
                      form2={form2}
                      form1={form1}
                      getForm={(form) => { this.setState({ form2: form }) }}
                      allActivity={allActivity}
                      allMallActivity={allMallActivity}
                      isEdit={true}
                  />
              </div>
          </div>
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

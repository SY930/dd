/*
 * @Author: Songnana
 * @Date: 2022-12-06 11:24:54
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import React, { Component } from 'react'
import { Spin, message } from 'antd';
import moment from 'moment'
import _ from 'loadsh';
import { jumpPage, closePage } from '@hualala/platform-base';
import BaseInfo from './BaseInfo';
import ActiveRules from './ActiveRules'
import HelpRules from './HelpRules'
import { putEvent, postEvent, getEvent, queryActiveList } from './AxiosFactory';
import { asyncParseForm, formatEventRange } from "../../../helpers/util";
import styles from './styles.less'

class BenefitCardBargain extends Component {

  constructor() {
    super()
    this.state = {
        formData: {}, //
        flag: false,
        loading: true,
        benefitCardLst: [],
    };
    this.baseForm = null;
    this.activeForm = null;
    this.helpForm = null;
}

  componentDidMount() {
    const { itemID } = this.props
    this.props.getSubmitFn(this.handleSubmit);
    if (!itemID) {
      this.setState({
        loading: false,
      })
    }
    this.getEventDetail()
    this.getActiveList()
  }


  onChangeGears = ({ giftID, presentValue, giftName }) => {
    this.setState({
      giftID,
      presentValue,
      giftName,
    })
  }


  getActiveList = () => {
    const { itemID } = this.props
    const params = {
      eventInfo: {
        eventWay: 91,
        itemID: itemID && itemID,
      },
    }
    queryActiveList(params).then((dataSource) => {
      let GearData = [];
       dataSource.map((item) => {
        GearData = GearData.concat(item.giftInfoList || {})
      })
      this.setState({
        gearData: GearData,
      })
    })
  }

  getEventDetail() {
    const { itemID } = this.props;
    if (itemID) {
        getEvent({ itemID }).then((obj) => {
            const { data, gifts = [{}] } = obj;
            const { eventStartDate: sd, eventEndDate: ed, defaultCardType  } = data
           const eventRange = [moment(sd), moment(ed)];
            this.setState({ formData: { ...data, eventRange, ...gifts[0], defaultCardType: defaultCardType == '0' ? null : defaultCardType }, loading: false });
        });
    }
  }

  handleSubmit = () => {
    // const { this.baseForm , form2 } = this.state
    const { itemID } = this.props
    const forms = [this.baseForm, this.activeForm, this.helpForm];
    const { giftID, presentValue, giftName } = this.state
    asyncParseForm(forms).then(({ values, error }) => {
      if (error) return;
      // console.log(values, 'values')
      if (!giftID) {
        message.warning('请选择权益卡档位')
        return
      }
      const { eventName, eventCode, eventRange, eventRemark, defaultCardType, giftGetRuleValue } = values;
      const newEventRange = formatEventRange(eventRange);
      const allData = {
        event: { eventWay: 91, eventName, eventCode, eventRemark, ...newEventRange, defaultCardType },
        gifts: [{ eventDurationType: 3,
          presentType: 15,
          presentValue,
          giftCount: 1,
          giftName,
          ..._.omit(values, ['eventName', 'eventCode', 'eventRange', 'eventRemark', 'defaultCardType', 'defaultCardType']),
          giftID }],
      }
      if (!defaultCardType) {
        allData.event.defaultCardType = '0'
      }
      if (giftGetRuleValue >= presentValue) {
        message.warning('底价必须小于礼品卡售价')
        return
      }
      if (itemID) {
        postEvent({
          event: { ...allData.event, itemID, isActive: this.props.isActive == '0' ? 0 : 1 },
          gifts: allData.gifts,
        }).then((res) => {
          if (res) {
            closePage()
            jumpPage({ pageID: '1000076003' })
          }
        })
        return
      }

      putEvent({ ...allData }).then((res) => {
        if (res.code === '000') {
          closePage()
          jumpPage({ pageID: '1000076003' })
        }
      })
    })
  }

  render() {
    const { loading, formData, gearData } = this.state;
    const { isView, itemID } = this.props

    return (
      <div className={styles.formContainer}>
      <div >
          <Spin spinning={loading}>
              <div
                  style={{
                      margin: '20px 0 10px 124px',
                  }}
                  className={styles.logoGroupHeader}
              >基本信息</div>
             <BaseInfo
                formData={formData}
                getForm={(form) => { this.baseForm = form}}
                isView={isView}
                key="BaseInfo_1"
             />

              <div
                  style={{
                      margin: '20px 0 10px 124px',
                  }}
                  className={styles.logoGroupHeader}
              >活动规则</div>
             <ActiveRules
                formData={formData}
                getForm={(form) => { this.activeForm = form}}
                isView={isView}
                onChangeGears={this.onChangeGears}
                key="ActiveRules_1"
                itemID={itemID}
                gearData={gearData}
             />
              <div
                  style={{
                      margin: '20px 0 10px 124px',
                  }}
                  className={styles.logoGroupHeader}
              >助力规则</div>
              <HelpRules 
                formData={formData}
                getForm={(form) => { this.helpForm = form }}
                isView={isView}
                key="HelpRules_1"
              />
          </Spin>
      </div>
     
  </div>
    )
  }
}

export default BenefitCardBargain
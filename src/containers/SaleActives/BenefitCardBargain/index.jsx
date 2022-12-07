/*
 * @Author: Songnana
 * @Date: 2022-12-06 11:24:54
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import React, { Component } from 'react'
import { Spin } from 'antd';
import BaseInfo from './BaseInfo';
import ActiveRules from './ActiveRules'
import HelpRules from './HelpRules'
import { asyncParseForm } from "../../../helpers/util";
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
    // this.getResourceData();
    this.props.getSubmitFn(this.handleSubmit);
    if (!itemID) {
      this.setState({
        loading: false,
      })
    }
  }

  getResourceData = () => {
    // getBenefitCards().then((list) => {
    //   this.setState({
    //     benefitCardLst: list,
    //   })
    // })
  }


  getEventDetail() {
    const { itemID } = this.props;
    // if (itemID) {
    //     getEvent({ itemID }).then((obj) => {
    //         const { data, eventConditionInfos = [], timeList, triggerSceneList } = obj;
    //         const { step1Data, setp2Data } = this.setData4Step1(data, eventConditionInfos, timeList, triggerSceneList);
    //         const formData2 = this.setData4Step2(eventConditionInfos, step1Data.sceneList);
    //         this.setState({ formData1: { ...step1Data, triggerSceneList }, formData2: { faceRule: formData2, ...setp2Data }, loading: false });
    //     });
    // }
  }

  handleSubmit = () => {
    // const { this.baseForm , form2 } = this.state
        const forms = [this.baseForm , this.activeForm, this.helpForm];
        asyncParseForm(forms).then(({ values, error }) => {
          if (error) return;
          console.log(values, 'values')
        })
  }

  render() {
    const { loading, formData } = this.state;
    const { isView } = this.props

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
              />
          </Spin>
      </div>
     
  </div>
    )
  }
}

export default BenefitCardBargain
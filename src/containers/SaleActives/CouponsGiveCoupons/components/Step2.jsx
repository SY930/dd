import React from 'react'
import { connect } from 'react-redux';
import { message, Button, Icon,  Tabs } from 'antd'
import _ from 'lodash'
import { formItems2, formKeys2 } from '../constant'
import  BaseForm  from '../../../../components/common/BaseForm';
import moment from 'moment'
import styles from "../CouponsGiveCoupons.less";
import { eventDateRender, afterPayJumpTypeRender } from '../../helper/common'
import { TreeSelect } from 'antd';
import { decodeUrl } from '@hualala/platform-base'

import { axiosData } from "../../../../helpers/util";
const DATE_FORMAT = 'YYYYMMDD000000';
const { TabPane } = Tabs;
let formList = []

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step2 extends React.Component {
    state = {
        formKeys2: _.cloneDeep(formKeys2),
        count: ['1'],
        activeKey: '1',
        treeData: [],
        filterTreeData: [],
        uniqueLoop: true,
        afterGiftList: [],
        ifJustDelete: false,
    }
    componentDidMount() {
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
            })
        }
        this.props.dispatch({
            type: 'createActiveCom/couponService_getSortedCouponBoardList',
            payload: {
                giftTypes: [10, 20, 21, 111, 110, 22, 30]
            },
        }).then((res) => {
            if (res) {
                this.setState({ treeData: res })
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.stepTwo !== nextProps.stepTwo) {
            this.initGiftData()
        } else if(this.props.ifGoback !== nextProps.ifGoback && nextProps.ifGoback) {
            console.log('now its saving data')
            this.saveGiftData()
        } else {
            return
        }
        
    }

    componentWillUnmount() {
        formList = []
    }

    getForm = (key) => (form) => {
        if(!formList[key] ) {
            formList[key] = form
            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    currentForm: form,
                },
            })
        }
        
    }

    

    changeFilterTreeDataPositive = (index, value) => {
        let { filterTreeData } = this.state
        if (!!value) {
            let mark
            let flag = filterTreeData.some((item, idx) => {
                if(item.index == index) {
                    mark = idx
                    return true
                }
                return false
            })
            if (!flag) {
                filterTreeData.push({
                    index: `${index}`,
                    value: value
                })
            } else {
                filterTreeData[mark].value = value
            }
        }
        this.setState({
            filterTreeData,
        })
    }

    handleFromChange = (index) => (key, value) => {
        if (key === 'consumeGiftID' && !!value) {
            let { filterTreeData } = this.state
            let mark
            let flag = filterTreeData.some((item, idx) => {
                if(item.index == index) {
                    mark = idx
                    return true
                }
                return false
            })
            if (!flag) {
                filterTreeData.push({
                    index: `${index}`,
                    value: value
                })
            } else {
                filterTreeData[mark].value = value
            }
        }
        return
    }
    
    initGiftData = () => {
        //addgift 组件有组价初始值问题，加上step中每一步都是在页面加载统一渲染产生的问题
        setTimeout(() => {
            const { formData } = this.props.createActiveCom
            const { giftList=[] } = formData
            let count = []
            if(giftList.length === 0) {
                count = ['1']
            } else {
                for (let i = 0; i< giftList.length; i++) {
                    count.push('1')
                }
                formList[0].setFieldsValue({mySendGift: this.transGiftData(giftList[0]) || {}})
                formList[0].setFieldsValue({consumeGiftID: giftList[0].consumeGiftID || {}})
                this.changeFilterTreeDataPositive(0, giftList[0].consumeGiftID)
            }
            this.setState({
                count,
            }, () => {
               this.initFormInstance() 
            })
        }, 500)
    }

    initFormInstance = () => {
        const { count } = this.state
        const  { itemID } = decodeUrl()
        const { formData } = this.props.createActiveCom
        const { giftList=[] } = formData
        setTimeout(() => {
            // 回显逻辑，在切换tab时进行多tab实例化这样在用户没有渲染其他baseform的时候，先获得form实例
            if(giftList.length) {
                count.forEach((item, index) => {
                    this.onChange(index+1, true)
                })
                this.onChange(1, true)
            }
        }, 500)
        setTimeout(() => {
            // 回显逻辑，在切换tab时进行多tab实例化这样在用户没有渲染其他baseform的时候，先获得form实例
            if(giftList.length) {
                formList.forEach((item, index) => {
                    if(index) {
                        // if(index !== formList.length-1) {
                            item.setFieldsValue({mySendGift: this.transGiftData(giftList[index]) || {}})
                            item.setFieldsValue({consumeGiftID: giftList[index].consumeGiftID || {}})
                            this.changeFilterTreeDataPositive(index, giftList[index].consumeGiftID)
                        // }
                    }
                }) 
            }
        }, 1000)
    }

    handleSubmit = () => {
        //验证表单
        let flag = true
        let gifts = []
        const { giftForm, formData } = this.props.createActiveCom
        giftForm.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            } else {
                const { formData } = this.props.createActiveCom
                this.props.dispatch({
                    type: 'createActiveCom/updateState',
                    payload: {
                        formData: {
                            ...formData,
                            mySendGift: v
                        }
                    }
                })
            }
        })
        if(!flag) {
            return flag
        }
        formList.forEach(form => {
            form.validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }
                // 不符合人性的设计
                let effectType = v.mySendGift.effectType || 1
                let effectTime = null
                let validUntilDate = null
                let giftEffectTimeHours = v.mySendGift.giftEffectTimeHours
                if(effectType == 1) {
                    if(v.mySendGift.countType == '1') {
                        effectType = 3
                        if(!v.mySendGift.giftEffectTimeHours) {
                            giftEffectTimeHours = '1'
                        } else {
                            giftEffectTimeHours = v.mySendGift.giftEffectTimeHours
                        }
                    }
                } else {
                    effectTime = v.mySendGift.rangeDate[0].format('YYYYMMDDHHmmss')
                    validUntilDate =v.mySendGift.rangeDate[1].format('YYYYMMDDHHmmss')
                }
                gifts.push({
                        ...v.mySendGift,
                        consumeGiftID: v.consumeGiftID,
                        effectType: effectType,
                        effectTime,
                        validUntilDate,
                        giftEffectTimeHours,
                })
            })
        })
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    gifts,
                }
            }
        })
        return flag
    }

    saveGiftData = () => {
          //验证表单
          let flag = true
          let gifts = []
          const { giftForm, formData } = this.props.createActiveCom
          giftForm.validateFieldsAndScroll((e,v) => {
              if(e) {
                  flag = false
              } else {
                  const { formData } = this.props.createActiveCom
                  this.props.dispatch({
                      type: 'createActiveCom/updateState',
                      payload: {
                          formData: {
                              ...formData,
                              mySendGift: v
                          }
                      }
                  })
              }
          })
          formList.forEach(form => {
              form.validateFieldsAndScroll((e,v) => {
                  if(e) {
                      flag = false
                  }
                  let effectType = v.mySendGift.effectType || 1
                  let effectTime = null
                  let validUntilDate = null
                  let giftEffectTimeHours = null
                  if(effectType == 1) {
                      if(v.mySendGift.countType == '1') {
                          effectType = 3
                          if(!v.mySendGift.giftEffectTimeHours) {
                              giftEffectTimeHours = '1'
                          } else {
                              giftEffectTimeHours = v.mySendGift.giftEffectTimeHours
                          }
                      }
                  } else {
                      effectTime = v.mySendGift.rangeDate[0].format('YYYYMMDDHHmmss')
                      validUntilDate =v.mySendGift.rangeDate[1].format('YYYYMMDDHHmmss')
                  }
                  gifts.push({
                          ...v.mySendGift,
                          consumeGiftID: v.consumeGiftID,
                          effectType: effectType,
                          effectTime,
                          validUntilDate,
                          giftEffectTimeHours,
                  })
              })
          })
          this.props.dispatch({
              type: 'createActiveCom/updateState',
              payload: {
                  formData: {
                      ...formData,
                      giftList: gifts,
                  }
              }
          })
          this.props.changeGoBack()       
    }

    getDateCount = () => {
        const { formData } = this.props.createActiveCom;
        const {  eventDate, afterPayJumpType } = formData || {};
        const startTime = eventDate && eventDate[0]
        const endTime = eventDate && eventDate[1]
        if (undefined == startTime || undefined == endTime) {
            return 0
        }
        return moment(endTime, DATE_FORMAT)
            .diff(moment(startTime, DATE_FORMAT), 'days') + 1;
    }

    addTab = () => {
        const { count } = this.state
        let length = count.length
        if(length < 5) {
            const { giftForm } = this.props.createActiveCom
            let flag = true
            formList[length-1].validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }
            })
            giftForm.validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }
            })
            if(!flag) {
                return
            }
            this.setState({
                count: count.concat(`1`),
                activeKey: `${length+1}`
            })
        } else {
            message.warn(`至多可添加5组规则`)
        }
    }

    onChange = (key, ifLetGo) => {
        const { activeKey } = this.state
        //在切tab时 校验前一个tab是否合规
        const { giftForm } = this.props.createActiveCom
        let flag = true
        if(!ifLetGo) {
            giftForm.validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }
            })
        }
        formList[activeKey-1].validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            }
        })
        if(!flag) {
            return
        }
        this.setState({
            activeKey: `${key}`
        })
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                currentForm: formList[key-1],
            },
        })
    }

    deleteTab = (key) => {
        let { count, filterTreeData } = this.state
        let { formData } = this.props.createActiveCom
        let {giftList = []} = formData
        const  { itemID } = decodeUrl()
        if (count.length === 1) {
            message.warn('至少有1条规则')
            return
        }
        let a = []
        filterTreeData.forEach((item, index) => {
            if(item.index > key-1) {
                a.push({
                    index: item.index-1,
                    value: item.value
                }) 
            } else if(item.index < key-1) {
                a.push(item)
            }
        })
        count.pop()
        let temp = []
        for (let i = 0; i<formList.length; i++) {
            formList[i].validateFieldsAndScroll((e,v) => {
                if(e) {
                    return
                } else {
                    if(i != key-1) {
                        temp.push(v)
                    }
                }
            })
        }
        formList = []
        this.changeDomData()
        //form的数据替换不掉 具体再看
        this.setState({
            count: count,
            activeKey: `${count.length}`,
            filterTreeData: a,
            ifJustDelete: true,
            afterGiftList: temp, 
            uniqueLoop: false,
        }, () => {
            this.setState({
                uniqueLoop: true,
            })
        })
        
    }
    changeDomData = () => {
        let temp = []
        for (let i = 0; i<formList.length; i++) {
            formList[i].validateFieldsAndScroll((e,v) => {
                if(e) {
                    return
                } else {
                    temp.push(v)
                }
            })
            this.setState({
                uniqueLoop: false
            }, () => {
                this.setState({
                    uniqueLoop: true
                }
                // , () => {
                //     formList.forEach((item, index) => {
                //         item.setFieldsValue({mySendGift: temp[index].mySendGift || {}})
                //         item.setFieldsValue({consumeGiftID: temp[index].consumeGiftID || {}})
                //     })
                // }
                )
            })
        }
        formList=[]
        this.setState({
            afterGiftList: temp
        })
    }

    onEdit = (targetKey, action) => {
        switch(action) {
            case 'remove':
                this.deleteTab(targetKey)
                break;
            default:
                this.deleteTab(targetKey)
        }
    };

    filterTreeDataMet = (index) => {
        const { treeData, filterTreeData } = this.state
        let arr = filterTreeData.filter((item) => {
            return item.index != index
        })
        let tree = JSON.parse(JSON.stringify(treeData))
        tree.forEach((item) => {
            item.children = item.children.filter((every) => {
                return !arr.some((each) => {
                    return each.value === every.key
                })
            })
        })
        return tree
    }

    filterFormItems = (index) => {
        const ctx = this
        let result = {
            ...formItems2,
            consumeGiftID: {
                ...formItems2.consumeGiftID,
                render(d) {
                    return d({})(<TreeSelect
                        treeData={ctx.filterTreeDataMet(index)}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择礼品名称"
                        showSearch={true}
                        treeNodeFilterProp="label"
                        allowClear={false}
                    />);
                },
            },
        }
        return result
    }

    transGiftData = (gift) => {
        let effectType = gift.effectType == 2 ? 2 : 1
        let countType = gift.effectType == 2 ? null : gift.effectType == 3 ? '1' : '0';
        let rangeDate
        if(effectType == 2) {
            rangeDate = [moment(gift.effectTime,'YYYYMMDDHHmmss'),moment(gift.validUntilDate,'YYYYMMDDHHmmss')]
        }
        let temp = {
            ...gift,
            countType,
            effectType,
            giftEffectTimeHours: `${gift.giftEffectTimeHours}`,
            rangeDate,
        }
        return temp
    }
    render () {
        const { formKeys2, count, activeKey, treeData, filterTreeData, uniqueLoop, afterGiftList } = this.state
        const { wxNickNameList } = this.props.createActiveCom

        formItems2.eventDate.render = eventDateRender.bind(this)
        formItems2.mySendGift.render = formItems2.mySendGift.render.bind(this)
        formItems2.afterPayJumpType.render =  afterPayJumpTypeRender.bind(this)
        if(formKeys2.includes('consumeGiftID')) {
            formItems2.consumeGiftID.options = treeData
        }
        const { formData } = this.props.createActiveCom
        const { giftList = [] } = formData
        return (
            <div className={styles.stepTwo} style={{marginRight: '20px'}}>
                 <Button type='primary' onClick={this.addTab} className={styles.addRulesBtn}>
                    <Icon type="plus" />
                    添加规则
                 </Button>
                 <span className={styles.reminderSpan}>至多可添加5组规则</span>
                 <div className={styles.grayLine}></div>
                 <div className={styles.tabArea}>
                    <Tabs
                        className="tabsStyles"
                        activeKey={activeKey}
                        onChange={activeKey => this.onChange(activeKey)}
                        onEdit={this.onEdit}
                        type="editable-card"
                        hideAdd
                    >
                        {
                            count.map((tab, index) => {
                                // formData.mySendGift = formData.giftList[index] || {}
                                // if(afterGiftList.length) {
                                //     formData.mySendGift = afterGiftList[index] ? afterGiftList[index].mySendGift : {}
                                //     formData.consumeGiftID = afterGiftList[index] ? afterGiftList[index].consumeGiftID : '' 
                                // } else {
                                    formData.mySendGift = formData.giftList[index] ? this.transGiftData(formData.giftList[index]) : ''
                                    formData.consumeGiftID = formData.giftList[index] ? formData.giftList[index].consumeGiftID : ''
                                // }
                                // console.log('formData.consumeGiftID', formData.consumeGiftID, `index  ${index}`)
                                // console.log('afterGiftList', afterGiftList)
                                return (
                                <TabPane tab={`规则${index+1}`} key={index+1}>
                                    {
                                        uniqueLoop && 
                                        <BaseForm
                                            getForm={this.getForm(index)}
                                            formItems={this.filterFormItems(index)}
                                            formData={afterGiftList.length ? afterGiftList[index] : formData}
                                            formKeys={formKeys2}
                                            key={`speForm${index}`}
                                            onChange={this.handleFromChange(index)}
                                            formItemLayout={{
                                            labelCol: { span: 3 },
                                            wrapperCol: { span: 21 },
                                            }}
                                        />
                                    }
                                </TabPane>)
                            })
                        }
                    </Tabs>
                 </div>     
            </div>
        )
    }
}

export default Step2

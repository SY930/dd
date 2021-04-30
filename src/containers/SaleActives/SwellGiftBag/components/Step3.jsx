import React from 'react'
import {   Tabs, Radio, message } from 'antd'
import styles from '../swellGiftBag.less'
import {connect} from 'react-redux';
import TabItem from './TabItem/TabItem'
import moment from 'moment'
import { dateFormat } from '../../constant'

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const formList = [];
const giftForm = [];
const numMap = {2: '三', 3: '四', 4: '五'}
@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step3 extends React.Component {
    tabKey = 1;
    state = {
        giftGetRule: 0,
        chooseTab: '0',
        treeData: this.props.createActiveCom.crmGiftTypes,
        formList: [],
        gearTab: [],
    }

    componentDidMount () {

        this.getSubmitFn()

    }

    getSubmitFn = () => {
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
            })
        }
    }

    handleSubmit = () => {
        let flag = true

        const { formData: modalFormData } = this.props.createActiveCom

        const { needCount, giftList } = modalFormData
        console.log('giftList:》》》》》》 ', giftList);
        let formData = {
            ...modalFormData,
        }

        giftList.forEach(v => {
            if(v.rangeDate) {
                v.effectTime = moment(v.rangeDate[0]).format(dateFormat)
                v.validUntilDate = moment(v.rangeDate[1]).format(dateFormat)
            }
        })

        formList.forEach(form => {
            form.validateFieldsAndScroll((e,v) => {
                console.log('v: ', v);
                if(e) {
                    flag = false
                }

            })
        })
        if(giftForm[3]) {
            giftForm[3].validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }

            })
            if(flag == false) {
                return false
            }
        }

        const initiator = [...giftList]
        initiator.length = 3
        if(initiator.filter(v => v).length !== 3 && flag) {
            message.warn('你有未设置的档位')
            return false
        }

        // 校验膨胀人数
        if(needCount[1] < needCount[0]) {
            message.warn('第二档数值必须大于上一档位的人数')
            return false
        }

        if(needCount[2] < needCount[1]) {
            message.warn('第三档数值必须大于上一档位的人数')
            return false
        }

        // 添加膨胀所需要的人数
        giftList.forEach((v,i) => {
            v.needCount = needCount[i]

        })


        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    giftList
                }
            }
        })

        return  flag
    }

    onRadioChange = (e) => {
        const { formData } = this.props.createActiveCom
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    giftGetRule: e.target.value
                }
            }
        })

    }

    onEdit = (targetKey, action) => {
        console.log('onEdit: ');
        this[action](targetKey);
    }

    add = () => {
        let flag = true;
        const { formData = {} } = this.props.createActiveCom;
        const { giftList = {} } = formData;
       if (this.handleSubmit()) {
            if (this.key === 4) return message.warn('最多添加五个档位');
            const { gearTab, chooseTab} = this.state;
            this.tabKey = this.tabKey + 1;
            const id = Date.now().toString(36); // 随机不重复ID号
            gearTab.push({id, effectType: '1', title: `档位${numMap[this.tabKey]}`, content: 'Content of new Tab', key: this.tabKey });
            const newTab = {...giftList, ...gearTab }
            this.setState({ gearTab, chooseTab: this.tabKey });
        }
        
    }

    handleTabChange = (e) => {
        console.log('e: ', e);
        let flag = true
        // debugger
        const giftFormInitiator = [...giftForm]
        giftFormInitiator.length = 3
        giftFormInitiator.forEach(form => {
            if(form) {
                form.validateFieldsAndScroll((e,v) => {
                    if(e) {
                        flag = false
                    }

                })
            }
        })
        formList.forEach(form => {
            form.validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }

            })
        })

        if(!flag) {
            return flag;
        }
        this.setState({
            chooseTab: e
        })

    }

    getForm = (key) => (form) => {
        if(!formList[key] ) {
            formList[key] = form
        }

    }

    handleGiftChange = (key) => {
        // console.log('key: ', key);
        return (giftData) => {
            // console.log('key:------------------- ', key);
    
            const { formData,isView,isEdit } = this.props.createActiveCom
            const { giftList } =  formData
            const { treeData } = this.state
    
            if((isView || isEdit) && !giftList[3] && key == 3 ) {
                return
            }
            let chooseCoupon = {}
            const chooseCouponItem = treeData.filter(v => {
                const list = v.children || []
               const chooseItem =  list.find(item => item.key === giftData[0].giftID)
                if(chooseItem) {
                    chooseCoupon = chooseItem
                }
                return chooseItem
            })
            const label = chooseCouponItem[0] && chooseCouponItem[0].label
    
            if(label) {
                giftData[0].label =  label
                giftData[0].giftValue = chooseCoupon.giftValue
            }
    
    
            giftList[key] = { ...giftList[key], ...giftData[0]}
    
    
            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    formData: {
                        ...formData,
                        giftList
                    }
                }
            })
        }
    }

    cacheTreeData = (treeData) => {
        this.setState({
            treeData
        })
    }

    onIptChange = (key) => (e)  => {

        const { formData } = this.props.createActiveCom
        const { needCount } =  formData
        needCount[key] = Number(e.number)

        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    needCount
                }
            }
        })

    }

    getGiftForm = (key) => (form) => {
        giftForm[key] = form
    }

    handleHelpCheckbox = (e) => {

        const { formData  } = this.props.createActiveCom
        const { giftList } = formData
        if(e.target.checked && (giftList.length < 4)) {
            giftList[3] = ({
                 id: 'wdjiejmgnglooe',
                 effectType: '1'
            })
        } else {
            giftList.length = 3
        }
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    giftList
                }
            }
        })
    }


    render () {

        const { formData, currentStep , isEdit, isView } = this.props.createActiveCom
        console.log('formData: ', formData);
        const { giftList, needCount, giftGetRule } = formData
        const {  chooseTab ,treeData, gearTab } = this.state
        // console.log('gearTab: ', gearTab);
        let activeTab = (<TabPane forceRender={true} style={{ display: 'none' }}></TabPane>);
        if (gearTab.length > 0) {
            activeTab = gearTab.map((item) =>
                <TabPane key={item.key} tab={item.title}>
                    {item.content}
                </TabPane>
            )
        }
        if(isEdit && currentStep !== 2) {
            return null
        }
        const checkedHelp = giftList[3]
        const isNew = !(isEdit || isView)
        return (
            <div className={styles.step3Wrap}>
                <div className={styles.initiatorWrap}>
                    <div className={styles.title}>
                        <div className={styles.line}></div>
                        发起人奖励
                    </div>
                    {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                    <div className={styles.giftMethods}>
                        礼品领取方式
                        <RadioGroup style={{marginLeft: '20px'}} onChange={this.onRadioChange} value={giftGetRule}>
                            <Radio value={0}>领取符合条件的最高档位礼品</Radio>
                            <Radio value={1}>领取符合条件的所有档位礼品</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <Tabs
                    // hideAdd={true}
                    // type="editable-card"
                    // onEdit={this.onEdit}
                    onChange={this.handleTabChange}
                    activeKey={chooseTab}
                    type="card"
                    className={styles.tabs}
                >
                    <TabPane tab="档位一" key="0" closable={false}>
                        {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                        <TabItem
                            itemKey={"0"}
                            getForm={this.getForm('0')}
                            handleGiftChange={this.handleGiftChange('0')}
                            giftList={giftList}
                            onIptChange={this.onIptChange('0')}
                            getGiftForm={this.getGiftForm('0')}
                            needCount={needCount}
                            closable={false}
                         />
                        </TabPane>
                    <TabPane tab="档位二" key="1" closable={false}>
                        {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                        <TabItem
                        itemKey={"1"}
                        getForm={this.getForm('1')}
                        handleGiftChange={this.handleGiftChange('1')}
                        giftList={giftList}
                        treeData={treeData}
                        onIptChange={this.onIptChange('1')}
                        getGiftForm={this.getGiftForm('1')}
                        needCount={needCount}
                        />
                    </TabPane>
                    <TabPane tab="档位三" key="2">
                        {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                        <TabItem
                        itemKey={"2"}
                        getForm={this.getForm('2')}
                        handleGiftChange={this.handleGiftChange('2')}
                        giftList={giftList}
                        treeData={treeData}
                        onIptChange={this.onIptChange('2')}
                        getGiftForm={this.getGiftForm('2')}
                        needCount={needCount}
                        />
                    </TabPane>

                    {/* {
                        gearTab.length > 0 ? gearTab.map((item) =>
                            <TabPane key={item.key} tab={item.title}>
                                {item.content}
                            </TabPane>
                        ) : null
                    } */}
                </Tabs>
                <div className={styles.helpPeople}>
                    <div className={styles.title}>
                        <div className={styles.line}></div>
                         助力人奖励
                    </div>
                    {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                    <TabItem
                     itemKey={"3"}
                     handleGiftChange={this.handleGiftChange('3')}
                     giftList={giftList}
                     isHelp
                     treeData={treeData}
                     cacheTreeData={this.cacheTreeData}
                     getGiftForm={this.getGiftForm('3')}
                     handleHelpCheckbox={this.handleHelpCheckbox}
                     checkedHelp={checkedHelp}
                     isNew
                     />
                </div>
            </div>
        )
    }
}

export default Step3

import React from 'react'
import {   Tabs, Radio, message } from 'antd'
import styles from '../swellGiftBag.less'
import {connect} from 'react-redux';
import TabItem from './TabItem/TabItem'
import moment from 'moment'
import { dateFormat } from '../../constant'

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
let formList = [];
let giftForm = [];
const numMap = {2: '三', 3: '四', 4: '五'}
let _FLAG = false;
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

    componentDidUpdate () {
        const { formData = {}, isView, isEdit } = this.props.createActiveCom;
        const { giftList = [] } = formData;
        if ( Array.isArray(giftList) ) {
            if (giftList.length > 2 && (isView || isEdit ) && !_FLAG) {
                this.resetGearTab(); // 动态拼接档位三-五。只执行一次
                _FLAG = true;
            }
        }
    }

    componentWillUnmount () {
        _FLAG = false;
        // console.log('tabKey', this.tabKey)
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
        let formData = {
            ...modalFormData,
        }

        giftList.forEach(v => {
            if(v.rangeDate) {
                v.effectTime = moment(v.rangeDate[0]).format(dateFormat)
                v.validUntilDate = moment(v.rangeDate[1]).format(dateFormat)
            }
        })

        formList.forEach(form => { // 校验膨胀所需人数
            form.validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }

            })
        })
        const giftFormInitiator = [...giftForm]
        giftFormInitiator.length = formList.length;
        giftFormInitiator.forEach(form => { // 校验所有礼品
            if(form) {
                form.validateFieldsAndScroll((e,v) => {
                    if(e) {
                        flag = false
                    }

                })
            }
        })
        if(giftForm[5]) {
            giftForm[5].validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }

            })
            if(flag == false) {
                return false
            }
        }

        const initiator = [...giftList];
        initiator.length = 2
        if(initiator.filter(v => v).length !== 2 && flag) {
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
        if(needCount[3] < needCount[2]) {
            message.warn('第四档数值必须大于上一档位的人数')
            return false
        }
        if(needCount[4] < needCount[3]) {
            message.warn('第五档数值必须大于上一档位的人数')
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
        this[action](targetKey);
    }

    handleCheckGifts = () => {
        let flag = true

        const { formData: modalFormData } = this.props.createActiveCom

        const { needCount, giftList } = modalFormData
        let formData = {
            ...modalFormData,
        }

        giftList.forEach(v => {
            if(v.rangeDate) {
                v.effectTime = moment(v.rangeDate[0]).format(dateFormat)
                v.validUntilDate = moment(v.rangeDate[1]).format(dateFormat)
            }
        })

        formList.forEach(form => { // 校验膨胀所需人数
            form.validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }

            })
        })
        const giftFormInitiator = [...giftForm]
        giftFormInitiator.length = formList.length;
        giftFormInitiator.forEach(form => { // 校验所有礼品
            if(form) {
                form.validateFieldsAndScroll((e,v) => {
                    if(e) {
                        flag = false
                    }

                })
            }
        })
        const initiator = [...giftList];
        initiator.length = 2
        if(initiator.filter(v => v).length !== 2 && flag) {
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
        if(needCount[3] < needCount[2]) {
            message.warn('第四档数值必须大于上一档位的人数')
            return false
        }
        if(needCount[4] < needCount[3]) {
            message.warn('第五档数值必须大于上一档位的人数')
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

    add = () => {
        const { formData = {} } = this.props.createActiveCom;
        const { giftList = {}, needCount } = formData;
       if (this.handleCheckGifts()) {
            if (this.tabKey === 4) return message.warn('最多添加五个档位');
            const { gearTab } = this.state;
            this.tabKey = this.tabKey + 1;
            const key = String(this.tabKey);

            gearTab.push({title: `档位${numMap[this.tabKey]}`, content: this.content(key, needCount, giftList), key: this.tabKey });

            this.setState({ gearTab, chooseTab: key });
        }
        
    }

    remove = (targetKey) => {

        const removeKey = targetKey.split('-')[0];
        const { formData, isView, isEdit } = this.props.createActiveCom;
        const { giftList, needCount } =  formData;
        if (isView && !isEdit) { return }
        let { gearTab, chooseTab } = this.state;
        // console.log('formList--- before', formList, giftForm)
        let reGiftList;
        reGiftList = giftList.slice(0, 5).filter((_, i) => i != removeKey);
        // 移除对应的formList和giftForm
        const cacheGiftForm5 = giftForm[5];
        formList.forEach((form, i) => {
            if (i == removeKey) {
                formList.splice(i, 1)
            }
        })
        giftForm = giftForm.slice(0, 5);

        giftForm.forEach((_, i) => {
            if (i == removeKey) {
                giftForm.splice(i, 1)
            }
        })

        // 移除对应的needCount
        const reNeedCount = needCount.filter((_, i) => i != removeKey);
        // console.log('reNeedCount: ', reNeedCount);
        // console.log('formList---- after', formList, giftForm)

        if (giftList[5]) {
            reGiftList[5] = giftList[5];
            giftForm[5] = cacheGiftForm5;
        }

        let lastIndex;
        gearTab.forEach((tab, i) => {
          if (tab.key === removeKey) {
            lastIndex = i - 1;
          }
        });
    
        const reGearTab = gearTab.filter(tab => {
            const tabkey = `${tab.key}`.split('-')[0];
            return tabkey != removeKey
        });

        let key = 1;
        const removeGearTab = (reGearTab || []).map((item, i) => {
            key = i + 2;
            return {
                ...item,
                title: `档位${numMap[i + 2]}`, 
                key: `${i + 2}-${Date.now().toString(36)}`,
                content: this.content(String(i + 2), reNeedCount, reGiftList)
            }
        })
        this.tabKey = key;

        if (lastIndex >= 0 && chooseTab === removeKey) {
            chooseTab = removeGearTab[lastIndex].key;
        }

        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    needCount: reNeedCount,
                    giftList: reGiftList,
                }
            }
        })
        this.setState({ gearTab: removeGearTab, chooseTab })
    }

    content = (key, needCount, giftList) => {
        return (
            <TabItem
                key={key}
                itemKey={key}
                getForm={this.getForm(key)}
                handleGiftChange={this.handleGiftChange(key)}
                giftList={giftList}
                onIptChange={this.onIptChange(key)}
                getGiftForm={this.getGiftForm(key)}
                needCount={needCount}
            // closable={false}
            />
        )
    }

    handleTabChange = (e) => {
        let flag = true;
        const giftFormInitiator = [...giftForm];

        giftFormInitiator.length = formList.length;  // 只校验三个档位
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
            return
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

    handleGiftChange = (key) => (giftData) => {
        const { formData, isView, isEdit } = this.props.createActiveCom
        const { giftList = [] } = formData
        const { treeData } = this.state

        if ((isView || isEdit) && !giftList[5] && key == 5) {
            return
        }
        let chooseCoupon = {}
        const chooseCouponItem = treeData.filter(v => {
            const list = v.children || []
            const chooseItem = list.find(item => item.key === giftData[0].giftID)
            if (chooseItem) {
                chooseCoupon = chooseItem
            }
            return chooseItem
        })
        const label = chooseCouponItem[0] && chooseCouponItem[0].label

        if (label) {
            giftData[0].label = label
            giftData[0].giftValue = chooseCoupon.giftValue
        }
        // console.log('giftData', giftData);
       if (giftData[0].effectType === '2') {// 重置生效方式为固定有效期时countType的值
            giftData[0].countType = '0'
       }

        giftList[key] = { ...giftList[key], ...giftData[0] }


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
        if(e.target.checked && (giftList.length < 6)) {
            giftList[5] = ({
                 id: 'wdjiejmgnglooe',
                 effectType: '1'
            })
        } else {
            giftList.length = formList.length;
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
     resetGearTab = () => {
        const { formData = {} } = this.props.createActiveCom;
        const { giftList = [], needCount } = formData;
        const { gearTab } = this.state;
        // console.log('this.tabKey', this.tabKey)
        if (giftList.length > 2) {
            let newG = [];
            giftList.map((item, i) => {
                if (item.sendType == '0') { // 只需要档位的giftlist
                    newG[i] = {...item};
                }
            })
            const reGearTab = newG.slice(2);
            reGearTab.forEach(() => {
                this.tabKey = this.tabKey + 1;
                const key = String(this.tabKey);
                gearTab.push({ title: `档位${numMap[this.tabKey]}`, content: this.content(key, needCount, giftList), key: this.tabKey });
            })
            this.setState({ gearTab });
        }
    }


    render () {

        const { formData, currentStep , isEdit, isView } = this.props.createActiveCom
        const { giftList, needCount, giftGetRule } = formData;
        console.log('giftList: ', giftList, 'formData', formData);
        const {  chooseTab ,treeData, gearTab } = this.state;
        // console.log('gearTab: ', gearTab);

        let activeTab = (<TabPane tab="档位二" key="1" closable={false}>
            {isView && !isEdit && <div className={styles.disabledDiv}></div>}
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
        </TabPane>);
        if (gearTab.length > 0) {
            const addActiveTab = gearTab.map((item) =>
                <TabPane key={item.key} tab={item.title}>
                    {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                    {item.content}
                </TabPane>
            )
            activeTab = [ activeTab, ...addActiveTab];
        }
        if(isEdit && currentStep !== 2) {
            return null
        }
        let checkedHelp = false;
        if (Array.isArray(giftList)) {
            checkedHelp = !!giftList[5];
        }
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
                    hideAdd={isView&&!isEdit}
                    type="editable-card"
                    onEdit={this.onEdit}
                    onChange={this.handleTabChange}
                    activeKey={chooseTab}
                    // type="card"
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
                    {/* <TabPane tab="档位二" key="1" closable={false}>
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
                    </TabPane> */}
                   {activeTab}
                    {/* <TabPane tab="档位三" key="2">
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
                    </TabPane> */}
                </Tabs>
                <div className={styles.helpPeople}>
                    <div className={styles.title}>
                        <div className={styles.line}></div>
                         助力人奖励
                    </div>
                    {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                    <TabItem
                    key={'5'}
                     itemKey={'5'}
                     handleGiftChange={this.handleGiftChange('5')}
                     giftList={giftList}
                     isHelp
                     treeData={treeData}
                     cacheTreeData={this.cacheTreeData}
                     getGiftForm={this.getGiftForm('5')}
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

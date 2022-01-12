/**
 * @description  新增券包的券包编辑页面
 * 
*/
import React, { PureComponent as Component } from 'react';
import { Button, message, Alert ,Select,Form,Col,Radio, Input } from 'antd';
import moment from 'moment';
import BaseForm from 'components/common/BaseForm';
import ShopSelector from 'components/ShopSelector';
import styles from './index.less';
import { formItems, formKeys, formItemLayout } from './Common';
import { keys1, keys2, keys3, keys4, keys5, keys7,keys8,keys9,keys10,keys11,keys12,DF, TF } from './Common';
import GiftInfo from '../../GiftAdd/GiftInfo';
import ImageUpload from './ImageUpload';
import EveryDay from './EveryDay';
import { putTicketBag, postTicketBag } from './AxiosFactory';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

// const ImageView = (props) => {
//     const url = `http://res.hualala.com/${props.value || 'basicdoc/ca249689-3339-4895-b481-43322147862f.png'}`
//     const _styles = {
//         width: '198px',
//         height: '96px',
//         objectFit: 'contain',
//     }
//     return (
//         <img src={url} alt="logo" style={_styles}></img>
//     )
// }

export default class Editor extends Component {
    state = {
        newFormKeys: formKeys,
        radioVal:'1'
    }
    keys = formKeys;
    /**
     * 这块的逻辑判断我也是醉了
     * 新建和回显总是各种bug。
     * 无奈只能 state 和 keys 混合判断
     */
    onChange = (key, value) => {
        const { keys } = this;
        const [a, b, c] = [...keys];
        let [newA, newB, newC] = [a, b, c];
        if (key==='couponPackageType'){
            if(value === '1'){
                newA = {...a, keys: keys1 };
            } else {
                newA = {...a, keys: keys2};
            }
            this.keys = [newA, newB, newC];
            this.setState({ newFormKeys: [newA, newB, newC] });
        }
        
        if (key==='cycleType') { // 选择周期
            const { getFieldsValue } = this.form;
            const { couponSendWay, couponPackageRadioSelect} = getFieldsValue();
            if (couponSendWay==='1') { return; }
            if(couponPackageRadioSelect){
                if(value){ 
                    if(couponPackageRadioSelect == '2'){
                        newB = {...b, keys: keys10};
                    }else{
                        newB = {...b, keys: keys9};
                    }
                }else{
                    if(couponPackageRadioSelect == '2'){
                        newB = {...b, keys: keys8};
                    }else{
                        newB = {...b, keys: keys7};
                    }
                }
                this.keys = [newA, newB, newC];
                this.setState({ newFormKeys: [newA, newB, newC] });
            }
        }
        if (key === 'couponPackageRadioSelect'){
            const { getFieldsValue } = this.form;
            const { cycleType } = getFieldsValue();
            if(value == '2'){
                if(cycleType){
                    newB = {...b, keys: keys10};
                }else{
                    newB = {...b, keys: keys8};
                }
            }else{
                if(cycleType){
                    newB = {...b, keys: keys9};
                }else{
                    newB = {...b, keys: keys7};
                }
            }
            this.keys = [newA, newB, newC];
            this.setState({ newFormKeys: [newA, newB, newC]});
        }
        if (key === 'maxSendLimit'){
            const { getFieldsValue,setFieldsValue } = this.form;
            const { couponSendWay,couponPackageRadioSelect, cycleType} = getFieldsValue();
            if (couponSendWay==='1') { return; }
            if(couponPackageRadioSelect){
                if(couponPackageRadioSelect == '2'){
                    if(cycleType){
                        if(value && Number(value) > 1 ){
                            newB = {...b, keys: keys10};
                        }else{
                            newB = {...b, keys: keys12};
                        }
                    }else{
                        if(value && Number(value) > 1 ){
                            newB = {...b, keys: keys8};
                        }else{
                            newB = {...b, keys: keys11};
                        }
                    }
                }else{
                    if(cycleType){
                        newB = {...b, keys: keys9};
                    }else{
                        newB = {...b, keys: keys7};
                    }
                    
                }
                this.keys = [newA, newB, newC];
                this.setState({ newFormKeys: [newA, newB, newC],});
            }
            
        }
        if (key==='couponSendWay') { // 发放类型
            const { getFieldsValue,setFieldsValue } = this.form;
            const { couponPackageGiftConfigs } = getFieldsValue();
            if(value === '1'){
                newB = {...b, keys: keys3};
            } else {
                if(couponPackageGiftConfigs && couponPackageGiftConfigs.length > 0 ){
                    let hasStage = couponPackageGiftConfigs.some((item)=>item.stage == '1')
                    if(hasStage){
                        newB = {...b, keys: keys8};
                    }else{
                        newB = {...b, keys: keys7};
                    }
                }else{
                    newB = {...b, keys: keys7};
                }
            }
            this.keys = [newA, newB, newC];
            this.setState({ newFormKeys: [newA, newB, newC]});
        }
    }
    /** 获取会员卡类型 */
    getGroupCardTypeOpts (){
        const { groupCardTypeList } = this.props;
        let cardTypeList = [];
        if(groupCardTypeList && this.isArray(groupCardTypeList)){
            cardTypeList = groupCardTypeList.filter((i)=>i.isActive);
        }
        
        return cardTypeList.map(x => {
            const { cardTypeID, cardTypeName, isActive } = x;
            return { label: cardTypeName, value: cardTypeID };
        });
    }
    /** 得到form */
    getForm = (form) => {
        this.form = form;
    }
    disabledDate = current => {
        const yesterday = moment().subtract('days', 2);
        return current && current.valueOf() < yesterday;
    }
    imageUploadDom = () => {
        const width = 100, height = 95, limit = 1024 * 2, cropperRatio = 520 / 416; 
        const children = (
            <div>
                <p className="ant-upload-hint">小程序分享图</p>
                <p className="ant-upload-hint">图片建议尺寸：520*416</p>
                <p className="ant-upload-hint">支持PNG、JPG格式，大小不超过2M</p>
            </div>
        );
        return (
            <ImageUpload
                width={width}
                height={height}
                limit={limit}
                cropperRatio={cropperRatio}
                children={children}
            />
        )
    }
    /** formItems 重新设置 */
    resetFormItems() {
        const { check, detail, settlesOpts } = this.props;
        const { sendCount = 0 } = detail || {};
        let [couponPackageType,cycleType,couponSendWay,couponPackageRadioSelect] = ['1', '','1','1'];
        if (this.form) {
            couponPackageType = this.form.getFieldValue('couponPackageType');
            cycleType = this.form.getFieldValue('cycleType');
            couponSendWay = this.form.getFieldValue('couponSendWay');
            couponPackageRadioSelect = this.form.getFieldValue('couponPackageRadioSelect');
        }
        
        const { couponPackageGiftConfigs, couponPackageGift,couponPackageFirstGift,couponPackageFollowGift,shopInfos, couponPackageImage, couponPackageType: cpt,
            validCycle, sellTime, settleUnitID, defaultCardTypeID,isAutoRefund, remainStock, miniProgramShareImagePath, ...other } = formItems;
        const disGift = check || (+sendCount > 0);
        const defaultCardOpts = this.getGroupCardTypeOpts();
        const render = d => d()(<GiftInfo disabled={disGift} isNeedMt={couponSendWay == '2'  ? true : false}/>);
        const render1 = d => d()(<ShopSelector disabled={check} />);
        const render2 = d => d()(<ImageUpload />);
        const render3 = d => d()(<EveryDay type={cycleType} disabled={disGift} />);
        const render4 = d => d()(this.imageUploadDom());
        const render5 = d => d()(<Select
            style={{
                width: 354
            }}
            showSearch={true}
            allowClear={true}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
            {
                defaultCardOpts.map((type, index) =>
                    <Option key={index} value={String(type.value)} >{type.label}</Option>
                )
            }
        </Select>);
        const render6 = d => d()(<Select
            style={{
                width: 354
            }}
            showSearch={true}
            allowClear={true}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
            {
                settlesOpts.map((type, index) =>
                    <Option key={index} value={String(type.value)} >{type.label}</Option>
                )
            }
        </Select>);
        let disDate = {};
        const isEdit = !!detail;    // 编辑状态下
        let stockRule = {};
        if(isEdit) {
            disDate = { disabledDate: this.disabledDate };
            stockRule = {rules: ['numbers']};
        }
        let newFormItems = {
            ...other,
            couponPackageType: { ...cpt, disabled: isEdit },
            sellTime: { ...sellTime , props: disDate},
            couponPackageGift: { ...couponPackageGift, render:render },
            couponPackageGiftConfigs: { ...couponPackageGiftConfigs, render:render },
            couponPackageFirstGift: { ...couponPackageFirstGift, render:render },
            couponPackageFollowGift: { ...couponPackageFollowGift, render:render },
            shopInfos: { ...shopInfos, render: render1 },
            // couponPackageImage: { ...couponPackageImage, render: render2 }, // 屏蔽掉
            validCycle: { ...validCycle, render: render3 },
            settleUnitID: { ...settleUnitID,render:render6},
            defaultCardTypeID: {...defaultCardTypeID,render:render5},
            isAutoRefund: { ...isAutoRefund, disabled: isEdit },
            remainStock: { ...remainStock, ...stockRule },
            miniProgramShareImagePath: { ...miniProgramShareImagePath, render: render4 }
        };
        if(!cycleType){
            newFormItems['validCycle']  = {...validCycle, render: ()=>{return ''}}
        }else{
            newFormItems['validCycle']  = {...validCycle, render: render3}
        }
        if(check) {
            let obj = {}
            for(let x in newFormItems) {
                obj[x] = {...newFormItems[x], disabled: true };
            }
            return obj;
        }
        if(+sendCount > 0) {
            let obj = {}
            for(let x in newFormItems) {
                const disabled = keys5.includes(x);
                if(disabled){
                    obj[x] = {...newFormItems[x], disabled };
                } else {
                    obj[x] = {...newFormItems[x] };
                }
            }
            return obj;
        }
        return newFormItems;
    }
    onCancel = () => {
        this.props.togglePage();
        this.props.toggleTabs();
    }
    isArray (object) {
        return object && typeof object==='object' &&
                Array == object.constructor;
    }
    onSave = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { groupID, detail } = this.props;
                let { sellTime, couponPackageGift,couponPackageGiftConfigs, shopInfos: shops, sendTime,couponSendWay,couponPackageFirstGift,couponPackageFollowGift,
                        cycleType, validCycle, couponPackagePrice2, couponPackagePrice,
                        remainStock: stock, maxBuyCount: buyCount, ...others,
                    } = v;
                let cycleObj = {};
                let couponPackageArr = [];
                if(couponSendWay=='2'){
                    if(couponPackageFirstGift && couponPackageFirstGift.length > 0){
                        couponPackageFirstGift.forEach((item) => {
                            item['stage'] = 1;
                            couponPackageArr.push(item)
                        })
                    }
                    if(couponPackageFollowGift && couponPackageFollowGift.length > 0){
                        couponPackageFollowGift.forEach((item) => {
                            item['stage'] = 0;
                            couponPackageArr.push(item)
                        })
                    }
                    if(couponPackageGift && couponPackageGift.length > 0){
                        couponPackageGift.forEach((item) => {
                            item['stage'] = 0;
                            couponPackageArr.push(item)
                        })
                    }
                }else if(couponSendWay=='1'){
                    couponPackageGiftConfigs.forEach((item)=>{
                        item['stage'] = 0;
                        couponPackageArr.push(item)
                    })
                }
                if(cycleType && this.isArray(cycleType)){
                    const cycle = validCycle.filter(x => (x[0] === cycleType));
                    cycleObj = { validCycle: cycle };
                    if (!cycle[0]) {
                        message.warning('必须选择一个日期');
                        return;
                    }
                }
                if(cycleType == 'm'){
                    validCycle = validCycle.filter((item,index) => item.indexOf('m') > -1)
                }
                if(cycleType == 'w'){
                    validCycle = validCycle.filter((item,index) => item.indexOf('w') > -1)
                }
                
                let dateObj = {};
                if(sellTime && sellTime[0]) {
                    const [sd, ed] = sellTime;
                    const sellBeginTime = moment(sd).format(DF);
                    const sellEndTime = moment(ed).format(DF);
                    dateObj = { sellBeginTime, sellEndTime };
                }
                let timeObj = {};
                if(sendTime) {
                    timeObj = { sendTime: moment(sendTime).format(TF) };
                }
                const price = couponPackagePrice || couponPackagePrice2;
                const shopInfos = shops ? shops.map(x=>({shopID:x})) : [];  // 店铺可能未选
                const remainStock = stock || '-1';           // 如果清空库存，给后端传-1
                const maxBuyCount = buyCount ? buyCount : '0';
                const couponPackageInfo = { ...timeObj, ...dateObj, ...others, ...cycleObj,validCycle,cycleType,
                    remainStock,maxBuyCount, couponSendWay,couponPackagePrice: price };
                const params = { groupID, couponPackageInfo, couponPackageGiftConfigs:couponPackageArr, shopInfos };

                if(detail){
                    const { couponPackageID } = detail; // 更新需要的id
                    const newParams = { ...params, couponPackageInfo: { ...couponPackageInfo, couponPackageID } };
                    postTicketBag(newParams).then((flag) => {
                        flag && this.onCancel();
                    });
                    return;
                }
                putTicketBag(params).then((flag) => {
                    flag && this.onCancel();
                });
            }
        });

    }
    render() {
        const { newFormKeys } = this.state;
        const { detail, check } = this.props;
        const newFormItems = this.resetFormItems();
        let clazz = styles.formWrap2;
        if(newFormKeys[0].keys.includes('d')){
            clazz = styles.formWrap;
        }

        return (
            <section className={styles.formBox}>
                <div className={styles.header}>
                    券包
                    <p className={styles.opBox}>
                        <Button onClick={this.onCancel}>取消</Button>
                        <Button type="primary" disabled={check} onClick={this.onSave}>保存</Button>
                    </p>
                </div>
                <div className={clazz}>
                    <BaseForm
                        getForm={this.getForm}
                        onChange={this.onChange}
                        formItems={newFormItems}
                        formKeys={newFormKeys}
                        formData={detail || {}}
                        formItemLayout={formItemLayout}
                    />
                </div>
            </section>
        );
    }
}


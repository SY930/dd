/**
 * @description  新增券包的券包编辑页面
 * 
*/
import React, { PureComponent as Component } from 'react';
import { Button, message, Alert } from 'antd';
import moment from 'moment';
import BaseForm from 'components/common/BaseForm';
import ShopSelector from 'components/ShopSelector';
import styles from './index.less';
import { formItems, formKeys, formItemLayout } from './Common';
import { keys1, keys2, keys3, keys4, keys5, DF, TF } from './Common';
import GiftInfo from '../../GiftAdd/GiftInfo';
import ImageUpload from './ImageUpload';
import EveryDay from './EveryDay';
import { putTicketBag, postTicketBag } from './AxiosFactory';

export default class Editor extends Component {
    state = {
        newFormKeys: formKeys,
    }
    keys = formKeys;
    /**
     * 这块的逻辑判断我也是醉了
     * 新建和回显总是各种bug。
     * 无奈只能 state 和 keys 混合判断
     */
    onChange = (key, value) => {
        const { keys } = this;
        const [a, b] = [...keys];
        let [newA, newB] = [a, b];
        if (key==='couponPackageType'){
            if(value === '1'){
                newA = {...a, keys: keys1 };
            } else {
                newA = {...a, keys: keys2};
            }
            this.keys = [newA, newB];
            this.setState({ newFormKeys: [newA, newB] });
        }
        if (key==='couponSendWay') {
            if(value === '1'){
                newB = {...b, keys: keys3};
            } else {
                newB = {...b, keys: keys4};
            }
            this.keys = [newA, newB];
            this.setState({ newFormKeys: [newA, newB] });
        }
        if (key==='cycleType') {
            const { getFieldsValue } = this.form;
            const { couponSendWay } = getFieldsValue();
            if (couponSendWay==='1') { return; }
            if(value){
                newB = {...b, keys: keys5};
            }else{
                newB = {...b, keys: keys4};
            }
            this.keys = [newA, newB];
            this.setState({ newFormKeys: [newA, newB] });
        }
    }
    /** 获取会员卡类型 */
    getGroupCardTypeOpts (){
        const { groupCardTypeList } = this.props;
        console.log(groupCardTypeList,'groupCardTypeList---------------')
        return groupCardTypeList.map(x => {
            const { cardTypeID, cardTypeName } = x;
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
    /** formItems 重新设置 */
    resetFormItems() {
        const { check, detail, settlesOpts } = this.props;
        const { sendCount = 0 } = detail || {};
        let [couponPackageType, cycleType] = ['1', ''];
        if(this.form) {
            couponPackageType = this.form.getFieldValue('couponPackageType');
            cycleType = this.form.getFieldValue('cycleType');
        }
        const { couponPackageGiftConfigs, shopInfos, couponPackageImage, couponPackageType: cpt,
            validCycle, sellTime, settleUnitID, defaultCardTypeID,isAutoRefund, remainStock, ...other } = formItems;
        const disGift = check || (+sendCount > 0);
        const render = d => d()(<GiftInfo disabled={disGift} />);
        const render1 = d => d()(<ShopSelector disabled={check} />);
        const render2 = d => d()(<ImageUpload />);
        const render3 = d => d()(<EveryDay type={cycleType} disabled={disGift} />);
        let disDate = {};
        const isEdit = !!detail;    // 编辑状态下
        let stockRule = {};
        if(isEdit) {
            disDate = { disabledDate: this.disabledDate };
            stockRule = {rules: ['numbers']};
        }
        const defaultCardOpts = this.getGroupCardTypeOpts();
        const newFormItems = {
            ...other,
            couponPackageType: { ...cpt, disabled: isEdit },
            sellTime: { ...sellTime , props: disDate},
            couponPackageGiftConfigs: { ...couponPackageGiftConfigs, render },
            shopInfos: { ...shopInfos, render: render1 },
            couponPackageImage: { ...couponPackageImage, render: render2 },
            validCycle: { ...validCycle, render: render3 },
            settleUnitID: { ...settleUnitID , options: settlesOpts},
            defaultCardTypeID: {...defaultCardTypeID,options: defaultCardOpts},
            isAutoRefund: { ...isAutoRefund, disabled: isEdit },
            remainStock: { ...remainStock, ...stockRule },
        };
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
    onSave = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { groupID, detail } = this.props;
                const { sellTime, couponPackageGiftConfigs, shopInfos: shops, sendTime,
                        cycleType, validCycle, couponPackagePrice2, couponPackagePrice,
                        remainStock: stock, maxBuyCount: buyCount, ...others,
                    } = v;
                let cycleObj = {};
                if(cycleType){
                    const cycle = validCycle.filter(x => (x[0] === cycleType));
                    cycleObj = { validCycle: cycle };
                    if (!cycle[0]) {
                        message.warning('必须选择一个日期');
                        return;
                    }
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
                const maxBuyCount = buyCount ? buyCount : '-1';
                const couponPackageInfo = { ...timeObj, ...dateObj, ...others, ...cycleObj,
                    remainStock,maxBuyCount, couponPackagePrice: price };
                const params = { groupID, couponPackageInfo, couponPackageGiftConfigs, shopInfos };
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


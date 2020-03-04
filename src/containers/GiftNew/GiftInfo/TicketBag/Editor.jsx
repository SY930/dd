import React, { PureComponent as Component } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import { BaseForm, ShopSelector } from '@hualala/platform-components';
import styles from './index.less';
import { formItems, formKeys, formItemLayout } from './Common';
import { keys1, keys2, keys3, keys4, keys5, DF, TF } from './Common';
import GiftInfo from '../../GiftAdd/GiftInfo';
import ImageUpload from './ImageUpload';
import EveryDay from './EveryDay';
import { putTicketBag } from './AxiosFactory';

export default class Editor extends Component {
    state = {
        couponPackageType: '1',
        couponSendWay: '1',
        cycleType: '',
    }
    /** form */
    onChange = (key, value) => {
        if (['couponPackageType', 'couponSendWay', 'cycleType'].includes(key)){
            this.setState({ [key]: value });
        }
        if (key==='cycleType') {
            // 每次更新选择周期就初始化日期选择集合
            const validCycle = [value + 1];
            this.form.setFieldsValue({ validCycle });
        }
        if (key==='couponSendWay') {
            // 每次切换发放类型，就初始化周期类型历史值。
            this.setState({ cycleType: '' });
        }
    }
    /** 得到form */
    getForm = (form) => {
        this.form = form;
    }
    /** formItems 重新设置 */
    resetFormItems() {
        const { cycleType, couponPackageType } = this.state;
        const { couponPackageGiftConfigs, shopInfos, couponPackageImage,
            validCycle, couponPackagePrice, ...other } = formItems;
        // 第一次加载组件进入给个初始化的值，默认第一天
        const defaultValue = [cycleType + 1];
        const label = (couponPackageType === '1') ? '购买金额' : '记录实收金额';
        const render = d => d()(<GiftInfo />);
        const render1 = d => d()(<ShopSelector />);
        const render2 = d => d()(<ImageUpload />);
        const render3 = d => d()(<EveryDay type={cycleType} />);
        return {
            ...other,
            couponPackagePrice: { ...couponPackagePrice, label },
            couponPackageGiftConfigs: { ...couponPackageGiftConfigs, render },
            shopInfos: { ...shopInfos, render: render1 },
            couponPackageImage: { ...couponPackageImage, render: render2 },
            validCycle: { ...validCycle, defaultValue, render: render3 },
        }
    }
    /** formKeys 重新设置 */
    resetFormKeys() {
        const { couponSendWay, couponPackageType, cycleType } = this.state;
        // 写的有点low，但如果改需求的话，会很便捷。
        const [a, b] = [...formKeys];
        let [newA, newB] = [a, b];
        if(couponPackageType==='1'){
            newA = {...a, keys: keys1 };
        }
        if(couponPackageType==='2') {
            newA = {...a, keys: keys2};
        }
        if(couponSendWay==='1'){
            newB = {...b, keys: keys3};
        }
        if(couponSendWay==='2') {
            if(cycleType){
                newB = {...b, keys: keys5};
            }else{
                newB = {...b, keys: keys4};
            }
        }
        return [newA, newB];
    }
    onCancel = () => {
        this.props.togglePage();
    }
    onSave = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { groupID } = this.props;
                const { sellTime, couponPackageGiftConfigs, shopInfos: shops, sendTime: time,
                        cycleType, ...others,
                    } = v;
                let dateObj = {};
                if(sellTime) {
                    const [sd, ed] = sellTime;
                    const sellBeginTime = moment(sd).format(DF);
                    const sellEndTime = moment(ed).format(DF);
                    dateObj = { sellBeginTime, sellEndTime };
                }
                const sendTime = moment(time).format(TF);
                const shopInfos = shops.map(x=>({shopID:x}));
                const couponPackageInfo = { sellBeginTime, sellEndTime, sendTime, ...dateObj, ...others };
                const params = { groupID, couponPackageInfo, couponPackageGiftConfigs, shopInfos };
                putTicketBag(params).then((flag) => {
                    flag && this.onCancel();
                });
            }
        });

    }
    render() {
        const { } = this.props;
        const newFormItems = this.resetFormItems();
        const newFormKeys = this.resetFormKeys();
        return (
            <section className={styles.formBox}>
                <div className={styles.header}>
                    券包
                    <p className={styles.opBox}>
                        <Button onClick={this.onCancel}>取消</Button>
                        <Button type="primary" onClick={this.onSave}>保存</Button>
                    </p>
                </div>
                <BaseForm
                    getForm={this.getForm}
                    onChange={this.onChange}
                    formItems={newFormItems}
                    formKeys={newFormKeys}
                    formData={{}}
                    formItemLayout={formItemLayout}
                />
            </section>
        );
    }
}


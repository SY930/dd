import React, { PureComponent as Component } from 'react';
import { Button, message, Tooltip, Icon } from 'antd';
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
    /** form */
    onChange = (key, value) => {
        const { newFormKeys } = this.state;
        const [a, b] = [...newFormKeys];
        let [newA, newB] = [a, b];
        if (key==='couponPackageType'){
            if(value === '1'){
                newA = {...a, keys: keys1 };
            } else {
                newA = {...a, keys: keys2};
            }
            this.setState({ newFormKeys: [newA, b] });
        }
        if (key==='couponSendWay') {
            if(value === '1'){
                newB = {...b, keys: keys3};
            } else {
                newB = {...b, keys: keys4};
            }
            this.setState({ newFormKeys: [a, newB] });
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
            this.setState({ newFormKeys: [a, newB] });
        }
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
        const { check, detail } = this.props;
        const { sendCount = 0 } = detail;
        let [couponPackageType, cycleType] = ['1', ''];
        if(this.form) {
            couponPackageType = this.form.getFieldValue('couponPackageType');
            cycleType = this.form.getFieldValue('cycleType');
        }
        const { couponPackageGiftConfigs, shopInfos, couponPackageImage, couponPackageType: cpt,
            validCycle, couponPackagePrice, c, sellTime, ...other } = formItems;
        const tip = (<span>记录实收金额
                <Tooltip title="记录实收金额：仅用于报表作为实收金额核算">
                    <Icon style={{ margin: '0 -5px 0 5px' }} type="question-circle" />
                </Tooltip>
            </span>);
        const tip2 = (<Tooltip title="将按周期发送添加的礼品">
                <Icon type="question-circle" />
            </Tooltip>);
        const disGift = check || (+sendCount > 0);
        const label = (couponPackageType === '1') ? '购买金额' : tip;
        const render = d => d()(<GiftInfo  disabled={disGift} />);
        const render1 = d => d()(<ShopSelector disabled={check} />);
        const render2 = d => d()(<ImageUpload />);
        const render3 = d => d()(<EveryDay type={cycleType} />);
        const render4 = () => (tip2);
        let disDate = {};
        if(!!detail) {
            disDate = { disabledDate: this.disabledDate };
        }
        const newFormItems = {
            ...other,
            couponPackageType: { ...cpt, disabled: !!detail },
            sellTime: { ...sellTime , props: disDate},
            couponPackagePrice: { ...couponPackagePrice, label },
            couponPackageGiftConfigs: { ...couponPackageGiftConfigs, render },
            shopInfos: { ...shopInfos, render: render1 },
            couponPackageImage: { ...couponPackageImage, render: render2 },
            validCycle: { ...validCycle, render: render3 },
            c: { ...c, render: render4 },
        };
        if(check) {
            let obj = {}
            for(let x in newFormItems) {
                obj[x] = {...newFormItems[x], disabled: !0 };
            }
            return obj;
        }
        return newFormItems;
    }
    onCancel = () => {
        this.props.togglePage('back');
    }
    onSave = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { groupID, detail } = this.props;
                const { sellTime, couponPackageGiftConfigs, shopInfos: shops, sendTime,
                        cycleType, validCycle, ...others,
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
                if(sellTime) {
                    const [sd, ed] = sellTime;
                    const sellBeginTime = moment(sd).format(DF);
                    const sellEndTime = moment(ed).format(DF);
                    dateObj = { sellBeginTime, sellEndTime };
                }
                let timeObj = {};
                if(sendTime) {
                    timeObj = { sendTime: moment(sendTime).format(TF) };
                }
                const shopInfos = shops.map(x=>({shopID:x}));
                const couponPackageInfo = { ...timeObj, ...dateObj, ...others, ...cycleObj };
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
        return (
            <section className={styles.formBox}>
                <div className={styles.header}>
                    券包
                    <p className={styles.opBox}>
                        <Button onClick={this.onCancel}>取消</Button>
                        <Button type="primary" disabled={check} onClick={this.onSave}>保存</Button>
                    </p>
                </div>
                <BaseForm
                    getForm={this.getForm}
                    onChange={this.onChange}
                    formItems={newFormItems}
                    formKeys={newFormKeys}
                    formData={detail || {}}
                    formItemLayout={formItemLayout}
                />
            </section>
        );
    }
}


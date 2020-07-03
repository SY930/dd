import React, { Component } from 'react';
import { Button, Table, Tooltip } from 'antd';
import styles from './Crm.less';
import GiftModal from './GiftModal';
import { getCardList } from './AxiosFactory';
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';
import GiftCfg from '../../../constants/Gift';
import { getVersionUI } from 'utils'
import AddCouponModal from './coupon/AddModal'
import {   typeMap } from './coupon/Common';

const href = 'javascript:;';
const DF = 'YYYYMMDD';
const ButtonGroup = Button.Group;
const btnList = [
    {
        value: '1',
        label: '优惠券'
    },
    {
        value: '4',
        label: '券包'
    },
    {
        value: '0',
        label: '不赠送'
    }
]
/** 任意金额组件 */
export default class GiftInfo extends Component {
    state = {
        visible: false,      // 弹层是否显示
        giftTreeData: [],
        currentChoose: 0,
        showCouponModal: false,
    }
    componentDidMount() {
        getCardList({}).then(x => {
            this.setState({ giftTreeData: x });
        });
    }
    handelEdit = (record,v) => () => {

        this.setState({
            visible: true,
        })
    }
    /* 生成表格头数据 */
    generateColumns() {
        const { disabled } = this.props;
        const { tc } = styles;
        const render = (v,record) => {
            return (
                <div>
                    <a href={href} name={v} disabled={disabled} onClick={this.onDelete}>删除</a>
                </div>
            );
        };
        const render1 = (v,o) => {
            const { effectType, giftEffectTimeHours,
                giftValidUntilDayCount, effectTime, validUntilDate } = o;
            let text = '';
            if([1,3].includes(+effectType)) {
                const options = (+effectType === 1) ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY;
                const { label } = options.find(x=>+x.value===+giftEffectTimeHours);
                text = <span>发放后{label}，有效期{giftValidUntilDayCount}天</span>;
            } else {
                text = effectTime +' - '+ validUntilDate;
            }
            return (<Tooltip title={text}><span>{text}</span></Tooltip>);
        };
        const render3 = (v) => {
            const { giftTypeName } = GiftCfg;
            const { label } = giftTypeName.find(x=>+x.value === +v) || {};
            return (<Tooltip title={label}><span>{label}</span></Tooltip>);
        };
        const render4 = (v) => {
            return (<Tooltip title={v}><span>{v}</span></Tooltip>);
        };
        // 表格头部的固定数据
        return [
            { width: 0, title: '序号', dataIndex: 'idx', className: tc },
            { width: 100, title: '礼品类型', dataIndex: 'giftType', className: tc, render: render3 },
            { width: 100, title: '礼品名称', dataIndex: 'giftName', className: tc, render: render4, },
            { width: 100, title: '礼品金额(元)', dataIndex: 'giftValue', className: tc },
            { width: 60, title: '礼品个数', dataIndex: 'giftCount', className: tc },
            { width: 180, title: '礼品有效期', dataIndex: 'effectTime', render: render1, className: tc },
            { width: 60, title: '操作', dataIndex: 'index', className: tc, render },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { value } = this.props;
        const { quotaCardGiftConfList = [] } = value
        return quotaCardGiftConfList.map((x, i) => ({
            key: x.giftItemID + i,
            idx: i + 1,
            index: i,
            ...x,
        }));
    }
    /* 关闭模态框 */
    toggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible,isEdit: false }));
    }
    /** 增加 */
    onPost = (params) => {
        const { giftTreeData } = this.state;
        const { value, onChange } = this.props;
        // effectType有效期限 如果为小时是 1 如果为天是 3 如果是固定有效期是 2
        const { giftItemID, effectType, rangeDate, countType } = params;
        let date = {};
        if(effectType === '2') {
            const [start, end] = rangeDate;
            const effectTime = start.format(DF);
            const validUntilDate = end.format(DF);
            date = { effectTime, validUntilDate };
        }
        let newEffectType = effectType;
        if(countType === '1') {
            newEffectType = '3';
        }
        let obj = null;
        giftTreeData.forEach(x => {
            const { children } = x;
            const card = children.find(y=>y.value === giftItemID);
            if(card){
                const { value: giftItemID, giftType, giftTypeName, label: giftName, giftValue } = card;
                obj = { giftType, giftTypeName, giftItemID, giftName, giftValue };
            }
        });
        const list = [...value.quotaCardGiftConfList, { ...params, ...obj, ...date, effectType: newEffectType }];
        onChange({
            ...value,
            presentType: value.presentType,
            quotaCardGiftConfList: list,
        });
    }
    /** 删除 */
    onDelete = ({ target }) => {
        const { name: index } = target;
        const { value, onChange } = this.props;
        const list = [...value.quotaCardGiftConfList];
        list.splice(index, 1);
        onChange({
            ...value,
            presentType: value.presentType,
            quotaCardGiftConfList: list,
        });
    }
    handleClickBtn = (i) => () => {
        const { onChange,value } = this.props;
        onChange({
            ...value,
            presentType: Number(btnList[i].value)
        });
    }
    handleShowCoupon = () => {
        this.setState({
            showCouponModal: true
        })
    }

    onSelectBag = (item) => {
        const { onChange, value } = this.props;
        onChange({
            ...value,
            chooseCoupon:  [item],
            presentType: value.presentType
        });
        this.handleCloseCoupon()
    }

    handleCloseCoupon = () => {
        this.setState({
            showCouponModal: false
        });
    }
    handleDeleteCoupon = () => {
        const { onChange,value } = this.props;
        onChange({
            ...value,
            chooseCoupon:  [],
            presentType: value.presentType
        });
    }
     /* 生成表格头数据 */
     generateCouponColumns() {
        const { tc } = styles;
        const render = (v, o) => {
            return (<a href={href} onClick={this.handleDeleteCoupon}>删除</a>);
        };
        const render1 = (v, o) => {
            return (<Tooltip title={v}>
                    <span>{v}</span>
                </Tooltip>);
        };
        const render2 = (v, o) => {
            const {sellBeginTime, sellEndTime } = o;
            let text = sellBeginTime + ' ~ ' + sellEndTime;
            if(sellBeginTime==='0'){
                text = '长期有效';
            }
            return (<span>{text}</span>);
        };
        const render3 = (v, o) => {
            const val = (v === -1) ? '不限制' : v;
            return (<span>{val}</span>);
        };
        // 表格头部的固定数据
        return [
            { title: '券包名称', dataIndex: 'couponPackageName', render: render1 },
            { width: 100, title: '券包类型', dataIndex: 'type' },
            { width: 100, title: '库存', dataIndex: 'couponPackageStock', render: render3, className: tc },
            { width: 200, title: '有效期', dataIndex: 'postTime', className: tc, render: render2 },
            { width: 80, title: '操作', dataIndex: 'op', className: tc, render },
        ];
    }
      /* 生成表格数据 */
      generateCouponDataSource() {
        const { value } = this.props;
        const { chooseCoupon = [] } = value
        return chooseCoupon.map((x, i) => ({
            key: x.couponPackageID,
            type: typeMap[x.couponPackageType],
            ...x,
        }));
    }
    render() {
        const { visible, giftTreeData,showCouponModal,chooseCoupon } = this.state;
        const { value, disabled } = this.props;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        //礼品定额卡添加优惠券限制最多10种
        let actStyle = {
            color: '#1ab495',
            borderColor: '#1ab495'
        }
        let actBtnRight = {
            borderLeftColor: '#1ab495'
        }
        if(getVersionUI() && getVersionUI().saasServiceVersionInfo === '2') {
            actStyle = {
                color: '#108ee9',
                borderColor: '#108ee9'
            }
            actBtnRight = {
                borderLeftColor: '#108ee9'
            }
        }
        const couponColumns = this.generateCouponColumns();
        const couponDataSource = this.generateCouponDataSource();
        const currentChoose = btnList.findIndex(v => v.value === String(value.presentType))

        return (
            <div className={styles.cGiftInfo}>
                <div style={{marginBottom: '10px'}}>
                    <ButtonGroup>
                        {btnList.map((v,i) => {
                            return <Button style={currentChoose === i ? actStyle : (currentChoose + 1) === i ? actBtnRight : {}  } onClick={this.handleClickBtn(i)} key={i}>{v.label}</Button>
                        })}
                    </ButtonGroup>
                </div>

                {!value[9] && currentChoose === 0 && <Button icon="plus" disabled={disabled} onClick={this.toggleModal}>添加优惠券</Button>}
                {currentChoose === 1 && <Button icon="plus" disabled={value.chooseCoupon && value.chooseCoupon.length > 0 || disabled} onClick={this.handleShowCoupon}>添加券包</Button>}
                {currentChoose === 1 &&  <Table
                    bordered={true}
                    columns={couponColumns}
                    dataSource={couponDataSource}
                    style={{ maxWidth: 1000 }}
                    pagination={false}
                />}
                {currentChoose === 0 && <Table
                    bordered={true}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />}
                {showCouponModal && <AddCouponModal
                        groupID={this.props.groupID}
                        onAdd={this.onSelectBag}
                        onClose={this.handleCloseCoupon}/>}
                {visible   &&
                    <GiftModal
                        treeData={giftTreeData}
                        onClose={this.toggleModal}
                        onPost={this.onPost}
                    />
                }
            </div>
        );
    }
}

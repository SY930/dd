import React, { Component } from 'react';
import { Button, Table, Tooltip, message } from 'antd';
import styles from './addGift.less';
import GiftModal from './GiftModal';
import { getCardList,getCouponsData } from './AxiosFactory';
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from './giftType';
import GiftCfg from './gift';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";

const href = 'javascript:;';
const DF = 'YYYYMMDD';
/** 任意金额组件 */
export default class GiftInfo extends Component {
    state = {
        visible: false,      // 弹层是否显示
        giftTreeData: [],
        giftData:{},
        isEdit:false,
        tableIndex:0,
        couponData: [],
        presentType:'1'
    }
    componentDidMount() {
        const {groupID} = this.props;
        getCardList({groupID}).then(x => {
            this.setState({ giftTreeData: x });
        });
        // getCouponsData({groupID}).then(x => {
        //     this.setState({ couponData: x });
        // })
    }

    onChangeField = (e, index, field) => {
        // console.log(e, index, field);
        const { value, onChange } = this.props;

        const list = [...value];
        list[index][field] = e.number;
        onChange(list);
    }
    
    /* 生成表格头数据 */
    generateColumns() {
        const { disabled } = this.props;
        const { tc } = styles;
        const render = (v,record,i) => {
            return (
                <div>
                    {/* <a href={href} name={v} disabled={disabled} onClick={() => this.onEdit(record,i)}>编辑</a> */}
                    <a href={href} name={v} disabled={disabled} onClick={this.onDelete}>删除</a>
                </div>
            );
        };
        const render1 = (v,o) => {
            const { effectType, giftEffectTimeHours,countType,
                giftValidUntilDayCount, effectTime, validUntilDate,presentType } = o;
            let text = '';
            if(presentType == 8){//如果是零售券
                return '--'
            }
            if([1,3].includes(+effectType)) {
                const options = (+countType === 0 || !countType) ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY;
                let label = '';
                let obj = options.find(x=>+x.value===+giftEffectTimeHours);
                if(obj && obj.label){
                    label = obj.label;
                }
                text = <span>发放后{label}，有效期{giftValidUntilDayCount}天</span>;
            } else {
                text = effectTime +' - '+ validUntilDate;
            }
            return (<Tooltip title={text}><span>{text}</span></Tooltip>);
        };
        const render2 = (v, o, index, field) => {
            const { giftCount = 0 } = o;
            let el;
            switch (field) {
                case 'giftCount':
                    el = (<PriceInput
                            style={{ border: v > 0 ? 'none' : '1px solid red' }}
                            modal={'int'}
                            maxNum={8}
                            disabled={disabled}
                            value={{ number: v }}
                            defaultValue={{ number: v }}
                            onChange={(e) => this.onChangeField(e, index, field)}
                        />)
                    break;
                case 'conditionValue':
                    el = (<PriceInput
                            style={{ border: v > 0 ? 'none' : '1px solid red' }}
                            modal={'int'}
                            maxNum={8}
                            disabled={disabled}
                            value={{ number: v }}
                            defaultValue={{ number: v }}
                            onChange={(e) => this.onChangeField(e, index, field)}
                        />)
                    break;
                case 'giftMaxCount':
                    el = (<PriceInput
                            style={{ border: v != undefined ? 'none' : '1px solid red' }}
                            modal={'int'}
                            maxNum={8}
                            disabled={disabled}
                            value={{ number: v }}
                            defaultValue={{ number: v }}
                            onChange={(e) => this.onChangeField(e, index, field)}
                        />)
                    break;
                default:
                    break;
            }
            return el;
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
            // { width: 65, title: '序号', dataIndex: 'idx', className: tc },
            { width: 80, title: '操作', dataIndex: 'index', fixed: 'left', className: tc, render },
            // { width: 60, title: '礼品属性', dataIndex: 'presentType', className: tc,render: render2 },
            { width: 100, title: '礼品名称', dataIndex: 'giftName', fixed: 'left', className: tc, render: render4, },
            { width: 100, title: '礼品类型', dataIndex: 'giftType', className: tc, render: render3 },
            // { width: 60, title: '礼品数量', dataIndex: 'giftCount', className: tc },
            { width: 150, title: '礼品有效期', dataIndex: 'effectTime', render: render1, className: tc },
            { width: 100, title: '兑换数量', dataIndex: 'giftCount', className: tc, render: (v, o, index) => render2(v, o, index, 'giftCount') },
            { width: 100, title: '兑换积分数', dataIndex: 'conditionValue', className: tc, render: (v, o, index) => render2(v, o, index, 'conditionValue') },
            { width: 150, title: '限兑数量(0表示无限制)', dataIndex: 'giftMaxCount', className: tc, render: (v, o, index) => render2(v, o, index, 'giftMaxCount') },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { value } = this.props;
        return value && value.length >0 && value.map((x, i) => ({
            key: `${(x.giftID||x.giftItemID) + i}`,
            idx: i + 1,
            index: i,
            giftItemID: x.giftID||x.giftItemID,
            ...x,
        }));
    }
    /* 关闭模态框 */
    toggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible,giftData:{},isEdit:false }));
    }
    /** 增加 */
    onPost = (params) => {
        const { giftTreeData = [], isEdit, tableIndex, couponData} = this.state;
        let { value = [], onChange } = this.props;
        // effectType有效期限 如果为小时是 1 如果为天是 3 如果是固定有效期是 2
        
        const { giftItemID, effectType, rangeDate, countType, presentType } = params;
        // let flag = true;
        // if(!isEdit && value && value.length > 0){
        //     value.map(item => {
        //         if(params.giftID == item.giftID){
        //             message.warning('有重复的优惠券!')
        //             flag = false
        //         }
        //     })
        // }
        // if(!flag) return;
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
        if(presentType == 8){
            couponData.forEach(x => {
                const { children } = x;
                const card = children.find(y=>y.value === giftItemID);
                if(card){
                    const { value: giftItemID, giftType, label: giftName, giftValue } = card;
                    obj = { giftType, giftItemID, giftName, giftValue };
                }
            });
        }else{
            giftTreeData.forEach(x => {
                const { children } = x;
                const card = children.find(y=>y.value === giftItemID);
                if(card){
                    const { value: giftItemID, giftType, giftTypeName, _label: giftName, giftValue } = card;
                    obj = { giftType, giftTypeName, giftItemID, giftName, giftValue };
                }
            });
        }
        
        let list = [];
        if(isEdit){//编辑状态
            if(presentType == 8){
                value[tableIndex] = { ...params, ...obj};
            }else{
                value[tableIndex] = { ...params, ...obj, ...date, effectType: newEffectType };
            }
            list = [...value];
        }else{
            if(presentType == 8){
                list = [...value, { ...params, ...obj }];
            }else{  
                list = [...value, { 
                    ...params, 
                    ...obj, 
                    ...date, 
                    effectType: newEffectType,
                    giftCount: 1,
                    conditionValue: null,
                    giftMaxCount: 0,
                    presentType: 1,
                    giftTotalCount: 0
                 }];
            }
        }
        onChange(list);
    }
    /** 删除 */
    onDelete = ({ target }) => {
        const { name: index } = target;
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(index, 1);
        onChange(list);
    }
    onEdit = (record,i) => {
        this.setState({
            giftData:record,
            isEdit:true,
            visible:true,
            tableIndex:i
        })
    }
    onChangePresentType = (type) => {
        this.setState({
            presentType:type
        })
    }
    render() {
        const { visible, giftTreeData,couponData,isEdit,giftData,presentType } = this.state;
        const { value=[], disabled,isNeedMt } = this.props;
        giftData.effectType = giftData.effectType == '3' ? '1' : giftData.effectType;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        let treeData = [];
        if(presentType == '1'){
            treeData = giftTreeData;
        }else{
            treeData = couponData;
        }
        treeData.forEach(item => {
            item.children.forEach(row => {
                if(!row._label) {
                    row._label = row.label;
                    row.label = row.label + ' -【' + row.value + '】';
                }
            })
        })
        //礼品定额卡添加优惠券限制最多10种
        return (
            <div className={styles.addGiftWrapper}>
                <div className={styles.addGiftCont}>
                    {!value[9] && <Button icon="plus" disabled={disabled} onClick={this.toggleModal}>添加优惠券</Button>}
                    <Table
                        scroll={{ x: 500 }}
                        // bordered={false}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        style={{ width: 800 }}
                    />
                    {visible &&
                        <GiftModal
                            treeData={treeData}
                            giftData={giftData}
                            isEdit={isEdit}
                            onClose={this.toggleModal}
                            onPost={this.onPost}
                            onChangePresentType={this.onChangePresentType}
                        />
                    }
                </div>
            </div>
        );
    }
}

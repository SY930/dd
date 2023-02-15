import React, { PureComponent as Component } from 'react';
import { Button, Table, Tooltip, Input } from 'antd';
import styles from './bag.less';
import { href, typeMap } from './Common';
import AddModal from './AddModal';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import GoodsRef from '@hualala/sc-goodsRef';
import { businessTypesList } from "../../../constants/WhiteList";
const { GoodsSelector } = GoodsRef;
export default class Goods extends Component {
    state = {
        value: '0',
        visible: false,
    };
    
    componentDidMount() {}

    /*  */
    onDelete = (index) => {
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(index, 1);
        onChange(list);
    }
    /*  */
    onToggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    onSelectBag = (data) => {
        const { value, onChange } = this.props;
        const list = data.map(item => ({
            ...item,
            giftCount: 1,
            conditionValue: null,
            giftMaxCount: 0,
            presentType: item.biz == 'ris' ? 9 : 10,
            giftTotalCount: 0
        }))

        let newGoodsData = [...value];
        list.forEach(item => {
            if(!newGoodsData.find(goods => goods.goodsID == item.goodsID)) {
                newGoodsData.push(item)
            }
        })
        // newGoodsData = newGoodsData.filter(item => data.find(row => row.goodsID == item.goodsID));
        onChange(newGoodsData);
        this.onToggleModal();
    }

    onChangeField = (e, index, field) => {
        const { value, onChange } = this.props;
        value[index][field] = e.number;

        onChange(value);
    }
    /* 生成表格头数据 */
    generateColumns = () => {
        const { disabled } = this.props;
        const { tc } = styles;
        const render = (v, o, index) => {
            return (<a disabled={disabled} href={href} onClick={() => this.onDelete(index)}>删除</a>);
        };
        const render1 = (v, o) => {
            return (<Tooltip title={v}>
                    <span>{v}</span>
                </Tooltip>);
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
        // 表格头部的固定数据
        return [
            { width: 80, title: '操作', dataIndex: 'op', fixed: 'left', className: tc, render },
            { width: 100, title: '商品', dataIndex: 'goodsName', fixed: 'left', render: render1 },
            { width: 100, title: '品牌', dataIndex: 'brandName', render: render1 },
            { width: 100, title: '分类', dataIndex: 'fullName', render: render1 },
            { width: 100, title: '规格', dataIndex: 'unit', render: render1 },
            // { width: 100, title: '售价(元)', dataIndex: 'goodsPrice', render: render1 },
            { width: 100, title: '兑换数量', dataIndex: 'giftCount', className: tc, render: (v, o, index) => render2(v, o, index, 'giftCount') },
            { width: 100, title: '兑换积分数', dataIndex: 'conditionValue', className: tc, render: (v, o, index) => render2(v, o, index, 'conditionValue') },
            { width: 150, title: '限兑数量(0表示无限制)', dataIndex: 'giftMaxCount', className: tc, render: (v, o, index) => render2(v, o, index, 'giftMaxCount') },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.state;
        return list.map((x, i) => ({
            key: x.couponPackageID,
            ...x,
        }));
    }
    render() {
        const { value, disabled } = this.props;
        const { visible } = this.state;
        const columns = this.generateColumns();
        return (
            <div className={styles.mainBox}>
                <Button disabled={disabled} style={{ marginBottom: '10px' }} onClick={this.onToggleModal}>添加商品</Button>
                <Table
                    bordered={true}
                    scroll={{ x: 500 }}
                    columns={columns}
                    dataSource={value}
                    style={{ maxWidth: 850 }}
                    pagination={false}
                />
                <GoodsSelector 
                    visible={visible} 
                    businessTypesList={businessTypesList}
                    // defaultValue={value}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                    onOk={this.onSelectBag}
                />
            </div>
        );
    }
}

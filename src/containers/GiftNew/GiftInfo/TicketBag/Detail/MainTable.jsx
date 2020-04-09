import React, { PureComponent as Component } from 'react';
import { Table, message, Modal, Popconfirm, Tooltip } from 'antd';
import styles from './index.less';
import PagingFactory from 'components/PagingFactory';

/** 列表页表格数据 */
const sendMap = {
    10: '购买',
    11: '商家赠送',
    12: '摇奖活动赠送',
    124: '券包',
};
const sexMap = {
    0: '女',
    1: '男',
    2: '未知',
};
const statusMap = {
    1: '待发送',
    2: '已发出',
    3: '已使用',
    4: '已作废',
    5: '已退款',
    6: '退款中',
};
class MainTable extends Component {
    /* 页面需要的各类状态属性 */
    state = {
    };
    /* 根据父组件传来的数据判断是否需要更新分页组件 */
    componentWillReceiveProps(np) {
        if (this.props.pageObj !== np.pageObj) {
            this.props.onSavePaging(np.pageObj);
        }
    }
    /* 分页改变执行 */
    onPageChange = (pageNo, pageSize) => {
        const { onSavePaging, onQuery } = this.props;
        const params = { pageSize, pageNo };
        onSavePaging(params);
        onQuery(params);
    }
    /* 生成表格头数据 */
    generateColumns() {
        const { type, pageObj } = this.props;
        const { tc } = styles;
        const render2 = (v, o) => {
            const { pageSize, pageNo } = pageObj;
            const idx = v + (pageSize * (pageNo - 1));
            return (<span>{idx}</span>);
        };
        // 表格头部的固定数据
        if(type === 2){
            return [
                { width: 50, title: '序号', dataIndex: 'idx', className: tc, render: render2 },
                { width: 160, title: '券包编码', dataIndex: 'customerCouponPackID' },
                { width: 100, title: '获得方式', dataIndex: 'way' },
                { width: 160, title: '获得时间', dataIndex: 'createStamp' },
                { width: 160, title: '使用时间', dataIndex: 'usingTime' },
                { width: 160, title: '客户编号', dataIndex: 'customerID' },
                { width: 100, title: '姓名', dataIndex: 'customerName' },
                { width: 60, title: '性别', dataIndex: 'sex', className: tc },
                { width: 100, title: '手机号', dataIndex: 'customerMobile' },
            ];
        }
        if(type === 3){
            return [
                { width: 50, title: '序号', dataIndex: 'idx', className: tc, render: render2 },
                { width: 160, title: '券包编码', dataIndex: 'customerCouponPackID' },
                { width: 100, title: '状态', dataIndex: 'stat' },
                { width: 160, title: '订单编号', dataIndex: 'linkOrderNo' },
                { width: 160, title: '发出时间', dataIndex: 'createStamp' },
                { width: 160, title: '客户编号', dataIndex: 'customerID' },
                { width: 100, title: '姓名', dataIndex: 'customerName' },
                { width: 60, title: '性别', dataIndex: 'sex', className: tc },
                { width: 100, title: '手机号', dataIndex: 'customerMobile' },
                { title: '退款原因', dataIndex: 'refundReason' },
            ];
        }
        return [
            { width: 50, title: '序号', dataIndex: 'idx', className: tc, render: render2 },
            { width: 160, title: '券包编码', dataIndex: 'customerCouponPackID' },
            { width: 100, title: '发出方式', dataIndex: 'way' },
            { width: 80, title: '状态', dataIndex: 'stat' },
            { width: 160, title: '发出时间', dataIndex: 'createStamp' },
            { width: 160, title: '客户编号', dataIndex: 'customerID' },
            { width: 100, title: '姓名', dataIndex: 'customerName' },
            { width: 60, title: '性别', dataIndex: 'sex', className: tc },
            { width: 100, title: '手机号', dataIndex: 'customerMobile' },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        return list.map((x, i) => ({
            key: x.customerCouponPackID,
            idx: i + 1,
            way: sendMap[x.getWay],
            sex: sexMap[x.customerSex],
            stat: statusMap[x.status],
            ...x,
        }));
    }

    render() {
        const { onChange, selectedRowKeys } = this.props;
        const { loading, page, type } = this.props;
        const scroll = { x: (type === 3) ? 1300 : 1000 };
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        const pagination = {
            ...page,
            onChange: this.onPageChange,
            onShowSizeChange: this.onPageChange,
        };
        let tableProps = {};
        if(type === 3) {
            tableProps = { rowSelection: { selectedRowKeys, onChange } };
        }
        return (
                <div className={styles.tableBox}>
                    <Table
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        style={{ maxWidth: 700 }}
                        scroll={scroll}
                        pagination={pagination}
                        {...tableProps}
                    />
                </div>
        )
    }
}
export default PagingFactory(MainTable)

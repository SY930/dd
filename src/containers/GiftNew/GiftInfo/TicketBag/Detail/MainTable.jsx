import React, { PureComponent as Component } from 'react';
import { Table, message, Modal, Popconfirm, Tooltip } from 'antd';
import styles from './index.less';
import PagingFactory from 'components/PagingFactory';

/** 列表页表格数据 */
const sendMap = {
    10: '购买',
    11: '商家赠送',
    12: '摇奖活动赠送',
};
const sexMap = {
    0: '女',
    1: '男',
    2: '未知',
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
        const { tc } = styles;
        // 表格头部的固定数据
        return [
            { width: 50, title: '序号', dataIndex: 'idx', className: tc },
            { width: 160, title: '券包ID', dataIndex: 'customerCouponPackID' },
            { width: 100, title: '发出方式', dataIndex: 'way' },
            { width: 160, title: '发出时间', dataIndex: 'createStamp' },
            { width: 160, title: '客户编号', dataIndex: 'customerID' },
            { width: 100, title: '姓名', dataIndex: 'customerName' },
            { width: 60, title: '性别', dataIndex: 'sex', className: tc },
            { width: 160, title: '手机号', dataIndex: 'customerMobile' },
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
            ...x,
        }));
    }
    render() {
        const { } = this.state;
        const { loading, page } = this.props;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        const pagination = { ...page, onChange: this.onPageChange, onShowSizeChange: this.onPageChange };
        return (
                <div className={styles.tableBox}>
                    <Table
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        style={{ maxWidth: 700 }}
                        scroll={{ x: 900 }}
                        pagination={pagination}
                    />
                </div>
        )
    }
}
export default PagingFactory(MainTable)

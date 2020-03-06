import React, { PureComponent as Component } from 'react';
import { Table, message, Modal, Popconfirm, Tooltip } from 'antd';
import styles from './index.less';
import { href } from '../Common';
import PagingFactory from 'components/PagingFactory';

/** 列表页表格数据 */
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
            { width: 160, title: '券包名称', dataIndex: 'couponPackageName' },
            { width: 160, title: '券包ID', dataIndex: 'customerCouponPackID' },
            { title: '券包说明', dataIndex: 'couponPackageDesciption' },
            { width: 80, title: '创建人', dataIndex: 'shopCount', className: tc },
            { width: 160, title: '时间', dataIndex: 'range', className: tc },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        return list.map((x, i) => ({
            key: x.customerCouponPackID,
            idx: i + 1,
            range: x.sellBeginTime + '~' + x.sellEndTime,
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
                        pagination={pagination}
                    />
                </div>
        )
    }
}
export default PagingFactory(MainTable)

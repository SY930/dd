import React, { PureComponent as Component } from 'react';
import { Table, message, Modal, Popconfirm, Tooltip } from 'antd';
import styles from './index.less';

/** 列表页表格数据 */
class TotalTable extends Component {
    /* 页面需要的各类状态属性 */
    state = {
    };

    /* 生成表格头数据 */
    generateColumns() {
        const { tr } = styles;
        // 表格头部的固定数据
        return [
            { width: 100, title: '券包总库存', dataIndex: 'couponPackageStock', className: tr },
            { width: 100, title: '券包发出总数', dataIndex: 'maxSendLimit', className: tr },
        ];
    }
    render() {
        const { } = this.state;
        const { list } = this.props;
        const columns = this.generateColumns();
        return (
                <div className={styles.tableBox}>
                    <Table
                        bordered={true}
                        columns={columns}
                        dataSource={list}
                        style={{ maxWidth: 200 }}
                        pagination={!1}
                    />
                </div>
        )
    }
}
export default TotalTable

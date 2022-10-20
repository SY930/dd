
import React, { PureComponent as Component } from 'react';
import { Table, message, Modal, Popconfirm, Tooltip } from 'antd';
import styles from './index.less';

/** 列表页表格数据 */
class TotalTable extends Component {
    /* 页面需要的各类状态属性 */
    state = {
    };

    /* 生成表格头数据 */
    generateColumns = () => {
        const { isOld, couponPackageType } = this.props
        console.log("🚀 ~ file: TotalTable.jsx ~ line 14 ~ TotalTable ~ isOld", isOld, couponPackageType)
        const { tr } = styles;
        // 表格头部的固定数据
        if (isOld || couponPackageType == 1) {
            return [
                { width: 100, title: '券包库存', dataIndex: 'remainStock', className: tr },
                { width: 100, title: '券包发出总数', dataIndex: 'sendCount', className: tr },
            ];
        }
        return [
            { width: 100, title: '券包发出总数', dataIndex: 'sendCount', className: tr },
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
                        pagination={false}
                    />
                </div>
        )
    }
}
export default TotalTable

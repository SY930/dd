import React, { PureComponent as Component } from 'react';
import { Table, message, Modal, Popconfirm, Tooltip } from 'antd';
import styles from './index.less';

/** 列表页表格数据 */
class InfoTable extends Component {
    /* 页面需要的各类状态属性 */
    state = {
    };

    /* 生成表格头数据 */
    generateColumns() {
        const { tr } = styles;
        // 表格头部的固定数据
        return [
            { title: '内容名称', dataIndex: 'giftName' },
            { width: 100, title: '领取数', dataIndex: 'giftSendCount', className: tr },
            { width: 100,  title: '使用数', dataIndex: 'useCount', className: tr },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        return list.map((x, i) => ({
            key: x.id,
            ...x,
        }));
    }
    render() {
        const { } = this.state;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        return (
                <div className={styles.tableBox}>
                    <Table
                        bordered={true}
                        columns={columns}
                        dataSource={dataSource}
                        style={{ maxWidth: 500 }}
                        pagination={!1}
                    />
                </div>
        )
    }
}
export default InfoTable

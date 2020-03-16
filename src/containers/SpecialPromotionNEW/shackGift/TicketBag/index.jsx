import React, { PureComponent as Component } from 'react';
import { Button, Table } from 'antd';
import styles from './index.less';
import AddModal from './AddModal';

export default class TicketBag extends Component {
    state = {
        value: '0',
        visible: false,
        list: [],
    };
    /*  */
    onQuery = () => {

    }
    /*  */
    onToggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    onTypeChange = ({ target }) => {
        this.setState({ value: target.value });
    }
    /* 生成表格头数据 */
    generateColumns() {
        const { tc } = styles;
        // 表格头部的固定数据
        return [
            { width: 50, title: '序号', dataIndex: 'idx', className: tc },
            { width: 160, title: '操作', dataIndex: 'op', className: tc },
            { width: 160, title: '券包名称', dataIndex: 'couponPackageName' },
            { width: 160, title: '券包ID', dataIndex: 'couponPackageID' },
            { title: '券包说明', dataIndex: 'couponPackageDesciption' },
            { width: 160, title: '创建人/修改人', dataIndex: 'postBy', className: tc },
            { width: 260, title: '创建时间/修改时间', dataIndex: 'postTime', className: tc },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.state;
        return list.map((x, i) => ({
            key: x.id,
            idx: i + 1,
            ...x,
        }));
    }
    render() {
        const { groupID } = this.props;
        const { value, visible } = this.state;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        return (
            <div className={styles.mainBox}>
                <Button onClick={this.onToggleModal}>添加券包</Button>
                <Table
                    bordered={true}
                    columns={columns}
                    dataSource={dataSource}
                    style={{ maxWidth: 1000 }}
                />
                {visible &&
                    <AddModal groupID={groupID} onClose={this.onToggleModal} />
                }
            </div>
        );
    }
}

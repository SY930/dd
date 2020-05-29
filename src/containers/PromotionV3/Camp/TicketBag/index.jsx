import React, { PureComponent as Component } from 'react';
import { Button, Table, Tooltip } from 'antd';
import styles from './bag.less';
import { href, typeMap } from './Common';
import AddModal from './AddModal';

export default class TicketBag extends Component {
    state = {
        visible: false,
        list: [],
    };
    componentWillReceiveProps(np) {
        const { value } = np;
        if(value) {
            this.setState({ list: value });
        }
    }
    /*  */
    onDelete = () => {
        this.setState({ list: [] });
        this.props.onChange([]);
    }
    /*  */
    onToggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    onSelectBag = (item) => {
        this.setState({ list: [item] });
        this.props.onChange([item]);
        this.onToggleModal();
    }
    /* 生成表格头数据 */
    generateColumns() {
        const { tc } = styles;
        const render = (v, o) => {
            return (<a href={href} onClick={this.onDelete}>删除</a>);
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
            const val = (v === -1) ? '不限制' : (v || 0);
            return (<span>{val}</span>);
        };
        // 表格头部的固定数据
        return [
            { width: 80, title: '操作', dataIndex: 'op', className: tc, render },
            { title: '券包名称', dataIndex: 'couponPackageName', render: render1 },
            { width: 100, title: '券包类型', dataIndex: 'type' },
            { width: 100, title: '库存', dataIndex: 'remainStock', className: tc, render: render3 },
            { width: 200, title: '有效期', dataIndex: 'postTime', className: tc, render: render2 },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.state;
        return list.map((x, i) => ({
            key: x.couponPackageID,
            type: typeMap[x.couponPackageType],
            ...x,
        }));
    }
    render() {
        const { visible } = this.state;
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
                    pagination={false}
                />
                {visible &&
                    <AddModal
                        onAdd={this.onSelectBag}
                        onClose={this.onToggleModal}
                    />
                }
            </div>
        );
    }
}

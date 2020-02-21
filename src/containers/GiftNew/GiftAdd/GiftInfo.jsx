import React, { Component } from 'react';
import { Button, Table, Popconfirm } from 'antd';
import styles from './Crm.less';
import GiftModal from './GiftModal';
import { getGiftList, deleteGift, postGift, getCardList } from './AxiosFactory';

const href = 'javascript:;';
/** 任意金额组件 */
export default class GiftInfo extends Component {
    state = {
        visible: false,      // 弹层是否显示
        giftTreeData: [],
    }
    componentDidMount() {
        getCardList({}).then(x => {
            this.setState({ giftTreeData: x });
        });
    }
    /* 生成表格头数据 */
    generateColumns() {
        const { tc } = styles;
        const render = (v) => {
            return (
                <Popconfirm
                    title="确定删除吗?"
                    onConfirm={() => { this.onDelete(v) }}
                >
                    <a href={href}>删除</a>
                </Popconfirm>
            );
        };
        // 表格头部的固定数据
        return [
            { width: 40, title: '序号', dataIndex: 'idx', className: tc },
            { width: 80, title: '礼品类型', dataIndex: 'op', className: tc },
            { width: 100, title: '礼品名称', dataIndex: 'giftName', className: tc },
            { width: 100, title: '礼品金额(元)', dataIndex: 'b', className: tc },
            { width: 70, title: '礼品个数', dataIndex: 'c', className: tc },
            { width: 100, title: '礼品有效期', dataIndex: 'd', className: tc },
            { width: 70, title: '操作', dataIndex: 'id', className: tc, render },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        // const { value: list } = this.props;
        const list = [{ id: 11, op: 2, giftName: 2, b: 3, c: 33, d: 43 }];
        return list.map((x, i) => ({
            key: x.id,
            idx: i + 1,
            ...x,
        }));
    }
    /* 关闭模态框 */
    toggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    /** 增加 */
    onPost = () => {
        postGift().then((flag) => {
            if (flag) {
                message.success('success');
                // getGiftList();
            }
        });
    }
    /** 删除 */
    onDelete = (id) => {
        deleteGift(id).then((flag) => {
            if (flag) {
                message.success('success');
                // getGiftList();
            }
        });
    }
    render() {
        const { visible, giftTreeData } = this.state;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        return (
            <div className={styles.cGiftInfo}>
                <Button icon="plus" onClick={this.toggleModal}>添加礼品</Button>
                <Table
                    bordered={true}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
                {visible &&
                    <GiftModal
                        treeData={giftTreeData}
                        onClose={this.toggleModal}
                        onPost={this.onPost}
                    />
                }
            </div>
        );
    }
}

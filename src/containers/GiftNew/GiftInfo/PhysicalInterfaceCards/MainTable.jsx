import React, { Component } from 'react';
import { Table, Modal } from 'antd';
import styles from './index.less';
import PagingFactory from 'components/PagingFactory';
import { CARDS } from './Common';
import { stopCardTemplate } from './AxiosFactory';

/** 列表页表格数据 */
class MainTable extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        visible: false, // 是否显示弹层
        visible1: false, // 是否显示弹层
        detail: {},
        couponPackageID: '',
        stock: '',
        pageSize: 25,
    };

    /* 根据父组件传来的数据判断是否需要更新分页组件 */
    componentWillReceiveProps(np) {
        if (this.props.pageObj !== np.pageObj) {
            this.props.onSavePaging(np.pageObj);
        }
    }

    /** 编辑/查看 */
    onEdit = (key, item) => {
        const { onGoEdit } = this.props;
        onGoEdit(key, {
            ...item,
            brandIDs: item.brandIDs ? item.brandIDs.split(',') : [],
        });
    }


    /* 分页改变执行 */
    onPageChange = (pageNo, pageSize) => {
        const { onQuery, pageObj } = this.props;
        this.setState({ pageSize }, () => {
            const params = { pageSize, pageNo: pageObj.pageSize !== pageSize ? 1 : pageNo };
            onQuery(params);
        })

    }

    handleStop = (item) => {
        const { title } = CARDS[this.props.pageType];
        const { groupID } = this.props
        Modal.confirm({
            title: '您确定要停用吗？',
            content: (
                <div>
                    {`您将停用${title}【${item.templateName}】`}
                    <br />
                    <span>{`停用是不可恢复操作，被停用的${title}可以在已停用状态下查看~`}</span>
                </div>
            ),
            onOk: () => {
                stopCardTemplate({ groupID, itemID: item.itemID }).then((res) => {
                    if (res) {
                        this.props.onQuery();
                    }
                });
            },
        })
    }

    handleOperate = (key, item) => {
        switch (key) {
            case 'edit':
                this.onEdit(key, item);
                break;
            case 'preview':
                this.onEdit(key, item);
                break;
            case 'stop':
                this.handleStop(item);
                break;
            case 'detail':
                //todo
                this.props.upDateParentState({ visibleCard: true, item });
                break;
            default:
                break;

        }
    }

    /* 生成表格头数据 */
    generateColumns() {
        const { pageObj, pageType } = this.props;
        const { columns } = CARDS[pageType];
        return columns({ pageObj, handleOperate: this.handleOperate, pageType })
    }

    render() {
        const { loading, pageObj, list, pageType, } = this.props;
        const { style } = CARDS[pageType];
        const columns = this.generateColumns();
        const pagination = { ...pageObj, onChange: this.onPageChange, onShowSizeChange: this.onPageChange, pageSizeOptions: ['25', '50', '100', '200'], showSizeChanger: true };
        return (
            <div className={styles.tableBox}>
                <Table
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    dataSource={list}
                    style={style}
                    scroll={{ y: 'calc(100vh - 440px)', x: true }}
                    pagination={pagination}
                />
            </div>
        )
    }
}
export default PagingFactory(MainTable)

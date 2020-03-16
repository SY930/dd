import React, { PureComponent as Component } from 'react';
import { Table, message, Modal, Tooltip } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { href, DF, TF } from './Common';
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
    /** 编辑 */
    onUse = (couponPackageID, name) => {

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
        const render = (v, o) => {
            const { couponPackageID: id } = o;
            return (<a href={href} id={id} onClick={this.onUse}>使用</a>);
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
        // 表格头部的固定数据
        return [
            { width: 80, title: '操作', dataIndex: 'op', className: tc, render },
            { title: '券包名称', dataIndex: 'couponPackageName', render: render1 },
            { width: 120, title: '券包类型', dataIndex: 'type' },
            { width: 100, title: '库存', dataIndex: 'couponPackageStock', className: tc },
            { width: 260, title: '有效期', dataIndex: 'postTime', className: tc, render: render2 },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        const type = { 1: '付费购买', 2: '活动投放' };
        return list.map((x, i) => ({
            key: x.couponPackageID,
            type: type[x.couponPackageType],
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
                        style={{ maxWidth: 1300 }}
                        scroll={{ y: 'calc(100vh - 440px)' }}
                        pagination={pagination}
                    />
                </div>
        )
    }
}
export default PagingFactory(MainTable)

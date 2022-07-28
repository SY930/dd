import React, { PureComponent as Component } from 'react';
import { Table } from 'antd';
import PagingFactory from 'components/PagingFactory';
import styles from "./style.less";

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
        let { tc } = styles;
        return [
            { 
                title: '序号',
                dataIndex: 'no',
                className: tc,
                width: 50
            },
            { 
                title: '订单号',
                dataIndex: 'orderId',
                className: tc,
                width: 200,
            },
            { 
                title: '分销人',
                dataIndex: 'distributor',
                className: tc,
                width: 180,
            },
            { 
                title: '被邀请人',
                dataIndex: 'invitee',
                className: tc,
                width: 100,
            },
            { 
                title: '返佣金额(元)',
                dataIndex: 'rakeBackMoney',
                className: tc,
                width: 100,
            },
            { 
                title: '返佣状态',
                dataIndex: 'rakeBackStatus',
                className: tc,
                width: 100,
            },
            { 
                title: '订单状态',
                dataIndex: 'orderStatus',
                className: tc,
                 width: 100,
            },
            { 
                title: '下单时间',
                dataIndex: 'orderTime',
                className: tc,
                width: 100,
            },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        return list.map((x, i) => ({
            key: x.couponPackageID,
            type: '',
            ...x,
        }));
    }
    render() {
        const { loading, page } = this.props;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        const pagination = { 
            ...page, 
            onChange: this.onPageChange,
            onShowSizeChange: this.onPageChange,  
        };
        return (
                <div>
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

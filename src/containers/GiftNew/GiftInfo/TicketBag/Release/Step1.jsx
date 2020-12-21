import React, { PureComponent as Component } from 'react';
import { Table, Alert, Modal, Popconfirm, Tooltip } from 'antd';
import styles from './index.less';
import PagingFactory from 'components/PagingFactory';

class Step1 extends Component {
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
        // 表格头部的固定数据
        return [
            { width: 150, title: '券包名称', dataIndex: 'couponPackageName' },
            { width: 160, title: '券包ID', dataIndex: 'couponPackageID' },
            { width: 100, title: '券包说明', dataIndex: 'couponPackageDesciption' },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        return list.map(x => ({
            key: x.couponPackageID,
            ...x,
        }));
    }

    render() {
        const { onChange, selectedRowKeys } = this.props;
        const { loading, page } = this.props;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        const pagination = {
            ...page,
            onChange: this.onPageChange,
            onShowSizeChange: this.onPageChange,
        };
        const tableProps = { rowSelection: { selectedRowKeys, onChange } };
        const tips = <p>提示：<br />1、仅付费购买类型的券包可以选择投放；<br />
            2、公众号菜单、线上餐厅可以配置链接进行投放，二维码可以投放在微信公众号文章等场景做为物料推广。
            其中，选择公众号后可在二维码推广场景扫码先关注公众号再购买券包。</p>
        return (
                <div className={styles.tableBox}>
                    <Alert message={tips} type="warning" />
                    <Table
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ y: 400 }}
                        pagination={pagination}
                        {...tableProps}
                    />
                </div>
        )
    }
}
export default PagingFactory(Step1)

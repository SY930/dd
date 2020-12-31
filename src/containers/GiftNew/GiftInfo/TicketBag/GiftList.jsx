import React, { PureComponent as Component } from 'react';
import { Row, Col, Button, Table } from 'antd';
import styles from './index.less';
import MainTable from './MainTable';
import QueryForm from './QueryForm';
import { getTicketList } from './AxiosFactory';
import ReleaseModal from './Release';

export default class GiftList extends Component {
    constructor(props){
        super(props)
        this.state = {
            list: [],
            loading: false,
            queryParams: {},        // 临时查询缓存，具体对象查看QueryForm对象
            visible: false,
        };
        this.setTableRef = el => this.tableRef = el;
    }
    componentDidMount() {
        this.onQueryList();
    }
    /**
     * 加载列表
     */
    onQueryList = (params) => {
        const { queryParams } = this.state;
        const { groupID, pageType } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        let couponPackageStatus = pageType == 2 ? 1 : 2
        const newParams = { ...queryParams, ...params, couponPackageStatus, groupID };
        // 把查询需要的参数缓存
        this.setState({ queryParams: newParams, loading: true });
        getTicketList({ groupID, ...newParams }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj, list, loading: false });
        });
    }
    /* 是否显示 */
    onToggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    render() {
        const { list, loading, pageObj, visible, queryParams } = this.state;
        const { groupID, onGoEdit } = this.props;
        const { couponPackageStatus } = queryParams;
        return (
            <div className={styles.listBox}>
                <QueryForm
                    onQuery={this.onQueryList}
                    onThrow={this.onToggleModal}
                    pageType={this.props.pageType}
                />
                <div className="layoutsLine"></div>
                <Table
                    ref={this.setTableRef}
                    bordered={true}
                    columns={this.getTableColumns().map(c => (c.render ? ({
                        ...c,
                        render: c.render.bind(this),
                    }) : c))}
                    dataSource={this.state.dataSource}
                    pagination={{
                        showSizeChanger: true,
                        pageSize,
                        current: pageNo,
                        total: this.state.total,
                        showQuickJumper: true,
                        onChange: this.handlePageChange,
                        onShowSizeChange: this.handlePageChange,
                        showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
                    }}
                    loading={this.props.loading}
                    scroll={{ x: 1600,  y: 'calc(100vh - 440px)' }}
                />
                {visible &&
                    <ReleaseModal
                        onClose={this.onToggleModal}
                        groupID={groupID}
                    />
                }
            </div>
        )
    }
}


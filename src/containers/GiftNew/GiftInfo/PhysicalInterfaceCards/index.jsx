import React, { Component } from 'react';
import styles from './index.less';
import MainTable from './MainTable';
import QueryForm from './QueryForm';
import { getCardTemplateList } from './AxiosFactory';

export default class PhysicalInterfaceCards extends Component {
    state = {
        list: [],
        loading: false,
        queryParams: { pageNo: 1, pageSize: 25, status: '1' },
        pageObj: { current: 1, pageSize: 25, total: 0 },
        brands: [],
        reLoadPage: false,
        selectedRowKeys: [],
        selectedRows: [],
    };

    componentDidMount() {
        this.onQueryList();

    }

    componentWillReceiveProps(np) {
        if (np.reloadList && !this.props.reloadList) {
            this.onQueryList();
            this.props.upDateParentState({ reloadList: false })
        }
    }

    /**
     * 加载列表
     */
    onQueryList = (params) => {
        const { queryParams } = this.state;
        const { groupID } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const newParams = { ...queryParams, ...params, groupID };
        // 把查询需要的参数缓存
        this.setState({ queryParams: newParams, loading: true });
        getCardTemplateList({ groupID, ...newParams }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj: pageObj || this.state.pageObj, list, loading: false });
        });
    }

    upDateSelected = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    }


    render() {
        const { list, loading, pageObj, queryParams, selectedRowKeys, selectedRows } = this.state;
        const { groupID, onGoEdit, pageType, cardTypeList } = this.props;
        const { couponPackageStatus } = queryParams;
        return (
            <div className={styles.listBox}>
                <QueryForm
                    onQuery={this.onQueryList}
                    pageType={pageType}
                    selectedRows={selectedRows}
                    cardTypeList={cardTypeList}
                />
                <div className="layoutsLine"></div>
                <MainTable
                    groupID={groupID}
                    list={list}
                    loading={loading}
                    pageObj={pageObj}
                    onQuery={this.onQueryList}
                    onGoEdit={onGoEdit}
                    status={couponPackageStatus}
                    pageType={this.props.pageType}
                    upDateParentState={this.props.upDateParentState}
                    upDateSelected={this.upDateSelected}
                    selectedRowKeys={selectedRowKeys}
                />
            </div>
        )
    }
}


import React, { PureComponent as Component } from 'react';
import { Row, Col, Button } from 'antd';
import styles from './index.less';
import MainTable from './MainTable';
import QueryForm from './QueryForm';
import { getTicketList } from './AxiosFactory';

export default class TicketBag extends Component {
    state = {
        list: [],
        loading: !1,
        queryParams: {},        // 临时查询缓存，具体对象查看QueryForm对象
    };
    componentDidMount() {
        this.onQueryList();
    }
    /**
     * 加载列表
     */
    onQueryList = (params) => {
        const { queryParams } = this.state;
        const { groupID } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const obj = { ...queryParams, ...params,  groupID };
        // 把查询需要的参数缓存
        this.setState({ queryParams: obj, loading: !0 });
        getTicketList({ groupID, ...params }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj, list, loading: !1 });
        });
    }
    render() {
        const { list, loading, pageObj } = this.state;
        const { groupID, accountID, onGoEdit } = this.props;
        return (
            <div className={styles.listBox}>
                <QueryForm
                    onQuery={this.onQueryList}
                />
                <div className="layoutsLine"></div>
                <MainTable
                    groupID={groupID}
                    accountID={accountID}
                    list={list}
                    loading={loading}
                    pageObj={pageObj}
                    onQuery={this.onQueryList}
                    onGoEdit={onGoEdit}
                />
            </div>
        )
    }
}


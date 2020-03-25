import React, { PureComponent as Component } from 'react';
import { Row, Col, Button } from 'antd';
import styles from './index.less';
import MainTable from './MainTable';
import QueryForm from './QueryForm';
import { getTicketList } from './AxiosFactory';
import ReleaseModal from './Release';

export default class TicketBag extends Component {
    state = {
        list: [],
        loading: false,
        queryParams: {},        // 临时查询缓存，具体对象查看QueryForm对象
        visible: false,
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
        const newParams = { ...queryParams, ...params,  groupID };
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
        const { list, loading, pageObj, visible } = this.state;
        const { groupID, onGoEdit } = this.props;
        return (
            <div className={styles.listBox}>
                <QueryForm
                    onQuery={this.onQueryList}
                    onThrow={this.onToggleModal}
                />
                <div className="layoutsLine"></div>
                <MainTable
                    groupID={groupID}
                    list={list}
                    loading={loading}
                    pageObj={pageObj}
                    onQuery={this.onQueryList}
                    onGoEdit={onGoEdit}
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


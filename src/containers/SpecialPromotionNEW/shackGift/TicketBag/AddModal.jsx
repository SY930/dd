import React, { PureComponent as Component } from 'react';
import { Modal, Button, Icon } from 'antd';
import styles from './index.less';
import { getTicketList } from './AxiosFactory';
import MainTable from './MainTable';
import QueryForm from './QueryForm';

class AddModal extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        list: [],
        loading: !1,
        queryParams: {},        // 临时查询缓存，具体对象查看QueryForm对象
        pageObj: {},
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
        const { onClose, groupID } = this.props;
        return (
            <Modal
                title="券包使用详情"
                visible={true}
                width="800"
                maskClosable={false}
                onCancel={onClose}
                footer={[<Button key="back" onClick={onClose}>关闭</Button>]}
            >
                <QueryForm
                    onQuery={this.onQueryList}
                />
                <MainTable
                    list={list}
                    loading={loading}
                    pageObj={pageObj}
                    onQuery={this.onQueryList}
                />
            </Modal>
        )
    }
}
export default AddModal

import React, { PureComponent as Component } from 'react';
import { Row, Col, Button, message } from 'antd';
import styles from './index.less';
import MainTable from './MainTable';
import QueryForm from './QueryForm';
import { getTicketList } from './AxiosFactory';
import ReleaseModal from './Release';
import { axiosData } from '../../../../helpers/util';

export default class TicketBag extends Component {
    queryFormRef = null;
    state = {
        list: [],
        loading: false,
        queryParams: { pageNo: 1, pageSize: 25 },        // 临时查询缓存，具体对象查看QueryForm对象
        visible: false,
        exportLoading: false,
    };
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
    onExport = () => {
        this.queryFormRef.form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const { groupID, pageType } = this.props;
            let couponPackageStatus = pageType == 2 ? 1 : 2
            const { pageNo, pageSize } = this.state.pageObj;
            const obj = {
                ...values,
                pageNo,
                pageSize,
                groupID,
                couponPackageStatus
            }
            if (!obj.name) {
                delete obj.name
            }
            this.setState({
                exportLoading: true
            })
            axiosData(
                '/crm/export/exportCouponPackage.ajax',
                { ...obj },
                null,
                { path: '' },
            ).then(res => {
                this.setState({
                    exportLoading: false
                })
                if (res && res.code == '000') {
                    message.success('导出成功')
                }
            }).catch(error => {
                this.setState({
                    exportLoading: false
                })
            })
        })
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
                    onExport={this.onExport}
                    pageType={this.props.pageType}
                    onRef={node => this.queryFormRef = node}
                    exportLoading={this.state.exportLoading}
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
                    treeData={this.props.treeData}
                    pageType={this.props.pageType}
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


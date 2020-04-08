import React, { PureComponent as Component } from 'react';
import { Modal, Button, Tabs, Icon, message } from 'antd';
import styles from './index.less';
import InfoTable from './InfoTable';
import TotalTable from './TotalTable';
import MainTable from './MainTable';
import QueryForm from './QueryForm';
import { getTotalList } from '../AxiosFactory';
import PresentForm from './PresentForm';
import { imgURI } from '../Common';
import ExportModal from '../../ExportModal';
import RefundModal from './RefundModal';

const TabPane = Tabs.TabPane;
class Detail extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        list: [],
        loading: false,
        queryParams: {},        // 发出数临时查询缓存，具体对象查看QueryForm对象
        pageObj: {},
        list2: [],
        loading2: false,
        queryParams2: {},        // 使用数临时查询缓存，具体对象查看QueryForm对象
        pageObj2: {},
        list3: [],
        loading4: false,
        queryParams4: {},        // 退款查询临时查询缓存，具体对象查看QueryForm对象
        pageObj4: {},
        visible: '',             // 弹层是否显示
        selectedRowKeys: [],     // 退款ids
    };
    componentDidMount() {
        const params = {pageSize: 10};
        this.onQueryList(params);
        this.onQueryList2(params);
        this.onQueryList3(params);
    }
    /**
     * 发出数
     */
    onQueryList = (params) => {
        const { queryParams } = this.state;
        const { ids } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const newParams = { ...queryParams, ...params,  ...ids };
        // 把查询需要的参数缓存
        this.setState({ queryParams: newParams, loading: true });
        getTotalList({ ...ids, ...newParams }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj, list, loading: false });
        });
    }
    // 使用数
    onQueryList2 = (params) => {
        const { queryParams2 } = this.state;
        const { ids } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const newParams = { ...queryParams2, ...params,  ...ids };
        // 把查询需要的参数缓存
        this.setState({ queryParams2: newParams, loading2: true });
        getTotalList({ ...ids, ...newParams, couponPackageStatus: '3' }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj2: pageObj, list2: list, loading2: false });
        });
    }
    // 退款查询
    onQueryList3 = (params) => {
        const { queryParams3 } = this.state;
        const { ids } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const newParams = { ...queryParams3, ...params,  ...ids };
        // 把查询需要的参数缓存
        this.setState({ queryParams3: newParams, loading3: true });
        getTotalList({ ...ids, ...newParams, getWay: '10' }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj3: pageObj, list3: list, loading3: false });
        });
    }
    /* 显示模态框 */
    onOpenModal = ({ target }) => {
        const { selectedRowKeys } = this.state;
        const { name: visible } = target.closest('button');
        if(visible === 'refund') {
            if(!selectedRowKeys[0]){
                message.warning('请选择需要退款的券包！');
                return;
            }
        }
        this.setState({ visible });
    }
    /* 关闭窗口 */
    onCloseModal = () => {
        this.setState({ visible: '' });
    }
    /* 关闭窗口 */
    onCloseRefund = () => {
        this.onCloseModal();
        this.onQueryList3();
    }
    // 退款选中的订单
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    render() {
        const { list, loading, pageObj, visible, selectedRowKeys } = this.state;
        const { list2, loading2, pageObj2 } = this.state;
        const { list3, loading3, pageObj3 } = this.state;
        const { detail: { couponPackageInfo = [], shopInfos = [], couponPackageGiftConfigs = [] } } = this.props;
        const { couponPackageImage, couponPackageName, createTime, couponPackageID,
            couponPackageDesciption, couponPackageStock, sendCount = 0 } = couponPackageInfo;
        const { onClose, ids } = this.props;
        const imgSrc = couponPackageImage || 'basicdoc/706f75da-ba21-43ff-a727-dab81e270668.png';
        const oddStock = couponPackageStock - sendCount;
        const resetStock = couponPackageStock === -1 ? '不限制' : couponPackageStock;
        return (
            <Modal
                title="券包使用详情"
                visible={true}
                width="800"
                maskClosable={false}
                onCancel={onClose}
                footer={[<Button key="back" onClick={onClose}>关闭</Button>]}
            >
                <ul className={styles.mainBox}>
                    <li>
                        <h3>基本信息</h3>
                        <div className={styles.infoBox}>
                            <img src={imgURI + imgSrc} alt="宣传图" />
                            <div>
                                <em>券包名称：</em>
                                <p>{couponPackageName}</p>
                            </div>
                            <div>
                                <em>创建时间：</em>
                                <p>{createTime}</p>
                            </div>
                            <div>
                                <em>券包说明：</em>
                                <p>{couponPackageDesciption}</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <h3>券包数据</h3>
                        <div>
                            <TotalTable list={[{couponPackageStock: resetStock, sendCount}]} />
                            <InfoTable list={couponPackageGiftConfigs} />
                        </div>
                    </li>
                    <li className={styles.dataBox}>
                        <h3>数据统计</h3>
                        <Tabs defaultActiveKey="1" className="tabsStyles">
                            <TabPane tab="发出数" key="1">
                                {/* <Button
                                    type="ghost"
                                    name="export"
                                    disabled={!list[0]}
                                    className={styles.expBtn}
                                    onClick={this.onOpenModal}
                                ><Icon type="export" />导出</Button> */}
                                <QueryForm onQuery={this.onQueryList} />
                                <MainTable
                                    list={list}
                                    loading={loading}
                                    pageObj={pageObj}
                                    onQuery={this.onQueryList}
                                />
                            </TabPane>
                            <TabPane tab="使用数" key="2">
                                <QueryForm type={2} onQuery={this.onQueryList2} />
                                {/* <Button
                                    type="ghost"
                                    disabled={!list2[0]}
                                    className={styles.expBtn}
                                    onClick={this.onToggleModal}
                                ><Icon type="export" />导出</Button> */}
                                <MainTable
                                    type={2}
                                    list={list2}
                                    loading={loading2}
                                    pageObj={pageObj2}
                                    onQuery={this.onQueryList2}
                                />
                            </TabPane>
                            <TabPane tab="赠送" key="3">
                                <PresentForm ids={ids} num={oddStock} />
                            </TabPane>
                            <TabPane tab="退款" key="4">
                                <QueryForm type={3} onRefund={this.onOpenModal} onQuery={this.onQueryList3} />
                                <MainTable
                                    type={3}
                                    list={list3}
                                    loading={loading3}
                                    pageObj={pageObj3}
                                    selectedRowKeys={selectedRowKeys}
                                    onQuery={this.onQueryList3}
                                    onChange={this.onSelectChange}
                                />
                            </TabPane>
                        </Tabs>
                    </li>
                </ul>
                {visible === 'export' &&
                    <ExportModal
                        giftItemID={couponPackageID}
                        giftName={couponPackageName}
                        activeKey="send"
                        newExport // 除了礼品定额卡之外的导出, 复用组件
                        handleClose={this.onCloseModal}
                    />
                }
                {visible === 'refund' &&
                    <RefundModal
                        ids={ids}
                        list={selectedRowKeys}
                        onClose={this.onCloseRefund}
                    />
                }
            </Modal>
        )
    }
}
export default Detail

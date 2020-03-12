import React, { PureComponent as Component } from 'react';
import { Modal, Button, Tabs, Icon } from 'antd';
import styles from './index.less';
import InfoTable from './InfoTable';
import TotalTable from './TotalTable';
import MainTable from './MainTable';
import QueryForm from './QueryForm';
import { getTotalList } from '../AxiosFactory';
import PresentForm from './PresentForm';
import { imgURI } from '../Common';
import ExportModal from "../../ExportModal";

const TabPane = Tabs.TabPane;
class Detail extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        list: [],
        loading: !1,
        queryParams: {},        // 临时查询缓存，具体对象查看QueryForm对象
        pageObj: {},
        list2: [],
        loading2: !1,
        queryParams2: {},        // 临时查询缓存，具体对象查看QueryForm对象
        pageObj2: {},
        visible: !1,
    };
    componentDidMount() {
        this.onQueryList();
    }
    /**
     * 加载列表
     */
    onQueryList = (params) => {
        const { queryParams } = this.state;
        const { ids } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const obj = { ...queryParams, ...params,  ...ids };
        // 把查询需要的参数缓存
        this.setState({ queryParams: obj, loading: !0 });
        getTotalList({ ...ids, ...params }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj, list, loading: !1 });
        });
    }
    onQueryList2 = (params) => {
        const { queryParams2 } = this.state;
        const { ids } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const { } = params;
        const obj = { ...queryParams2, ...params,  ...ids };
        // 把查询需要的参数缓存
        this.setState({ queryParams2: obj, loading2: !0 });
        getTotalList({ ...ids, ...params, couponPackageStatus: '3' }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj2: pageObj, list2: list, loading2: !1 });
        });
    }
    /* 是否显示 */
    onToggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    render() {
        const { list, loading, pageObj, visible } = this.state;
        const { list2, loading2, pageObj2 } = this.state;
        const { detail: { couponPackageInfo = [], shopInfos = [], couponPackageGiftConfigs = [] } } = this.props;
        const { couponPackageImage, couponPackageName, sellBeginTime, couponPackageID,
            sellEndTime, couponPackageDesciption, couponPackageStock, sendCount = 0 } = couponPackageInfo;
        const { onClose, ids } = this.props;
        const imgSrc = couponPackageImage || 'basicdoc/706f75da-ba21-43ff-a727-dab81e270668.png';
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
                                <p>{sellBeginTime + ' ~ ' + sellEndTime}</p>
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
                            <TotalTable list={[{couponPackageStock, sendCount}]} />
                            <InfoTable list={couponPackageGiftConfigs} />
                        </div>
                    </li>
                    <li className={styles.dataBox}>
                        <h3>数据统计</h3>
                        <Tabs defaultActiveKey="1" className="tabsStyles">
                            <TabPane tab="发出数" key="1">
                                <Button
                                    type="ghost"
                                    className={styles.expBtn}
                                    onClick={this.onToggleModal}
                                ><Icon type="export" />导出</Button>
                                <QueryForm onQuery={this.onQueryList} />
                                <MainTable
                                    list={list}
                                    loading={loading}
                                    pageObj={pageObj}
                                    onQuery={this.onQueryList}
                                />
                            </TabPane>
                            <TabPane tab="使用数" key="2">
                                <QueryForm use={!0} onQuery={this.onQueryList2} />
                                <MainTable
                                    use={!0}
                                    list={list2}
                                    loading={loading2}
                                    pageObj={pageObj2}
                                    onQuery={this.onQueryList2}
                                />
                            </TabPane>
                            <TabPane tab="赠送" key="3">
                                <PresentForm ids={ids} num={couponPackageStock} />
                            </TabPane>
                        </Tabs>
                    </li>
                </ul>
                {visible &&
                    <ExportModal
                        giftItemID={couponPackageID}
                        giftName={couponPackageName}
                        activeKey="send"
                        newExport // 除了礼品定额卡之外的导出, 复用组件
                        handleClose={this.onToggleModal}
                    />
                }
            </Modal>
        )
    }
}
export default Detail

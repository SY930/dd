import React, { PureComponent as Component } from 'react';
import { Modal, Button } from 'antd';
import styles from './index.less';
import InfoTable from './InfoTable';
import TotalTable from './TotalTable';
import MainTable from './MainTable';
import QueryForm from './QueryForm';
import { getTotalList } from '../AxiosFactory';

class Detail extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        list: [],
        loading: !1,
        queryParams: {},        // 临时查询缓存，具体对象查看QueryForm对象
    };
    componentDidMount() {
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
        this.setState({ queryParams: obj, loading: !!1 });
        getTotalList({ ...ids, ...params }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj, list, loading: !1 });
        });
    }
    render() {
        const { list, loading, pageObj } = this.state;
        const { detail: { couponPackageInfo = [], shopInfos = [], couponPackageGiftConfigs = [] } } = this.props;
        const { couponPackageImage, couponPackageName, sellBeginTime,
            sellEndTime, couponPackageDesciption, couponPackageStock, maxSendLimit } = couponPackageInfo;
        const { onClose } = this.props;
        const imgSrc = couponPackageImage || 'http://res.hualala.com/basicdoc/706f75da-ba21-43ff-a727-dab81e270668.png';
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
                            <img src={imgSrc} alt="宣传图" />
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
                            <TotalTable list={[{couponPackageStock, maxSendLimit}]} />
                            <InfoTable list={couponPackageGiftConfigs} />
                        </div>
                    </li>
                    <li>
                        <h3>券包明细统计</h3>
                        <div>
                            <QueryForm onQuery={this.onQueryList} />
                            <MainTable
                                list={list}
                                loading={loading}
                                pageObj={pageObj}
                                onQuery={this.onQueryList}
                            />
                        </div>
                    </li>
                </ul>
            </Modal>
        )
    }
}
export default Detail

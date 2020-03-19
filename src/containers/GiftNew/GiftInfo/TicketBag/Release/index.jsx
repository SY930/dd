import React, { PureComponent as Component } from 'react';
import { Modal, Button, Steps, message } from 'antd';
import styles from './index.less';
import { getTicketList, getWechatMpInfo, getImgTextList,
    getBagBatch } from '../AxiosFactory';
import { couponImage } from '../Common';
import style from 'components/basic/ProgressBar/ProgressBar.less';
import Step1 from './Step1';
import Step2 from './Step2';

const Step = Steps.Step;

const env = window.HUALALA.ENVIRONMENT;
const urlPath = 'm.hualala.com/newm/couponPackage';
const urlMap = {
    'development': 'dohko.',
    'production-dohko': 'dohko.',
    'production-release': '',
};
class Release extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        current: 0,
        mpInfoList: [],
        imgList: [],
        list: [],
        loading: false,
        queryParams: {},        // 发出数临时查询缓存，具体对象查看QueryForm对象
        pageObj: {},
        selectedRowKeys: [],     // ids
        firstImg: couponImage,
        batchID: '',
        url: '',
        btnLoading: false,
    };
    componentDidMount() {
        this.onQueryStep2Data();
        this.onQueryList({ pageSize: 10 });
    }
    onQueryStep2Data = () => {
        const { groupID } = this.props;
        const params = { groupID, pageNo: 1, pageSize: 1000 };
        getWechatMpInfo(params).then(mpInfoList => {
            this.setState({ mpInfoList });
        });
        const params2 = { ...params, resType: 0 };
        getImgTextList(params2).then(imgList => {
            this.setState({ imgList });
        });
    }
    /**
     * 加载列表
     */
    onQueryList = (params) => {
        const { queryParams } = this.state;
        const { groupID } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const data = { ...queryParams, ...params };
        // 把查询需要的参数缓存
        this.setState({ queryParams: data, loading: true });
        getTicketList({ groupID, ...params }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj, list, loading: false });
        });
    }
    /* 是否显示 */
    onToggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    onGoStep = () => {
        const { current, selectedRowKeys } = this.state;
        if(!selectedRowKeys[0]){
            message.warning('必选一项券包');
            return;
        }
        if(current === 0) {
            const { groupID } = this.props;
            const couponPackageIDs = selectedRowKeys.join();
            const params = { groupID, couponPackageIDs };
            this.setState({ btnLoading: true });
            getBagBatch(params).then(x => {
                const domain = urlMap[env];
                const url = `https://${domain}${urlPath}?groupID=${groupID}&couponPackagesBatchID=${x}`;
                this.setState({ url, current: 1, btnLoading: false });
            });
            return;
        }
        this.setState({ current: 0 });
    }
    // 退款选中的订单
    onSelectChange = (selectedRowKeys) => {
        const { list } = this.state;
        let firstImg = couponImage;
        if(selectedRowKeys[0]){
            const obj = list.find(x=>x.couponPackageID === selectedRowKeys[0]);
            firstImg = obj.couponPackageImage || couponImage;
        }
        this.setState({ selectedRowKeys, firstImg });
    }
    render() {
        const { current, mpInfoList, imgList, firstImg, url, btnLoading } = this.state;
        const { list, loading, pageObj, selectedRowKeys } = this.state;
        const { onClose } = this.props;
        const btnTxt = { 0: '下一步', 1: '上一步' }[current];
        return (
            <Modal
                title=""
                visible={true}
                width="800"
                maskClosable={false}
                onCancel={onClose}
                footer={[<Button key="0" loading={btnLoading} onClick={this.onGoStep}>{btnTxt}</Button>]}
            >
                <section className={styles.mainBox}>
                    <Steps className={style.ProgressBar} current={current}>
                        <Step title="选择券包" />
                        <Step title="券包投放" />
                    </Steps>
                    {current === 0 &&
                        <Step1
                            list={list}
                            loading={loading}
                            pageObj={pageObj}
                            selectedRowKeys={selectedRowKeys}
                            onQuery={this.onQueryList}
                            onChange={this.onSelectChange}
                        />
                    }
                    {current === 1 &&
                        <Step2
                            mpInfoList={mpInfoList}
                            imgList={imgList}
                            firstImg={firstImg}
                            url={url}
                        />
                    }
                </section>
            </Modal>
        )
    }
}
export default Release

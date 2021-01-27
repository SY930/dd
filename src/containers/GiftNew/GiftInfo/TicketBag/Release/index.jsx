import React, { PureComponent as Component } from 'react';
import { Modal, Button, Steps, message } from 'antd';
import styles from './index.less';
import { getTicketList, getWechatMpInfo, getImgTextList,
    getBagBatch } from '../AxiosFactory';
import { couponImage } from '../Common';
import style from 'components/basic/ProgressBar/ProgressBar.less';
import Step1 from './Step1';
import Step2 from './Step2';
import {
    axiosData,
} from '../../../../../helpers/util';

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
        tempList: [],       // 临时券包列表，结合所有查询过的数据，用来筛选firstImg
        downLoadFlag: true,
        shopsInfo: [],
        downloadLoading: false,
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
    // eslint-disable-next-line react/sort-comp
    downLoadLoadingChange = (flag) => {
        this.setState({
            downloadLoading: flag,
        })
    }
    /**
     * 加载列表
     */
    onQueryList = (params) => {
        const { queryParams, tempList: temp } = this.state;
        const { groupID } = this.props;
        const sellBeginTime = new Date().toJSON().substr(0,10).replace(/-/g,'');
        const sellEndTime = sellBeginTime;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const data = { ...queryParams, ...params, couponPackageType: '1', sellBeginTime,sellEndTime};
        // 把查询需要的参数缓存
        this.setState({ queryParams: data, loading: true });
        getTicketList({ groupID, ...data }).then((obj) => {
            const { pageObj, list } = obj;
            const tempList = [...temp, ...list];
            this.setState({ pageObj, list, loading: false, tempList });
        });
    }
    organizeShopId = (arr) => {
        let temp = []
        try {
            arr.forEach((item) => {
                if (item.shopInfos) {
                    const cross = []
                    item.shopInfos.forEach((every) => {
                        cross.push(every.shopID)
                    })
                    if (cross.length && temp.length) {
                        temp = temp.filter((i) => {
                            return cross.indexOf(i) !== -1
                        })
                        if (!temp.length) {
                            throw new Error('it has no range')
                        }   
                    }
                    if (!temp.length) {
                        temp = cross
                    }
                }
            })
        } catch(e) {
            return false
        }
       
        return temp
    }
    onGoStep2 = () => {
        const { selectedRowKeys } = this.state;
        if(!selectedRowKeys[0]){
            message.warning('必选一项券包');
            return;
        }
        const { groupID } = this.props;
        const couponPackageIDs = selectedRowKeys.join();
        const params1 = { groupID, couponPackageIDs: selectedRowKeys };
        this.setState({ btnLoading: true });
        axiosData(
            "/couponPackage/querySaleShopInfo.ajax",
            { ...params1 },
            null,
            { path: "couponPackageInfos" },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        )
            .then(
                (records) => {
                    let shops = this.organizeShopId(records)
                    //  如果shops为空证明是所有店铺
                    this.setState({
                        shopsInfo: shops
                    })
                },
                (err) => {
                    // network error catch
                    message.error(err)
                }
            )
            .catch((err) => {
                // js error catch
                console.log(err);
            });
        const params = { groupID, couponPackageIDs };
        getBagBatch(params).then(x => {
            const domain = urlMap[env];
            const url = `https://${domain}${urlPath}?groupID=${groupID}&couponPackagesBatchID=${x}`;
            this.setState({ url, current: 1, btnLoading: false });
        });
    }
    onGoStep1 = () => {
        this.onQueryList({ pageSize: 10 });
        this.setState({ current: 0 });
    }
    //
    onSelectChange = (selectedRowKeys) => {
        const { tempList } = this.state;
        let firstImg = couponImage;
        if(selectedRowKeys[0]){
            const obj = tempList.find(x=>x.couponPackageID === selectedRowKeys[0]);
            firstImg = obj.couponPackageImage || couponImage;
        }
        this.setState({ selectedRowKeys, firstImg });
    }
    constructBusinessArray = (data) => {
        data.shops.forEach((item) => {
            item.businessType = BUSINESS_MODEL[item.businessModel];
        });
        data.businessModels = [
            {businessModel: '1', businessType: '直营 '},
            {businessModel: '2', businessType: '加盟 '},
            {businessModel: '3', businessType: '托管'},
            {businessModel: '4', businessType: '合作'},
        ]
        return data
    }
    cancelDownLoad = () => {
        this.setState({
            downLoadFlag: true
        })
    }
    goDownLoad = () => {
        this.setState({
            downLoadFlag: false
        })
    }
    render() {
        const { current, mpInfoList, imgList, firstImg, url, btnLoading, downLoadFlag, downloadLoading } = this.state;
        const { list, loading, pageObj, selectedRowKeys } = this.state;
        const { onClose, groupID } = this.props;
        const step1 = ([<Button key="0" loading={btnLoading} onClick={this.onGoStep2}>下一步</Button>]);
        const step2 = ([
            <Button key="2" onClick={onClose}>取消</Button>,
            <Button key="1" onClick={this.onGoStep1}>上一步</Button>,
            <Button key="3" type={'primary'} onClick={this.goDownLoad} loading={downloadLoading}>下载二维码</Button>,
        ]);
        const footer = { 0: step1, 1: step2 }[current];
        return (
            <Modal
                title=""
                visible={true}
                width="825"
                maskClosable={false}
                onCancel={onClose}
                footer={footer}
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
                            groupID={groupID}
                            downLoadFlag={downLoadFlag}
                            cancelDownLoad={this.cancelDownLoad}
                            shopsInfo={this.state.shopsInfo}
                            downLoadLoadingChange={this.downLoadLoadingChange}
                        />
                    }
                </section>
            </Modal>
        )
    }
}
export default Release

import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { jumpPage } from '@hualala/platform-base';
import { connect } from 'react-redux';
import {
    Table, Icon, Select, DatePicker,
    Button, Modal, Row, Col, message,
    Input, Tooltip, Tabs
} from 'antd';
import CreateCouponContent from '../Modal/CreateCouponContent'
import ScenePutContent from '../Modal/ScenePutContent'
import DYCouponInfoMoldeContent from '../Modal/DYCouponInfoMoldeContent';
import { debounce } from 'lodash'
import styles from '../AlipayCoupon.less'
import { columnsView, getColumns, ThirdCouponConfig } from '../config';
import { axiosData } from '../../../helpers/util'
import { isZhouheiya } from '../../../constants/WhiteList.jsx'
import registerPage from '../../../../index';
import { THIRD_VOUCHER_MANAGEMENT } from '../../../constants/entryCodes';
import { getCardList, getShopPid, getIndirectList, getMpAppList, getPayChannel, getRetailList } from '../AxiosFactory';



const mapStateToProps = (state) => {
    return {
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

@registerPage([THIRD_VOUCHER_MANAGEMENT], {})
@connect(mapStateToProps, mapDispatchToProps)
class CouponManageList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            pageSizes: 25, // 默认显示的条数
            pageNo: 1,
            dataSource: [],
            batchName: '', // 第三方券名称
            itemID: '', // 券ID
            platformType: '', // 关联平台
            promotionType: '', // 关联平台
            couponDateRange: '', // 创建时间
            createCouponModalVisible: false,
            createThirdCouponVisble: false,
            treeData: [],
            treeDataX: [],
            shopPid: [], // 直连PID
            indirectList: [], // 间连列表
            viewModalVisible: false, // 查看券详情弹窗
            viewData: {}, // 券详情内容
            editData: {}, // 编辑券详情内容
            batchStatus: '0,1,3,4,5', // 使用状态
            // couponCodeDockingType: '', // 券码对接类型: 1-订单获取, 2-批量预存导入
            type: '', // 前端标识 1 支付宝 | 2 微信 | 3 抖音 | 
            channelID: 60, // 60支付宝 50微信
            title: '',
            platformTypeCreate: 1, // 平台：1 支付宝   3微信  2 抖音(小风车)
            WXLaunchVisible: false,
            wxData: {},
            cachesTreeData: [],
        }
        this.handleQuery = debounce(this.handleQuery.bind(this), 500);
    }

    componentDidMount() {
        const { from } = this.getQueryVariable();
        this.handleSearch(from);
        this.initData();
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
        this.setState({
            platformType: '',
        })
    }

    onWindowResize = () => {
        const parentDoms = ReactDOM.findDOMNode(this.layoutsContainer); // 获取父级的doms节点
        if (parentDoms != null) { // 如果父级节点不是空将执行下列代码
            const parentHeight = parentDoms.getBoundingClientRect().height; // 获取到父级的高度存到变量 parentHeight
            const contentrDoms = parentDoms.querySelectorAll('.layoutsContent'); // 从父节点中获取 类名是 layoutsContent 的doms节点 存到变量 contentrDoms 中
            if (undefined != contentrDoms && contentrDoms.length > 0) { // 如果 contentrDoms 节点存在 并且length>0 时执行下列代码
                const layoutsContent = contentrDoms[0]; // 把获取到的 contentrDoms 节点存到 变量 layoutsContent 中
                const headerDoms = parentDoms.querySelectorAll('.layoutsHeader');
                const headerHeight = headerDoms[0].getBoundingClientRect().height;
                layoutsContent.style.height = `${parentHeight - headerHeight - 120}px`; // layoutsContent 的高度，等于父节点的高度-头部-横线-padding值
                this.setState({
                    contentHeight: parentHeight - headerHeight - 120,
                })
            }
        }
    }

    initData = () => {
        const { user: {accountInfo}} = this.props;
        const { groupID } = accountInfo || {}
        getCardList({ giftTypes: [10, 111, 21] }).then(x => {
            this.setState({ cacheTreeData: x });
        });
        // 抖音 周黑鸭不调零售接口
        if(!isZhouheiya(groupID)){
            getRetailList().then(v => {
                this.setState({ treeDataX: v });
            })
        }
        
        getShopPid().then((res) => {
            this.setState({
                shopPid: res,
            })
        })
        getIndirectList().then((res) => {
            this.setState({
                indirectList: res,
            })

        })
    }
    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            loading: true,
        }, () => {
            this.handleQuery(1, pageSize)
        })
    };

    onDateQualificationChange = (value) => {
        this.setState({
            couponDateRange: value,
        });
    }

    clearUrl = () => {
        var { href } = window.location;
        var [valiable] = href.split('?');
        window.history.pushState(null, null, valiable);
    }

    getTreeData = (giftTypes) => {
        const { cacheTreeData } = this.state
        let treeData = []
        if (cacheTreeData.length > 0) {
            treeData = (cacheTreeData || []).filter((item) => giftTypes.includes(item.key))
        } else {
            getCardList({ giftTypes }).then(x => {
                this.setState({ treeData: x });
            });
        }
        return treeData
    }

    getQueryVariable = () => {
        const search = window.decodeURIComponent(window.location.search)
        var query = search.substr(1)
        query = query.split('&')
        var params = {}
        for (let i = 0; i < query.length; i++) {
            let q = query[i].split('=')
            if (q.length === 2) {
                params[q[0]] = q[1]
            }
        }
        return params
    }


    getParams = () => {
        const {
            batchName,
            itemID,
            platformType,
            couponDateRange,
            batchStatus,
            promotionType,
            trdDeliveryID,
        } = this.state;
        const opt = {
        };
        if (couponDateRange !== '' && couponDateRange !== undefined && couponDateRange[0] !== undefined) {
            const createStampStart = couponDateRange[0].format('YYYY-MM-DD');
            const createStampEnd = couponDateRange[1].format('YYYY-MM-DD');
            opt.createStampStart = `${createStampStart} 00:00:00`; // 开始时间
            opt.createStampEnd = `${createStampEnd} 23:59:59`; // 结束时间
        }
        if (platformType) {
            opt.platformType = platformType;
        }
        if (batchName !== '' && batchName !== undefined) {
            opt.batchName = batchName;
        }
        if (itemID) {
            opt.itemID = itemID
        }
        if (promotionType) {
            opt.promotionType = promotionType
        }
        if (batchStatus) {
            opt.batchStatus = batchStatus
        }
        if (trdDeliveryID) {
            opt.trdDeliveryID = trdDeliveryID
        }
        return opt
    }

    handleSearch = (from) => {
        if (from) {
            this.setState({
                // platformType: '3'
                platformType: from,
            }, () => {
                this.handleQuery();
                this.clearUrl();
            })
        } else {
            this.setState({
                platformType: ''
            }, () => {
                this.handleQuery();
            })
        }
    }

    handleQuery = (pageNo, pageSize) => {
        if (!this.state.loading) {
            this.setState({
                loading: true,
            });
        }
        const _opt = this.getParams();
        const opt = {
            pageSize: pageSize || this.state.pageSizes,
            pageNo: pageNo || this.state.pageNo,
            ..._opt,
        };
        opt.cb = this.showNothing;
        this.queryEvents(opt);
    }

    queryEvents = (opts) => {
        // const shopID = this.props.user.shopID;

        const params = { ...opts };
        axiosData(
            'couponCodeBatchService/queryBatchList.ajax',
            params,
            null,
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        )
            .then((res) => {
                const { data = {} } = res;
                this.setState({
                    loading: false,
                    dataSource: (data.couponCodeBatchInfos || []).map((item, index) => ({ ...item, index: index + 1 })),
                    pageNo: data.pageNo || 1,
                    pageSizes: data.pageSize || 30,
                    total: data.totalSize || 0,
                });
            }, err => {
                this.setState({
                    loading: false,
                });
            })
    }

    handleChangeTable = (key) => {
        if (key === '2') {
           this.setState({
               batchStatus: '2',
           }, () => {
               this.handleQuery()
           })
        } else {
            this.setState({
                platformType: '',
                batchStatus: '0,1,3,4,5',
            }, () => {
                this.handleQuery()
            })
        }
    }

    handleCreateCouponModal = () => {
        this.setState({
            createThirdCouponVisble: true,
        })
    }

    handleCloseDYCouponInfoModal = () => {
        this.setState({
            dyCouponInfoVisible: false,
        })
    }

    handleCloseThirdCouponModal = () => {
        this.setState({
            createThirdCouponVisble: false,
        })
    }

    handleCloseWXLaunchModal = () => {
        this.setState({
            WXLaunchVisible: false
        })
    }

    // 微信编辑
    handleEdit = (record) => {
        const treeData = this.getTreeData([10, 111, 21])
        this.setState({
            channelID: record.channelID,
            type: 2,
            editData: record,
            createCouponModalVisible: true,
            platformTypeCreate: record.platformType,
            treeData,
            title: '编辑第三方微信商家券'
        })
    }

    // 创建
    handleCreateCouponContentModal = ({ type, channelID, platformTypeCreate, giftTypes }, title) => {
       const treeData = this.getTreeData(giftTypes)
        this.setState({
            createCouponModalVisible: true,
            type,
            channelID,
            platformTypeCreate,
            title,
            editData: {},
            treeData,
        })
    }

    handleCloseModal = () => {
        this.setState({
            createCouponModalVisible: false,
        })
        return null;
    }

    handleStopClickEvent = (record, batchStatus, platformType) => {
        const { itemID } = record;
        // const { user } = getStore().getState();
        // const { groupID } = user.get('accountInfo').toJS()
        const params = { couponCodeBatchInfo: { itemID, batchStatus, platformType } };
        axiosData(
            'couponCodeBatchService/switchStatus.ajax',
            params,
            null,
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((res) => {
            const { code, message: msg } = res;
            if (code === '000') {
                this.handleQuery()
                return message.success(msg)
            }
            return message.error(msg)
        })
    }

    handleView = (record, flag) => {
        const { itemID } = record;
        const params = { itemID };
        axiosData(
            'couponCodeBatchService/getBatchDetail.ajax',
            params,
            null,
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        )
            .then((res) => {
                const { data = {}, code } = res;
                if (code === '000') {
                    if (flag) {
                        this.setState({
                            editData: data.couponCodeBatchInfo,
                            createCouponModalVisible: true
                        });
                    } else {
                        this.setState({
                            viewData: data.couponCodeBatchInfo,
                            viewModalVisible: true
                        });
                    }

                }
            })
    }

    // 抖音（小风车）增加优惠券已发放详情
    handleCouponInfo = (record) => {
        this.setState({
            dyCouponInfoVisible: true,
            batchItemID: record.itemID,
        })
    }

    handleCloseVidwModal = () => {
        this.setState({
            viewModalVisible: false,
        })
    }

    handleShowWxModal = () => {
        this.setState({
            WXLaunchVisible: true,
        })
    }


    renderHeader = () => {
        const headerClasses = `layoutsToolLeft ${styles.headerWithBgColor}`;
        return (
            <div className={headerClasses}>
                <span className={styles.customHeader}>
                    第三方券管理
                </span>
                <div>
                    <Button
                        type="ghost"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                            jumpPage({ menuID: '100008993' })
                        }}
                    >第三方投放</Button>
                    <Button
                        type="primary"
                        icon="plus"
                        className={styles.jumpToCreate}
                        onClick={this.handleCreateCouponModal}
                    >新建第三方券</Button>
                </div>
            </div>
        );
    }

    renderFilterBar = (stop) => {
        return (
            <div>
                <div className="layoutsSearch">
                    <ul>
                        <li>第三方券名称</li>
                        <li>
                            <Input
                                placeholder="请输入三方券名称"
                                onChange={(e) => {
                                    this.setState({
                                        batchName: e.target.value,
                                    });
                                }}
                            />
                        </li>
                        <li>券ID</li>
                        <li>
                            <Input
                                placeholder="请输入券ID"
                                onChange={(e) => {
                                    this.setState({
                                        itemID: e.target.value,
                                    });
                                }}
                            />
                        </li>
                        <li>业态</li>
                        <li>
                            <Select
                                style={{ width: '160px' }}
                                defaultValue={this.state.promotionType}
                                value={this.state.promotionType}
                                onChange={(value) => {
                                    this.setState({
                                        promotionType: value,
                                    });
                                }}
                            >
                                <Option value={''}>全部</Option>
                                <Option value={1}>餐饮</Option>
                                <Option value={2}>零售</Option>
                            </Select>
                        </li>
                        <li>
                            <h5>关联渠道</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: '160px' }}
                                defaultValue={this.state.platformType}
                                // placeholder="请选择关联渠道"
                                value={this.state.platformType}
                                onChange={(value) => {
                                    this.setState({
                                        platformType: value,
                                    });
                                }}
                            >
                                <Option value={''}>全部</Option>
                                <Option value={'1'}>支付宝</Option>
                                <Option value={'3'}>微信</Option>
                                <Option value={'2'}>抖音（小黄车）</Option>
                                <Option value={'5'}>抖音（小风车）</Option>
                                <Option value={'6'}>E折券</Option>
                                <Option value={'7'}>快手</Option>
                            </Select>
                        </li>
                        {
                            !stop && <ul className={styles.restUl}>
                                <li>
                                    <h5>使用状态</h5>
                                </li>
                                <li>
                                    <Select
                                        style={{ width: '160px' }}
                                        defaultValue="0,1,3,4,5"
                                        onChange={(value) => {
                                            this.setState({
                                                batchStatus: value,
                                            });
                                        }}
                                    >
                                        <Option value={'0,1,3,4,5'}>全部</Option>
                                        <Option value={'0'}>未生效</Option>
                                        <Option value={'1'}>执行中</Option>
                                        {/* <Option value={'2'}>停用</Option> */}
                                        <Option value={'3'}>待审核</Option>
                                        <Option value={'4'}>审核通过</Option>
                                        <Option value={'5'}>审核失败</Option>

                                    </Select>
                                </li>
                                <li>
                                    <h5>创建时间</h5>
                                </li>
                                <li>
                                    <RangePicker
                                        style={{ width: 260 }}
                                        // showTime={{ format: 'HH:mm' }}
                                        className={styles.ActivityDateDayleft}
                                        format="YYYY-MM-DD"
                                        placeholder={['开始日期', '结束日期']}
                                        onChange={this.onDateQualificationChange}
                                    />
                                </li>
                            </ul>
                        }
                         <li>批次ID</li>
                        <li>
                            <Input
                                placeholder="请输入批次ID"
                                onChange={(e) => {
                                    this.setState({
                                        trdDeliveryID: e.target.value,
                                    });
                                }}
                            />
                        </li>
                        
                        <li>
                            <Button type="primary" onClick={() => this.handleQuery(1)} disabled={this.state.loading}><Icon type="search" />搜索</Button>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    renderTables = () => {
        return (
            <div className={['layoutsContent', styles.tableClass].join(' ')} style={{ height: this.state.contentHeight, padding: '20px 0' }}>
                <Table
                    scroll={{ x: 800, y: this.state.contentHeight - 108 }}
                    bordered={true}
                    columns={getColumns(this)}
                    dataSource={this.state.dataSource}
                    loading={
                        {
                            delay: 200,
                            spinning: this.state.loading,
                        }
                    }
                    className={styles.CouponTableList}
                    pagination={{
                        pageSize: this.state.pageSizes,
                        pageSizeOptions: ['25', '50', '100', '200'],
                        current: this.state.pageNo,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: this.onShowSizeChange,
                        total: this.state.total || 0,
                        showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                        onChange: (page, pageSize) => {
                            this.setState({
                                /*pageNo: page,*/
                                loading: true
                            }, () => {
                                this.handleQuery(page, this.state.pageSizes);
                            });
                        },
                    }}
                />
            </div>
        );
    }


    render() {
      
        const { user: {accountInfo}} = this.props;

        const { groupID } = accountInfo || {}
        
         let newThirdCouponConfig = [...ThirdCouponConfig];
        if(isZhouheiya(groupID)){
            newThirdCouponConfig = ThirdCouponConfig.filter((item) => ![1,3,5,7].includes(item.params.type))
        }

        return (
            <div className={['layoutsContainer', styles.CouponManageListBox].join(' ')} ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                <div>
                    {this.renderHeader()}
                </div>
                <div style={{ margin: '0 20px' }} className="layoutsLine"></div>
                <Tabs defaultActiveKey="1" className="tabsStyles" onChange={this.handleChangeTable}>
                    <TabPane key={'1'} tab="第三方券查询">
                        <div>
                            <div style={{ background: '#fff', padding: '12px 30px 0' }} className="layoutsHeader">
                                {this.renderFilterBar()}
                            </div>
                            <div className="layoutsLineBlock"></div>
                            <div className={styles.pageContentWrapper}>
                                {this.renderTables()}
                            </div>
                        </div>
                    </TabPane>
                    <TabPane key={'2'} tab="已停用第三方券">
                    <div>
                            <div style={{ background: '#fff', padding: '12px 30px 0' }} className="layoutsHeader">
                                {this.renderFilterBar('stop')}
                            </div>
                            <div className="layoutsLineBlock"></div>
                            <div className={styles.pageContentWrapper}>
                                {this.renderTables()}
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
                {
                    this.state.createThirdCouponVisble && <Modal
                        title="创建第三方券"
                        visible={true}
                        width={710}
                        onCancel={this.handleCloseThirdCouponModal}
                        footer={null}
                        maskClosable={true}
                    >
                        <ul className={styles.createCouponModal__flex__ul}>
                            {
                                newThirdCouponConfig.map((item, index) => (
                                    <li
                                        onClick={() => {
                                            this.handleCreateCouponContentModal(item.params, `新建第三方${item.subTitle}`)
                                        }}
                                        className={styles.createCouponModal__item__li}
                                    >
                                        <p><img src={item.url}></img></p>
                                        <span>{item.title}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </Modal>
                }
                {
                    this.state.createCouponModalVisible && <CreateCouponContent
                        treeData={this.state.treeData}
                        treeDataX={this.state.treeDataX}
                        shopPid={this.state.shopPid}
                        indirectList={this.state.indirectList}
                        handleCloseModal={this.handleCloseModal}
                        handleQuery={this.handleQuery}
                        editData={this.state.editData}
                        type={this.state.type}
                        title={this.state.title}
                        groupID={groupID}
                        platformType={this.state.platformTypeCreate}
                        channelID={this.state.channelID}
                        onParentCancel={this.handleCloseThirdCouponModal}
                    />
                }
                {
                    this.state.viewModalVisible && <ViewCouponContent
                        viewData={this.state.viewData}
                        handleCloseVidwModal={this.handleCloseVidwModal}
                    />
                }
                {/* 投放企鹅吉市 */}
                {
                    this.state.WXLaunchVisible && <ScenePutContent onCancel={this.handleCloseWXLaunchModal} wxData={this.state.wxData} isEdit={this.state.isEdit} title={this.state.title} handleQuery={this.handleQuery} />
                }
                {/* 抖音详情 */}
                {/* TODO: 快手详情，URL传参 */}
                { this.state.dyCouponInfoVisible && <DYCouponInfoMoldeContent onCancel={this.handleCloseDYCouponInfoModal} batchItemID={this.state.batchItemID}/>}
            </div>
        )
    }
}

export default CouponManageList

class ViewCouponContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewData: props.viewData,
            payChannelList: [],
            mpAndAppList: [],
            titleMap: {
                1: '支付宝',
                2: '抖音',
                5: '抖音',
                3: '微信',
                6: 'E折',
                7: '快手'
            }

        }
    }
    componentDidMount() {
        const channelCode = this.state.viewData.merchantType == '1' ? 'wechat' : 'hualalaAinong';
        getPayChannel(channelCode).then((res) => {
            this.setState({
                payChannelList: res,
            })
        })
        getMpAppList().then((res) => {
            if (res) {
                this.setState({
                    mpAndAppList: res,
                })
            }
        })
    }

    renderNumber = (stock) => {        
        const { viewData } = this.state;
        switch (stock) {
            case -1:
                return "不限制";
            default:
                return <span>{stock ? Number(stock) - Number(viewData.receive) : ''}/{viewData.stock}</span>;
        }
    }

    getWXMerchantID = (data) => {
        const { payChannelList } = this.state;
        const { settleName = '' } = payChannelList.find((item) => item.merchantID == data.merchantID) || {}
        return `${data.merchantID}_${settleName}`

    }
    getJumpAppName = (data) => {
        const { mpAndAppList } = this.state;
        const { nickName = '' } = mpAndAppList.find((item) => item.appID == data.jumpAppID) || {}
        return nickName ? `${nickName}` : `${data.jumpAppID}`
    }

    render() {
        const { viewData } = this.state;
        const { stock, receive, merchantType, merchantID, itemID, platformType } = viewData;
        let title = this.state.titleMap[platformType];
        const styleMap = {
            1: 'signInfoZhifubao',
            2: 'signInfoDouyin',
            3: 'signInfoWx',
            5: 'signInfoDouyin',
            6: 'signInfoEzhe',
            7: 'signInfoKuaiShou',
        }
        let styleName = styleMap[platformType];
        return (
            <Modal
                title={`第三方${title}券详情`}
                maskClosable={true}
                width={700}
                visible={true}
                onCancel={this.props.handleCloseVidwModal}
                footer={null}
            >
                <Row className={styles.CouponViewInfo}>
                    <Col span={24} offset={1} className={[styles.signInfo, styles[styleName]].join(' ')}>
                        <h4>{viewData.batchName}</h4>
                        <div style={{ marginBottom: 12 }}>
                            <p>券批次ID： <Tooltip title={itemID}><span>{itemID.length > 15 ? `${itemID.slice(0, 6)}...${itemID.slice(-10)}` : itemID}</span></Tooltip></p>
                            {
                                (platformType == 1 || platformType == 3) && <p>关联小程序：
                                    <span>{platformType == 3 ? this.getJumpAppName(viewData) : viewData.jumpAppID}</span></p>
                            }
                            {
                                platformType == 6 && <p>优惠券面值： <span>{viewData.giftFaceValue || '--'}</span></p>
                            }

                        </div>
                        <div>
                            <p>剩余/总数： { this.renderNumber(stock)}</p>
                            {
                                platformType == 6 && <p>售价： <span>{viewData.deliveryValue || '--'}</span></p>
                            }

                        </div>
                    </Col>
                    <Col span={24} className={styles.relationCoupon__table}>
                        <p className={styles.relationText__span} style={{ marginRight: 0 }}>关联优惠券：</p>
                        <Table
                            pagination={false}
                            bordered={true}
                            columns={columnsView}
                            dataSource={[this.state.viewData]}
                        />
                    </Col>
                    {
                        (platformType == 1 || platformType == 3) && <Col>
                            <div style={{ marginBottom: 12 }}>
                                <p><span className={styles.relationText__span}>{title}链接方式：</span> <span>{merchantType == 1 ? '直连' : '间连'}</span></p>
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <p><span className={styles.relationText__span}>{title}{merchantType == 1 ? (platformType == '1' ? 'pid' : '账务主体') : platformType == '1' ? 'smid' : '账务主体'}号：</span>
                                    <span>{platformType == '3' ? this.getWXMerchantID(viewData) : merchantID}</span>
                                </p>
                            </div>
                        </Col>
                    }
                    <div className={styles.promotionFooter__footer}>
                        <Button key="0" onClick={this.props.handleCloseVidwModal}>关闭</Button>
                    </div>
                </Row>
            </Modal>
        )
    }
}
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { jumpPage } from '@hualala/platform-base';
import { connect } from 'react-redux';
import {
	Table, Icon, Select, DatePicker,
	Button, Modal, Row, Col, message,
	Input, Tooltip,
} from 'antd';
import CreateCouponContent from '../Modal/CreateCouponContent'
import { debounce } from 'lodash'
import styles from '../AlipayCoupon.less'
import { axiosData } from '../../../helpers/util'
import registerPage from '../../../../index';
import { THIRD_VOUCHER_MANAGEMENT } from '../../../constants/entryCodes';
import { getCardList, getShopPid, getIndirectList } from '../AxiosFactory';
import WEIXIN from '../../../assets/weixin.png';
import ZHIFUBAO from '../../../assets/zhifubao.png'
const moment = require('moment');


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

@registerPage([THIRD_VOUCHER_MANAGEMENT], {})
@connect(mapStateToProps, mapDispatchToProps)
class CouponManageList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			pageSizes: 30, // 默认显示的条数
            pageNo: 1,
			dataSource: [],
			batchName: '', // 第三方券名称
            itemID: '', // 券ID
			platformType: '', // 关联平台
			couponDateRange: '', // 创建时间
            createCouponModalVisible: false,
            createThirdCouponVisble: false,
            treeData: [],
            shopPid: [], // 直连PID
            indirectList: [], // 间连列表
            viewModalVisible: false, // 查看券详情弹窗
            viewData: {}, // 券详情内容
            editData: {}, // 编辑券详情内容
            batchStatus: '', // 使用状态
            // couponCodeDockingType: '', // 券码对接类型: 1-订单获取, 2-批量预存导入
            type: '', // 前端标识 1 支付宝 | 2 微信
            channelID: 60, // 60支付宝 50微信
            title: '',
            platformTypeCreate: 1, // 平台：1 支付宝   3微信
		}
		this.handleQuery = debounce(this.handleQuery.bind(this), 500);
	}

	componentDidMount() {
		this.handleQuery();
        this.initData();
		this.onWindowResize();
		window.addEventListener('resize', this.onWindowResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize);
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
        getCardList({giftTypes:[10, 111, 21]}).then(x => {
            this.setState({ treeData: x });
        });
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


	getParams = () => {
        const {
			batchName,
			itemID,
			platformType,
			couponDateRange,
            batchStatus,
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
        if (batchStatus) {
            opt.batchStatus = batchStatus
        }
        return opt
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

    handleCreateCouponModal = () => {
        this.setState({
            createThirdCouponVisble: true,
        })
    }

    handleCloseThirdCouponModal = () => {
        this.setState({
            createThirdCouponVisble: false,
        })
    }

    // handleCreateCouponModal = () => {
    //     this.setState({
    //         createCouponModalVisible: true,
    //         editData: {},
    //     })
    // }

    handleCreateCouponContentModal = ({ type, channelID, platformTypeCreate }, title) => {
        if (type === 1) { // 支付宝券
            getCardList({giftTypes:[10]}).then(x => {
                this.setState({ 
                    treeData: x 
                });
            });
        } else { // 微信券
            getCardList({giftTypes:[10, 111, 21]}).then(x => {
                this.setState({ treeData: x });
            });
        }
        this.setState({
            createCouponModalVisible: true,
            type,
            channelID,
            platformTypeCreate,
            title,
            editData: {},
        })
    }

    handleCloseModal = () => {
        this.setState({
            createCouponModalVisible: false,
        })
        return null;
    }

    handleSuccesModalSubmit = () => {
        
    }
    handleStopClickEvent = (record) => {
        const {itemID } = record;
        const params = { couponCodeBatchInfo: { itemID, batchStatus: 2} };
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
        const {itemID } = record;
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

    handleCloseVidwModal = () => {
        this.setState({
            viewModalVisible: false,
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
					{/* <Button
						type="ghost"
                        style={{ marginRight: 10 }}

					>已删除第三方券</Button> */}
					<Button
						type="ghost"
						icon="plus"
						className={styles.jumpToCreate}
                        onClick={this.handleCreateCouponModal}
					>新建第三方券</Button>
				</div>
			</div>
		);
	}

	renderFilterBar = () => {
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
						<li>
                            <h5>关联渠道</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: '160px' }}
                                defaultValue=""
                                // placeholder="请选择关联渠道"
                                onChange={(value) => {
                                    this.setState({
                                        platformType: value,
                                    });
                                }}
                            >
                                <Option value={''}>全部</Option>
                                <Option value={'1'}>支付宝</Option>
                                <Option value={'3'}>微信</Option>
                            </Select>
                        </li>
                        <li>
                            <h5>使用状态</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: '160px' }}
                                defaultValue=""
                                onChange={(value) => {
                                    this.setState({
                                        batchStatus: value,
                                    });
                                }}
                            >
                                <Option value={''}>全部</Option>
                                <Option value={'1'}>执行中</Option>
                                <Option value={'2'}>停用</Option>
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
						<li>
                            <Button type="primary" onClick={() => this.handleQuery(1)} disabled={this.state.loading}><Icon type="search" />搜索</Button>
                        </li>
					</ul>
				</div>
			</div>
		)
	}

	renderTables = () => {
		const columns = [
			{
                title: '序号',
                dataIndex: 'index',
                className: 'TableTxtCenter',
                width: 50,
                // fixed:'left',
                key: 'index',
                render: (text, record, index) => {
                    return (this.state.pageNo - 1) * this.state.pageSizes + text;
                },
            },
			{
                title: '操作',
                key: 'operation',
                // className: 'TableTxtCenter',
                width: 160,
                // fixed: 'left',
                render: (text, record, index) => {
                    return (<span>
						{/* <a
                            href="#"
                            onClick={() => {
                                this.handleView(record, true)
                            }}
                        >编辑</a> */}
						<a
							href="#"
                            onClick={() => {
                                this.handleView(record, false)
                            }}
						>
							查看
						</a>
                        <a
							href="#"
                            disabled={record.batchStatus == 1 ? false : true}
                            onClick={record.batchStatus == 1 ? () => {
                                this.handleStopClickEvent(record);
                            }: null}
                        >停用</a> 
						<a
							href="#"
                            onClick={() => {
                                jumpPage({ menuID: '100008993' })
                            }}
                        >投放</a> 
                    </span>
                    );
                },
            },
            {
                title: '第三方券名称',
                dataIndex: 'batchName',
                key: 'batchName',
                width: 400,
                render: (text) => text,
            },
            {
                title: '券ID',
                dataIndex: 'itemID',
                key: 'itemID',
                width: 400,
                render: (text) => text,
            },
            {
                title: '关联渠道',
                dataIndex: 'channelID',
                key: 'channelID',
                width: 300,
                render: (text) => {
                    return ['60', 60].includes(text) ? '支付宝' : ''
                },
            },
            {
                title: '剩余数量',
                dataIndex: 'stock',
                key: 'stock',
                width: 100,
                render: (text, record) => {
                    const { receive } = record
                    if (text) {
                        return Number(text) - Number(receive)
                    }
                }
            },
            {
                title: '创建时间',
                dataIndex: 'createStampStr',
                key: 'createStampStr',
                width: 400,
                render: (text) => text,
            },
		];
		return (
            <div className={['layoutsContent', styles.tableClass].join(' ')} style={{ height: this.state.contentHeight }}>
                <Table
                    scroll={{ x: 2000, y: this.state.contentHeight - 108 }}
                    bordered={true}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    loading={
                        {
                            delay: 200,
                            spinning: this.state.loading,
                        }
                    }
                    pagination={{
                        pageSize: this.state.pageSizes,
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
		return (
			<div style={{ backgroundColor: '#F3F3F3' }} className={['layoutsContainer', styles.CouponManageListBox].join(' ')} ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
				<div>
					{this.renderHeader()}
				</div>
				<div className="layoutsLineBlock"></div>
				<div>
					<div className={styles.pageContentWrapper}>
						<div style={{ padding: 0 }} className="layoutsHeader">
							{this.renderFilterBar()}
							<div style={{ margin: '0' }} className="layoutsLine"></div>
						</div>
						{this.renderTables()}
					</div>
				</div>
                {
                    this.state.createThirdCouponVisble && <Modal
                        title="创建第三方券"
                        visible={true}
                        width={520}
                        onCancel={this.handleCloseThirdCouponModal}
                        footer={null}
                        maskClosable={true}
                    >
                        <ul className={styles.createCouponModal__flex__ul}>
                            <li
                                onClick={() => {
                                    this.handleCreateCouponContentModal({ type: 1, channelID: 60, platformTypeCreate: 1 }, '新建第三方支付宝券')
                                }}
                                className={styles.createCouponModal__item__li}
                                style={{ marginRight: '72px' }}
                            >
                                <p><img src={ZHIFUBAO}></img></p>
                                <span>第三方支付宝券</span>
                            </li>
                            <li
                                className={styles.createCouponModal__item__li}
                                onClick={() => {
                                    this.handleCreateCouponContentModal({ type: 2, channelID: 50, platformTypeCreate: 3 }, '新建第三方微信券')
                                }}
                            >
                                <p><img src={WEIXIN}></img></p>
                                <span>第三方微信券</span>
                            </li>
                        </ul>
                    </Modal>
                }
                {
                    this.state.createCouponModalVisible &&  <CreateCouponContent
                        // handleSubmit={this.handleSuccesModalSubmit}
                        treeData={this.state.treeData}
                        shopPid={this.state.shopPid}
                        indirectList={this.state.indirectList}
                        handleCloseModal={this.handleCloseModal}
                        handleQuery={this.handleQuery}
                        editData={this.state.editData}
                        type={this.state.type}
                        title={this.state.title}
                        platformType={this.state.platformTypeCreate}
                        channelID={this.state.channelID}
                />
                }
                {
                    this.state.viewModalVisible && <ViewCouponContent 
                        viewData={this.state.viewData}
                        handleCloseVidwModal={this.handleCloseVidwModal}
                    />
                }
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
        }
    }
    render() {
        const { viewData } = this.state;
        const { stock, receive, merchantType, merchantID, itemID } = viewData;
        const columns = [
            {
                title: '券名称',
                key: 'giftName',
                dataIndex: 'giftName',
                render: (t) => {
                    return <Tooltip title={t}>{t}</Tooltip>;
                }
            },
            {
                title: '生成数量',
                key: 'stock',
                dataIndex: 'stock',
            },
            {
                title: '生效方式',
                key: 'effectType',
                dataIndex: 'effectType',
                render: (text) => {
                    if (text == 3) {
                        return '相对有效期'
                    }
                    return '固定有效期'
                }
            },
            {
                title: '生效时间',
                key: 'Stimes',
                dataIndex: 'Stimes',
                render: (text, record) => {
                    if (record.effectType == 3) { //
                        const effectGiftTimeHours = record.effectGiftTimeHours;
                        const t = effectGiftTimeHours > 0 ? `${effectGiftTimeHours}后天生效` : '立即生效'
                        return <Tooltip title={t}>{t}</Tooltip>;
                    }
                    const time = record.EGiftEffectTime ? `${moment(record.EGiftEffectTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}/${moment(record.validUntilDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}` : '--';
                    return <Tooltip title={time}>{time}</Tooltip>;
                }
            },
            {
                title: '有效时间',
                key: 'times',
                dataIndex: 'times',
                render: (text, record) => {
                    if (record.effectType == 3) { //
                        const t = `自领取${record.validUntilDays}天有效`;
                        return <Tooltip title={t}>{t}</Tooltip>
                    }
                    const time = record.EGiftEffectTime ? `${moment(record.EGiftEffectTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}/${moment(record.validUntilDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}` : '--';
                    return <Tooltip title={time}>{time}</Tooltip>;;
                }
            },
        ];
        return (
            <Modal
                title={'第三方支付宝券详情'}
                maskClosable={true}
                width={700}
                visible={true}
                onCancel={this.props.handleCloseVidwModal}
                footer={null}
            >
                <Row className={styles.CouponViewInfo}>
                    <Col span={24} offset={1} className={styles.signInfo}>
                        <h4>{viewData.batchName}</h4>
                        <div style={{ marginBottom: 12 }}>
                            <p>券批次ID： <Tooltip title={itemID}><span>{itemID.length > 15 ? `${itemID.slice(0, 6)}...${itemID.slice(-10)}` : itemID}</span></Tooltip></p>
                            <p>关联小程序： <span>{viewData.jumpAppID}</span></p>
                        </div>
                        <div>
                            <p>剩余/总数： <span>{stock ? Number(stock) - Number(receive) : ''}/{viewData.stock}</span></p>
                        </div>
                    </Col>
                    <Col span={24} className={styles.relationCoupon__table}>
                        <p className={styles.relationText__span} style={{ marginRight: 0 }}>关联优惠券：</p>
                        <Table 
                            pagination={false}
                            bordered={true}
                            columns={columns}
                            dataSource={[this.state.viewData]}
                        />
                    </Col>
                    <Col>
                        <div style={{ marginBottom: 12 }}>
                            <p><span className={styles.relationText__span}>支付宝链接方式：</span> <span>{merchantType == 1 ? '直连' : '间连'}</span></p>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <p><span className={styles.relationText__span}>支付宝{merchantType == 1 ? `pid` : `smid`}号：</span> <span>{merchantID}</span></p>
                        </div>
                    </Col>
                    <div className={styles.promotionFooter__footer}>
                        <Button key="0" onClick={this.props.handleCloseVidwModal}>关闭</Button>
                    </div>
                </Row>
            </Modal>
        )
    }
}
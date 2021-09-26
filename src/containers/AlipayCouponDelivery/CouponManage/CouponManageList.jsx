import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { jumpPage } from '@hualala/platform-base';
import { connect } from 'react-redux';
import {
	Table, Icon, Select, DatePicker,
	Button, Modal, Row, Col, message,
	Input,
} from 'antd';
import CreateCouponContent from '../Modal/CreateCouponContent'
import { debounce } from 'lodash'
import styles from '../AlipayCoupon.less'
import { axiosData } from '../../../helpers/util'
import registerPage from '../../../../index';
import { PROMOTION_ZHIFUBAO_COUPON_LIST } from '../../../constants/entryCodes';
import { getCardList, getShopPid, getIndirectList } from '../AxiosFactory';
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

@registerPage([PROMOTION_ZHIFUBAO_COUPON_LIST], {})
@connect(mapStateToProps, mapDispatchToProps)
class CouponManageList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			pageSizes: 30, // 默认显示的条数
            pageNo: 1,
			dataSource: [],
			couponName: '', // 第三方券名称
			couponID: '', // 券ID
			channel: '', // 渠道
			couponDateRange: '', // 创建时间
            createCouponModalVisible: false,
            treeData: [],
            shopPid: [], // 直连PID
            indirectList: [], // 间连列表
		}
		this.handleQuery = debounce(this.handleQuery.bind(this), 500);
	}

	componentDidMount() {
		// this.handleQuery();
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
        getCardList({giftTypes: [10, 21]}).then(x => {
            this.setState({ treeData: x });
        });
        getShopPid().then((res) => {
            this.setState({
                shopPid: res,
            })
            console.log("🚀 ~ file: CouponManageList.jsx ~ line 59 ~ CouponManageList ~ getShopPid ~ res", res)
        })
        getIndirectList().then((res) => {
            this.setState({
                indirectList: res,
            })
        console.log("🚀 ~ file: CouponManageList.jsx ~ line 89 ~ CouponManageList ~ getIndirectList ~ res", res)
            
        })
    }
	  // 切换每页显示条数
	  onShowSizeChange = (current, pageSize) => {
        this.setState({
            loading: true
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
			couponName,
			couponID,
			channel,
			couponDateRange,
        } = this.state;
        const opt = {
        };
        if (couponDateRange !== '' && couponDateRange !== undefined && couponDateRange[0] !== undefined) {
            opt.appointedStartTime = couponDateRange[0].format('YYYYMMDDHHmm'); // 开始时间
            opt.appointedEndTime = couponDateRange[1].format('YYYYMMDDHHmm'); // 结束时间
        }
        // if (channel) {
            opt.channel = channel;
        // }
        if (couponName !== '' && couponName !== undefined) {
            opt.couponName = couponName;
        }
        if (couponID) {
            opt.couponID = couponID
        }
        return opt
    }

	handleQuery(pageNo, pageSize) {
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

        const params = { ...opts, shopID };
        // axiosData(
        //     '/promotion/extra/extraEventService_getExtraEvents.ajax',
        //     params,
        //     null,
        //     { path: '' },
        //     'HTTP_SERVICE_URL_PROMOTION_NEW'
        // )
        //     .then((res) => {
        //         this.setState({
        //             loading: false,
        //             dataSource: (res.extraEventList || []).map((item, index) => ({ ...item, index: index + 1 })),
        //             pageNo: res.pageNo || 1,
        //             pageSizes: res.pageSize || 30,
        //             total: res.totalSize || 0,
        //         });
        //     }, err => {
        //         this.setState({
        //             loading: false,
        //         });
        //     })
    }

    handleCreateCouponModal = () => {
        this.setState({
            createCouponModalVisible: true,
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
					>已删除第三方券</Button>
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
										couponName: e.target.value,
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
										couponID: e.target.value,
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
                                defaultValue="0"
                                placeholder="请选择关联渠道"
                                onChange={(value) => {
                                    this.setState({
                                        channel: value,
                                    });
                                }}
                            >
                                <Option value={'0'}>全部</Option>
                                <Option value={'1'}>支付宝</Option>
                            </Select>
                        </li>
						<li>
                            <h5>创建时间</h5>
                        </li>
                        <li>
                            <RangePicker
                                style={{ width: 260 }}
                                showTime={{ format: 'HH:mm' }}
                                className={styles.ActivityDateDayleft}
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['开始日期', '结束日期']}
                                onChange={this.onDateQualificationChange}
                            />
                        </li>
						<li>
                            <Button type="primary" onClick={() => this.handleQuery()} disabled={this.state.loading}><Icon type="search" />搜索</Button>
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
                key: 'key',
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
                    // 有点懒 sorry
                    // const format = record.extraEventType == 72 ? 'YYYYMMDDHHmm' : 'YYYYMMDD';
                    // const isExpired = moment().format(format) > moment(record.endTime, format).format(format);
                    // const isOngoing = moment().format(format) <= moment(record.endTime, format).format(format)
                    //     && moment().format(format) >= moment(record.startTime, format).format(format);
                    // const buttonText = (record.status == 1 ? '禁用' : '启用');
                    return (<span>
						<a
                            href="#"
                            // disabled={record.status == 1 || isOngoing || isExpired || record.status == 3}
                            // onClick={record.status == 1 || isOngoing || isExpired || record.status == 3 ? null : () => {
                            //     this.handleEdit(record, true)
                            // }}
                        >编辑</a>
						<a
							href="#"
						// onClick={() => {
						//     this.handleEdit(record, false)
						// }}
						>
							查看
						</a>
						<a
							href="#"
						// disabled={isExpired || record.status == 3}
						// onClick={isExpired || record.status == 3 ? null : () => {
						//     this.handleDisableClickEvent(record, 3);
						// }}
						>删除</a>
						<a
							href="#"
                            // disabled={isExpired || record.status == 3}
                            // onClick={isExpired || record.status == 3 ? null : () => {
                            //     this.handleDisableClickEvent(record, 3);
                            // }} 跳转活动投放页面
                        >投放</a> 
                    </span>
                    );
                },
            },
		];
		return (
            <div className={['layoutsContent', styles.tableClass].join(' ')} style={{ height: this.state.contentHeight }}>
                <Table
                    scroll={{ x: 1600, y: this.state.contentHeight - 108 }}
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
                    this.state.createCouponModalVisible &&  <CreateCouponContent
                    handleSubmit={this.handleSuccesModalSubmit}
                    treeData={this.state.treeData}
                    shopPid={this.state.shopPid}
                    indirectList={this.state.indirectList}
                    handleCloseModal={this.handleCloseModal}
                />
                }
			</div>
		)
	}
}

export default CouponManageList

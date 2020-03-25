import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Table,
    message,
    Button,
    Icon,
    Input,
    Select,
    Tooltip,
    Spin,
} from 'antd';
import moment from 'moment';
import { jumpPage } from '@hualala/platform-base'
import registerPage from '../../index';
import {PROMOTION_ZHIFUBAO_COUPON_LIST, CRM_ALIPAY_AUTH} from '../../constants/entryCodes';
import style from './style.less'
import {axiosData} from "../../helpers/util";
import upgradeImg from '../../assets/upgrade.png'
import alert from 'assets/alert.png'

export const BATCH_STATUS = [
    {
        value: '',
        label: '全部',
    },
    {
        value: '1',
        label: '未激活',
    },
    {
        value: '2',
        label: '审批中',
    },
    {
        value: '4',
        label: '已激活',
    },
    {
        value: '8',
        label: '已作废',
    },
    {
        value: '16',
        label: '终止发放',
    },
]

@registerPage([PROMOTION_ZHIFUBAO_COUPON_LIST])
@connect(mapStateToProps)
export default class EntryPage extends Component {
    render() {
        return <ZhiFuBaoCouponList/>
    }
}


@connect(mapStateToProps)
class ZhiFuBaoCouponList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            queryBatchID: '',
            queryBusinessNo: '',
            queryBatchStatus: '',
            isQuerying: false,
            couponList: [],
            pageSize: 30,
            pageNo: 1,
            total: 0,
            tableHeight: 800,
            selectedCoupon: null,
            zhiAccount: '',
            zhiAccountList: [],
            isNew: true,
        };
        this.tableActionRef = null;
        this.bodyRef = null;
    }

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize)
        this.queryZhiList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user.activeTabKey !== prevProps.user.activeTabKey && this.props.user.activeTabKey === PROMOTION_ZHIFUBAO_COUPON_LIST) {
            const tabArr = this.props.user.tabList.map((tab) => tab.value);
            // if (tabArr.includes(PROMOTION_ZHIFUBAO_COUPON_LIST)) {
            //     this.query();
            // }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    }

    queryZhiList = () => {
        const groupID = this.props.user.accountInfo.groupID
        this.setState({ isQuerying: true })
        axiosData(
            '/crm/alipayAuthorizeService_queryAlipayAuthorize.ajax',
            {status: 1},
            {},
            { path: 'data.alipayAuthorizeList'}
        ).then(res => {
            if(res.length){
                this.setState({
                    isQuerying: false,
                    zhiAccountList: Array.isArray(res) ? res : [],
                    zhiAccount: res[0].authAppId,
                    isNew: false,
                })
                this.query(res[0].authAppId);
            }else{
                this.setState({
                    isQuerying: false,
                    isNew: true,
                })
            }
            
        }).catch(e => {
            this.setState({ isQuerying: false })
        })
    }
    query = (id) => {
        const groupID = this.props.user.accountInfo.groupID
        let param;
        if(!id){
            param ={
                appid: this.state.zhiAccount
            } 
        }else{
            param ={
                appid: id
            } 
        }
        this.setState({ isQuerying: true })
        axiosData(
            `/promotion/insidevoucher/getInsideVouchersByappID.ajax`,
            {...param},
            {},
            { path: 'data.InsideVoucherTemplateForResult' },
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then(res => {
            this.setState({
                isQuerying: false,
                couponList: Array.isArray(res) ? res : []
            })
        }).catch(e => {
            this.setState({ isQuerying: false })
        })
    }

    refresh = () => {
        const { zhiAccount } = this.state;
        const groupName = this.props.user.accountInfo.groupName
        axiosData(
            `/promotion/insidevoucher/synInsideVoucher.ajax`,
            {appid: zhiAccount, groupName,},
            {},
            { path: 'data.InsideVoucherTemplateForResult' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(res => {
            message.success('刷新成功');
            this.query();
        }).catch(e => {
            this.setState({ isQuerying: false })
        })
    }

    onWindowResize = () => {
        try {
            const actionRowHeight = this.tableActionRef.offsetHeight;
            const bodyHeight = this.bodyRef.offsetHeight;
            // padding: 20
            this.setState({ tableHeight: bodyHeight - actionRowHeight - 40 })
        } catch (e) {
            // oops
        }
    }

    goJunpPage = () => {
        jumpPage({pageID: CRM_ALIPAY_AUTH});
    }

    handleQueryBatchIDChange = ({ target: { value } }) => {
        if (!value || value.length < 12) {
            this.setState({ queryBatchID: value })
        }
    }

    handleQueryBusinessNoChange = ({ target: { value } }) => {
        if (!value || value.length < 12) {
            this.setState({ queryBusinessNo: value })
        }
    }

    handleQueryBatchStatusChange = (value) => {
        this.setState({ zhiAccount: value });
        this.query(value);
    }

    renderHeader() {
        const { isQuerying, zhiAccount, zhiAccountList } = this.state;
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                  支付宝代金券
                </span>
                <span className={style.zhifuSpan}>支付宝账号</span>
                <Select
                    className={style.zhifuSelect}
                    value={zhiAccount}
                    onChange={this.handleQueryBatchStatusChange}
                    style={{ width: 200, marginRight: 20 }}
                >
                    {
                        zhiAccountList.map(({ authAppId, title }) => (
                            <Select.Option key={authAppId} value={authAppId}>
                                {title}
                            </Select.Option>
                        ))
                    }
                </Select>
                <div className={style.spacer} />
                <Button
                    type="ghost"
                    onClick={() => {
                        this.refresh()
                    }}
                    disabled={isQuerying}
                    style={{ marginRight: 12 }}
                >
                    <Icon type="sync" />
                    刷新
                </Button>
            </div>
        )
    }

    renderBody() {
        const {
            queryBatchID,
            queryBatchStatus,
            queryBusinessNo,
            isQuerying,
            tableHeight,
            selectedCoupon,
            isNew,
        } = this.state;
        const couponList = this.state.couponList.map((item, index) => ({...item, index: index + 1}))
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                className: 'TableTxtCenter',
                width: 50,
                fixed: 'left',
                key: 'key',
            },

            {
                title: '券模板ID',
                key: 'trdTemplateID',
                width: 150,
                fixed: 'left',
                className: 'TableTxtCenter',
                render: (text) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                },
            },
            {
                title: '券类型',
                dataIndex: 'trdTypeDes',
                key: 'trdTypeDes',
                width: 100,
                fixed: 'left',
                render: (text) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                },
            },
            {
                title: '券名称',
                dataIndex: 'giftName',
                key: 'giftName',
                width: 500,
                render: (text) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                },
            },
            {
                title: '状态',
                dataIndex: 'trdStatusDes',
                key: 'trdStatusDes',
                className: 'TableTxtRight',
                render: (text) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                },
            },
            {
                title: '券面值',
                className: 'TableTxtCenter',
                dataIndex: 'beginTime',
                key: 'beginTime',
                width: 140,
            },
            {
                title: '有效期',
                className: 'TableTxtCenter',
                dataIndex: 'period',
                key: 'period',
                width: 140,
                // render: (time) => {
                //     return `${moment.unix(+time).format('YYYY/MM/DD HH:mm')}`;
                // },
                render: (text) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                },
            },
            {
                title: '总库存',
                dataIndex: 'couponStockStatus',
                key: 'couponStockStatus',
                fixed: 'right',
                width: 140,
                render: (text) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                },
            },
        ];
        return (
            <div style={{ padding: 20, height: 'calc(100% - 75px)' }} ref={e => this.bodyRef = e}>
                <div className={style.noteDiv}>
                    注： 
                    <p>1、关联在支付宝创建的代金券之前需确认支付宝卡包应用<a onClick={this.goJunpPage}>已授权</a>给哗啦啦</p>
                    <p>2、支付宝卡包应用与支付/结算应用需创建在同一支付宝账号下</p>
                    <p>3、如在支付宝后台进行任何改动，请手动进行数据<a onClick={this.refresh}>刷新</a></p>
                </div>
                {isNew ? 
                    <div className={style.emptyDiv}>
                        <img className={style.emptyImg} src={alert}></img>
                        <Button className={style.priBtn} type='primary' onClick={this.goJunpPage}>去授权</Button>
                    </div>
                    :
                    <div className={style.tableWrapper} style={{ height: tableHeight }}>
                        <Table
                            scroll={{ x: 1600, y: tableHeight - 93 }}
                            bordered={true}
                            columns={columns}
                            dataSource={couponList}
                            loading={isQuerying}
                            pagination={{
                                showQuickJumper: true,
                                defaultPageSize: 20,
                                showSizeChanger: true,
                                // total: couponList.length,
                                showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                            }}
                        />
                    </div>
                }
                
            </div>
        )
    }

    render() {
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                <div className={style.blockLine} />
                {this.renderBody()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
    }
}

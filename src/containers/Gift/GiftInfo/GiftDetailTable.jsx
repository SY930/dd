import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Row, Col, Table, Popconfirm, Button, Icon ,Modal,message} from 'antd';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Moment from 'moment';
import { fetchData } from '../../../helpers/util';
import GiftCfg from '../../../constants/Gift';
import BaseForm from '../../../components/common/BaseForm';
import Authority from '../../../components/common/Authority';
import styles from './GiftInfo.less';
import GiftDetailModal from './GiftDetailModal';
import QuatoCardDetailModal from './QuatoCardDetailModal';
import GiftAddModal from '../GiftAdd/GiftAddModal';
import { GiftAddModalStep } from '../GiftAdd/GiftAddModalStep';
import { COLUMNS } from './_tableListConfig';
import {
    FetchGiftList,
} from '../_action';
const format = "YYYY/MM/DD HH:mm:ss";
class GiftDetailTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleDetail: false,
            visibleEdit: false,
            data: {},
            dataSource: [],
            editGift: { describe: '', value: '' },
            loading: true,
            queryParams: {
                pageNo: 1,
                pageSize: 10,
            },
            //total为数据总数。并不是页数。
            total: 2,
            tableHeight:'100%',
            contentHeight:'100%',
        },
        this.queryFrom = null;
        this.columns = [
            ...[{
                title: "序号",
                dataIndex: "num",
                key: "num",
                className: 'x-tc',
                fixed: 'left',
                width: 50,
            }, {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                fixed: 'left',
                width: 120,
                render: (value, record) => this.handleOperate(record),
            },],
            ...COLUMNS,
        ];
    }
    componentDidMount() {
        const { FetchGiftList } = this.props;
        FetchGiftList({
            pageNo: 1,
            pageSize: 10,
        }).then((data = []) => {
            this.proGiftData(data);
        });
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }
    componentWillReceiveProps(nextProps) {
        this.queryFrom && this.queryFrom.resetFields();
        const { dataSource } = nextProps;
        let data = dataSource.toJS();
        if(this.state.dataSource !== data) {
            this.proGiftData(data);
        }
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }
    onWindowResize = () => {
        let parentDoms = ReactDOM.findDOMNode(this.layoutsContainer);           //获取父级的doms节点
        if(null!==parentDoms){                                                  //如果父级节点不是空将执行下列代码
            let parentHeight=parentDoms.offsetHeight;                           //获取到父级的高度存到变量 parentHeight
            let contentrDoms = parentDoms.querySelectorAll('.layoutsContent');  //从父节点中获取 类名是 layoutsContent 的doms节点 存到变量 contentrDoms 中
            if(undefined !== contentrDoms && contentrDoms.length > 0) {         //如果 contentrDoms 节点存在 并且length>0 时执行下列代码
                let layoutsContent = contentrDoms[0];                           //把获取到的 contentrDoms 节点存到 变量 layoutsContent 中
                let headerDoms = parentDoms.querySelectorAll('.layoutsHeader');
                let headerHeight = headerDoms[0].offsetHeight;
                layoutsContent.style.height = parentHeight - headerHeight - 15 - 20 + 'px';      //layoutsContent 的高度，等于父节点的高度-头部-横线-padding值
                this.setState({
                    contentHeight:parentHeight - headerHeight - 15,
                    tableHeight:layoutsContent.offsetHeight - 120
                })
            }
        }
    }
    proGiftData = data => {
        const _total = data.totalSize;
        let gifts = data.crmGiftList;
        if (gifts === undefined) return;
        let newDataSource = gifts.map((g, i) => {
            g.key = i + 1;
            g.giftType = String(g.giftType);
            g.giftTypeName = _.find(GiftCfg.giftTypeName, { value: String(g.giftType) }).label;
            g.createTime = g.createTime == 0 ? '————/——/—— ——:——:——' : Moment(String(g.createTime),'YYYYMMDDHHmmss').format(format);
            g.actionTime = g.actionTime == 0 ? '————/——/—— ——:——:——' : Moment(String(g.actionTime),'YYYYMMDDHHmmss').format(format);
            g.operateTime = <div>{g.createTime}<br />{g.operateTime}</div>;
            g.createBy = g.createBy == undefined ? '——  ——' : '——  ——';
            g.operator = `${g.createBy} / ${g.createBy}`;
            g.giftRule = g.giftRule.split('</br>');
            g.num = i + 1;
            g.usingTimeType = g.usingTimeType.split(',');
            g.shopNames = g.shopNames === undefined ? '不限' : g.shopNames;
            return g;
        });
        this.setState({ dataSource: [...newDataSource], total: _total });
    }
    handleFormChange(key, value) {
        // //console.log(key, value);
        // let { queryParams } = this.state;
        // if (value !== undefined) {
        //     queryParams[key] = value;
        // }
        // this.setState({ queryParams });
    }
    handleQuery() {
        const { queryParams } = this.state;
        const { FetchGiftList } = this.props;
        this.queryFrom.validateFieldsAndScroll((err, Values) => {
            if (err) return;
            const params = this.formatFormData(Values);
            this.setState({
                queryParams: {pageNo: 1, pageSize: 10, ...params},
            })
            FetchGiftList({
                pageNo: 1,
                pageSize: 10,
                ...params,
            }).then((data = []) => {
                this.proGiftData(data);
            });
            //console.log(Values,queryParams);
            // this.reLoading().then(() => {
            //     this.setState({ loading: true ,pageNo: 1});
            // }).then(() => {
            //     this.getData(queryParams);
            // });
        });
    }
    formatFormData = params => {
        return _.mapValues(params, (value, key) => {
            switch(key){
              default:
                return  value !== undefined ? value : '';
            }
        })
    }
    handleCancel() {
        this.reLoading().then(() => {
            this.setState({ visibleDetail: false, visibleEdit: false });
        })
        // .then(()=>{
        //     this.handleQuery();
        // })
    }
    reLoading() {
        return new Promise((resolve, reject) => {
            resolve();
            return new Promise((resolve, reject) => {
                resolve();
            });
        });
    }
    handleEdit(rec) {
        let gift = _.find(GiftCfg.giftType, { name: rec.giftTypeName });
        let selectShops = [];
        gift.data = { ...rec };
        gift.data.shopNames = gift.data.shopNames === '不限' ? [] : gift.data.shopNames.split(',');
        gift.data.shopIDs = gift.data.shopIDs === undefined ? [] : gift.data.shopIDs.split(',');
        gift.data.shopNames.map((shop, idx) => {
            selectShops.push({
                content: shop,
                id: String(gift.data.shopIDs[idx]),
            })
        });
        gift.data.shopNames = [...selectShops];
        gift.data.isOfflineCanUsing = gift.data.isOfflineCanUsing === undefined ? '' : String(gift.data.isOfflineCanUsing);
        gift.data.isHolidaysUsing = gift.data.isHolidaysUsing === undefined ? '' : String(gift.data.isHolidaysUsing);
        gift.data.supportOrderType = gift.data.supportOrderType === undefined ? '' : String(gift.data.supportOrderType);
        gift.data.shareType = gift.data.shareType === undefined ? '' : String(gift.data.shareType);
        gift.data.moneyLimitType = gift.data.moneyLimitType === undefined ? '' : String(gift.data.moneyLimitType);
        gift.data.isFoodCatNameList = gift.data.isFoodCatNameList === undefined ? '' : String(gift.data.isFoodCatNameList);
        this.setState({ visibleEdit: true, editGift: gift });
    }
    handleDelete(rec) {
        const { giftItemID, giftName } = rec;
        Modal.confirm({
            title: `您确定要删除吗？`,
            content: (
                <div>
                    {`您将删除礼品
                        【${giftName}】`}
                    <br />
                    <span>删除是不可恢复操作，请慎重考虑~</span>
                </div>
            ),
            onOk: () => {
                fetchData('removeGift', { giftItemID }).then((data) => {
                    message.success('此礼品删除成功');
                    const { queryParams } = this.state;
                    const { FetchGiftList } = this.props;
                    FetchGiftList(queryParams).then((data = []) => {
                        this.proGiftData(data);
                    });
                });
            },
            onCancel: () => { }
        })

    }
    handleMore(rec) {
        this.setState({ visibleDetail: true, data: { ...rec } });
    }
    handleOperate(rec) {
        return (
            <span>
                <Authority rightCode="marketing.lipin.update">
                    <a href="javaScript:;" onClick={() => this.handleEdit(rec)}>编辑</a>
                </Authority>
                {rec.sendTotalCount > 0 ?
                    <a disabled={true}><span>删除</span></a>
                    :
                    <Authority rightCode="marketing.lipin.delete">
                        <a onClick={() => this.handleDelete(rec)}><span>删除</span></a>
                    </Authority>
                }
                <Authority rightCode="marketing.chakanlipin.query">
                    <a href="javaScript:;" onClick={() => this.handleMore(rec)}>详情</a>
                </Authority>
            </span>
        )
    }
    handlePageChange = (pageNo, pageSize) => {
        const { queryParams } = this.state;
        const { FetchGiftList } = this.props;
        FetchGiftList({
            ...queryParams,
            pageNo: pageNo,
            pageSize: pageSize,
        }).then((data = []) => {
            this.proGiftData(data);
        });
        this.setState({
            queryParams: {...queryParams, pageNo, pageSize },
        });
    }
    render() {
        const { visibleDetail, visibleEdit, editGift, data, queryParams } = this.state;
        const { pageNo, pageSize } = queryParams;
        const editProps = {
            type: "edit",
            visible: visibleEdit,
            gift: editGift,
            onCancel: () => this.handleCancel()
        };
        const detailProps = {
            data: data,
            visible: visibleDetail,
            onCancel: () => this.handleCancel()
        };
        const GiftEdit = (v) => {
            switch (v) {
                case '10':
                case '20':
                case '80':
                    return <GiftAddModalStep {...editProps} />;
                case '30':
                case '40':
                case '42':
                case '90':
                    return <GiftAddModal {...editProps} />;
            };
        };
        const GiftDetail = (v) => {
            switch (v) {
                case '10':
                case '20':
                case '80':
                case '30':
                case '40':
                case '42':
                    return <GiftDetailModal {...detailProps} />;
                case '90':
                    return <QuatoCardDetailModal {...detailProps} />;
            };
        };
        const formItems = {
            giftName: {
                label: '礼品名称',
                type: 'text',
                placeholder: '请输入礼品名称',
            },
            giftType: {
                label: '礼品类型',
                type: 'combo',
                defaultValue: '',
                options: GiftCfg.giftTypeName,
            }
        };
        const formKeys = ['giftName', 'giftType'];
        return (
                <Row className="layoutsContainer" ref = {layoutsContainer => this.layoutsContainer = layoutsContainer}>
                    <Col className="layoutsHeader">
                        <Row className="layoutsTool">
                            <div className="layoutsToolLeft">
                                <h1>礼品信息</h1>
                            </div>
                        </Row>
                        <Row className="layoutsLine"></Row>
                        <Row className="layoutsSearch">
                            <ul>
                                <li className={styles.formWidth}>
                                    <BaseForm
                                        getForm={form => this.queryFrom = form}
                                        formItems={formItems}
                                        formKeys={formKeys}
                                        formData={queryParams}
                                        layout="inline"
                                        onChange={(key, value) => this.handleFormChange(key, value)}
                                    />
                                </li>
                                <li>
                                    <Authority rightCode="marketing.lipinxinxi.query">
                                        <Button type="primary" onClick={() => this.handleQuery()}>
                                            <Icon type="search" />
                                            查询
                                        </Button>
                                    </Authority>
                                </li>
                            </ul>
                        </Row>
                    </Col>
                    <Col className="layoutsLineBlock"></Col>
                    <Col className="layoutsContent tableClass" style={{height:this.state.contentHeight}}>
                        <Table
                            bordered
                            columns={this.columns.map(c => c.render ? ({
                                    ...c,
                                    render: c.render.bind(this)
                                }) : c)}
                            dataSource={this.state.dataSource}
                            pagination={{
                                showSizeChanger: true,
                                pageSize: pageSize,
                                current: pageNo,
                                total: this.state.total,
                                showQuickJumper: true,
                                onChange: this.handlePageChange,
                                onShowSizeChange: this.handlePageChange,
                                showTotal:(total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`
                            }}
                            loading={this.props.loading}
                            scroll={{ x: 1600, y:this.state.tableHeight }}
                        />
                    </Col>
                    <Col>
                        {GiftDetail(data.giftType)}
                    </Col>
                    <Col>
                        {GiftEdit(editGift.value)}
                    </Col>
                </Row>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
        dataSource: state.giftInfo.get('dataSource'),
        loading: state.giftInfo.get('loading'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        FetchGiftList: opts => dispatch(FetchGiftList(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GiftDetailTable)

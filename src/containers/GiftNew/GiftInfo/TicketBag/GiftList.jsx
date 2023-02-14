import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Table, Icon, message, Form } from 'antd';
import styles from '../GiftInfo.less';
import styles2 from '../../../SaleCenterNEW/ActivityPage.less';
import BaseForm from '../../../../components/common/BaseForm';
import Authority from '../../../../components/common/Authority';
import GiftCfg from '../../../../constants/Gift';
import {
    GIFT_LIST_QUERY
} from "../../../../constants/authorityCodes";
import {
    FetchGiftList,
    UpdateBatchNO,
    UpdateDetailModalVisible,
    FetchSharedGifts,
    emptyGetSharedGifts,
    queryCouponShopList,
    queryWechatMpInfo, startEditGift,
    FetchGiftSchema,
} from '../../_action';
import _ from 'lodash';
import { axiosData } from '../../../../helpers/util';
import CategoryFormItem from "containers/GiftNew/GiftAdd/CategoryFormItem";

const FormItem = Form.Item;
const searchDefaultPageParams = {
    pageNo: 1,
    pageSize: 25, 
}

const validUrl = require('valid-url');

class GiftList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            exportLoading: false,
            visible: false,
            queryParams: {
                ...searchDefaultPageParams,
                action: '1',
            },        // 临时查询缓存，具体对象查看QueryForm对象
            dataSource: [],
            total: 0,
            expand: false,
            tagLst: [], // 标签
        };
        this.setTableRef = el => this.tableRef = el;
        this.queryFroms = null;
    }
    componentDidMount() {
        this.onQueryList(searchDefaultPageParams);
        document.addEventListener('keydown', this.handleEnterKey);
    }

    componentWillReceiveProps(nextProps) {
        const { dataSource, total } = nextProps;
        if (dataSource != this.props.dataSource) {
            if (this.props.pageType == 1) {
                this.setState({ dataSource, total })
            }
        }
        if (this.props.saveDone != nextProps.saveDone && nextProps.saveDone && (nextProps.pageType == 1 || nextProps.pageType == 3)) {
            const { pageNo,pageSize } = this.state.queryParams;
            this.onQueryList({
                pageNo,
                pageSize
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleEnterKey);
    }

    handleEnterKey = (e) => {
        let { pageType } = this.props;
        if (e.keyCode === 13 && (pageType == 1 || pageType == 3)) {
            this.onQueryList({});
        }
    }

    /**
     * 加载列表
     */
    onQueryList = (pagingParams) => {
        let { pageType } = this.props
        let action = pageType == 1 ? 0 : 2
        const { queryParams } = this.state;
        const { FetchGiftList } = this.props;
        this.queryFroms.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const params = { 
                ...values,
                tags: this.state.tagLst.join(','),
            };
            this.setState({
                queryParams: { 
                    pageNo: 1, 
                    pageSize: queryParams.pageSize || 1, 
                    action, 
                    ...params,
                    ...pagingParams,
                },
            })
            FetchGiftList({
                action,
                pageNo: 1,
                pageSize: queryParams.pageSize || 1,
                ...pagingParams,
                ...params,
            }).then((data = []) => {
                this.proGiftData(data);
            });
        });
    }

    handlePageChange = (pageNo, pageSize) => {
        const { queryParams } = this.state;
        const { FetchGiftList } = this.props;
        FetchGiftList({
            ...queryParams,
            pageNo,
            pageSize,
        }).then((data = []) => {
            this.proGiftData(data);
        });
        this.setState({
            queryParams: { ...queryParams, pageNo, pageSize },
        });
    }

    proGiftData = (data) => {
        // 在此处预处理用来显示 编辑的字段
        const _total = data.totalSize;
        const _pageSize = data.pageSize;
        const _pageNo = data.pageNo;
        const gifts = data.crmGiftList;
        if (gifts === undefined) {
            this.setState({ dataSource: [], total: _total });
            return;
        }
        const newDataSource = (gifts || []).map((g, i) => {
            g.key = i + 1;
            g.giftType = String(g.giftType);
            g.giftTypeName = _.find(GiftCfg.giftTypeName, { value: String(g.giftType) }) ? _.find(GiftCfg.giftTypeName, { value: String(g.giftType) }).label : '未定义';
            g.createTime = g.createStamp == 0 ? '--' : g.createStamp.split('.')[0];
            g.updateStamp = g.updateStamp == 0 ? '--' : g.updateStamp.split('.')[0];
            g.operateTime = <div>{g.createTime}<br />{g.updateStamp}</div>;
            g.createBy = g.createBy == undefined ? '--' : g.createBy;
            g.modifyBy = g.modifyBy == undefined ? '--' : g.modifyBy;
            g.operator = `${g.createBy} / ${g.modifyBy}`;
            g.giftRule = g.giftRule.split('</br>');
            g.num = i + 1 + (_pageSize * (_pageNo - 1));
            g.usingTimeType = (g.usingTimeType || '').split(',');
            g.usingDateType = (g.usingDateType || '').split(',');
            g.usingWeekType = (g.usingWeekType || '').split(',');
            g.supportOrderTypeLst = g.supportOrderTypeLst ? (g.supportOrderTypeLst).split(',') : undefined;
            g.shopNames = g.shopNames === undefined ? '不限' : g.shopNames;
            g.isDiscountRate = g.discountRate < 1;
            g.isPointRate = g.pointRate > 0;
            // 现金红包相关字段合并
            g.sellerCode = g.settleId ? `${g.settleId}:${g.merchantNo}:${g.settleName}` : undefined;
            // 金豆商城字段和vivo快应用字段合并
            g.aggregationChannels = [];
            g.goldGift && g.aggregationChannels.push('goldGift');
            g.vivoChannel && g.aggregationChannels.push('vivoChannel');

            g.transferType = g.transferType > 0 ? 1 : 0; // 该字段以前是0 1 2, 三种值 现在1, 2合并为1
            if (g.transferLimitType !== undefined && g.transferLimitType != -1) {
                g.transferLimitType = String(g.transferLimitType);
                g.transferLimitType === '0' && (g.transferLimitTypeValue = '');
                g.transferLimitType > 0 && (g.transferLimitTypeValue = g.transferLimitType, g.transferLimitType = '-1');
            }
            if (g.giftType == 30 && g.giftImagePath && !validUrl.isWebUri(g.giftImagePath)) {
                if (g.giftImagePath.startsWith('/')) {
                    g.giftImagePath = 'http://res.hualala.com' + g.giftImagePath
                } else {
                    g.giftImagePath = 'http://res.hualala.com/' + g.giftImagePath
                }
            }
            return g;
        });
        this.setState({ dataSource: [...newDataSource], total: _total });
    }

    onExport = () => {
        let { pageType } = this.props
        let action = pageType == 1 ? 1 : 2
        const { queryParams } = this.state;
        this.queryFroms.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const params = {
                ...values,
                tags: this.state.tagLst.join(','),
            };
            this.setState({
                queryParams: { pageNo: 1, pageSize: queryParams.pageSize || 1, action, ...params },
            })
            let obj = {
                action,
                pageNo: 1,
                pageSize: queryParams.pageSize || 1,
                ...params,
                exportType: 22
            }
            this.setState({
                exportLoading: true
            })
            axiosData(
                '/crm/export/exportGift.ajax',
                { ...obj },
                null,
                { path: '' },
            ).then(res => {
                this.setState({
                    exportLoading: false
                })
                if (res && res.code == '000') {
                    if (res.data.highMoment == 1) {
                        return message.warning('11:00-14:00，17:00-20:30 营业高峰期无法导出')
                    }
                    message.success('导出成功')
                }
            }).catch(error => {
                this.setState({
                    exportLoading: false
                })
            })
        });
    }

    toggleExpandState = () => {
        this.setState({
            expand: !this.state.expand,
            tagLst: [],
        });
    }

    changeCategoryFormItem = (value) => {
        this.setState({
            tagLst: value
        })
    }

    render() {
        const { loading, queryParams, dataSource = [], total } = this.state;
        const { groupID, formItems, formKeys, getTableColumns, } = this.props;
        const { pageNo, pageSize } = queryParams;
        return (
            <div className={styles2.pageContentWrapper}>
                <div style={{ padding: '0' }} className="layoutsHeader">
                    <div>
                        <ul style={{ display: 'flex' }}>
                            <li className={styles.formWidth}>
                                {/* _TODO */}
                                <BaseForm
                                    getForm={form => this.queryFroms = form}
                                    formItems={formItems}
                                    formKeys={formKeys}
                                    formData={queryParams}
                                    layout="inline"
                                // onChange={(key, value) => this.handleFormChange(key, value)}
                                />
                            </li>
                            <li style={{display: 'flex', alignItems: 'center'}} className={styles2.categoryFormItemLi}>
                                <a style={{ margin: '0 10px' }} onClick={this.toggleExpandState}>
                                    高级查询{this.state.expand ? <Icon type="caret-up" /> : <Icon type="caret-down" />}
                                </a>
                            </li>
                            <li>
                                <Authority rightCode={GIFT_LIST_QUERY}>
                                    <Button type="primary" onClick={() => this.onQueryList(searchDefaultPageParams)}>
                                        <Icon type="search" />
                                        查询
                                    </Button>
                                </Authority>
                            </li>
                        </ul>
                        {
                            this.state.expand && 
                            <Form inline>
                                <FormItem label='标签' style={{ width: 220 }} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                    <CategoryFormItem 
                                        onChange={this.changeCategoryFormItem}
                                        key='tagLst'
                                        phraseType='3'
                                        selectedPhrases={this.state.tagLst}
                                        hideBtn={true}
                                    />
                                </FormItem>
                            </Form>
                        }
                    </div>
                    <div className={styles2.rightBtnBox}>
                        <Button onClick={this.onExport} loading={this.state.exportLoading} disabled={this.state.exportLoading}>导出</Button>
                    </div>
                    <div style={{ margin: '0' }} className="layoutsLine"></div>
                </div>
                <div className={[styles.giftTable, styles2.tableClass, 'layoutsContent'].join(' ')}>
                    <Table
                        ref={this.setTableRef}
                        bordered={true}
                        columns={this.props.columns}
                        dataSource={dataSource}
                        pagination={{
                            showSizeChanger: true,
                            pageSize,
                            pageSizeOptions: ['25', '50', '100', '200'],
                            current: pageNo,
                            total: this.state.total,
                            showQuickJumper: true,
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.handlePageChange,
                            showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
                        }}
                        loading={this.props.loading}
                        scroll={{ x: 1600, y: 'calc(100vh - 440px)' }}
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // dataSource: state.sale_giftInfoNew.get('dataSource'),
        loading: state.sale_giftInfoNew.get('loading'),
        saveDone: state.sale_editGiftInfoNew.get('saveDone'),
        user: state.user.toJS(),
        shopData: state.sale_giftInfoNew.get('shopData'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        FetchGiftList: opts => dispatch(FetchGiftList(opts)),
        startEditGift: opts => dispatch(startEditGift(opts)),
        UpdateBatchNO: opts => dispatch(UpdateBatchNO(opts)),
        UpdateDetailModalVisible: opts => dispatch(UpdateDetailModalVisible(opts)),
        FetchSharedGifts: opts => dispatch(FetchSharedGifts(opts)),
        emptyGetSharedGifts: opts => dispatch(emptyGetSharedGifts(opts)),
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        fetchAllPromotionList: (opts) => dispatch(fetchAllPromotionListAC(opts)),
        queryCouponShopList: (opts) => dispatch(queryCouponShopList(opts)),
        queryWechatMpInfo: () => dispatch(queryWechatMpInfo()),
        FetchGiftSchemaAC: opts => dispatch(FetchGiftSchema(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        withRef: true
    }
)(GiftList)


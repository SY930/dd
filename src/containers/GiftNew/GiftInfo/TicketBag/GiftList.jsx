import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Table, Icon } from 'antd';
import styles from '../GiftInfo.less';
import styles2 from '../../../SaleCenterNEW/ActivityPage.less';
import BaseForm from '../../../../components/common/BaseForm';
import Authority from '../../../../components/common/Authority';
import MainTable from './MainTable';
import QueryForm from './QueryForm';
import { getTicketList } from './AxiosFactory';
import {
    GIFT_LIST_UPDATE,
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
import ReleaseModal from './Release';

class GiftList extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            visible: false,
            queryParams: {
                pageNo: 1,
                pageSize: 20,
                action: '1',
            },        // 临时查询缓存，具体对象查看QueryForm对象
            dataSource: [],
            total: 0,
        };
        this.setTableRef = el => this.tableRef = el;
    }
    componentDidMount() {
        let {dataSource, total} = this.props
        this.setState({dataSource, total})
        this.onQueryList();
    }
    componentWillReceiveProps(nextProps){
        const { dataSource, total } = nextProps;
        if(dataSource != this.state.dataSource){
            this.setState({dataSource, total})
        }
    }
    /**
     * 加载列表
     */
    onQueryList = (pageType) => {
        let action = pageType == 1 ? 0 : 2
        const { queryParams } = this.state;
        const { FetchGiftList } = this.props;
        this.queryFroms.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const params = { ...values };
            this.setState({
                queryParams: { pageNo: 1, pageSize: queryParams.pageSize || 1, action, ...params },
            })
            FetchGiftList({
                action,
                pageNo: 1,
                pageSize: queryParams.pageSize || 1,
                ...params,
            }).then((data = []) => {
                this.props.proGiftData(data);
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
            this.props.proGiftData(data);
        });
        this.setState({
            queryParams: { ...queryParams, pageNo, pageSize },
        });
    }

    render() {
        const { loading, queryParams, dataSource = [], total} = this.state;
        const { groupID, formItems, formKeys, getTableColumns,  } = this.props;
        const { pageNo, pageSize } = queryParams;
        return (
            <div className={styles2.pageContentWrapper}>
                <div style={{ padding: '0'}} className="layoutsHeader">
                    <div className="layoutsSearch">
                        <ul>
                            <li className={styles.formWidth}>
                                <BaseForm
                                    getForm={form => this.queryFroms = form}
                                    formItems={formItems}
                                    formKeys={formKeys}
                                    formData={queryParams}
                                    layout="inline"
                                    // onChange={(key, value) => this.handleFormChange(key, value)}
                                />
                            </li>
                            <li>
                                <Authority rightCode={GIFT_LIST_UPDATE}>
                                    <Button type="primary" onClick={() => this.onQueryList(3)}>
                                        <Icon type="search" />
                                        查询
                                    </Button>
                                </Authority>
                            </li>
                        </ul>
                    </div>
                    <div style={{ margin: '0'}} className="layoutsLine"></div>
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
                            current: pageNo,
                            total: this.state.total,
                            showQuickJumper: true,
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.handlePageChange,
                            showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
                        }}
                        loading={this.props.loading}
                        scroll={{ x: 1600,  y: 'calc(100vh - 440px)' }}
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
    mapDispatchToProps
)(GiftList)

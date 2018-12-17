import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Button, Icon } from 'antd';
import _ from 'lodash';
import SendGiftPanel from '../components/SendGiftPanel'
import GiftSendOrUsedCount from './GiftDetailSendorUsedTable';
import {
    UpdateSendorUsedTabKey,
    UpdateSendorUsedPage,
    FetchSendorUsedList,
    UpdateSendorUsedParams,
} from '../_action';
import ExportModal from "./ExportModal";
import GenerateBatchGifts from "../components/GenerateBatchGifts";

const TabPane = Tabs.TabPane;

const sendableGiftTypes = [
    '10', '20', '21', '30', '110', '111', '40', '42', '80'
];

class GiftDetailModalTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'send',
            exportVisible: false,
        };
        this.handleExport = this.handleExport.bind(this);
    }
    componentDidMount() {
        // const { sendorUsedKey } = this.props;
        // this.setState({ activeKey: sendorUsedKey});
    }

    handleExport() {
        this.setState({
            exportVisible: true,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { sendorUsedKey } = nextProps;
        this.setState({ activeKey: sendorUsedKey });
        // this.setState({
        //     activeKey: 'send',
        // });
    }

    onChange(activeKey) {
        this.setState({ activeKey });
        const { UpdateSendorUsedTabKey, UpdateSendorUsedPage, data: { giftItemID }, FetchSendorUsedList, UpdateSendorUsedParams } = this.props;
        UpdateSendorUsedTabKey({ key: activeKey });
        UpdateSendorUsedPage({ page: { pageNo: 1, pageSize: 10 } });
        const params = activeKey === 'used' ? { giftItemID, pageNo: 1, pageSize: 10, giftStatus: '2' } :
            { giftItemID, pageNo: 1, pageSize: 10 }
        FetchSendorUsedList({ params, isSend:  activeKey === 'send'});
        UpdateSendorUsedParams({ params });
    }
    render() {
        const { data } = this.props;
        const tabs = data.giftType === '91' ?
            [{ tab: '发出数', key: 'send' },
            ]
            : [{ tab: '发出数', key: 'send' },
            { tab: '使用数', key: 'used' },
                // {tab:'赠送',key:'give'}
            ];
        return (
            <div>
                <Tabs
                    className="tabsStyles"
                    activeKey={this.state.activeKey}
                    onChange={activeKey => this.onChange(activeKey)}
                    tabBarExtraContent={
                        this.state.activeKey === 'send' || this.state.activeKey === 'used' ?
                        <Button type="ghost"
                                title={this.state.activeKey === 'send' ? '导出发出信息' : '导出使用信息'}
                                disabled={
                                    (this.state.activeKey === 'send' && this.props.sendCount <= 0) ||
                                    (this.state.activeKey === 'used' && this.props.usedCount <= 0)
                                }
                                onClick={this.handleExport}
                                style={{top: '8px'}}
                        >
                            <Icon type="export" />导出
                        </Button>
                        :
                        null
                    }
                >
                    {
                        tabs.map((tab) => {
                            return (<TabPane tab={tab.tab} key={tab.key}>
                                <GiftSendOrUsedCount key={tab.key} data={data} _key={tab.key} />
                            </TabPane>)
                        }).concat(
                            sendableGiftTypes.includes(String(data.giftType)) ?
                                [
                                    (
                                        <TabPane tab={'赠送'} key={'send_gift'}>
                                            <SendGiftPanel giftItemID={data.giftItemID}/>
                                        </TabPane>
                                    ),
                                    (
                                        <TabPane tab={'批量生成券码'} key={'generate_gifts'}>
                                            <GenerateBatchGifts giftItemID={data.giftItemID} />
                                        </TabPane>
                                    )

                                ]
                                :
                                []
                        )
                    }
                </Tabs>
                {
                    !this.state.exportVisible ? null :
                        <ExportModal
                            giftItemID={data.giftItemID}
                            giftName={data.giftName}
                            activeKey={this.state.activeKey}
                            newExport // 除了礼品定额卡之外的导出, 复用组件
                            handleClose={() => this.setState({ exportVisible: false })}
                        />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sendorUsedKey: state.sale_giftInfoNew.get('sendorUsedKey'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateSendorUsedTabKey: opts => dispatch(UpdateSendorUsedTabKey(opts)),
        UpdateSendorUsedPage: opts => dispatch(UpdateSendorUsedPage(opts)),
        FetchSendorUsedList: opts => dispatch(FetchSendorUsedList(opts)),
        UpdateSendorUsedParams: opts => dispatch(UpdateSendorUsedParams(opts)),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GiftDetailModalTabs);

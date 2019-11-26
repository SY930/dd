import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Button, Icon } from 'antd';
import _ from 'lodash';
import RedPacketSendOrUsedTable from './RedPacketSendOrUsedTable';
import {
    UpdateSendorUsedTabKey,
    UpdateSendorUsedPage,
    FetchSendorUsedList,
    UpdateSendorUsedParams,
} from '../_action';
import ExportModal from "./ExportModal";

const TabPane = Tabs.TabPane;

class RedPacketDetailModalTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'send',
            exportVisible: false,
        };
        this.handleExport = this.handleExport.bind(this);
    }

    handleExport() {
        this.setState({
            exportVisible: true,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { sendorUsedKey } = nextProps;
        this.setState({ activeKey: sendorUsedKey });
    }

    onChange(activeKey) {
        this.setState({ activeKey });
        const { UpdateSendorUsedTabKey, UpdateSendorUsedPage, data: { giftItemID }, FetchSendorUsedList, UpdateSendorUsedParams } = this.props;
        UpdateSendorUsedTabKey({ key: activeKey });
        UpdateSendorUsedPage({ page: { pageNo: 1, pageSize: 10 } });
        const params = activeKey === 'used' ? { giftItemID, pageNo: 1, pageSize: 10, presentStatus: '4' } :
            { giftItemID, pageNo: 1, pageSize: 10 }
        FetchSendorUsedList({ params, isSend:  activeKey === 'send'});
        UpdateSendorUsedParams({ params });
    }
    render() {
        const { data } = this.props;
        const tabs = [
            { tab: '发出数', key: 'send' },
            { tab: '已领取数', key: 'used' },
        ];
        return (
            <div>
                <Tabs
                    className="tabsStyles"
                    activeKey={this.state.activeKey}
                    onChange={activeKey => this.onChange(activeKey)}
                    tabBarExtraContent={
                        // this.state.activeKey === 'send' || this.state.activeKey === 'used' ?
                        // <Button type="ghost"
                        //         disabled={
                        //             (this.state.activeKey === 'send' && this.props.sendCount <= 0) ||
                        //             (this.state.activeKey === 'used' && this.props.usedCount <= 0)
                        //         }
                        //         onClick={this.handleExport}
                        //         style={{top: '8px'}}
                        // >
                        //     <Icon type="export" />导出
                        // </Button>
                        // :
                        null
                    }
                >
                    {
                        tabs.map((tab) => {
                            return (
                                <TabPane tab={tab.tab} key={tab.key}>
                                    <RedPacketSendOrUsedTable activeKey={this.state.activeKey} key={tab.key} data={data} _key={tab.key} />
                                </TabPane>
                            )
                        })
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
)(RedPacketDetailModalTabs);

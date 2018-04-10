import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import _ from 'lodash';
import GiftSendOrUsedCount from './GiftDetailSendorUsedTable';
import {
    UpdateSendorUsedTabKey,
    UpdateSendorUsedPage,
    FetchSendorUsedList,
    UpdateSendorUsedParams,
} from '../_action';

const TabPane = Tabs.TabPane;
class GiftDetailModalTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'send',
        }
    }
    componentDidMount() {
        // const { sendorUsedKey } = this.props;
        // this.setState({ activeKey: sendorUsedKey});
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
        FetchSendorUsedList({ params });
        UpdateSendorUsedParams({ params });
    }
    render() {
        const { data } = this.props;
        const tabs = data.giftType === '91' ?
            [{ tab: '发送数', key: 'send' },
            ]
            : [{ tab: '发送数', key: 'send' },
            { tab: '使用数', key: 'used' },
                // {tab:'赠送',key:'give'}
            ];
        return (
            <div>
                <Tabs
                    className="tabsStyles"
                    activeKey={this.state.activeKey}
                    onChange={activeKey => this.onChange(activeKey)}
                >
                    {
                        tabs.map((tab) => {
                            return (<TabPane tab={tab.tab} key={tab.key}>
                                <GiftSendOrUsedCount data={data} _key={tab.key} />
                            </TabPane>)
                        })
                    }
                </Tabs>
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

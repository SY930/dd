import React, { Component } from 'react';
import { Tabs } from 'antd'
import { connect } from 'react-redux';
import styles from '../styles.less'
import {
  UpdateSendorUsedTabKey,
  UpdateSendorUsedPage,
  FetchSendorUsedList,
  UpdateSendorUsedParams,
} from '../../_action';
import RedPacketSendOrUsedTable from '../../GiftInfo/RedPacketSendOrUsedTable';

const TabPane = Tabs.TabPane;

class RedPacketUseDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'send',
      popoverVisible: false,
      exportVisible: false,
      tooltipVisble: false,
      sameItemID: '',
      isExist: false,
    };
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
    const { UpdateSendorUsedTabKey, UpdateSendorUsedPage, giftDetailInfo: { giftItemID }, FetchSendorUsedList, UpdateSendorUsedParams } = this.props;
    UpdateSendorUsedTabKey({ key: activeKey });
    UpdateSendorUsedPage({ page: { pageNo: 1, pageSize: 10 } });
    const params = activeKey === 'used' ? { giftItemID, pageNo: 1, pageSize: 10, presentStatus: '4' } :
      { giftItemID, pageNo: 1, pageSize: 10 }
    FetchSendorUsedList({ params, isSend: activeKey === 'send' });
    UpdateSendorUsedParams({ params });
  }

  render() {
    const { giftDetailInfo } = this.props
    const { activeKey } = this.state
    const tabs = [
      { tab: '发出数', key: 'send' },
      { tab: '已领取数', key: 'used' },
    ];
    return (
      <div className={styles.useContent}>
        <Tabs onChange={tabKey => this.onChange(tabKey)} activeKey={activeKey} className={styles.useTabs}>
          {
            tabs.map((tab) => {
              return (<TabPane tab={tab.tab} key={tab.key}>
                <RedPacketSendOrUsedTable activeKey={this.state.activeKey} key={tab.key} data={giftDetailInfo} _key={tab.key} />
              </TabPane>)
            })
          }
        </Tabs>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
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
)(RedPacketUseDetail)
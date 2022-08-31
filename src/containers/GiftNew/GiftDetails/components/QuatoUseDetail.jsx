import React, { Component } from 'react';
import { Tabs } from 'antd'
import { connect } from 'react-redux';
import styles from '../styles.less'
import {
  UpdateSendorUsedTabKey,
  UpdateSendorUsedPage,
  FetchSendorUsedList,
  UpdateSendorUsedParams,
  UpdateTabKey,
  FetchQuotaCardBatchNo,
  FetchQuotaList,
} from '../../_action';
import SendCard from '../../GiftInfo/SendCard';
import QuotaCardBatchSold from '../../GiftInfo/QuatoCardBatchSold';
import GenerateBatchQRCodes from '../../../GiftNew/components/GenerateBatchQRCodes';

const TabPane = Tabs.TabPane;

class QuatoUseDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'send',
      popoverVisible: false,
      exportVisible: false,
      tooltipVisble: false,
      sameItemID: '',
      isExist: false,
      formData: {},
    };
  }

  onChange(activeKey, batchNO) {
    const formData = {};
    if (batchNO !== void (0)) {
      formData.batchNO = batchNO;
    }
    const { UpdateTabKey } = this.props;
    if (activeKey === 'batchQRCode') {
      this.props.fetchQuotaCardBatchNo({ giftItemID: this.props.giftDetailInfo.giftItemID })
    }
    UpdateTabKey({
      key: activeKey,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { tabKey } = nextProps;
    this.setState({
        activeKey: tabKey,
    })
  }

  render() {
    const { giftDetailInfo } = this.props
    const { activeKey, formData } = this.state
    const tabs = giftDetailInfo.action != 2 ? [
      { label: '发卡', key: 'send' },
      { label: '已制卡明细', key: 'made' },
      { label: '卡汇总', key: 'sum' },
      { label: '批量售卖', key: 'batchSold' },
      { label: '批量生成二维码', key: 'batchQRCode' },
    ] : [
      { label: '发卡', key: 'send' },
      { label: '已制卡明细', key: 'made' },
      { label: '卡汇总', key: 'sum' },
    ];
    return (
      <div className={styles.useContent} key={+new Date() + Math.random()}>
        <Tabs onChange={tabKey => this.onChange(tabKey)} activeKey={activeKey} className={styles.useTabs}>
          {
            tabs.map((tab, index) => {
              if (tab.key === 'batchSold') {
                return (<TabPane tab={tab.label} key={tab.key}>
                  <QuotaCardBatchSold data={giftDetailInfo} />
                </TabPane>)
              }
              if (tab.key === 'batchQRCode') {
                return (
                  <TabPane tab={tab.label} key={tab.key}>
                    <GenerateBatchQRCodes
                      data={giftDetailInfo}
                      giftItemID={giftDetailInfo.giftItemID}
                    />
                  </TabPane>
                )
              }
              return (<TabPane tab={tab.label} key={tab.key} forceRender={false}>
                <SendCard
                  formData={formData}
                  _key={tab.key}
                  data={giftDetailInfo}
                />
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
    tabKey: state.sale_giftInfoNew.get('tabKey'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    UpdateSendorUsedTabKey: opts => dispatch(UpdateSendorUsedTabKey(opts)),
    UpdateSendorUsedPage: opts => dispatch(UpdateSendorUsedPage(opts)),
    FetchSendorUsedList: opts => dispatch(FetchSendorUsedList(opts)),
    UpdateSendorUsedParams: opts => dispatch(UpdateSendorUsedParams(opts)),
    UpdateTabKey: opts => dispatch(UpdateTabKey(opts)),
    fetchQuotaCardBatchNo: opts => dispatch(FetchQuotaCardBatchNo(opts)),
    FetchQuotaListAC: opts => dispatch(FetchQuotaList(opts)),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuatoUseDetail)
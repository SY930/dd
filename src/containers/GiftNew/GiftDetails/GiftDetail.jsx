import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd'
import styles from './styles.less'
import GiftBaseInfo from './components/GiftBaseInfo'
import StatisticData from './components/StatisticData'
import GiftUseDetails from './components/GiftUseDetails'
import RedPacketUseDetail from './components/RedPacketUseDetail'
import QuatoUseDetail from './components/QuatoUseDetail'
import BatchCreateCode from './components/BatchCreateCode'
import { getVersionUI } from 'utils'
import { jumpPage, closePage } from '@hualala/platform-base';
import { GIFT_DETAILS, GIFT_PAGE } from '../../../constants/entryCodes';
import { FetchSendorUsedList, UpdateSendorUsedTabKey, UpdateSendorUsedPage, UpdateSendorUsedParams, resetSendOrTotalCount, FetchQuotaCardSum, UpdateBatchNO, UpdateTabKey } from '../_action';
import SendGiftPanel from '../components/SendGiftPanel'

const sendableGiftTypes = [
  '10', '20', '21', '30', '110', '111', '40', '42', '80', '22', '81'
];

const batchableGiftTypes = [
  '10', '20', '21', '30', '110', '111', '22', '81'
];
const isPro = getVersionUI().styleName === 'professional'

class GiftDetail extends React.Component {

  state = {
    modalVisible: false,
    sendVisible: false,
  }

  componentDidMount() {
    const { giftDetailInfo: { giftType, giftItemID }, FetchSendorUsedList } = this.props;
    if (!giftItemID) {
      this.closeItemPage()
      return
    }
    if (giftType !== '90') {
      FetchSendorUsedList({ isSend: true, params: { pageNo: 1, pageSize: 10, giftItemID } });
      giftType !== '91' && FetchSendorUsedList({ isSend: false, params: { giftStatus: '2', pageNo: 1, pageSize: 10, giftItemID } })
      giftType !== '91' && FetchSendorUsedList({ isSend: false, params: { giftStatus: '13', pageNo: 1, pageSize: 10, giftItemID } })
    }
  }

  createCode = () => {
    this.setState({
      modalVisible: true,
    })
  }
  hideCreateModal = () => {
    this.setState({
      modalVisible: false,
    })
  }

  closeItemPage = () => {
    const {
      UpdateSendorUsedTabKey,
      UpdateSendorUsedPage,
      UpdateSendorUsedParams,
      resetSendOrTotalCount,
      UpdateBatchNO,
      UpdateTabKey,
    } = this.props;
    UpdateSendorUsedTabKey({ key: 'send' });
    UpdateTabKey({
        key: 'send',
    });
    UpdateBatchNO({ batchNO_madeCard: '' })
    UpdateSendorUsedPage({
      page: {
        pageNo: 1,
        pageSize: 10,
      },
    });
    UpdateSendorUsedParams({
      params: {},
    });
    resetSendOrTotalCount();
    closePage()
    jumpPage({ pageID: GIFT_PAGE })
  }

  hideModal = () => {
    this.setState({
      sendVisible: false,
    })
  }

  sendGift = () => {
    this.setState({
      sendVisible: true,
    })
  }

  render() {
    const { giftDetailInfo, redPacketInfoList } = this.props
    const propsData = {
      giftDetailInfo,
    }
    const totalData = {
      sendCount: this.props.sendTotalSize || 0,
      usedCount: this.props.usedTotalSize || 0,
      noUsedCount: this.props.noUsedTotalSize || 0,
      giftDetailInfo,
      FetchQuotaCardSum: this.props.FetchQuotaCardSum,
      redPacketInfoList,
    };
    return (
      <div className={styles.giftDetailsWrapper}>
        <div className={styles.giftTitleWrapper}>
          <div className={styles.giftTitle}>礼品使用详情</div>
          <div>
            <Button onClick={this.closeItemPage}>返回</Button>
            {sendableGiftTypes.includes(String(giftDetailInfo.giftType)) && giftDetailInfo.action != 2 ? <Button style={{ marginLeft: 10 }} onClick={this.sendGift}>赠送</Button> : null}
            {batchableGiftTypes.includes(String(giftDetailInfo.giftType)) && giftDetailInfo.action != 2 ? <Button style={{ marginLeft: 10 }} onClick={this.createCode}>生成券码</Button> : null}
          </div>
        </div>
        <div className={styles.baseWrapper} style={{ paddingTop: 20 }}>
          <div className={styles.baseTitle} style={{ borderLeft: isPro ? '2px solid #0091FF' : '2px solid #1bb496' }}>基本信息</div>
          <GiftBaseInfo {...propsData}></GiftBaseInfo>
        </div>
        <div className={styles.baseWrapper}>
          <div className={styles.baseTitle} style={{ borderLeft: isPro ? '2px solid #0091FF' : '2px solid #1bb496' }}>使用概览</div>
          <StatisticData {...totalData}></StatisticData>
        </div>
        <div className={styles.baseWrapper}>
          <div className={styles.baseTitle} style={{ borderLeft: isPro ? '2px solid #0091FF' : '2px solid #1bb496' }}>使用明细</div>
          {giftDetailInfo.giftType == '113' ? <RedPacketUseDetail {...totalData}></RedPacketUseDetail> : giftDetailInfo.giftType == '90' ? <QuatoUseDetail {...totalData}></QuatoUseDetail> : <GiftUseDetails {...totalData}></GiftUseDetails>}
        </div>
        <BatchCreateCode giftItemID={giftDetailInfo.giftItemID} modalVisible={this.state.modalVisible} hideCreateModal={this.hideCreateModal}></BatchCreateCode>
        <Modal
          title='赠送'
          visible={this.state.sendVisible}
          maskClosable={false}
          onCancel={this.hideModal}
          width={710}
          footer={null}
        >
            {
                this.state.sendVisible && <SendGiftPanel giftItemID={giftDetailInfo.giftItemID} hideModal={this.hideModal}></SendGiftPanel>
            }
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    giftDetailInfo: state.sale_giftInfoNew.get('giftDetailInfo'),
    sendorUsedKey: state.sale_giftInfoNew.get('sendorUsedKey'),
    sendTotalSize: state.sale_giftInfoNew.get('totalSendCount'),
    usedTotalSize: state.sale_giftInfoNew.get('totalUsedCount'),
    noUsedTotalSize: state.sale_giftInfoNew.get('totalNoUsedCount'),
    redPacketInfoList: state.sale_giftInfoNew.get('redPacketInfoList'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    FetchSendorUsedList: opts => dispatch(FetchSendorUsedList(opts)),
    UpdateSendorUsedTabKey: opts => dispatch(UpdateSendorUsedTabKey(opts)),
    UpdateSendorUsedPage: opts => dispatch(UpdateSendorUsedPage(opts)),
    UpdateSendorUsedParams: opts => dispatch(UpdateSendorUsedParams(opts)),
    resetSendOrTotalCount: opts => dispatch(resetSendOrTotalCount(opts)),
    FetchQuotaCardSum: opts => dispatch(FetchQuotaCardSum(opts)),
    UpdateBatchNO: opts => dispatch(UpdateBatchNO(opts)),
    UpdateTabKey: opts => dispatch(UpdateTabKey(opts)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GiftDetail)
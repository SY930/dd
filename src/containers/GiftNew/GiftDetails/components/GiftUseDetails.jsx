import React, { Component } from 'react';
import { Tabs, Popover, Button, Icon } from 'antd'
import { connect } from 'react-redux';
import styles from '../styles.less'
import {
  UpdateSendorUsedTabKey,
  UpdateSendorUsedPage,
  FetchSendorUsedList,
  UpdateSendorUsedParams,
} from '../../_action';
import SendRecords from './SendRecords'
import GiftSendOrUsedCount from '../../GiftInfo/GiftDetailSendorUsedTable';
import GenerateBatchGifts from "../../components/GenerateBatchGifts";
import ExportModal from "../../GiftInfo/ExportModal";
import { axiosData } from '../../../../helpers/util';

const TabPane = Tabs.TabPane;

const sendableGiftTypes = [
  '10', '20', '21', '30', '110', '111', '40', '42', '80', '22', '81'
];

const batchableGiftTypes = [
  '10', '20', '21', '30', '110', '111', '22', '81'
];

class UseDetails extends Component {

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
    const params = activeKey === 'used' ? { giftItemID, pageNo: 1, pageSize: 10, giftStatus: '2' } :
      activeKey === 'send' ? { giftItemID, pageNo: 1, pageSize: 10 } : { giftItemID, pageNo: 1, pageSize: 10, giftStatus: '13' }
    FetchSendorUsedList({ params, isSend: activeKey === 'send' });
    UpdateSendorUsedParams({ params });
  }

  openOther = () => {
    this.setState({
      popoverVisible: false,
    });
    this.setState({
      exportVisible: true,
      isExist: true,
    });
  };
  handleVisibleChange = visible => {
    this.setState({ popoverVisible: visible });
  };

  renderPopOver = () => {
    const { popContent = '', popA = '' } = this.state;
    return (
      <div className={styles.popDiv} style={{ width: this.state.tooltipVisble ? 160 : 'auto' }}>
        <span>{popContent}</span>
        <a className={styles.greenLink} onClick={this.openOther}>{popA}</a>
      </div>
    );
  }

  handleExport = () => {
    const { activeKey } = this.state;
    const { giftDetailInfo: { giftItemID, giftName }, } = this.props;
    const params = { giftItemID, giftName };
    if (this.state.activeKey === 'used') {
      params.giftStatus = '2'
    } else if (activeKey === 'noUsed') {
      params.giftStatus = '13'
    }
    const { sendorUsedParams } = this.props;
    Object.assign(params, sendorUsedParams ? sendorUsedParams.toJS() : {});
    axiosData('/crmimport/crmExportService_doExportGiftUsedInfo.ajax', { ...params }, null, {
      path: 'data',
    }).then((records) => {
      if (records.sameRequest) {
        this.setState({
          popContent: '已有导出任务 请勿重复操作，',
          popA: '查看导出结果',
          sameItemID: records.sameItemID,
        })
      } else {
        this.setState({
          popContent: '数据导出中 请',
          popA: '查看导出进度',
        })
      }
      if (records.highMoment == 1) {
        this.setState({
          popContent: <div><p style={{ whiteSpace: 'nowrap' }}>营业高峰期(11:00-14:00,17:00</p><p style={{ whiteSpace: 'nowrap' }}>-20:30)暂停使用数据导出功能</p></div>,
          popA: '',
          tooltipVisble: true,
        })
      } else {
        this.setState({
          tooltipVisble: false,
        })
      }
      this.setState({
        popoverVisible: true,
      });
    }).catch(() => {
    })
  }
  render() {
    const { giftDetailInfo } = this.props
    const { activeKey } = this.state
    const tabs = giftDetailInfo.giftType === '91' ?
      [{ tab: '发出数', key: 'send' },]
      :
      [
        { tab: '发出数', key: 'send' },
        { tab: '使用数', key: 'used' },
        { tab: '作废数', key: 'noUsed' },
      ];
    return (
      <div className={styles.useContent}>
        <Tabs onChange={tabKey => this.onChange(tabKey)} activeKey={activeKey} className={styles.useTabs}
          tabBarExtraContent={
            ['send', 'used', 'noUsed'].includes(activeKey) ?
              <Popover
                content={this.renderPopOver()}
                placement="topRight"
                title={false}
                trigger="click"
                visible={this.state.popoverVisible}
                onVisibleChange={this.handleVisibleChange}
              >
                <Button
                  type="ghost"
                  title={activeKey === 'send' ? '导出发出信息' : (activeKey === 'used' ? '导出使用信息' : '导出作废信息')}
                  disabled={
                    (this.state.activeKey === 'send' && this.props.sendCount <= 0) ||
                    (this.state.activeKey === 'used' && this.props.usedCount <= 0) ||
                    (activeKey === 'noUsed' && this.props.noUsedCount <= 0)
                  }
                  onClick={this.handleExport}
                  style={{ top: '8px' }}
                >
                  <Icon type="export" />导出
                </Button>
              </Popover>
              :
              null
          }
        >
          {
            tabs.map((tab) => {
              return (<TabPane tab={tab.tab} key={tab.key}>
                <GiftSendOrUsedCount key={tab.key} data={giftDetailInfo} _key={tab.key} />
              </TabPane>)
            }).concat(
              sendableGiftTypes.includes(String(giftDetailInfo.giftType)) && giftDetailInfo.action != 2 ?
                [
                  (
                    <TabPane tab={'赠送记录'} key={'send_gift'}>
                      <SendRecords giftItemID={giftDetailInfo.giftItemID} activeKey={activeKey} />
                    </TabPane>
                  )
                ] : []
            ).concat(
              batchableGiftTypes.includes(String(giftDetailInfo.giftType)) && giftDetailInfo.action != 2 ?
                [
                  (
                    <TabPane tab={'批量生成券码记录'} key={'generate_gifts'}>
                      <GenerateBatchGifts giftItemID={giftDetailInfo.giftItemID} />
                    </TabPane>
                  )
                ] : []
            )
          }
        </Tabs>
        {
          !this.state.exportVisible ? null :
            <ExportModal
              giftItemID={giftDetailInfo.giftItemID}
              giftName={giftDetailInfo.giftName}
              activeKey={this.state.activeKey}
              newExport // 除了礼品定额卡之外的导出, 复用组件
              handleClose={() => this.setState({ exportVisible: false, sameItemID: '', isExist: false })}
              sendorUsedParams={this.props.sendorUsedParams}
              sameItemID={this.state.sameItemID}
              isExist={this.state.isExist}
            />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    sendorUsedKey: state.sale_giftInfoNew.get('sendorUsedKey'),
    sendorUsedParams: state.sale_giftInfoNew.get('sendorUsedParams'),
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
)(UseDetails)
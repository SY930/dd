import React, { Component } from 'react';
import styles from '../styles.less'

class StatisticData extends Component {

  state = {
    quotaData: {},
  }

  componentDidMount() {
    const { giftDetailInfo: { giftItemID, giftType }, FetchQuotaCardSum } = this.props;
    if (giftType == '90') {
      FetchQuotaCardSum({
        giftItemID,
      }).then((data = []) => {
        this.setState({ quotaData: data });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { giftDetailInfo: { giftItemID, giftType }, FetchQuotaCardSum } = nextProps
    if (this.props.giftDetailInfo.giftType !== giftType) {
      if (giftType == '90') {
        FetchQuotaCardSum({
          giftItemID,
        }).then((data = []) => {
          this.setState({ quotaData: data });
        });
      }
    }
  }

  getRedPacketTotalInfo() {
    const { redPacketInfoList } = this.props;
    const redPacketStatusList = redPacketInfoList.toJS();
    const result = {};
    let total = 0;
    redPacketStatusList.forEach(item => {
      total += item.sum || 0;
      result[`${item.presentStatus}`] = item.sum;
    })
    result.total = total;
    return result;
  }
  render() {
    const { giftDetailInfo } = this.props
    const { quotaData = {} } = this.state
    const redData = this.getRedPacketTotalInfo()
    let dataSource = giftDetailInfo.giftType == '113' ? redData : giftDetailInfo.giftType == '90' ? quotaData : this.props
    let dataKeys = [
      {
        title: '发出数',
        key: 'sendCount',
        background: 'rgb(236,252,246)',
        icon: <img src={require('../assets/send.png')} alt="" />
      }, {
        title: '使用数',
        key: 'usedCount',
        background: 'rgb(229,243,255)',
        icon: <img src={require('../assets/use.png')} alt="" />
      },
      {
        title: '作废数',
        key: 'noUsedCount',
        background: 'rgb(254,248,230)',
        icon: <img src={require('../assets/out.png')} alt="" />
      },
    ];
    let QuatoKeys = [
      {
        title: '已制卡',
        key: 'createdNum',
        background: 'rgb(236,252,246)',
        icon: <img src={require('../assets/send.png')} alt="" />
      }, {
        title: '已售出',
        key: 'soldNum',
        background: 'rgb(253,239,229)',
        icon: <img src={require('../assets/sale.png')} alt="" />
      },
      {
        title: '已充值',
        key: 'rechargedNum',
        background: 'rgb(229,243,255)',
        icon: <img src={require('../assets/use.png')} alt="" />
      },
      {
        title: '已作废',
        key: 'cancelledNum',
        background: 'rgb(254,248,230)',
        icon: <img src={require('../assets/out.png')} alt="" />
      },
      {
        title: '总计',
        key: 'totalSum',
        background: 'rgb(243,252,231)',
        icon: <img src={require('../assets/total.png')} alt="" />
      },
    ]
    let redpacketKeys = [
      {
        title: '发出中',
        key: '1',
        background: 'rgb(236,252,246)',
        icon: <img src={require('../assets/send.png')} alt="" />
      }, {
        title: '已发待领',
        key: '2',
        background: 'rgb(253,239,229)',
        icon: <img src={require('../assets/sale.png')} alt="" />
      },
      {
        title: '已领取',
        key: '4',
        background: 'rgb(229,243,255)',
        icon: <img src={require('../assets/use.png')} alt="" />
      },
      {
        title: '发送失败',
        key: '3',
        background: 'rgb(254,248,230)',
        icon: <img src={require('../assets/out.png')} alt="" />
      },
      {
        title: '退款中',
        key: '6',
        background: 'rgb(253,240,231)',
        icon: <img src={require('../assets/tuiing.png')} alt="" />
      },
      {
        title: '已退款',
        key: '6',
        background: 'rgb(253,233,234)',
        icon: <img src={require('../assets/tuiend.png')} alt="" />
      },
      {
        title: '总计',
        key: 'total',
        background: 'rgb(243,252,231)',
        icon: <img src={require('../assets/total.png')} alt="" />
      },
    ]
    dataKeys = giftDetailInfo.giftType == '113' ? redpacketKeys : giftDetailInfo.giftType == '90' ? QuatoKeys : giftDetailInfo.giftType === '91' ? dataKeys.slice(0, 1) : dataKeys
    return (
      <div className={styles.statisticContent}>
        {
          dataKeys.map(item => {
            return <div key={item.key} className={styles.statisticItem} style={{ background: item.background }}>
              {item.icon}
              <div>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemValue}>{dataSource[item.key] || 0}</div>
              </div>
            </div>
          })
        }
      </div>
    )
  }
}

export default StatisticData
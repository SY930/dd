import React, { Component } from 'react';
import { Row, Col, Table, Modal, Button, Tooltip } from 'antd'
import styles from '../styles.less'
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../../redux/actions/saleCenterNEW/types';
import GiftCfg from '../../../../constants/Gift';


class GiftBaseInfo extends Component {

  state = {
    shopVisible: false,
  }

  generateColumns = () => {
    const { tc } = styles;
    const render1 = (v, o) => {
      const { effectType, giftEffectTimeHours,
        giftValidUntilDayCount, effectTime, validUntilDate } = o;
      let text = '';
      if ([1, 3].includes(+effectType)) {
        const options = (+effectType === 1) ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY;
        const { label } = options.find(x => +x.value === +giftEffectTimeHours);
        text = <span>发放后{label}，有效期{giftValidUntilDayCount}天</span>;
      } else {
        text = effectTime + ' - ' + validUntilDate;
      }
      return (<span>{text}</span>);
    };
    const render3 = (v) => {
      const { giftTypeName } = GiftCfg;
      const { label } = giftTypeName.find(x => +x.value === +v);
      return (<span>{label}</span>);
    };
    // 表格头部的固定数据
    return [
      { width: 40, title: '序号', dataIndex: 'idx', className: tc },
      { width: 100, title: '礼品类型', dataIndex: 'giftType', className: tc, render: render3 },
      { width: 100, title: '礼品名称', dataIndex: 'giftName', className: tc },
      { width: 100, title: '礼品金额(元)', dataIndex: 'giftValue', className: tc },
      { width: 60, title: '礼品个数', dataIndex: 'giftCount', className: tc },
      { width: 180, title: '礼品有效期', dataIndex: 'effectTime', render: render1, className: tc },
    ];
  }
  /* 生成表格数据 */
  generateDataSource = () => {
    const { giftDetailInfo = {} } = this.props;
    const { quotaCardGiftConfList = [], presentType, couponPackageBaseInfo } = giftDetailInfo;
    let list = quotaCardGiftConfList
    if (presentType === 4) {
      list = couponPackageBaseInfo.couponPackageGiftConfigs
    }
    return list.map((x, i) => ({
      key: x.giftItemID,
      idx: i + 1,
      index: i,
      ...x,
    }));
  }
  renderShopNames = () => {
    const { giftDetailInfo } = this.props
    const { shopNames, shopScopeType, selectBrands } = giftDetailInfo
    let selectedBrands = selectBrands && selectBrands.map(target => `${target.targetName}`).join(',') || [];
    if (!shopNames && !shopNames.length) {
      return ''
    }
    if(shopNames == '不限') {
        return '全部门店'
    }
    const shopsNum = shopNames.split(',').length
    if (shopScopeType == 1) {
      return shopNames.length > 30 ? <span>{shopNames.substr(0, 30) + '...'} <a onClick={() => {this.setState({shopVisible: true})}}>{`${shopsNum}家门店`}</a></span> : shopNames
    } else {
      return shopNames.length > 30 ? <span>仅 {selectedBrands} 品牌可用，其中 {shopNames.substr(0, 30) + '...'} <a onClick={() => {this.setState({shopVisible: true})}}>{`${shopsNum}家门店`}</a> 店铺不可用</span> : `仅 ${selectedBrands} 品牌可用，其中${shopNames}店铺不可用`
    }
  }
  render() {
    const { giftDetailInfo } = this.props
    const columns = this.generateColumns();
    const dataSource = this.generateDataSource();
    const shopNamesData = giftDetailInfo.shopNames ? giftDetailInfo.shopNames.split(',').map(item => {
      return {
        shopName: item
      }
    }) : []

    const shopColumns = [
      {
        title: '序号',
        key: 'index',
        width: 60,
        className: 'TableTxtCenter',
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '门店名称',
        key: 'shopName',
        dataIndex: 'shopName',
        width: 360,
        className: 'TableTxtCenter',
        render: (text) => (
          <Tooltip title={text}>{text}</Tooltip>
        )
      },
    ]
    return (
      <div>
        {
          giftDetailInfo.giftType == '90' ? <Row className={styles.baseContent}>
            <Col span={6} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>礼品名称：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftName}</span>
            </Col>
            <Col span={14} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>工本费用：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftCost || 0}</span>
            </Col>
            <Col span={6} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>礼品类型：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftTypeName}</span>
            </Col>
            <Col span={14} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>卡面值：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftDenomination}</span>
            </Col>
            <Col span={6} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>记录实收金额：</label>
              <span className={styles.baseValue}>{giftDetailInfo.price}</span>
            </Col>
            <Col span={14} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>礼品详情：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftRemark}</span>
            </Col>
            <Col span={14} style={{ marginBottom: 18, display: 'flex' }}>
              <label className={styles.baseKey}>使用规则：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftRule && giftDetailInfo.giftRule.map((item, idx) => (<span
                key={idx}
              >{`${++idx}、${item}`}<br /></span>))}</span>
            </Col>
            <Col span={16} style={{ paddingLeft: 20 }}>
              <p style={{ marginBottom: 10 }}>{giftDetailInfo.presentType === 4 ? `礼品详情：${giftDetailInfo.couponPackageBaseInfo && giftDetailInfo.couponPackageBaseInfo.couponPackageName}券包` : '礼品详情'}</p>
              <Table
                bordered={true}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                style={{ marginBottom: 30 }}
              />
            </Col>
          </Row> : <Row className={styles.baseContent}>
            <Col span={6} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>礼品名称：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftName}</span>
            </Col>
            <Col span={14} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>创建时间：</label>
              <span className={styles.baseValue}>{giftDetailInfo.createStamp}</span>
            </Col>
            <Col span={6} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>礼品类型：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftTypeName}</span>
            </Col>
            {giftDetailInfo.giftType == '80' ? null : <Col span={14} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>礼品价值：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftValue}</span>
            </Col>}
            <Col span={6} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>礼品详情：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftRemark}</span>
            </Col>
            {giftDetailInfo.giftType != '113' ? <Col span={18} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>适用门店：</label>
              <span className={styles.baseValue}>{this.renderShopNames()}</span>
            </Col> : null}
            <Col span={14} style={{ marginBottom: 18, display: 'flex' }}>
              <label className={styles.baseKey}>使用规则：</label>
              <span className={styles.baseValue}>{giftDetailInfo.giftRule && giftDetailInfo.giftRule.map((item, idx) => (<span
                key={idx}
              >{`${++idx}、${item}`}<br /></span>))}</span>
            </Col>
          </Row>
        }
        <Modal
          title='查看门店'
          visible={this.state.shopVisible}
          onCancel={() => { this.setState({ shopVisible: false }) }}
          footer={[<Button onClick={() => { this.setState({ shopVisible: false }) }}>关闭</Button>]}
        >
          <Table
            columns={shopColumns}
            dataSource={shopNamesData}
            bordered
            pagination={{
              pageSize: 10,
              total: shopNamesData.length || 0
            }}
          ></Table>
        </Modal>
      </div>
    )
  }
}

export default GiftBaseInfo
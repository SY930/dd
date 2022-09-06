import React, { Component } from 'react';
import { Row, Col, Table, Modal, Button, Tooltip, Input } from 'antd'
import styles from '../styles.less'
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../../redux/actions/saleCenterNEW/types';
import GiftCfg from '../../../../constants/Gift';


class GiftBaseInfo extends Component {

  state = {
    shopVisible: false,
    searchValue: '',
    shopNamesData: [],
    page: 1,
    ruleVisible: false,
    moreRule: [],
  }

  componentWillReceiveProps(nextProps) {
    const shopNames = this.props.giftDetailInfo.shopNames
    const shopIds = this.props.giftDetailInfo.shopIDs ? this.props.giftDetailInfo.shopIDs.split(',') : []
    const shopNamesData = shopNames ? shopNames.split(',').map((item, index) => {
      return {
        shopName: item,
        shopId: shopIds[index],
      }
    }) : []
    this.setState({
      shopNamesData
    })
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
    let selectedBrands = selectBrands && selectBrands.map(target => `${target.targetName}`).join(',') || '';
    selectedBrands = selectedBrands.length > 30 ? <Tooltip title={selectedBrands}>{selectedBrands.substr(0, 30) + '...'}</Tooltip> : selectedBrands
    if (!shopNames) {
      return ''
    }
    if (shopNames == '不限') {
      return '全部门店'
    }
    const shopsNum = shopNames.split(',').length
    if (shopScopeType == 1) {
      return shopNames.length > 30 ? <span>{shopNames.substr(0, 30) + '...'} <a onClick={() => { this.setState({ shopVisible: true }) }}>{`${shopsNum}家门店`}</a></span> : shopNames
    } else {
      return shopNames.length > 30 ? <span>仅 {selectedBrands} 品牌可用，其中 {shopNames.substr(0, 30) + '...'} <a onClick={() => { this.setState({ shopVisible: true }) }}>{`${shopsNum}家门店`}</a> 店铺不可用</span> : `仅 ${selectedBrands} 品牌可用，其中${shopNames}店铺不可用`
    }
  }

  queryShops = () => {
    const { searchValue, shopNamesData } = this.state
    const shopNames = this.props.giftDetailInfo.shopNames
    const shopIds = this.props.giftDetailInfo.shopIDs ? this.props.giftDetailInfo.shopIDs.split(',') : []
    const shopData = shopNames ? shopNames.split(',').map((item, index) => {
      return {
        shopName: item,
        shopId: shopIds[index],
      }
    }) : []
    let filterShops = shopNamesData.filter(item => {
      return item.shopName.indexOf(searchValue) != -1
    })
    if (!searchValue) {
      this.setState({
        shopNamesData: shopData
      })
    } else {
      this.setState({
        shopNamesData: filterShops
      })
    }
  }

  showMoreRules = (rules) => {
    this.setState({
      ruleVisible: true,
      moreRule: rules,
    })
  }

  renderGiftRule = (rules) => {
    console.log(11111, rules);
    if (!rules && !rules.length) {
      return ''
    }
    let ruleStr = rules.join('/')
    ruleStr = ruleStr.length > 30 ? ruleStr.substr(0, 30) + '...' : ruleStr
    const ruleArr = ruleStr.split('/')
    return <div>
      {ruleArr.map((item, idx) => (<span
        key={idx}
      >{`${++idx}、${item}`}<br /></span>))}
      {ruleStr.length > 30 ? <a onClick={() => this.showMoreRules(rules)}>查看详情</a> : null}
    </div>
  }

  renderRemark = (remark) => {
    if(!remark) {
      return ''
    }
    if(remark.length > 30) {
      return <Tooltip title={remark}>{remark.substr(0,30) + '...'}</Tooltip>
    }
    return remark
  }

  render() {
    const { giftDetailInfo } = this.props
    const columns = this.generateColumns();
    const dataSource = this.generateDataSource();
    const shopIds = giftDetailInfo.shopIDs ? giftDetailInfo.shopIDs.split(',') : []
    const shopData = giftDetailInfo.shopNames ? giftDetailInfo.shopNames.split(',').map((item, index) => {
      return {
        shopName: item,
        shopId: shopIds[index],
      }
    }) : []

    const shopColumns = [
      {
        title: '序号',
        key: 'index',
        width: 60,
        className: 'TableTxtCenter',
        render: (text, record, index) => {
          return index + 1 + (this.state.page - 1) * 10
        }
      },
      {
        title: '门店ID',
        key: 'shopId',
        dataIndex: 'shopId',
        width: 120,
        className: 'TableTxtCenter',
        render: (text) => (
          <Tooltip title={text}>{text}</Tooltip>
        )
      },
      {
        title: '门店名称',
        key: 'shopName',
        dataIndex: 'shopName',
        width: 240,
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
            <Col span={14} style={{ marginBottom: 12, display: 'flex' }}>
              <label className={styles.baseKey} style={{ width: 100, display: 'inline-block' }}>礼品详情：</label>
              <span className={styles.baseValue} style={{ flex: 1 }}>{this.renderRemark(giftDetailInfo.giftRemark)}</span>
            </Col>
            <Col span={14} style={{ marginBottom: 18, display: 'flex' }}>
              <label className={styles.baseKey}>使用规则：</label>
              <span className={styles.baseValue}>{this.renderGiftRule(giftDetailInfo.giftRule)}</span>
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
            <Col span={6} style={{ marginBottom: 12, display: 'flex' }}>
              <label className={styles.baseKey} style={{ width: 100, display: 'inline-block' }}>礼品详情：</label>
              <span className={styles.baseValue} style={{ flex: 1 }}>{this.renderRemark(giftDetailInfo.giftRemark)}</span>
            </Col>
            {giftDetailInfo.giftType != '113' ? <Col span={18} style={{ marginBottom: 12 }}>
              <label className={styles.baseKey}>适用门店：</label>
              <span className={styles.baseValue}>{this.renderShopNames()}</span>
            </Col> : null}
            <Col span={14} style={{ marginBottom: 18, display: 'flex' }}>
              <label className={styles.baseKey}>使用规则：</label>
              <span className={styles.baseValue}>{this.renderGiftRule(giftDetailInfo.giftRule)}</span>
            </Col>
          </Row>
        }
        <Modal
          title='使用规则详情'
          visible={this.state.ruleVisible}
          onCancel={() => { this.setState({ ruleVisible: false }) }}
          footer={[<Button onClick={() => { this.setState({ ruleVisible: false }) }}>关闭</Button>]}
        >
          {
            <div>
              {this.state.moreRule.map((item, idx) => (<span
                key={idx}
              >{`${++idx}、${item}`}<br /></span>))}
            </div>
          }
        </Modal>
        <Modal
          title='查看门店'
          visible={this.state.shopVisible}
          onCancel={() => { this.setState({ shopVisible: false }) }}
          footer={[<Button onClick={() => { this.setState({ shopVisible: false, page: 1 }) }}>关闭</Button>]}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
            <div>
              <span>门店名</span>
              <Input style={{ width: 180, margin: '0 20px' }} placeholder='输入门店名' value={this.state.searchValue} onChange={(e) => { this.setState({ searchValue: e.target.value }) }} />
              <Button type='primary' icon='search' onClick={this.queryShops}>搜索</Button>
            </div>
            <div>适用门店数：{shopData.length || 0}</div>
          </div>
          <Table
            columns={shopColumns}
            dataSource={this.state.shopNamesData}
            bordered
            rowKey={'shopId'}
            pagination={{
              pageSize: 10,
              total: this.state.shopNamesData.length || 0,
              current: this.state.page,
              onChange: (page) => {
                this.setState({
                  page,
                })
              }
            }}
          ></Table>
        </Modal>
      </div>
    )
  }
}

export default GiftBaseInfo
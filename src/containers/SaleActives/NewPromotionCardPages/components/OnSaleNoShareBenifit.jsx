import React, { Component } from 'react'
import { Row, Icon, Tag, Spin, Modal } from 'antd';
import { axios, getStore } from '@hualala/platform-base';
import { Iconlist } from '../../../../components/basic/IconsFont/IconsFont';
// import { BASIC_PROMOTION_MAP } from "../../../../constants/promotionType";
import FilterSelector from '../../../../components/common/FilterSelector';
import { FILTERS } from '../common/giftConfig'
import { fetchAllPromotionList } from './AxiosFactory';
import styles from './style.less'

// const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);

function getAccountInfo() {
  const { user } = getStore().getState();
  return user.toJS();
}

class OnSaleNoShareBenifit extends Component {
  state = {
    showPromotionModal: false,
    filters: FILTERS,
    loading: true
  }

  componentDidMount() {
    this.getAllOptions()
  }


  onCancelModal = () => {
    this.setState({
      showPromotionModal: false,
    })
  }

  getAllOptions = () => {
    const {accountInfo: { groupID }, shopID } = getAccountInfo();
    const method = '/promotion/docPromotionService_query.ajax';
    const params = {
      service: 'HTTP_SERVICE_URL_PROMOTION_NEW', type: 'post', data: {
        groupID,
        shopID: shopID > 0 ? shopID : undefined,
        isActive: -1,
        status: 4,//正在执行的活动和未开始执行的活动
        pageNo: 1,
        pageSize: 10000,
      },
      method,
    };
    fetchAllPromotionList(params).then((res) => {
      if (res.length) {
        this.setState({
          promotionLst: res,
          loading: false,
        })
      } else {
        this.setState({
          promotionLst: [],
          loading: false
        })
      }
    })
  }

  showModal = () => {    
    this.setState({
      showPromotionModal: true,
    })
  }

  handleOk = () => {
    this.props.onChange(this.selected);
    this.onCancelModal()
}

  handleChange = (values) => {
    this.selected = values;
    // this.props.onChange(values);
  }

  handleClose = (evt, tarID) => {
    evt.preventDefault();
    const { value } = this.props;
    const nextValue = value.filter(id => id !== tarID);
    this.props.onChange(nextValue);
}

  renderTages = () => {
    const { value = [] } = this.props;
    const { promotionLst = [] } = this.state
    const values = value.reduce((ret, shopID) => {
      const shopInfo = promotionLst.find(shop => shop.value === shopID);
      if (!shopInfo) return ret;
      return ret.concat({ value: shopInfo.value, label: shopInfo.label });
  }, []);

    if (values instanceof Array && values.length > 0) {
      return (
        <div className={styles.proXz}>
          {
            values.map((item, idx) => {
              return (
                  <div key={`${idx}`} className={styles.projectTag}>
                    <Tag
                      key={item.value}
                      className={`${styles.item}`}
                      closable={true}
                      onClose={evt => this.handleClose(evt, item.value)}
                    >
                      {item.label}
                    </Tag>
                  </div>
              );
            })
          }
        </div>
      )
    }
                  {/*  */}

    return (
      <div onClick={this.showModal} className={styles.proRBtn1}>
        <Iconlist iconName={'plus'} className="plusSmall" />
        <br />
        <span className="colors">{`点击添加不共享的促销活动`}</span>
      </div>
    )
  }
  render() {
    const { promotionLst = [], showPromotionModal, filters, loading } = this.state
    const { value = [] } = this.props
    return (
      <Row className={`${styles.OnSaleNoShareBenifit}`} >
        {this.renderTages()}
      {value.length &&  <div className={styles.iconAddMore}><Icon type="plus-circle-o" onClick={this.showModal} /></div>}
        {
          showPromotionModal ?
          <Modal
          // {...this.props}
          visible={true}
          width={700}
          onOk={this.handleOk}
          maskClosable={false}
          onCancel={this.onCancelModal}
        >
          <Spin spinning={loading} delay={500}>
            <FilterSelector
              title="活动"
              doGroup={true}
              options={promotionLst}
              filters={filters}
              isPromotion={true}
              defaultValue={value}
              onChange={this.handleChange}
              isShowBatchImport={false}
            />
          </Spin>
        </Modal>
            : null
        }
      </Row>
    )
  }
}

export default OnSaleNoShareBenifit
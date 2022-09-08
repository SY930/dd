import { Button, Col, DatePicker, Row } from 'antd';
import BaseForm from 'components/common/BaseForm';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { httpDistributionWithdraw } from '../AxiosFactory';
import MainTable from './MainTable';
import styles from './style.less';

const defaultFormat = 'YYYY-MM-DD HH:mm:ss';
const initialPaging = {
  pageNo: 1,
  pageSize: 10,
}
const { RangePicker } = DatePicker;
const formItems = {
  customerID: {
    type: 'text',
    label: '分销人',
    placeholder: '请输入手机号',
  },
  orderTime: {
    type: 'custom',
    label: '下单时间',
    render: decorator => (
      <Row>
        <Col>
          {decorator({})(<RangePicker
            format="YYYY-MM-DD"
            placeholder={['开始日期', '结束日期']}
          />)}
        </Col>
      </Row>
    ),
  },
};

export default class DistributionWithdrawDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.queryFrom = null;
    this.state = {
      loading: false,
      list: [],
      total: 0,
      pageObj: {},
    }
  }

  componentDidMount() {
    this.onQueryList();
  }

  onQueryList = (pagingParams = initialPaging) => {
    const queryFormParams = _.cloneDeep(this.queryFrom.getFieldsValue());
    const { orderTime } = queryFormParams;
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      queryFormParams.createStampStart = moment(orderTime[0]).format(defaultFormat);
      queryFormParams.createStampEnd = moment(orderTime[1]).format(defaultFormat);
    }
    delete queryFormParams.orderTime;
    const requestParams = {
      ...queryFormParams,
      ...this.state.pageObj,
      ...pagingParams,
    }

    this.setState({
      loading: true,
    })

    httpDistributionWithdraw(requestParams).then((res) => {
      if (res) {
        const { list, total } = res;
        this.setState({
          list,
          total,
          pageObj: pagingParams,
        })
      }
      this.setState({
        loading: false,
      })
    });
  }

  handleSearch = () => {
    this.onQueryList();
  }

  resetFormItems = () => {
    const render = () => (<div><Button type="primary" icon="search" onClick={this.handleSearch}>查询</Button></div>);
    return {
      ...formItems,
      q: {
        type: 'custom',
        label: '',
        render,
      },
    }
  }

  render() {
    const formItems1 = this.resetFormItems();
    const formKeys = Object.keys(formItems1);
    const { list, loading, pageObj } = this.state;
    return (
      <Col span={24} className={styles.distributionDetail}>
        <Col span={24} className={styles.queryFrom}>
          <BaseForm
            getForm={(form) => { this.queryFrom = form }}
            formItems={formItems1}
            formKeys={formKeys}
            layout="inline"
          />
        </Col>
        <Col span={24} className={styles.tableBox}>
          <MainTable
            list={list}
            loading={loading}
            pageObj={pageObj}
            onQuery={this.onQueryList}
          />
        </Col>
      </Col>
    )
  }
}

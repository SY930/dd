import { Button, Col, message, Spin, Tabs } from 'antd';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Admin from './Admin/index';
import { httpCreateOrUpdateDistributionParams } from './AxiosFactory';
import DistributionDetail from './DistributionDetail/index';
import DistributionWithdrawDetail from './DistributionWithdrawDetail/index';
import styles from './style.less';

const TabPane = Tabs.TabPane;

class Distribution extends React.Component {
  constructor(props) {
    super(props);
    this.adminContainer = null;
    this.state = {
      loading: false,
      currentTabKey: '1',
    }
  }

  onSave = () => {
    this.adminContainer.adminForm.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const copiedValues = _.cloneDeep(values);
      const { withdrawRuleType, withdrawTimeStep1, withdrawTimeStep2, distributionStatus, bannerUri, distributionTypes } = copiedValues;
      copiedValues.withdrawTimeStep = withdrawRuleType === 1 ? withdrawTimeStep1 : withdrawTimeStep2;
      copiedValues.distributionStatus = distributionStatus ? 1 : 2;
      copiedValues.distributionTypes = distributionTypes.join(',');
      delete copiedValues.withdrawTimeStep1;
      delete copiedValues.withdrawTimeStep2;
      if (bannerUri && bannerUri.url) {
        copiedValues.bannerUri = copiedValues.bannerUri.url
      }
      this.setState({
        loading: true,
      })
      copiedValues.itemID = this.props.itemID;
      httpCreateOrUpdateDistributionParams(copiedValues).then((res) => {
        this.setState({
          loading: false,
        })
        if (res) {
          message.success('保存成功!');
          this.adminContainer.getDistribution();
        }
      }).catch((error) => {
        this.setState({
          loading: false,
        })
      });
    });
  }

  render() {
    const { currentTabKey, loading } = this.state;
    const changeTab = (key) => {
      this.setState({
        currentTabKey: key,
      })
    }
    return (
      <Col span={24} className={styles.distribution}>
        <Spin spinning={loading}>
          <Col span={24} className={`${styles.header} ${styles.flexBetween}`}>
            <span className={styles.title}>拓展分销</span>
            <div>
              {currentTabKey === '1' ?
                <Button type="primary" onClick={this.onSave} disabled={loading}>保存</Button>
                : null}
            </div>
          </Col>
          <Col span={24} className={styles.tabCol}>
            <Tabs
              defaultActiveKey={currentTabKey}
              onChange={changeTab}
            >
              <TabPane tab="分销管理" key="1"></TabPane>
              <TabPane tab="分销明细" key="2"></TabPane>
              <TabPane tab="分销提现详情" key="3"></TabPane>
            </Tabs>
          </Col>
          <Col span={24} className="layoutsLineBlock"></Col>
          {
            currentTabKey === '1' ? <Admin onRef={(node) => { this.adminContainer = node }} /> : null
          }
          {
            currentTabKey === '2' ? <DistributionDetail ref={(node) => { this.distributionDetailContainer = node }} /> : null
          }
          {
            currentTabKey === '3' ? <DistributionWithdrawDetail ref={(node) => { this.withdrawDetailContainer = node }} /> : null
          }
        </Spin>
      </Col>
    )
  }
}

const mapStateToProps = ({ distribution_reducer }) => {
  return {
    itemID: distribution_reducer.toJS().itemID,
  }
}

export default connect(mapStateToProps, null)(Distribution);

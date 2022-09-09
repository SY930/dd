import { Button, Col, message, Spin, Tabs } from 'antd';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Admin from './Admin/index';
import { httpCreateDistributionParams, httpUpdateDistributionParams } from './AxiosFactory';
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
      console.log('values==2222', values);
      const { withdrawRuleType, withdrawTimeStep1, withdrawTimeStep2, distributionStatus, bannerUri, distributionTypes } = copiedValues;
      copiedValues.withdrawTimeStep = withdrawRuleType === 1 ? withdrawTimeStep1 : withdrawTimeStep2;
      copiedValues.distributionStatus = distributionStatus ? 1 : 0;
      copiedValues.distributionTypes = distributionTypes.join(',');
      delete copiedValues.withdrawTimeStep1;
      delete copiedValues.withdrawTimeStep2;
      if (bannerUri && bannerUri.url) {
        copiedValues.bannerUri = copiedValues.bannerUri.url
      }
      this.setState({
        loading: true,
      })
      if (this.props.itemID) {
        copiedValues.itemID = this.props.itemID;
        httpUpdateDistributionParams(copiedValues).then((res) => {
          console.log('res==2222', res);
          this.setState({
            loading: false,
          })
          if (res) {
            message.success('保存成功!');
          }
        }).catch((error) => {
          this.setState({
            loading: false,
          })
        });
      } else {
        httpCreateDistributionParams(copiedValues).then((res) => {
          console.log('res==2222', res);
          this.setState({
            loading: false,
          })
          if (res) {
            message.success('保存成功!');
          }
        }).catch((error) => {
          this.setState({
            loading: false,
          })
        });
      }
    });
  }

  onExport = () => {

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
              {/* {currentTabKey === '2' || currentTabKey === '3' ? <Button style={{ margin: '0 12px' }} onClick={this.onExport}>导出明细</Button> : null} */}
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

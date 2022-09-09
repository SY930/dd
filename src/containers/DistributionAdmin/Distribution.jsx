import { Button, Col, message, Tabs } from 'antd';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Admin from './Admin/index';
import { httpUpdateDistributionParams } from './AxiosFactory';
import DistributionDetail from './DistributionDetail/index';
import DistributionWithdrawDetail from './DistributionWithdrawDetail/index';
import styles from './style.less';

const TabPane = Tabs.TabPane;

class Distribution extends React.Component {
  constructor(props) {
    super(props);
    this.adminContainer = null;
    this.state = {
      currentTabKey: '1',
    }
  }

  onSave = () => {
    this.adminContainer.adminForm.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const copiedValues = _.cloneDeep(values);
      console.log('values==2222', values);
      const { rebateRule, withdrawTimeStep1, withdrawTimeStep2, distributionStatus, bannerUri, distributionTypes } = copiedValues;
      copiedValues.withdrawTimeStep = rebateRule === 1 ? withdrawTimeStep1 : withdrawTimeStep2;
      copiedValues.distributionStatus = distributionStatus ? 1 : 0;
      copiedValues.distributionTypes = distributionTypes.join(',');
      delete copiedValues.withdrawTimeStep1;
      delete copiedValues.withdrawTimeStep2;
      if (bannerUri && bannerUri.url) {
        copiedValues.bannerUri = copiedValues.bannerUri.url
      }
      // if (this.props.isCreated) {

      // } else {

      // }
      httpUpdateDistributionParams(copiedValues).then((res) => {
        console.log('res==2222', res);
        if (res) {
          message.success('保存成功!');
        }
      })
    });
  }

  onExport = () => {

  }

  render() {
    const { currentTabKey } = this.state;
    const changeTab = (key) => {
      this.setState({
        currentTabKey: key,
      })
    }
    return (
      <Col span={24} className={styles.distribution}>
        <Col span={24} className={`${styles.header} ${styles.flexBetween}`}>
          <span className={styles.title}>拓展分销</span>
          <div>
            {currentTabKey === '1' ? <Button type="primary" onClick={this.onSave}>保存</Button> : null}
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
      </Col>
    )
  }
}

const mapStateToProps = ({ distribution_reducer }) => {
  return {
    isCreated: distribution_reducer.toJS().isCreated,
  }
}

export default connect(mapStateToProps, null)(Distribution);

import React from 'react';
import { Col, Button, Tabs, message } from "antd";
import Admin from "./Admin/index";
import DistributionDetail from "./DistributionDetail/index";
import DistributionWithdrawDetail from "./DistributionWithdrawDetail/index";
import styles from "./style.less";
import _ from "lodash";

const TabPane = Tabs.TabPane;

export default class Distribution extends React.Component {
    constructor(props){
        super(props);
        this.adminContainer = null;
        this.state = {
            currentTabKey: '1'
        }
    }

    onSave = () => {
        this.adminContainer.adminForm.validateFieldsAndScroll((err, values) => {
            if (err) return;
           let copiedValues = _.cloneDeep(values);
           copiedValues.withdrawTimeStep = copiedValues.rebateRule == 1 ? copiedValues.withdrawTimeStep1 : copiedValues.withdrawTimeStep2;
            delete copiedValues.withdrawTimeStep1;
            delete copiedValues.withdrawTimeStep2;
            console.log('copiedValues', copiedValues);
            message.success('保存成功!');
        });
    }

    onExport = () => {

    }

    render() {
        let { currentTabKey } = this.state;
        const changeTab = (key) => {
            this.setState({
                currentTabKey: key
            })
        }
        return (
            <Col span={24} className={styles.distribution}>
                <Col span={24} className={`${styles.header} ${styles.flexBetween}`}>
                    <span className={styles.title}>拓展分销</span>
                    <div>
                        { currentTabKey == '1' ? <Button type='primary' onClick={this.onSave}>保存</Button> : null }  
                        { currentTabKey == '2' || currentTabKey == '3' ? <Button style={{margin: '0 12px'}} onClick={this.onExport}>导出明细</Button> : null}
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
                    currentTabKey == '1' ? <Admin ref={node => this.adminContainer = node} /> : null
                }
                {
                    currentTabKey == '2' ? <DistributionDetail ref={node => this.distributionDetailContainer = node} /> : null
                }
                {
                    currentTabKey == '3' ? <DistributionWithdrawDetail ref={node => this.withdrawDetailContainer = node} /> : null
                }
            </Col>
        )
    }
}

import React from 'react';
import { Col, Button, Tabs } from "antd";
import Admin from "./Admin/index";
import DistributionDetail from "./DistributionDetail/index";
import DistributionWithdrawDetail from "./DistributionWithdrawDetail/index";
import styles from "./style.less";

const TabPane = Tabs.TabPane;

export default class Distribution extends React.Component {
    constructor(props){
        super(props);
        this.adminContainer = null;
    }
    state = {
        currentTabKey: '1'
    }
    onSave = () => {
        let formValue = this.adminContainer.queryFrom.getFieldsValue()
        console.log(9999, formValue);
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
                        <Button>取消</Button>  
                        <Button style={{margin: '0 12px'}}>导出明细</Button>  
                        <Button type='primary' onClick={this.onSave}>保存</Button>  
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
                    currentTabKey == '2' ? <DistributionDetail /> : null
                }
                {
                    currentTabKey == '3' ? <DistributionWithdrawDetail /> : null
                }
            </Col>
        )
    }
}

import React, { Component } from 'react';
import { Row,Col,Button,Icon } from 'antd';
import styles from './Crm.less';
import Cfg from '../../../constants/CrmOperationCfg';
import SearchModal from './SearchModal';
import CrmOperationDetailModal from './CrmOperationDetailModal';
export default class CrmOperation extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchModalVisible: false,
            detailModalVisible: false,
            baseInfoData: {},
            shopsData: [],
            tableHeight:'100%',
            contentHeight:'100%',
        }
    }
    handleOnClick = (e, type) => {
    //   量充，量制，批量延期
        if(type == 'batchRecharge' || type == 'batchMake' || type == 'batchPostpone') {
            this.setState({
                type,
                detailModalVisible: true,
            })
        } else {
            this.setState({
                type,
                searchModalVisible: true,
            });
        }

    }
    render(){
        const searchModalProps = {
            visible: this.state.searchModalVisible,
            type: this.state.type,
        };
        const detailModalProps = {
            visible: this.state.detailModalVisible,
            type: this.state.type,
            baseInfoData: this.state.baseInfoData,
            shopsData: this.state.shopsData,
            uuid: this.state.uuid || '',
            transWay: 'false',

            // callbackVisible: {(visible) => {this.setState({ visible })}}
        };
        //console.log('Cfg',Cfg)
        return(
            <Row className="layoutsContainer">
                <Col span={24} className="layoutsHeader">
                    <div className="layoutsTool">
                        <div className="layoutsToolLeft">
                            <h1>会员卡操作</h1>
                        </div>
                    </div>
                </Col>
                <Col span={24} className="layoutsLineBlock"></Col>
                <Col span={24} className={[styles.crmOperationContentContainer,'layoutsContent'].join(' ')}>
                    <ul className={styles.CrmBodyList}>
                        {Cfg.operationTypeCfg.map((item,index)=>{
                            return (
                                <li key={'title'+index} onClick={e => this.handleOnClick(e, item.type)}>
                                    <CrmLogo key={'title'+index} describe={item.describe} index={index}>{item.name}</CrmLogo>
                                </li>
                            )
                        })}
                    </ul>
                </Col>
                <Col span={24} >
                    <SearchModal { ...searchModalProps }
                        callbackVisible={(detailModalVisible, searchModalVisible) => {
                            this.setState({
                               detailModalVisible,
                               searchModalVisible,
                            })
                        }}
                        callbackBaseInfo={baseInfoData => {
                            this.setState({ baseInfoData });
                        }}
                        callbackShopData={data => {
                         //console.log('这是可使用店铺数据', data);
                            this.setState({shopsData: data});
                        }}
                        callbackUUID={
                            data => {
                                this.setState({
                                    uuid: data.uuid,
                                })
                            }
                        }
                    />
                </Col>
                <Col span={24}>
                    <CrmOperationDetailModal { ...detailModalProps }
                        callbackVisible={visible => {
                            this.setState({detailModalVisible: visible})
                        }}
                    />
                </Col>
            </Row>
        )
    }
}
export const CrmLogo = ({ children, describe, index, ...props}) => (
    <div className={styles[`cardWrap_${ index }`]}>
        <p className={styles.title}>{children}</p>
        <p className={styles.describe}>{describe}</p>
    </div>
)

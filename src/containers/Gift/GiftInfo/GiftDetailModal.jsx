
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Row, Col, Table, Modal, Button, Tooltip } from 'antd';
import ENV from '../../../helpers/env';
import _ from 'lodash';
import Moment from 'moment';
import { fetchData, getByteLength } from '../../../helpers/util';
import GiftCfg from '../../../constants/Gift';
import GiftDetailModalTabs from './GiftDetailModalTabs';

import styles from './GiftInfo.less';

class GiftDetailModal extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource : [],
            loading:true,
        };
    }
    componentWillReceiveProps(nextProps){
        const { visible } = nextProps;
        if(visible){
            const { user:{accountInfo}, data:{giftItemID} } = nextProps;
            fetchData('getGiftSummary',{groupID:accountInfo.groupID,giftItemID},null,{path:"data"}).then(data=>{
                let dataSource = [];
                if(data){
                    let giftStatusCounts = data.summaryByGiftStatusList ? data.summaryByGiftStatusList : [];
                    let sumCount = data. giftSummary;
                    giftStatusCounts.map((d,i)=>{
                        d.key = d.giftStatus;
                        d.giftStatus = _.find(GiftCfg.giftSendStatus,{value:String(d.giftStatus)}).label;
                        dataSource.push(d);
                    });
                    sumCount = _.mapKeys(sumCount,(v,k)=>{
                        if(k == 'countTotal'){
                            return 'sum';
                        }else{
                            return k.replace('count','sum');
                        }
                    });
                    sumCount.giftStatus = '全部';
                    sumCount.key = sumCount.giftStatus;
                    dataSource.push(sumCount);
                    this.setState({dataSource,loading:false});
                }else{
                    this.setState({loading:false});
                }
            });
        }
    }
    handleCancel(){
        this.setState({loading:true});
        this.props.onCancel();
    }
    render(){
        const { visible, data } = this.props;
        const infoItem = [
            {col:{span:8},maxL:18,keys:{giftName:'礼品名称',giftTypeName:'礼品类型',giftValue:'礼品价值'}},
            {col:{span:16},labelCol:{span:4},itemCol:{span:20},maxL:40,keys:{createStamp:'创建时间',giftRemark:'使用说明',shopNames:'使用店铺'}},
        ];
        const columns = [
            {
                title:'状态',
                dataIndex:'giftStatus',
                key:'giftStatus',
            },{
                title:'消费返券',
                dataIndex:'sum10',
                key:'sum10',
            },{
                title:'摇奖活动',
                dataIndex:'sum20',
                key:'sum20',
            },{
                title:'积分摇奖',
                dataIndex:'sum30',
                key:'sum30',
            },{
                title:'积分兑换',
                dataIndex:'sum40',
                key:'sum40',
            },{
                title:'免费领取',
                dataIndex:'sum60',
                key:'sum60',
            },{
                title:'商家赠送',
                dataIndex:'sum70',
                key:'sum70',
            },{
                title:'商家支付',
                dataIndex:'sum80',
                key:'sum80',
            },{
                title:'商家卖出',
                dataIndex:'sum90',
                key:'sum90',
            },{
                title:'总计',
                dataIndex:'sum',
                key:'sum',
            }
        ];
        const value = data.giftType;
        const giftRule = data.giftRule ? data.giftRule : [];
        const giftLogo = (v)=>{
            switch(v){
                case '10':
                case '20':
                case '30':
                case '40':
                    return <span><em>{data.giftValue}</em>元</span>;
                case '80':
                    return (<span><em>{data.discountRate}</em>折<em>{data.pointRate}</em>倍</span>);
                case '42':
                    return <span><em>{data.giftValue}</em>分</span>;
            };
        };
        return(
            <Modal
                key="礼品使用详情"
                title="礼品使用详情"
                visible={this.props.visible}
                onCancel={()=>this.props.onCancel()}
                maskClosable={false}
                width={900}
                footer={[<Button key="0" type="ghost" onClick={()=>this.handleCancel()}>关闭</Button>]}
            >
                <div className={styles.giftDetailModal}>
                    <div>
                        <Row>
                            <h3>基本信息</h3>
                        </Row>
                        <Row style={{margin:'0 10px'}}>
                            <Col span={4}>
                                <div className="gift-image" style={{backgroundImage: `url("/asserts/img/${value}.jpg")`}}>
                                    {giftLogo(value)}
                                    <p>{data.giftName}</p>
                                </div>
                            </Col>
                            <Col span={19} push={1}>
                                <InfoDisplay infoItem={infoItem} infoData={data}/>
                                <Row className="info-rule">
                                    <Col span={3}>使用规则 :</Col>
                                    <Col span={21}>{giftRule.map((item,idx) => <span key={idx}>{`${++idx}、${item}`}<br /></span>)}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    {/*<div>
                        <Row>
                            <h3>礼品统计</h3>
                        </Row>
                        <Row>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={this.state.dataSource}
                                pagination={false}
                                loading={this.state.loading}
                                className="gift-detail-modal-table"
                            />
                        </Row>
                    </div>*/}
                    <div>
                        <Row>
                            <h3>使用统计</h3>
                        </Row>
                        <Row>
                            <GiftDetailModalTabs  data={data}/>
                        </Row>
                    </div>
                </div>
            </Modal>
        )
    }
}

class InfoDisplay extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const { infoItem, infoData={} } = this.props;
        return(
            <Row>
                {
                    infoItem.map((itm,idx)=>{
                        const len = 24/infoItem.length;
                        const col = itm.col ? itm.col : {span:len};
                        const labelCol = itm.labelCol ? itm.labelCol : {span:8};
                        const itemCol = itm.itemCol ? itm.itemCol : {span:16};
                        const maxL = itm.maxL;
                        return (<Col {...col} key={idx}>
                            {
                                _.keys(itm.keys).map((key,idx)=>{
                                    let value = infoData[key] === undefined ? "" : infoData[key];
                                    return (<Row key={idx} className="info-display">
                                            <Col {...labelCol}>{`${itm.keys[key]} :`}</Col>
                                            {
                                                _.isArray(value)
                                                ? <Col {...itemCol}>{value.map((item,idx) => <span key={idx}>{`${++idx}、${item}`}<br /></span>)}</Col>
                                                : <Col {...itemCol}>{
                                                    getByteLength(value) > maxL
                                                    ?(<Tooltip title={value}>{value}</Tooltip>)
                                                    :value
                                                }</Col>
                                            }
                                        </Row>)
                                })
                            }
                        </Col>)
                    })
                }
            </Row>
        )
    }
}

function mapStateToProps(state) {
  return {
    user: state.user.toJS(),
  }
}


export default connect(
  mapStateToProps
)(GiftDetailModal);

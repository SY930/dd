
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Row, Col, Table, Modal, Button, Tooltip } from 'antd';

import _ from 'lodash';
import Moment from 'moment';
import { fetchData, getByteLength } from '../../../helpers/util';
import GiftCfg from '../../../constants/Gift';
import { COLUMNS } from './_tableSum';
import QuatoCardDetailModalTabs from './QuatoCardDetailModalTabs';
import {
    FetchQuotaCardSum,
    UpdateTabKey, 
} from '../_action';
import styles from './GiftInfo.less';

class QuatoCardDetailModal extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource : [],
            loading: true,
        };
        this.columns = COLUMNS;
    }
    componentWillMount(){
        const { data:{giftItemID}, FetchQuotaCardSum } = this.props;
        FetchQuotaCardSum({
            giftItemID,
        }).then((data = []) => {
            this.proSumData(data);
        });
        // fetchData('getQuotaSummary',{giftItemID},null,{path:"data.summary"}).then(data=>{
        //     let dataSource = [];
        //     if(data){
        //         dataSource = [{key:'summary',...data,giftStatus:'数量'}]
        //         this.setState({dataSource,loading:false});
        //     }else{
        //         this.setState({loading:false});
        //     }
        // });
    }
    componentWillReceiveProps(nextProps){
        const { visible, dataSource } = nextProps;
        const _dataSource = dataSource.toJS();
        this.proSumData(_dataSource);
    }
    proSumData = (data = []) => {
        let dataArr = [];
        if(data) {
            dataArr = [{key:'summary',...data,giftStatus:'数量'}]
            this.setState({dataSource: dataArr, loading:false});
        }else {
            this.setState({loading:false});
        }
    }
    handleCancel(){
        const { UpdateTabKey } = this.props;
        UpdateTabKey({
            key: 'send',
        });
        this.setState({loading:true});
        this.props.onCancel();
    }
    render(){
        const { visible, data } = this.props;
        const infoItem = [
            {col:{span:8},keys:{giftName:'礼品名称',giftTypeName:'礼品类型',giftValue:'卡面值', price:'建议售价'}},
            {col:{span:16},labelCol:{span:4},itemCol:{span:20},keys:{giftRule:'礼品规则', giftRemark:'使用说明'}},
        ];
        const value = data.giftType;
        return(
            <Modal
                key="礼品使用详情"
                title="礼品使用详情"
                visible={this.props.visible}
                maskClosable={false}
                onCancel={()=>this.props.onCancel()}
                width={900}
                footer={[<Button key="0" type="primary" onClick={()=>this.handleCancel()}>关闭</Button>]}
            >
                <div className={styles.giftDetailModal}>
                    <div>
                        <Row>
                            <h3>基本信息</h3>
                        </Row>
                        <Row style={{margin:'0 10px'}}>
                            <Col span={4}>
                                <div className="gift-image" style={{backgroundImage: `url("/asserts/img/${value}.jpg")`}}>
                                    <span><em>{data.giftValue}</em>元</span>
                                    <p>{data.giftName}</p>
                                </div>
                            </Col>
                            <Col span={19} push={1}>
                                <InfoDisplay infoItem={infoItem} infoData={data}/>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <Row>
                            <h3>礼品统计</h3>
                        </Row>
                        <Row>
                            <Table
                                bordered
                                columns={this.columns}
                                dataSource={this.state.dataSource}
                                pagination={false}
                                // loading={this.state.loading}
                                className="gift-detail-modal-table"
                            />
                        </Row>
                    </div>
                    <div>
                        <Row>
                            <h3>使用统计</h3>
                        </Row>
                        <Row>
                            <QuatoCardDetailModalTabs  data={data}/>
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
                        return (<Col {...col} key={idx}>
                            {
                                _.keys(itm.keys).map((key,idx)=>{
                                    let value = infoData[key] === undefined ? "" : infoData[key];
                                    return (<Row key={idx} className="info-display">
                                            <Col {...labelCol}>{`${itm.keys[key]} :`}</Col>
                                            <Col {...itemCol}>{value}</Col>
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
        dataSource: state.sale_old_giftInfo.get('quotaCardSumSource'),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        FetchQuotaCardSum: opts => dispatch(FetchQuotaCardSum(opts)),
        UpdateTabKey: opts => dispatch(UpdateTabKey(opts)),
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuatoCardDetailModal);

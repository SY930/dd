import { connect } from 'react-redux';
import React from 'react';
import { Row, Col } from 'antd';
import styles from './GiftAdd.less';
import { CrmLogo } from './CrmOperation';
import GiftCfg from '../../../constants/Gift';
import Moment from 'moment';
import { GiftAddModalStep } from './GiftAddModalStep';
import GiftAddModal from './GiftAddModal';
import { fetchData } from '../../../helpers/util';
import _ from 'lodash';
import Authority from '../../../components/common/Authority';
const format = "YYYY/MM/DD HH:mm:ss";
class GiftType extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gift : {describe:'',value:'',data:{groupID:this.props.user.accountInfo.groupID}},
            visible:false,
        }
    }
    componentWillMount(){
        this.getData();
    }
    getData(params={}){
        const { user } = this.props;
        params.groupID = user.accountInfo.groupID;
        fetchData('getGifts',params,null,{path:'data.crmGiftList'}).then((gifts)=>{
          //console.log(gifts);
          if(gifts === undefined)return;
          let newDataSource = gifts.map((g,i)=>{
            g.key = i+1;
            g.giftType = String(g.giftType);
            g.giftTypeName = _.find(GiftCfg.giftTypeName,{value:String(g.giftType)}).label;
            g.createStamp = g.createStamp == 0 ? '————/——/—— ——:——:——' : Moment(g.createStamp).format(format);
            g.actionStamp = g.actionStamp == 0 ? '————/——/—— ——:——:——' : Moment(g.actionStamp).format(format);
            g.operateTime = <div>{g.createStamp}<br/>{g.actionStamp}</div>;
            g.createBy = g.createBy == undefined ? '——  ——' : '——  ——';
            g.operator = `${g.createBy} / ${g.createBy}`;
            g.giftRule = g.giftRule.split('</br>');
            g.num = i+1;
            g.usingTimeType = g.usingTimeType.split(',');
            g.shopNames = g.shopNames === undefined ? '不限' : g.shopNames;
            return g;
          });
          this.setState({ dataSource:[...newDataSource] })
        });
    }
    handleAdd(g){
        this.setState({visible:true,gift:{...this.state.gift,...g}});
    }
    handleCancel(){
        this.setState({visible:false});
    }
    render(){
        // console.log(this.props)
        const value = this.state.gift.value;
        const GiftAdd = (v)=>{
            switch(v){
                case '10':
                case '20':
                case '80':
                    return <GiftAddModalStep type="add" {...this.state} onCancel={()=>this.handleCancel()}/>;
                case '30':
                case '40':
                case '42':
                case '90':
                    return <GiftAddModal type="add" {...this.state} onCancel={()=>this.handleCancel()}/>;
            };
        };
        return(
            <div>
            <Row className="layoutsContainer">
                <Col className="layoutsHeader">
                    <Row className="layoutsTool">
                        <div className="layoutsToolLeft">
                            <h1>新建礼品</h1>
                        </div>
                    </Row>
                </Col>
                <Col className="layoutsLineBlock"></Col>
                <Col className="layoutsContent">
                    <ul>
                        {GiftCfg.giftType.slice(0,7).map((gift,index)=>{
                            return (
                                <Authority rightCode="marketing.lipin.create" key={gift.value}>
                                    <a key={gift.value} onClick={()=>this.handleAdd(gift)}>
                                        <CrmLogo background={gift.color} describe={gift.describe} index={index}>{gift.name}</CrmLogo>
                                    </a>
                                </Authority>
                            )
                        })}
                    </ul>
                </Col>
            </Row>
            {GiftAdd(value)}
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user : state.user.toJS(),
    }
}

export default connect(
    mapStateToProps
)(GiftType)

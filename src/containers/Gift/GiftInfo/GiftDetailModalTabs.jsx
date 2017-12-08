import { connect } from 'react-redux';
import React from 'react';
import { Row, Col, Table, Modal, Tabs, Button, Icon, Tooltip, TreeSelect } from 'antd';

import _ from 'lodash';
import Moment from 'moment';
import { fetchData } from '../../../helpers/util';
import GiftCfg from '../../../constants/Gift';
import { sex } from '../../../constants/CrmCardInfo';
import BaseForm from '../../../components/common/BaseForm';

import styles from './GiftInfo.less';

const TabPane = Tabs.TabPane;

class GiftDetailModalTabs extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    render(){
        const tabs = [{tab:'发送数',key:'send'},
                    {tab:'使用数',key:'used'},
                    //{tab:'赠送',key:'give'}
                    ];
        const tabComponents={
            'send':GiftSendCount,
            'used':GiftUsedCount,
            //'give':GiftGiveCount,
        };
        const { user:{accountInfo}, data } = this.props;
        return(
            <div className={styles.giftDetailModalTabs}  key={+new Date()+Math.random()}>
                <Tabs defaultActiveKey="send" className="tabsStyles">
                    {
                        tabs.map((tab,index)=>{
                            const ChildTab = tabComponents[tab.key];
                            return <TabPane tab={tab.tab} key={tab.key}><ChildTab groupID={accountInfo.groupID} data={data}/></TabPane>
                        })
                    }
                </Tabs>
            </div>
        )
    }
}

const format = "YYYY/MM/DD HH:mm";
class GiftSendCount extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:true,
            dataSource:[],
        };
        this.queryForm = null;
    }
    componentWillMount(){
        this.getData();
    }
    getData(params={}){
        const { groupID, data:{giftItemID} } = this.props;
        _.assign(params,{groupID,giftItemID});
        fetchData('getGiftUsageInfo',params,null,{path:"data.customerGiftDetails"}).then(data=>{
            if(data){
                data.map((d,i)=>{
                    d.key = i;
                    d.num = i+1;
                    d.customerName = d.customerName ? d.customerName : '';
                    d.customerSex = d.customerSex ? d.customerSex : '';
                    d.customerMobile = d.customerMobile ? d.customerMobile : '';
                    d.sendShopName = d.sendShopName ? d.sendShopName : '';
                    d.validUntilDate = Moment(d.validUntilDate,'YYYYMMDDHHmmss').format('YYYY/MM/DD');
                    d.createTime = Moment(d.createTime,'YYYYMMDDHHmmss').format(format);
                    d.getWay = d.getWay == 0 ? '未知' : _.find(GiftCfg.getWay,{value:String(d.getWay)}).label;
                    d.giftStatus = _.find(GiftCfg.giftSendStatus,{value:String(d.giftStatus)}).label;
                    return d;
                });
                this.setState({dataSource:[...data],loading:false});
            }else{
                this.setState({dataSource:[],loading:false});
            }
        });
    }
    reloading(fn){
        fn();
        return new Promise((resolve,reject)=>{
            resolve();
        });
    }
    componentWillReceiveProps(nextProps){
        this.queryForm && this.queryForm.resetFields();
    }
    handleFormChange(k,v,f){
        //console.log(k,v,f);
    }
    handleQuery(){
        this.queryForm.validateFieldsAndScroll((err,values)=>{
            if(err)return;
            let params = {};
            _.mapKeys(values,(v,k)=>{
                if(v){
                    switch(k){
                        case 'timeRangeSend':
                            params.startDate = v[0].format('YYYY-MM-DD HH:mm:ss');
                            params.endDate = v[1].format('YYYY-MM-DD HH:mm:ss');
                            break;
                        default:
                            params[k] = v;
                            break;
                    }
                }
            });
            this.reloading(()=>{
                this.setState({loading:true});
            }).then(()=>{
                this.getData(params);
            });
        });
    }
    render(){
        const { loading, dataSource } = this.state;
        //console.log(dataSource);
        const formItems = {
            timeRangeSend:{
                label:'发出时间',
                type:'datepickerRange',
                showTime:true,
                format:format,
                labelCol:{span:4},
                wrapperCol:{span:20},
            },
            giftStatus:{
                label:'状态',
                type:'combo',
                defaultValue:'',
                options:GiftCfg.giftSendStatus,
                labelCol:{span:4},
                wrapperCol:{span:20},
            },
            getWay:{
                label:'发出方式',
                type:'combo',
                defaultValue:'',
                options:GiftCfg.getWay,
                labelCol:{span:4},
                wrapperCol:{span:20},
            }
        };
        const formKeys = [{col:{span:12},keys:['getWay', 'timeRangeSend']},
                        {col:{span:12},keys:['giftStatus']}];
        const columns = [
            {
                title:'序号',
                dataIndex:'num',
                key:'num',
            },{
                title:'发出方式',
                dataIndex:'getWay',
                key:'getWay',
            },{
                title:'发出时间',
                dataIndex:'createTime',
                key:'createTime',
            },{
                title:'发出店铺',
                dataIndex:'sendShopName',
                key:'sendShopName',
                render:(value)=><Tooltip title={value}><span>{value}</span></Tooltip>
            },{
                title:'有效日期',
                dataIndex:'validUntilDate',
                key:'validUntilDate',
            },{
                title:'状态',
                dataIndex:'giftStatus',
                key:'giftStatus',
            },{
                title:'姓名',
                dataIndex:'customerName',
                key:'customerName',
            },{
                title:'性别',
                dataIndex:'customerSex',
                key:'customerSex',
            },{
                title:'手机号',
                dataIndex:'customerMobile',
                key:'customerMobile',
            }
        ];
        return (
            <div className={styles.giftSendCount}>
                <Row type='flex' align='bottom'>
                    <Col span={23}>
                        <BaseForm
                            getForm={form => this.queryForm = form}
                            formItems={formItems}
                            formKeys={formKeys}
                            onChange={(key,value)=>this.handleFormChange(key,value,this.queryForm)}
                        />
                    </Col>
                    <Col span={1} pull={4}>
                        <Row>
                            <Col span={12} pull={24}><Button type="primary" onClick={()=>this.handleQuery()}><Icon type="search" />查询</Button></Col>
                            <Col span={12} push={24}><Button type="ghost"><Icon type="export" />导出</Button></Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        loading={loading}
                        pagination={{
                            showSizeChanger:true,
                            pageSize: 10,
                            showQuickJumper:true,
                        }}
                    />
                </Row>
            </div>
        )
    }
}

class GiftUsedCount extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:true,
            dataSource:[],
            treeData:[],
        };
        this.queryForm = null;
    }
    componentWillMount(){
        const groupID = this.props.groupID;
        fetchData('getSchema', {groupID,_groupID:groupID}, null, {path:'data.shops'}).then(shops=>{
            let treeData = [];
            shops.map((item,idx)=>{
                let index = _.findIndex(treeData,{label:item.cityName})
                if(index != -1){
                    treeData[index].children.push({
                        label: item.shopName,
                        value: item.shopID,
                        key: item.shopID,
                    });
                }else{
                    treeData.push({
                        label: item.cityName,
                        key: item.cityID,
                        children:[{
                            label: item.shopName,
                            value: item.shopID,
                            key: item.shopID,
                        }]
                    });
                }
            });
            this.setState({treeData});
        });
        this.getData();
    }
    componentWillReceiveProps(nextProps){
        this.queryForm && this.queryForm.resetFields();
    }
    handleFormChange(k,v,f){
        //console.log(k,v,f);
    }
    getData(params={}){
        const { groupID, data:{giftItemID} } = this.props;
        _.assign(params,{groupID,giftItemID});
        fetchData('getGiftUsageInfo',params,null,{path:"data.customerGiftDetails"}).then(data=>{
            if(data){
                data.map((d,i)=>{
                    d.key = i;
                    d.num = i+1;
                    d.customerName = d.customerName ? d.customerName : '';
                    d.customerSex = d.customerSex ? d.customerSex : '';
                    d.customerMobile = d.customerMobile ? d.customerMobile : '';
                    d.sendShopName = d.sendShopName ? d.sendShopName : '';
                    d.usingShopName = d.usingShopName ? d.usingShopName : '';
                    d.usingTime = d.usingTime ? Moment(d.usingTime).format(format) : '';
                    d.createTime = Moment(d.createTime,'YYYYMMDDHHmmss').format(format);
                    d.getWay = d.getWay == 0 ? '未知' : _.find(GiftCfg.getWay,{value:String(d.getWay)}).label;
                    return d;
                });
                this.setState({dataSource:[...data],loading:false});
            }else{
                this.setState({dataSource:[],loading:false});
            }
        });
    }
    reloading(fn){
        fn();
        return new Promise((resolve,reject)=>{
            resolve();
        });
    }
    handleQuery(){
        this.queryForm.validateFieldsAndScroll((err,values)=>{
            if(err)return;
            let params = {};
            _.mapKeys(values,(v,k)=>{
                if(v){
                    switch(k){
                        case 'timeRangeSend':
                            params.startDate = v[0].format('YYYY-MM-DD HH:mm:ss');
                            params.endDate = v[1].format('YYYY-MM-DD HH:mm:ss');
                            break;
                        default:
                            params[k] = v;
                            break;
                    }
                }
            });
            this.reloading(()=>{
                this.setState({loading:true});
            }).then(()=>{
                this.getData(params);
            });
        });
    }
    handleShop(decorator){
        return (
        <Row>
            <Col className='giftDetailUsedCount'>
                {decorator({})
                (
                    <TreeSelect
                        dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                        treeData={this.state.treeData}
                        placeholder="请选择入会店铺"
                        showSearch
                        getPopupContainer={ () => document.querySelector('.giftDetailUsedCount')}
                        treeNodeFilterProp="label"
                        allowClear
                    />
                )}
            </Col>
        </Row>
        )
      }
    render(){
        const { loading, dataSource } = this.state;
        //console.log(dataSource);
        const formItems = {
            timeRangeSend:{
                label:'使用时间',
                type:'datepickerRange',
                showTime:true,
                format:format,
                labelCol:{span:4},
                wrapperCol:{span:20},
            },
            usingShopID:{
                label:'使用店铺',
                type:'custom',
                render:(decorator)=>this.handleShop(decorator),
            }
        };
        const formKeys = [{col:{span:15},keys:['timeRangeSend']},{col:{span:8,offset:1},keys:['usingShopID']}];
        const columns = [
            {
                title:'序号',
                dataIndex:'num',
                key:'num',
            },{
                title:'获得方式',
                dataIndex:'getWay',
                key:'getWay',
            },{
                title:'获得时间',
                dataIndex:'createTime',
                key:'createTime',
            },{
                title:'获得店铺',
                dataIndex:'sendShopName',
                key:'sendShopName',
                render:(value)=><Tooltip title={value}><span>{value}</span></Tooltip>
            },{
                title:'使用时间',
                dataIndex:'usedTime',
                key:'usedTime',
            },{
                title:'使用店铺',
                dataIndex:'usingShopName',
                key:'usingShopName',
                render:(value='')=><Tooltip title={value}><span>{value}</span></Tooltip>
            },{
                title:'姓名',
                dataIndex:'customerName',
                key:'customerName',
            },{
                title:'性别',
                dataIndex:'customerSex',
                key:'customerSex',
            },{
                title:'手机号',
                dataIndex:'customerMobile',
                key:'customerMobile',
            }
        ];
        return (
            <div className={styles.giftUsedCount}>
                <Row>
                    <Col span={18}>
                        <BaseForm
                            getForm={form => this.queryForm = form}
                            formItems={formItems}
                            formKeys={formKeys}
                            onChange={(key,value)=>this.handleFormChange(key,value,this.queryForm)}
                        />
                    </Col>
                    <Col span={6}>
                        <Row>
                            <Col span={10} offset={1}><Button type="primary" onClick={()=>this.handleQuery()}><Icon type="search" />查询</Button></Col>
                            <Col span={12}><Button type="ghost"><Icon type="export" />导出</Button></Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        loading={loading}
                    />
                </Row>
            </div>
        )
    }
}

// class GiftGiveCount extends React.Component{
//     constructor(props){
//         super(props);
//         this.state={
//             formKeys:[{keys:['customerMobile','giftNum','isSendSMS']}],
//             cardInfo:{},
//         },
//         this.giveForm = null;
//     }
//     componentWillReceiveProps() {
//         this.giveForm && this.giveForm.resetFields();
//     }
//     handleFormChange(k,v,f){
//         console.log(k,v);
//         if(v === void(0))return;
//         const { formKeys } = this.state;
//         let newKeys = formKeys[0].keys;
//         let index = _.findIndex(newKeys,item=>item==k);
//         switch(k){
//             case 'isSendSMS':
//                 let smsTemplateIndex = _.findIndex(newKeys,item=>item=='smsTemplate');
//                 if(v == true){
//                     smsTemplateIndex === -1 && newKeys.splice(index+1,0,'smsTemplate');
//                 }else{
//                     smsTemplateIndex !== -1 && newKeys.splice(index+1,1);
//                 }
//             break;
//             default:
//             break;
//         }
//         formKeys[0].keys = [...newKeys];
//         this.setState({formKeys});
//     }
//     handleGive(){
//         const { groupID, data:{giftItemID} } = this.props;
//         const { cardID,cardTypeID,customerID } = this.state.cardInfo;
//         this.giveForm.validateFieldsAndScroll((err, Values) => {
//             if (err) return;
//             console.log(Values);
//             let params = { groupID, giftItemID, cardID, cardTypeID, customerID };
//             _.assign(params,_.omit(Values,'customerMobile'));
//             fetchData('sendGifts',params).then((data)=>{
//                 console.log(data);
//                 this.setState({formKeys:[{keys:['customerMobile','giftNum','isSendSMS']}]});
//                 this.giveForm.resetFields();
//             });
//         });
//     }
//     validateCustomerMobile(v,res,msg){
//         const { groupID } = this.props;
//         fetchData('getCardInfoByMobile',{groupID,customerMobile:v},null,{path:'data'}).then(data=>{
//             let cardInfo = {};
//             if(data){
//                 cardInfo = {...data};
//                 res();
//             }else{
//                 res(msg);
//             };
//             this.setState({cardInfo});
//         },()=>res(msg));
//     }
//     render(){
//         const { values, formKeys, cardInfo  } = this.state;
//         const _this = this;
//         const formItems = {
//             customerMobile:{
//                 label:'用户手机号',
//                 type:'text',
//                 placeholder:'请输入用户手机号',
//                 rules:[{required:true,message:'请输入手机号'},
//                     {pattern:/^1[34578]\d{9}$/,message:'请输入正确的手机号'},
//                     {validator:(rule,v,cb)=>{
//                         if(/^1[34578]\d{9}$/.test(v)){
//                             this.validateCustomerMobile(v,cb,rule.message);
//                         }else{
//                             cb();
//                         }
//                     },message:'手机号对应的会员卡不存在'}],
//             },
//             giftNum:{
//                 label:'赠送张数',
//                 type:'text',
//                 placeholder:'请输入赠送张数',
//                 rules:[{
//                     required: true, message: '请输入礼品数量'
//                 },{
//                     pattern: /^([1-9]|10)$/,
//                     message: '请填写1~10的整数'
//                 }],
//             },
//             isSendSMS:{
//                 label:'是否发送短信',
//                 type:'switcher',
//                 defaultValue:false,
//                 onLabel:'是',
//                 offLabel:'否',
//             },
//             smsTemplate:{
//                 label:'短信模板',
//                 type:'textarea',
//                 placeholder:'请输入短信模板',
//                 defaultValue:'呼拉尔赠送了您 1 张呼拉尔 10 元代金券，您可以登陆我的账户-代金券查看。',
//                 rules:[{required:true,message:'请输入短信内容'}],
//             }
//         };
//         return (
//             <div className={styles.GiftGive}>
//                 <Row>
//                     <Col span={14} offset={3}>
//                         <BaseForm
//                             getForm={form => this.giveForm = form}
//                             formItems={formItems}
//                             formKeys={formKeys}
//                             formData={values}
//                             onChange={(key,value)=>this.handleFormChange(key,value,this.giveForm)}
//                         />
//                     </Col>
//                 </Row>
//                 <Row>
//                     <Col offset={15}>
//                         <Button type="primary" style={{marginLeft:-6}} onClick={()=>this.handleGive()}>确认赠送</Button>
//                     </Col>
//                 </Row>
//             </div>
//         )
//     }
// }

function mapStateToProps(state) {
  return {
    user: state.user.toJS(),
  }
}


export default connect(
  mapStateToProps
)(GiftDetailModalTabs);

import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import styles from '../../SaleCenter/ActivityPage.less';
import Cfg from '../../../constants/SpecialPromotionCfg';
import {
    Table, Input, Select, DatePicker,
    Button, Modal, Row, Col, message,
    Spin, Icon
} from 'antd';
import moment from 'moment';
const confirm = Modal.confirm;

const Option = Select.Option;
const { RangePicker } = DatePicker;

import {saleCenterSetSpecialBasicInfoAC, saleCenterResetDetailInfoAC} from '../../../redux/actions/saleCenter/specialPromotion.action'

import {
    toggleSelectedActivityStateAC,
    fetchSpecialPromotionList,
    fetchPromotionListCancel,
    deleteSelectedRecordAC,
    fetchSpecialPromotionDetailAC,
    fetchSpecialPromotionDetailCancel,
    fetchSpecialDetailAC
} from "../../../redux/actions/saleCenter/mySpecialActivities.action";

import SpecialPromotionDetail from './specialPromotionDetail';

import {
    getSpecialPromotionIdx,
    specialPromotionBasicDataAdapter,
} from '../../../redux/actions/saleCenter/types';

import ActivityMain from '../activityMain';

import registerPage from '../../../index';
import { OLD_SPECIAL_PAGE } from '../../../constants/entryCodes';

import { promotionBasicInfo } from '../../../redux/reducer/saleCenter/promotionBasicInfo.reducer';
import { promotionDetailInfo } from '../../../redux/reducer/saleCenter/promotionDetailInfo.reducer';
import { promotionScopeInfo } from '../../../redux/reducer/saleCenter/promotionScopeInfo.reducer';
import { fullCut } from '../../../redux/reducer/saleCenter/fullCut.reducer';
import { myActivities } from '../../../redux/reducer/saleCenter/myActivities.reducer';
import { saleCenter } from '../../../redux/reducer/saleCenter/saleCenter.reducer';
// import { giftInfoNew as sale_giftInfoNew } from '../GiftNew/_reducers';
import { mySpecialActivities } from '../../../redux/reducer/saleCenter/mySpecialActivities.reducer';
import { specialPromotion } from '../../../redux/reducer/saleCenter/specialPromotion.reducer';
// import { crmCardTypeNew as sale_crmCardTypeNew } from '../../../redux/reducer/saleCenterNEW/crmCardType.reducer';
import { steps } from '../../../redux/modules/steps';

const mapStateToProps = (state)=>{
    return {
        mySpecialActivities: state.mySpecialActivities,
        promotionBasicInfo: state.promotionBasicInfo,
        promotionScopeInfo: state.promotionScopeInfo,
        user:state.user.toJS()
    };
};

const mapDispatchToProps = (dispatch)=>{
    return {
        query: (opts)=>{
            dispatch(fetchSpecialPromotionList(opts));
        },

        toggleSelectedActivityState: (opts)=>{
            dispatch(toggleSelectedActivityStateAC(opts));
        },

        deleteSelectedRecord: (opts)=>{
            dispatch(deleteSelectedRecordAC(opts));
        },

        fetchSpecialPromotionList:(opts)=>{
            dispatch(fetchSpecialPromotionList(opts))
        },

        fetchSpecialPromotionDetail:(opts)=>{
            dispatch(fetchSpecialPromotionDetailAC(opts))
        },

        cancelFetchSpecialPromotionDetail:(opts)=>{
            dispatch(fetchSpecialPromotionDetailCancel(opts))
        },
        saleCenterSetSpecialBasicInfo:(opts)=>{
            dispatch(saleCenterSetSpecialBasicInfoAC(opts))
        },
        fetchSpecialDetail:(opts)=>{
            dispatch(fetchSpecialDetailAC(opts))
        },
        saleCenterResetDetailInfo:(opts)=>{
            dispatch(saleCenterResetDetailInfoAC(opts))
        },
    };
};

@registerPage([OLD_SPECIAL_PAGE], {
    promotionBasicInfo,
    promotionDetailInfo,
    promotionScopeInfo,
    fullCut,
    myActivities,
    saleCenter,
    // sale_giftInfoNew,
    mySpecialActivities,
    specialPromotion,
    // sale_crmCardTypeNew,
    steps,
})
@connect(mapStateToProps, mapDispatchToProps)
class MySpecialActivities extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            dataSource: [],
            advancedQuery: true,
            visible: false,
            selectedRecord: null,    // current record
            updateModalVisible: false,
            expand: false, // 高级查询
            index: 0,
            recordToDisplay: null,
            // qualifications:
            valid: '0',
            modalTitle: '更新活动信息',
            isNew: false,

            selectedShop: null,

            loading: true,
            eventWay: '',
            promotionDateRange: '',
            isActive: '',
            eventName: '',
            pageSizes: 30,
            pageNo: 1,
            record:{
                eventInfo:{},
                cardInfo:[],
                userInfo:[]
            }
        };

        this.renderFilterBar = this.renderFilterBar.bind(this);
        this.showNothing = this.showNothing.bind(this);
        // disable selected activity


        this.handleDisableClickEvent = this.handleDisableClickEvent.bind(this);
        this.handelStopEvent = this.handelStopEvent.bind(this);
        this.onDateQualificationChange = this.onDateQualificationChange.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.renderContentOfThisModal = this.renderContentOfThisModal.bind(this);
        this.checkDeleteInfo = this.checkDeleteInfo.bind(this);
        this.checkDetailInfo = this.checkDetailInfo.bind(this);
        this.renderModals = this.renderModals.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderUpdateModals = this.renderUpdateModals.bind(this);
        this.handleUpdateOpe = this.handleUpdateOpe.bind(this);
    }

    /**
     * @description toggle the advanced qualification selection.
     * */
    handleDisableClickEvent(text, record,index,nextActive,modalTip){
        // this.state.selectedRecord
        this.props.toggleSelectedActivityState({
            record,
            nextActive,
            modalTip,
            success: this.toggleStateCallBack,
            fail: this.toggleStateFailCallBack,
            warning: this.toggleStateWarningCallBack,
        });
    }

    toggleStateFailCallBack(val){
        message.error(val);
    }

    toggleStateWarningCallBack(val){
        message.warning(val);
    }

    toggleStateCallBack(val){
        message.success(val);
    }
    //终止活动
    handelStopEvent(text,record,index,nextActive,modalTip){
        confirm({
            title: '终止特色营销活动',
            content: (
                <div>
                    您将终止
                    【<span>{record.eventName}</span>】
                    <br/>
                    <span>终止是不可恢复操作，请慎重考虑~</span>
                </div>
            ),
            footer:'终止是不可恢复操作,请慎重考虑',
            onOk:()=>{
                this.handleDisableClickEvent(text,record,index,nextActive,modalTip)
            },
            onCancel:() => {},
        });
    }
    //关闭更新
    handleDismissUpdateModal(){
        this.setState({
            updateModalVisible: false
        });
        this.props.saleCenterResetDetailInfo();
        this.showNothing = this.showNothing.bind(this);

    }

    componentDidMount(){

        let {
            fetchSpecialPromotionList
        } = this.props;
        fetchSpecialPromotionList({
            data:{
                groupID:this.props.user.accountInfo.groupID,
                // _role:this.props.user.accountInfo.roleType,
                // _loginName:this.props.user.accountInfo.loginName,
                // _groupLoginName:this.props.user.accountInfo.groupLoginName,
                pageSize: this.state.pageSizes,
                pageNo:1
            },
            fail:(msg)=>{message.success(msg)},
        });
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
        let parentDoms = ReactDOM.findDOMNode(this.layoutsContainer);           //获取父级的doms节点
        if(null!==parentDoms){                                                  //如果父级节点不是空将执行下列代码
            let parentHeight=parentDoms.offsetHeight;                           //获取到父级的高度存到变量 parentHeight
            let contentrDoms = parentDoms.querySelectorAll('.layoutsContent');  //从父节点中获取 类名是 layoutsContent 的doms节点 存到变量 contentrDoms 中
            if(undefined !== contentrDoms && contentrDoms.length > 0) {         //如果 contentrDoms 节点存在 并且length>0 时执行下列代码
                let layoutsContent = contentrDoms[0];                           //把获取到的 contentrDoms 节点存到 变量 layoutsContent 中
                let headerDoms = parentDoms.querySelectorAll('.layoutsHeader');
                let headerHeight = headerDoms[0].offsetHeight;
                layoutsContent.style.height = parentHeight - headerHeight - 15 - 20 + 'px';      //layoutsContent 的高度，等于父节点的高度-头部-横线-padding值
                this.setState({
                    contentHeight:parentHeight - headerHeight - 15,
                    tableHeight:layoutsContent.offsetHeight - 40 - 68
                })
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    // TODO: the following code may be not the best implementation of filter
    // The filter condition should not be save to redux, just save it to state temporarily.
    // Modify it in the future
    componentWillReceiveProps(nextProps){
        if (this.props.mySpecialActivities.get('$specialPromotionList') !== nextProps.mySpecialActivities.get('$specialPromotionList')) {
            let _promoitonList =nextProps.mySpecialActivities.get('$specialPromotionList').toJS();
            switch (_promoitonList.status){
                case 'timeout':
                    message.error('请求超时');
                    this.setState({
                        loading: false
                    });
                    break;
                case 'fail':
                    message.error('请求失败');
                    this.setState({
                        loading: false
                    });
                    break;
                case 'success':
                    if(_promoitonList.data){
                        this.setState({
                            loading: false,
                            dataSource: _promoitonList.data.map((activity, index)=>{
                                activity.index = index+1;
                                activity.key = `${index}`;
                                activity.validDate = {
                                    start: activity.eventStartDate,
                                    end: activity.eventEndDate
                                };
                                return activity;
                            }),
                            total:_promoitonList.total
                        });
                    }else{
                        message.warning('暂无数据');
                        this.setState({
                            loading: false,
                            dataSource:[]
                        });
                    }
                    break;
            }

        }

        if(this.props.mySpecialActivities.get("$specialDetailInfo") !== nextProps.mySpecialActivities.get("$specialDetailInfo")){
            this.setState({
                record: nextProps.mySpecialActivities.get("$specialDetailInfo").toJS()
            })

        }
    }

    render(){
        return (
            <Row className="layoutsContainer" ref = {layoutsContainer => this.layoutsContainer = layoutsContainer}>
                <Col span={24} className="layoutsHeader">
                    {this.renderHeader()}
                    <div className="layoutsLine"></div>
                    {this.renderFilterBar()}
                </Col>
                <Col span={24} className="layoutsLineBlock"> </Col>
                {this.renderTables()}
                {this.renderModals()}
                {this.renderUpdateModals()}
            </Row>
        );
    }
    //查询
    handleQuery(){
        this.setState({
            loading: true,
            pageNo: 1
        });

        let {
            eventWay,
            promotionDateRange,
            isActive,
            eventName
        } = this.state;

        let opt = {};
        if(eventWay!==''&&eventWay!==undefined){
            opt.eventWay = eventWay;
        }

        if(promotionDateRange !== ''  && promotionDateRange.length !==  0 ){
            opt.eventStartDate=promotionDateRange[0].format('YYYYMMDD');
            opt.eventEndDate=promotionDateRange[1].format('YYYYMMDD');
        }

        if(eventName!==''&&eventName!==undefined){
            opt.eventName = eventName;
        }

        if(isActive!==''){
            opt.isActive = isActive == '-1'?'-1':(isActive == '1'?'1':'0');
        }

        this.props.query({
            data:{
                groupID:this.props.user.accountInfo.groupID,
                pageSize: this.state.pageSizes,
                pageNo:1,
                ...opt
            },
            fail:(msg)=>{message.success(msg)},
        });
    }

    showNothing(data){
        if(data == undefined){
            setTimeout(()=>{
                this.setState({
                    loading: false,
                });
                message.error('没有查到相应数据');
            });
        }
    }

    renderHeader(){
        return (
            <div className="layoutsTool">
                <div className="layoutsToolLeft">
                    <h1>特色营销信息</h1>
                </div>

            </div>
        );
    }
    // date qualification
    onDateQualificationChange(value){
        this.setState({
            promotionDateRange: value
        });
    }

    renderFilterBar(){
        let opts = [];
        Cfg.eventWay.forEach((item, index)=>{
            if(index <= 6){
                opts.push(
                    <Option value={`${item.value}`} key={`${index}`}>{item.label}</Option>
                );
            }
        });
        return (
            <div>
                <div className="layoutsSearch">
                    <ul>
                        <li>
                            <h5>活动时间</h5>
                        </li>
                        <li>
                            <RangePicker style={{ width: 200 }} onChange={this.onDateQualificationChange} />
                        </li>

                        <li>
                            <h5>活动类型</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 160 }}
                                showSearch
                                placeholder="请选择活动类型"
                                defaultValue="全部"
                                onChange={(value) => {
                                    this.setState({
                                        eventWay: value === "ALL" ? null : value
                                    });
                                }}
                            >
                                {opts}
                            </Select>
                        </li>

                        <li>
                            <h5>使用状态</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 160 }}
                                defaultValue=""
                                placeholder="请选择使用状态"
                                onChange={(value) => {
                                    this.setState({
                                        isActive: value
                                    });
                                }}
                            >
                                <Option value=''>不限</Option>
                                <Option value='1'>已启用</Option>
                                <Option value='0'>未启用</Option>
                                <Option value='-1'>已终止</Option>
                            </Select>
                        </li>

                        <li>
                            <h5>活动名称</h5>
                        </li>
                        <li>
                            <Input placeholder="请输入活动名称"
                                onChange={e => {
                                       this.setState({
                                           eventName: e.target.value
                                       });
                                   }} />
                        </li>

                        <li>
                            <Button  type="primary" onClick={this.handleQuery}><Icon type="search" />查询</Button>
                        </li>

                    </ul>
                </div>
            </div>

        );
    }
    //切换每页显示条数
    onShowSizeChange = (current, pageSize)=>{
        this.setState({
            pageSizes:pageSize,
        })
    };

    renderTables(){
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                className: 'TableTxtCenter',
                width: 60,
                // fixed:'left',
                key: 'key',
                render:(text, record, index)=> {
                    return (this.state.pageNo - 1) * this.state.pageSizes + text;
                }
            },

            {
                title: '操作',
                key: 'operation',
                width: 210,
                // fixed:'left',
                render: (text, record, index) => {
                    let buttonText = (record.isActive == "1" ? "禁用" : "启用");
                    return (<span>
                                    <a href="#"
                                       className={record.isActive == '-1' ?styles.textDisabled:null}
                                       onClick={()=>{
                                           record.isActive == '-1' ?null:
                                           this.handleDisableClickEvent(text, record, index,null,'使用状态修改成功');
                                       }}>
                                        {buttonText}</a>
                                    <a href="#"
                                       className={record.isActive != '0' ?styles.textDisabled:null}
                                       onClick={()=>{
                                           record.isActive != '0' ?null:
                                           this.handleUpdateOpe(text, record, index);
                                       }}>
                                        编辑</a>
                                    <a href="#"
                                       className={record.isActive != '0'||record.userCount != 0 ?styles.textDisabled:null}
                                       onClick={()=>{
                                           record.isActive != '0'||record.userCount != 0 ?null:
                                           this.checkDeleteInfo(text, record, index);
                                       }}>
                                        删除</a>
                                    <a href="#"
                                       className={record.isActive == '-1' ?styles.textDisabled:null}
                                       onClick={()=>{
                                           record.isActive == '-1' ?null:
                                           this.handelStopEvent(text, record, index,'-1','活动终止成功');
                                       }}>
                                        终止</a>
                                    <a href="#"
                                       onClick={()=>{
                                           this.checkDetailInfo(text, record, index);
                                       }}>
                                        活动跟踪</a>
                        </span>
                    );}
            },
            {
                title: '活动类型',
                dataIndex: 'eventWay',
                key: 'eventWay',
                width: 120,
                // fixed:'left',
                render: (text,record,index)=>{
                    return <span>{mapValueToLabel(Cfg.eventWay, String(record.eventWay))}</span>
                }
            },

            {
                title: '活动名称',
                dataIndex: 'eventName',
                key: 'eventName',
                // fixed:'left',
                width: 200,
            },
            {
                title: '参与人数',
                className: 'TableTxtRight',
                dataIndex: 'userCount',
                key: 'userCount',
                width: 100,
            },
            {
                title:'有效时间',
                className: 'TableTxtCenter',
                dataIndex: 'validDate',
                key: '',
                width: 200,
                render: (validDate)=>{
                    if (validDate.start === '0' || validDate.end === '0' ||
                        validDate.start === '20000101' || validDate.end === '29991231'){
                        return "不限制";
                    }
                    return `${moment(validDate.start,'YYYY/MM/DD').format('YYYY/MM/DD')} - ${moment(validDate.end,'YYYY/MM/DD').format('YYYY/MM/DD')}`;
                }
            },
            {
                title:'创建时间/修改时间',
                className: 'TableTxtCenter',
                dataIndex: 'operateTime',
                key: 'operateTime',
                width: 360,
                render: (text, record, index)=>{
                    if (record.actionStamp === "" && record.createStamp ==='') {
                        return "--";
                    }
                    return `${moment(new Date(parseInt(record.createStamp))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionStamp))).format('YYYY-MM-DD HH:mm:ss')}`;
                }
            },
            {
                title: '创建人/修改人',
                dataIndex: 'operator',
                key: 'operator',
                render: (text, record, index)=>{
                    if (record.operator === "" ) {
                        return "--";
                    }
                    return `${JSON.parse(record.operator).userName} / ${JSON.parse(record.operator).userName||JSON.parse(record.operator).u_userName}`;
                }
            },
            {
                title: '使用状态',
                dataIndex: 'isActive',
                key: 'isActive',
                width: 120,
                render: (isActive) => {
                    return isActive == "-1" ? "已终止": isActive == "1" ? "已启用" : '已禁用';
                }
            }
        ];

        return (
            <Col span={24} className="layoutsContent  tableClass">
                <Table scroll = {{x:1500,y:this.state.tableHeight}}
                       bordered
                       columns={columns}
                       dataSource={this.state.dataSource}
                       loading = {this.state.loading}
                       pagination={{
                           pageSize:this.state.pageSizes,
                           current:this.state.pageNo,
                           showQuickJumper:true,
                           showSizeChanger:true,
                           onShowSizeChange:this.onShowSizeChange,
                           total: this.state.total || 0,
                           showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                           onChange:(page, pageSize)=>{
                               this.setState({
                                   pageNo:page
                               });
                               let opt = {
                                   pageSize: pageSize,
                                   pageNo: page
                               };
                               let {
                                   eventWay,
                                   promotionDateRange,
                                   isActive,
                                   eventName
                               } = this.state;

                               if(eventWay!==''&&eventWay!==undefined){
                                   opt.eventWay = eventWay;
                               }

                               if(promotionDateRange !== ''  && promotionDateRange.length !==  0 ){
                                   opt.eventStartDate=promotionDateRange[0].format('YYYYMMDD');
                                   opt.eventEndDate=promotionDateRange[1].format('YYYYMMDD');
                               }

                               if(eventName!==''&&eventName!==undefined){
                                   opt.eventName = eventName;
                               }

                               if(isActive!==''){
                                   opt.isActive = isActive == '-1'?'-1':isActive == '1'?'1':'0';
                               }
                               this.props.query({
                                   data:{
                                       groupID:this.props.user.accountInfo.groupID,
                                       ...opt
                                   },
                                   fail:(msg)=>{message.success(msg)},
                               });
                           }
                       }}
                />
            </Col>
        );
    }
    //删除
    checkDeleteInfo(text, record, index){
        confirm({
            title: '删除特色营销活动',
            content: (
                <div>
                    您将删除
                    【<span>{record.eventName}</span>】
                    <br/>
                    <span>删除是不可恢复操作，请慎重考虑~</span>
                </div>
            ),
            footer:'删除数据时不可恢复操作,请慎重考虑',
            onOk:()=>{
                this.props.deleteSelectedRecord({
                    ...record,
                    success:()=>{
                        message.success('删除成功');
                    },
                    fail: (msg)=>{
                        message.error(msg);
                    }
                });
            },
            onCancel:() => {},
        });
    }

    //编辑
    handleUpdateOpe(){
        this.setState({
            updateModalVisible: true,
        });
        // Set promotion information to the PromotionBasic and promotionScope redux
        let _record = arguments[1];

        let user = this.props.user;


        let successFn = (response)=>{
            let _promotionIdx = getSpecialPromotionIdx(`${_record.eventWay}`);
            let _serverToRedux = false;
            if(response === undefined || response.data === undefined) {
                message.error("没有查询到相应数据");
                return null;
            }
            this.props.saleCenterSetSpecialBasicInfo(specialPromotionBasicDataAdapter(response, _serverToRedux));
            this.setState({
                modalTitle: "更新活动信息",
                isNew: false,
                index: _promotionIdx
            });
        };

        let failFn = ()=>{
            message.error('错误');
        };
        this.props.fetchSpecialDetail({
            data: {
                itemID: _record.itemID,
                groupID: user.accountInfo.groupID
            },
            success: successFn,
            fail:failFn
        });
    }
    /**
     * Render promotion update Modal
     * wrapped normally.
     * @param {Bool} isNew A bool value identify the current operation is update or create.
     */

    renderUpdateModals(){
        return (
            <Modal
                wrapClassName = 'progressBarModal'
                title={this.state.modalTitle}
                visible={this.state.updateModalVisible}
                footer={false}
                width="924px"
                height="569px"
                maskClosable={false}
                onCancel={()=>{
                    this.setState({
                        updateModalVisible:false,
                    });
                    this.props.saleCenterResetDetailInfo();
                }}
            >
                {
                    this.state.updateModalVisible?
                        this.renderContentOfThisModal()
                        :null
                }
            </Modal>
        );
    }

    renderContentOfThisModal(){
        let mySpecialActivities = this.props.mySpecialActivities.get("$specialDetailInfo").toJS();
        let handleUpdateOpe = this.handleUpdateOpe;
        let _state = this.state;
        if(mySpecialActivities.status === 'start' || mySpecialActivities.status === 'pending') {
            return (
                <div className={styles.spinFather}>
                    <Spin size="large" />
                </div>
            )
        }
        if(mySpecialActivities.status === 'timeout'|| mySpecialActivities.status === 'fail'){
            return (
                <div className={styles.spinFather}>
                    查询详情出错!点击 <a onClick={handleUpdateOpe}>重试</a>
                </div>
            );
        }

        if (mySpecialActivities.status === 'success') {
            return (<ActivityMain
                isNew={_state.isNew}
                index={_state.index}
                callbackthree={(arg) => {
                    if(arg == 3){
                        this.handleDismissUpdateModal();
                    }
                }}
            />);
        }
    }

    // Row Actions: 查看
    checkDetailInfo(){
        this.setState({
            visible: true
        });
        let _record = arguments[1];
        let user = this.props.user;

        let failFn = ()=>{
            message.error('查询详情失败');
        };

        this.props.fetchSpecialPromotionDetail({
            data: {
                itemID: _record.itemID,
                groupID: user.accountInfo.groupID,
            },
            fail:failFn
        });

    }
    //关闭详情页
    handleClose(){
        this.setState({
            visible: false
        })
    }
    //活动详情页
    renderModals(){
        let mySpecialActivities = this.props.mySpecialActivities.get("$specialDetailInfo").toJS();
        let checkDetailInfo = this.checkDetailInfo;
        function renderContentOfTheModal(cancelFetchSpecialPromotionDetail){
            if(mySpecialActivities.status === 'start' || mySpecialActivities.status === 'pending') {
                return (
                    <div className={styles.spinFather}>
                        <Spin size="large" />
                    </div>)
            }
            if(mySpecialActivities.status === 'timeout'|| mySpecialActivities.status === 'fail'){
                return (
                    <div className={styles.spinFather}>
                        查询详情出错!点击 <a onClick={checkDetailInfo}>重试</a>
                    </div>
                );
            }
            if (mySpecialActivities.status === 'success') {
                return (<SpecialPromotionDetail record={mySpecialActivities.data}/>);
            }
        }
        return (
            <Modal
                title="活动详情"
                visible={this.state.visible}
                footer={<Button onClick = {this.handleClose}>关闭</Button>}
                closable={false}
                width="750px"
            >
                {
                    this.state.visible?
                        renderContentOfTheModal(this.props.cancelFetchSpecialPromotionDetail)
                        :null
                }
            </Modal>
        );
    }

}


function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value : val}), 'label');
}
export default MySpecialActivities;

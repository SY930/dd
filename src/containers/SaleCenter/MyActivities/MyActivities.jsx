/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-02-28T21:30:35+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: MyActivities.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-10T11:29:38+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import styles from '../ActivityPage.less';

import {
    Table, Icon, Input, Select, Form, DatePicker,
    Button, Modal, Row, Col, message,
    TreeSelect,
    Popconfirm,
    Spin
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
let Immutable = require('immutable');
var moment = require('moment');


import {
    initializationOfMyActivities,
    toggleSelectedActivityStateAC,
    fetchPromotionList,
    fetchPromotionListCancel,

} from "../../../redux/actions/saleCenter/myActivities.action";

import {
    fetchPromotionCategoriesAC,
    fetchPromotionTagsAC,
    saleCenterResetBasicInfoAC
} from '../../../redux/actions/saleCenter/promotionBasicInfo.action';

import {
    fetchPromotionScopeInfo,
    saleCenterResetScopeInfoAC
} from '../../../redux/actions/saleCenter/promotionScopeInfo.action';

import {
    saleCenterResetDetailInfoAC
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';
import {
    fetchPromotionDetail,
    resetPromotionDetail,
    fetchPromotionDetailCancel
} from '../../../redux/actions/saleCenter/promotion.action';

import {
    TRIPLE_STATE
} from "../../../redux/actions/saleCenter/types";


import PromotionDetail from './PromotionDetail';

import {
    ACTIVITY_CATEGORIES,
    SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST,

    getPromotionIdx,
    promotionBasicDataAdapter,
    promotionScopeInfoAdapter,
    promotionDetailInfoAdapter
} from '../../../redux/actions/saleCenter/types';

import ActivityMain from '../activityMain';
import registerPage from '../../../index';
import { OLD_SALE_CENTER_PAGE } from '../../../constants/entryCodes';

import { promotionBasicInfo } from '../../../redux/reducer/saleCenter/promotionBasicInfo.reducer';
import { promotionDetailInfo } from '../../../redux/reducer/saleCenter/promotionDetailInfo.reducer';
import { promotionScopeInfo } from '../../../redux/reducer/saleCenter/promotionScopeInfo.reducer';
import { fullCut } from '../../../redux/reducer/saleCenter/fullCut.reducer';
import { myActivities } from '../../../redux/reducer/saleCenter/myActivities.reducer';
import { saleCenter } from '../../../redux/reducer/saleCenter/saleCenter.reducer';
// import { giftInfoNew as sale_giftInfoNew } from '../../GiftNew/_reducers';
import { mySpecialActivities } from '../../../redux/reducer/saleCenter/mySpecialActivities.reducer';
import { steps } from '../../../redux/modules/steps';

const mapStateToProps = (state)=>{
    return {
        myActivities: state.sale_old_myActivities,
        promotionBasicInfo: state.sale_old_promotionBasicInfo,
        promotionScopeInfo: state.sale_old_promotionScopeInfo,
        user:state.user.toJS()
    };
};

const mapDispatchToProps = (dispatch)=>{
    return {
        //查询
        query: (opts)=>{
            dispatch(initializationOfMyActivities(opts));
        },
        //启用/禁用
        toggleSelectedActivityState: (opts)=>{
            dispatch(toggleSelectedActivityStateAC(opts));
        },
        //查询类别
        fetchPromotionCategories: (opts) => {
            dispatch(fetchPromotionCategoriesAC(opts));
        },
        //查询标签
        fetchPromotionTags: (opts) => {
            dispatch(fetchPromotionTagsAC(opts));
        },
        //查询品牌、店铺等信息
        fetchPromotionScopeInfo: (opts)=>{
            dispatch(fetchPromotionScopeInfo(opts));
        },
        //查询活动详情
        fetchPromotionDetail:(opts)=>{
            dispatch(fetchPromotionDetail(opts))
        },
        //查询活动列表
        fetchPromotionList:(opts)=>{
            dispatch(fetchPromotionList(opts))
        },
        //reset
        saleCenterResetBasicInfo: (opts)=>{
            dispatch(saleCenterResetBasicInfoAC(opts));
        },
        //reset
        saleCenterResetScopeInfo: (opts)=>{
            dispatch(saleCenterResetScopeInfoAC(opts));
        },
        //reset
        saleCenterResetDetailInfo: (opts)=>{
            dispatch(saleCenterResetDetailInfoAC(opts));
        },
        // reset promotionDetail in myActivities.reducer $promotionDetailInfo
        resetPromotionDetail: (opts)=>{
            dispatch(resetPromotionDetail());
        },
        // cancel the promotion detail fetch operation
        cancelFetchPromotionDetail: (opts)=>{
            dispatch(fetchPromotionDetailCancel())
        }
    };
};

@registerPage([OLD_SALE_CENTER_PAGE], {
    sale_old_promotionBasicInfo: promotionBasicInfo,
    sale_old_promotionDetailInfo: promotionDetailInfo,
    sale_old_promotionScopeInfo: promotionScopeInfo,
    sale_old_fullCut: fullCut,
    sale_old_myActivities: myActivities,
    sale_old_saleCenter: saleCenter,
    sale_old_mySpecialActivities: mySpecialActivities,
    sale_old_steps: steps,
})
@connect(mapStateToProps, mapDispatchToProps)
class MyActivities extends React.Component {

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
            //以下是用于查询的条件
            promotionType: '',
            promotionDateRange: '',
            promotionValid: '',
            promotionState: '',
            promotionCategory: '',
            promotionTags: '',
            promotionBrands: '',
            promotionOrder: '',
            promotionShop: '',
            pageSizes:30,                           //默认显示的条数
            pageNo: 1

        };

        this.checkDetailInfo = this.checkDetailInfo.bind(this);
        this.renderModals = this.renderModals.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderFilterBar = this.renderFilterBar.bind(this);
        this.handleDisableClickEvent = this.handleDisableClickEvent.bind(this);
        this.toggleExpandState = this.toggleExpandState.bind(this);
        this.renderModifyRecordInfoModal = this.renderModifyRecordInfoModal.bind(this);
        this.onDateQualificationChange = this.onDateQualificationChange.bind(this);
        this.renderShopsInTreeSelectMode = this.renderShopsInTreeSelectMode.bind(this);
        this.onTreeSelect = this.onTreeSelect.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.showNothing = this.showNothing.bind(this);
        this.renderContentOfThisModal = this.renderContentOfThisModal.bind(this);
        this.handleUpdateOpe = this.handleUpdateOpe.bind(this);
    }
    componentDidMount(){

        let {
            promotionBasicInfo,
            fetchPromotionCategories,
            fetchPromotionTags,
            promotionScopeInfo,
            fetchPromotionScopeInfo,
            fetchPromotionList
        } = this.props;
        fetchPromotionList({
            data:{
                _groupID: this.props.user.accountInfo.groupID,
                pageSize: this.state.pageSizes,
                pageNo: 1
            },
            fail:(msg)=>{message.error(msg)},
            success:this.showNothing
        });
        // Make sure the categoryList is fetched from the server.
        if(!promotionBasicInfo.getIn(["$categoryList", "initialized"])) {
            fetchPromotionCategories({
                _groupID: this.props.user.accountInfo.groupID,
                phraseType:'0'
            });
        }

        // Make sure the taglist is fetched from the server
        if(!promotionBasicInfo.getIn(["$tagList", "initialized"])){
            fetchPromotionTags({
                _groupID: this.props.user.accountInfo.groupID,
                phraseType:'1'
            });
        }

        // Make sure that the promotion scope related data is fetched from the server
        if(!promotionScopeInfo.getIn(["refs", "initialized"])){
            fetchPromotionScopeInfo({
                _groupID: this.props.user.accountInfo.groupID,
            });
        }

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }
    /**
     * @description toggle the advanced qualification selection.
     * */
    toggleExpandState(){
        let expand = this.state.expand;

        this.setState({
            expand: !expand
        });
    }

    handleDisableClickEvent(text, record){
        // this.state.selectedRecord
        this.props.toggleSelectedActivityState({
            record,
            cb: this.toggleStateCallBack
        });
    }

    toggleStateCallBack(){
        message.success('使用状态修改成功');
    }

    handleClose(){
        this.props.resetPromotionDetail();
        this.props.cancelFetchPromotionDetail();
        this.setState({
            visible: false,
        });
    }

    handleDismissUpdateModal(){
        this.setState({
            updateModalVisible: false
        });
        this.props.saleCenterResetBasicInfo();
        this.props.saleCenterResetScopeInfo();
        this.props.saleCenterResetDetailInfo();

    }

    onWindowResize = () => {
        let parentDoms = ReactDOM.findDOMNode(this.layoutsContainer);           //获取父级的doms节点
        if(null!=parentDoms){                                                  //如果父级节点不是空将执行下列代码
            let parentHeight=parentDoms.offsetHeight;                           //获取到父级的高度存到变量 parentHeight
            let contentrDoms = parentDoms.querySelectorAll('.layoutsContent');  //从父节点中获取 类名是 layoutsContent 的doms节点 存到变量 contentrDoms 中
            if(undefined != contentrDoms && contentrDoms.length > 0) {         //如果 contentrDoms 节点存在 并且length>0 时执行下列代码
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

    componentWillReceiveProps(nextProps){
        if (this.props.myActivities.get('$promotionList') != nextProps.myActivities.get('$promotionList')) {
            let _promoitonList =nextProps.myActivities.get('$promotionList').toJS();
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
                    this.setState({
                        loading: false,
                        dataSource: _promoitonList.data.map((activity, index)=>{
                            activity.index = index+1;
                            activity.key = `${index}`;
                            activity.validDate = {
                                start: activity.startDate,
                                end: activity.endDate
                            };
                            return activity;
                        }),
                        total:_promoitonList.total
                    });
                    break;
            }

        }

    }

    handleQuery(){
        this.setState({
            loading: true,
            pageNo: 1
        });

        let {
            promotionType,
            promotionDateRange,
            promotionValid,
            promotionState,
            promotionCategory,
            promotionTags,
            promotionBrands,
            promotionOrder,
            promotionShop
        } = this.state;

        let opt = {
            _groupID: this.props.user.accountInfo.groupID,
            pageSize: this.state.pageSizes,
            pageNo: 1
        };
        if(promotionType!=''&&promotionType!='undefined'){
            opt.promotionType = promotionType;
        }
        if(promotionDateRange!=''&&promotionDateRange!=undefined){
            opt.startDate=promotionDateRange[0].format('YYYYMMDD');
            opt.endDate=promotionDateRange[1].format('YYYYMMDD');
        }
        if(promotionCategory!=''&&promotionCategory!=undefined){
            opt.categoryName = promotionCategory;
        }
        if(promotionBrands!=''&&promotionBrands!=undefined){
            opt.brandID = promotionBrands;
        }
        if( promotionOrder!=''&&promotionOrder!=undefined){
            opt.orderType = promotionOrder;
        }
        if(promotionShop!=''&&promotionShop!=undefined){
            opt.shopID = promotionShop;
        }
        if(promotionState!=''&&promotionState!='0'){
            opt.isActive = promotionState == '1'?'1':'0';
        }
        if(promotionValid!=''&&promotionValid!='0'){
            opt.status = promotionValid;
        }
        if(promotionTags!=''&&promotionTags!='0'){
            opt.tag = promotionTags;
        }
        opt.cb = this.showNothing;
        this.props.query(opt);
    }

    showNothing(data){
        if(data == undefined){
            setTimeout(()=>{
                this.setState({
                    loading: false,
                    dataSource:[]
                });
                message.warning('暂无数据');
            });
        }
    }

    // date qualification
    onDateQualificationChange(value){

        this.setState({
            promotionDateRange: value
        });
    }

    onTreeSelect(value,treeData){
        let shopsInfo = [];
        treeData.forEach((td)=>{
            if(td.children){
                td.children.map((tdc)=>{
                    shopsInfo.push(tdc);
                })
            }
        });
        if(value!=undefined){
            if(value.match(/[-]/g).length != 2){
                return null;
            }else{
                let selectedShopID = shopsInfo.find((si)=>{
                    return si.value === value;
                }).shopID;

                this.setState({
                    selectedShop: value,
                    promotionShop :selectedShopID
                });
            }
        }else{
            this.setState({
                selectedShop: null,
                promotionShop: value,
            });
        }
    }

    //切换每页显示条数
    onShowSizeChange = (current, pageSize)=>{
        this.setState({
            pageSizes:pageSize,
        })
    };

    handleUpdateOpe(){
        this.setState({
            updateModalVisible: true,
        });
        // Set promotion information to the PromotionBasic and promotionScope redux
        let _record = arguments[1];
        let successFn = (responseJSON)=>{
            let _promotionIdx = getPromotionIdx(_record.promotionType);
            let _serverToRedux = false;
            if(responseJSON.promotionInfo === undefined || responseJSON.promotionInfo.master === undefined) {
                message.error("没有查询到相应数据");
                return null;
            }
            //把查询到的活动信息存到redux
            this.props.saleCenterResetBasicInfo(promotionBasicDataAdapter(responseJSON.promotionInfo, _serverToRedux));
            this.props.saleCenterResetScopeInfo(promotionScopeInfoAdapter(responseJSON.promotionInfo.master, _serverToRedux));
            this.props.saleCenterResetDetailInfo(promotionDetailInfoAdapter(responseJSON.promotionInfo, _serverToRedux));

            this.setState({
                promotionInfo: responseJSON.promotionInfo,
                selectedRecord: responseJSON.promotionInfo, //arguments[1],
                modalTitle: "更新活动信息",
                isNew: false,
                index: _promotionIdx
            });
        };

        let failFn = (msg)=>{
            message.error(msg);
        };

        this.props.fetchPromotionDetail({
            data: {
                promotionID: _record.promotionIDStr,
                _groupID: this.props.user.accountInfo.groupID,
            },
            success: successFn,
            fail: failFn
        });
    }

    // Row Actions: 查看
    checkDetailInfo(){
        this.setState({
            visible: true
        });
        let _record = arguments[1];

        let failFn = (msg)=>{
            message.error(msg);
        };

        this.props.fetchPromotionDetail({
            data: {
                promotionID: _record.promotionIDStr,//promotionID 会自动转换int类型,出现数据溢出,新加字符串类型的promotionIDStr替换
                _groupID: this.props.user.accountInfo.groupID
            },
            fail:failFn
        });

    }

    /**
     * Render promotion update Modal
     * wrapped normally.
     * @param {Bool} isNew A bool value identify the current operation is update or create.
     */

    renderContentOfThisModal(){
        let promotionDetailInfo = this.props.myActivities.get("$promotionDetailInfo").toJS();
        let handleUpdateOpe = this.handleUpdateOpe;
        let _state = this.state;
        if(promotionDetailInfo.status === 'start' || promotionDetailInfo.status === 'pending') {
            return (
                <div className={styles.spinFather}>
                    <Spin size="large" />
                </div>
            )
        }
        if(promotionDetailInfo.status === 'timeout'|| promotionDetailInfo.status === 'fail'){
            return (
                <div className={styles.spinFather}>
                    查询详情出错!点击 <a onClick={handleUpdateOpe}>重试</a>
                </div>
            );
        }

        if (promotionDetailInfo.status === 'success') {
            return (<ActivityMain
                isNew={_state.isNew}
                index={_state.index}
                steps={_state.steps}
                callbackthree={(arg) => {
                    if(arg == 3){
                        this.handleDismissUpdateModal();
                    }
                }}
            />);
        }
    }

    renderModifyRecordInfoModal(){
        // TODO: remove the const 0, fixed with corresponding promotionType

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
                    this.props.saleCenterResetBasicInfo();
                    this.props.saleCenterResetScopeInfo();
                    this.props.saleCenterResetDetailInfo();
                    this.props.cancelFetchPromotionDetail();
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

    renderModals(){
        let promotionDetailInfo = this.props.myActivities.get("$promotionDetailInfo").toJS();
        let checkDetailInfo = this.checkDetailInfo;
        function renderContentOfTheModal(cancelFetchPromotionDetail){
            if(promotionDetailInfo.status === 'start' || promotionDetailInfo.status === 'pending') {
                return (
                    <div className={styles.spinFather}>
                        <Spin size="large" />
                    </div>)
            }
            if(promotionDetailInfo.status === 'timeout'|| promotionDetailInfo.status === 'fail'){
                return (
                    <div className={styles.spinFather}>
                        查询详情出错!点击 <a onClick={checkDetailInfo}>重试</a>
                    </div>
                );
            }
            if (promotionDetailInfo.status === 'success') {
                return (<PromotionDetail record={promotionDetailInfo.data.promotionInfo}/>);
            }
        }
        return (
            <Modal
                title="活动详情"
                visible={this.state.visible}
                footer={<Button onClick = {this.handleClose}>关闭</Button>}
                closable={false}
            >
                {
                    this.state.visible?
                        renderContentOfTheModal(this.props.cancelFetchPromotionDetail)
                        :null
                }
            </Modal>
        );
    }

    renderHeader(){
        return (
            <div className="layoutsTool">
                <div className="layoutsToolLeft">
                    <h1>基础营销信息</h1>
                </div>
            </div>
        );
    }

    renderShopsInTreeSelectMode(){

        const treeData = Immutable.List.isList(this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData']))?
            this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData']).toJS():
            this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData']);

        let tProps = this.state.selectedShop != null?
        {
            treeData,
            value: this.state.selectedShop,
            onChange: (value)=>this.onTreeSelect(value,treeData),
            placeholder:'请选择店铺',
            allowClear: true
        }:{
            treeData,
            value: undefined,
            onChange: (value)=>this.onTreeSelect(value,treeData),
            placeholder:'请选择店铺',
            allowClear: true
        };
        return (
            <TreeSelect {...tProps}  style={{ width: 150 }} dropdownStyle={{minWidth:150}} dropdownMatchSelectWidth={false}/>
        );
    }

    renderFilterBar(){
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
                                style={{ width: '160px' }}
                                showSearch
                                placeholder="请选择类型"
                                defaultValue="全部"
                                onChange={(value) => {
                                    this.setState({
                                        promotionType: value === "ALL" ? null : value
                                    });
                                }}
                            >
                                {
                                    [{
                                        value: "ALL",
                                        title: '全部'
                                    }, ...ACTIVITY_CATEGORIES].map((activity, index)=>{
                                        return (
                                            <Option value={`${activity.key}`} key={`${index}`}>{activity.title}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>

                        <li>
                            <h5>使用状态</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: '160px' }}
                                defaultValue="0"
                                placeholder="请选择使用状态"
                                onChange={(value) => {
                                    this.setState({
                                        promotionState: value
                                    });
                                }}
                            >
                                <Option value={TRIPLE_STATE.ALL}>全部</Option>
                                <Option value={TRIPLE_STATE.OPTION1}>启用</Option>
                                <Option value={TRIPLE_STATE.OPTION2}>禁用</Option>
                            </Select>
                        </li>

                        <li>
                            <h5>适用店铺</h5>
                        </li>
                        <li>
                            {this.renderShopsInTreeSelectMode()}
                        </li>

                        <li>
                            <Button  type="primary" onClick={this.handleQuery}><Icon type="search" />查询</Button>
                        </li>
                        <li>
                            <a onClick={this.toggleExpandState}>高级查询 {this.state.expand ?<Icon type="caret-up" />:<Icon type="caret-down" />}</a>
                        </li>

                    </ul>
                </div>
                {this.renderAdvancedFilter()}
            </div>

        );
    }

    renderAdvancedFilter(){

        let categories = [], tags=[], brands = [];
        let $categories = this.props.promotionBasicInfo.getIn(['$categoryList', 'data']);
        if (Immutable.List.isList($categories)) {
            categories = $categories.toJS();
        }

        let $tags = this.props.promotionBasicInfo.getIn(['$tagList', 'data']);
        if (Immutable.List.isList($tags)){
            tags = $tags.toJS();
        }

        let $brands = this.props.promotionScopeInfo.getIn(["refs", "data", "brands"]);
        if (Immutable.List.isList($brands)) {
            brands = $brands.toJS();
        }
        // let categories = this.props.promotionBasicInfo.getIn(['$categoryList', 'data']).toJS(),
        //     tags = this.props.promotionBasicInfo.getIn(['$tagList', 'data']).toJS(),
        //     brands = this.props.promotionScopeInfo.getIn(["refs", "data", "brands"]).toJS();

        if (this.state.expand) {
            return (
                <div className="layoutsSeniorQuery">
                    <ul>
                        <li>
                            <h5>有效状态</h5>
                        </li>
                        <li>
                            <Select
                                placeholder="请选择有效状态"
                                defaultValue={'0'}
                                style={{ width: 100 }}
                                onChange={(value)=>{
                                    this.setState({
                                        promotionValid: value
                                    });
                                }}
                            >

                                <Option key="0" value={'0'}>全部</Option>
                                <Option key="1" value={'1'}>未开始</Option>
                                <Option key="2" value={'2'}>执行中</Option>
                                <Option key="3" value={'3'}>已结束</Option>
                            </Select>
                        </li>

                        <li>
                            <h5>统计类别</h5>
                        </li>
                        <li>
                            <Select
                                placeholder="请选择统计类别"
                                onChange={(value)=>{
                                    this.setState({
                                        promotionCategory: value
                                    });
                                }}
                                allowClear={true}
                                style={{ width: 120 }}
                            >
                                {
                                    categories.map((category, index)=>{
                                        return (
                                            <Option key={`${index}`} value={`${category.name}`}>{category.name}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>

                        <li>
                            <h5>标签</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 120 }}
                                allowClear={true}
                                placeholder="请选择标签"
                                onChange={(tags)=>{
                                    this.setState({
                                        promotionTags: tags
                                    });
                                }}
                            >
                                {
                                    tags.map((tag, index)=>{
                                        return (
                                            <Option key={`${index}`} value={`${tag.name}`}>{tag.name}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>

                        <li>
                            <h5>品牌</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 100 }}
                                allowClear={true}
                                placeholder="请选择品牌"
                                onChange={(brands)=>{
                                    this.setState({
                                        promotionBrands: brands
                                    });
                                }}
                            >
                                {
                                    brands.map((brand, index)=>{
                                        return (
                                            <Option key={`${index}`} value={`${brand.brandID}`}>{brand.brandName}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>

                        <li>
                            <h5>适用业务</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 120 }}
                                onChange={(value)=>{
                                    this.setState({
                                        promotionOrder: value
                                    });
                                }}
                                allowClear={true}
                                placeholder="请选择适用业务"
                            >
                                {
                                    SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST.map((order)=>{
                                        return (
                                            <Option key={`${order.value}`} value={`${order.value}`}>{order.label}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>
                    </ul>
                </div>
            );
        } else {
            return null;
        }

    }

    renderTables(){
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                className: 'TableTxtCenter',
                width: 50,
                // fixed:'left',
                key: 'key',
                render:(text, record, index)=> {
                    return (this.state.pageNo - 1) * this.state.pageSizes + text;
                }
            },
            {
                title: '操作',
                key: 'operation',
                width: 140,
                // fixed:'left',
                render: (text, record, index) => {
                    let buttonText = (record.isActive === "ACTIVE" ? "禁用" : "启用");
                    return (<span>
                                <a href="#"
                                   onClick={()=>{
                                       this.handleDisableClickEvent(text, record, index);
                                   }}>{buttonText}</a>
                                <a href="#"
                                   onClick={()=>{
                                       this.checkDetailInfo(text, record, index);
                                   }}
                                >
                                  查看
                                </a>
                                <a href="#"
                                   onClick={()=>{
                                       this.handleUpdateOpe(text, record, index);
                                   }}>编辑</a>

                              </span>

                    );}
            },
            {
                title: '活动类型',
                dataIndex: 'promotionType',
                key: 'promotionType',
                width: 120,
                // fixed:'left',
                render: (promotionType)=>{
                    let promotion = ACTIVITY_CATEGORIES.filter((promotion)=>{
                        return promotion.key === promotionType;
                    });
                    return promotion.length ? promotion[0].title : "--";
                }
            },

            {
                title: '活动名称',
                dataIndex: 'promotionName',
                key: 'promotionName',
                width: 200,
                // fixed:'left',
                render: (promotionName) => {
                    if (promotionName === undefined || promotionName === null || promotionName === ""){
                        return "--";
                    }else {
                        return promotionName;
                    }
                }
            },
            {
                title: '活动编码',
                dataIndex: 'promotionCode',
                key: 'promotionCode',
                width: 140,
            },

            {
                title:'有效时间',
                className: 'TableTxtCenter',
                dataIndex: 'validDate',
                key: '',
                width: 200,
                render: (validDate)=>{
                    if (validDate.start === 20000101 || validDate.end === 29991231){
                        return "不限制";
                    }
                    return `${validDate.start} - ${validDate.end}`;
                }
            },

            {
                title: '有效状态',
                dataIndex: 'status',
                key: 'valid',
                width: 140,
                render: (status) => {
                    return status=='1' ? "未开始" : status=='2' ?"执行中":"已结束";
                }
            },

            {
                title: '创建人/修改人',
                dataIndex: '',
                key: 'createBy',
                width: 140,
                render: (text, record, index)=>{
                    if (record.createBy === "" && record.modifiedBy ==='') {
                        return "--";
                    }
                    return `${record.createBy}/${record.modifiedBy}`;
                }
            },

            {
                title: '创建时间/修改时间',
                dataIndex: '',
                className: 'TableTxtCenter',
                key: 'createTime',
                width: 300,
                render: (text, record, index)=>{
                    if (record.createTime == "0" && record.actionTime == '0') {
                        return "--";
                    }
                    return `${moment(new Date(parseInt(record.createTime))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionTime))).format('YYYY-MM-DD HH:mm:ss')}`;

                }
            },

            {
                title: '使用状态',
                dataIndex: 'isActive',
                className: 'TableTxtCenter',
                key: 'isActive',
                //width: 120,
                render: (isActive) => {
                    return (isActive==="ACTIVE" ? "启用" : '禁用');
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
                           total: this.state.total ? this.state.total : 0,
                           showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                           onChange:(page, pageSize)=>{
                               this.setState({
                                   pageNo : page
                               })
                               let opt = {
                                   _groupID: this.props.user.accountInfo.groupID,
                                   pageSize: pageSize,
                                   pageNo: page
                               };
                               let {
                                   promotionType,
                                   promotionDateRange,
                                   promotionValid,
                                   promotionState,
                                   promotionCategory,
                                   promotionTags,
                                   promotionBrands,
                                   promotionOrder,
                                   promotionShop
                               } = this.state;

                               if(promotionType!=''&&promotionType!='undefined'){
                                   opt.promotionType = promotionType;
                               }
                               if(promotionDateRange!=''&&promotionDateRange!=undefined){
                                   opt.startDate=promotionDateRange[0].format('YYYYMMDD');
                                   opt.endDate=promotionDateRange[1].format('YYYYMMDD');
                               }
                               if(promotionCategory!=''&&promotionCategory!=undefined){
                                   opt.categoryName = promotionCategory;
                               }
                               if(promotionBrands!=''&&promotionBrands!=undefined){
                                   opt.brandID = promotionBrands;
                               }
                               if( promotionOrder!=''&&promotionOrder!=undefined){
                                   opt.orderType = promotionOrder;
                               }
                               if(promotionShop!=''&&promotionShop!=undefined){
                                   opt.shopID = promotionShop;
                               }
                               if(promotionState!=''&&promotionState!='0'){
                                   opt.isActive = promotionState == '1'?'1':'0';
                               }
                               if(promotionValid!=''&&promotionValid!='0'){
                                   opt.status = promotionValid;
                               }
                               if(promotionTags!=''&&promotionTags!='0'){
                                   opt.tag = promotionTags;
                               }
                               opt.cb = this.showNothing;
                               this.props.query(opt);
                           }
                       }}
                />
            </Col>
        );
    }

    render(){
        return (
            <Row className="layoutsContainer" ref = {layoutsContainer => this.layoutsContainer = layoutsContainer}>
                <Col span={24} className="layoutsHeader">
                    {this.renderHeader()}
                    <div className="layoutsLine"></div>
                    {this.renderFilterBar()}
                </Col>
                <Col span={24} className="layoutsLineBlock"></Col>
                {this.renderTables()}
                {this.renderModals()}
                {this.renderModifyRecordInfoModal(0)}
            </Row>
        );
    }
}


export default MyActivities;

/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-02-09T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-10T14:57:36+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react'
import { Row, Col, Icon, Input, DatePicker, Tag, Modal, Form, Select, message, Spin, Checkbox} from 'antd';
const CheckboxGroup = Checkbox.Group;
import { connect } from 'react-redux'


import SeniorDateSetting from './SeniorDateSetting/SeniorDateSetting';//日期高级设置
import styles from '../ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import {WrappedAdvancedTimeSetting} from './AdvancedTimeSetting';
import CustomTimeRangeInput from './CustomTimeRangeInput';

var Immutable = require("immutable");
import {
    fetchPromotionCategoriesAC,
    fetchPromotionTagsAC,
    saleCenterAddPhrase,
    saleCenterSetBasicInfoAC
} from '../../../redux/actions/saleCenter/promotionBasicInfo.action';

import {
    MONTH_OPTIONS,
    WEEK_OPTIONS
} from '../../../redux/actions/saleCenter/fullCutActivity.action';


import {
    CYCLE_TYPE,
    FULL_CUT_ACTIVITY_CYCLE_TYPE
} from '../../../redux/actions/saleCenter/types';


const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;

var moment = require("moment");

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const  Option  = Select.Option;
const AddCategorys =Form.create()(class AddCategory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cateVisible:false
        };

        this.showAddCategory = this.showAddCategory.bind(this);
        this.hideAddCategory = this.hideAddCategory.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }
    showAddCategory(){
        this.setState({
            cateVisible:true
        })
    }
    hideAddCategory(){
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) return;
            this.setState({
                loading: false
            })
            let options = this.props.categoryName;
            options.push({
                value:this.state.newCategory,
            });
            this.props.addPhrase({
                data:{
                    _groupID: this.props.user.accountInfo.groupID,
                    phraseType:'CATEGORY_NAME',
                    name:this.state.newCategory
                },
                success:()=>{
                    this.props.fetchPromotionCategories({
                        _groupID: this.props.user.accountInfo.groupID,
                        phraseType:'CATEGORY_NAME'
                    });
                    this.props.callback && this.props.callback(options);
                    this.setState({
                        loading: false,
                        cateVisible: false,
                    });
                    message.success('添加分类成功');

                },
                fail:()=>{
                    this.setState({
                        loading: false
                    });
                    message.error('添加分类失败');
                }
            });


        });
    }
    handleCancel(){
        this.setState({
            loading: false,
            cateVisible:false
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        };
        return(
            <div>
                <a className={styles.linkSelectorBtn} title={`新建类别`} onClick={this.showAddCategory}>新建类别</a>
                <Modal title="新建类别" visible={this.state.cateVisible}
                       onOk={this.hideAddCategory} onCancel={this.handleCancel}
                       okText="添加" cancelText="取消" confirmLoading={this.state.loading}
                       wrapClassName={styles.linkSelectorModal}>
                    {
                        this.state.cateVisible?(
                            <Form className={styles.FormStyleSmall}>
                                <FormItem label="类别名称" className={styles.FormItemStyle} {...formItemLayout}>
                                    {getFieldDecorator('addName', {
                                        rules: [{
                                            whitespace:true,
                                            required:true,
                                            message: '汉字、字母、数字组成，不多于50个字符',
                                            pattern:/^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                                        }],
                                        onChange:(e)=>{
                                            this.setState({
                                                newCategory:e.target.value
                                            })
                                        }
                                    })(
                                        <Input placeholder="请输入类别名称"/>
                                    )}
                                </FormItem>
                            </Form>
                        ):null
                    }

                </Modal>
            </div>
        )
    }
});

class PromotionBasicInfo extends React.Component{
    constructor(props){
        super(props);
        this.basicForm1 = null;
        this.state={
            cateVisible:false,
            dayNum:'',
            data:{},
            error:false,
            expand: false,
            seniorDateSetting: null,

            excludeDateArray: Immutable.fromJS([]),

            validCycleType: FULL_CUT_ACTIVITY_CYCLE_TYPE.EVERYDAY,
            selectWeekValue: ['1'],     //
            dateRange: Array(2),
            selectMonthValue: ['1'],


            // redux data
            category: undefined,
            name: undefined,
            showName: undefined,
            code: undefined,
            tags: undefined,


            // advanced time setting
            timeRangeInfo: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: undefined,
                    end: undefined
                }
            ],
            maxCount: 3
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderExcludedDatePicker = this.renderExcludedDatePicker.bind(this);
        this.onDateWeekChange = this.onDateWeekChange.bind(this);
        this.onDateMonthChange = this.onDateMonthChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleShowNameChange = this.handleShowNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);

        this.handleTimeRangeInfo = this.handleTimeRangeInfo.bind(this);
        this.renderTimeSlot = this.renderTimeSlot.bind(this);
        this.deleteTimeRange = this.deleteTimeRange.bind(this);
        this.addTimeRange = this.addTimeRange.bind(this);
        this.getDateCount = this.getDateCount.bind(this);
        this.renderCategorys = this.renderCategorys.bind(this);
        this.rendertags = this.rendertags.bind(this);

    }

    handleSubmit(){
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                nextFlag = false;
            }

            if(this.state.error==true){
                nextFlag = false;
            }
        });
        if(nextFlag){
            // save state to redux
            this.props.saleCenterSetBasicInfo({
                startDate: this.state.dateRange[0],
                endDate: this.state.dateRange[1],
                category: this.state.category,
                name: this.state.name,
                code: this.state.code,
                description: this.state.description,
                showName: this.state.showName,
                tags: this.state.tags,
                validCycleType: this.state.validCycleType,
                timeRangeInfo :this.state.timeRangeInfo,
                selectMonthValue: this.state.selectMonthValue,
                selectWeekValue: this.state.selectWeekValue,
                excludeDateArray: this.state.excludeDateArray
            });
        }
        return nextFlag;
    }

    setSeniorDateSetting(value){
        this.setState({
            seniorDateSetting: value
        })
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined
        });
        const {promotionBasicInfo, fetchPromotionCategories, fetchPromotionTags} = this.props;

        promotionBasicInfo.getIn(["$categoryList", "initialized"]) ||
        fetchPromotionCategories({
            _groupID: this.props.user.accountInfo.groupID,
            phraseType:'CATEGORY_NAME'
        });

        promotionBasicInfo.getIn(["$tagList", "initialized"]) ||
        fetchPromotionTags({
            _groupID: this.props.user.accountInfo.groupID,
            phraseType:'TAG_NAME'
        });

        if(promotionBasicInfo.getIn(["$categoryList", "initialized"])){
            this.setState({
                categoryName: promotionBasicInfo.getIn(["$categoryList","data"])
                    .map((category) => {
                        return {
                            value: category.get("name")
                        }
                    })
                    .toJS(),
            })
        }
        if(promotionBasicInfo.getIn(["$tagList", "initialized"])){
            this.setState({
                tagName: promotionBasicInfo.getIn(["$tagList","data"])
                    .map((tags) => {
                        return {
                            value: tags.get("name")
                        }
                    })
                    .toJS(),
            })
        }
        let expand = promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo']).toJS()[0].start != undefined?true:false;
        // restore date from redux to component state
        this.setState({
            name: promotionBasicInfo.getIn(['$basicInfo', 'name']),
            category: promotionBasicInfo.getIn(['$basicInfo', 'category']),
            showName: promotionBasicInfo.getIn(['$basicInfo', 'showName']),
            code: promotionBasicInfo.getIn(['$basicInfo', 'code']),
            tags: Immutable.List.isList(promotionBasicInfo.getIn(['$basicInfo', 'tags']))?promotionBasicInfo.getIn(['$basicInfo', 'tags']).toJS() :[],
            description: promotionBasicInfo.getIn(['$basicInfo', 'description']),
            dateRange: [promotionBasicInfo.getIn(['$basicInfo', 'startDate']), promotionBasicInfo.getIn(['$basicInfo', 'endDate'])],
            validCycleType: promotionBasicInfo.getIn(['$basicInfo', 'validCycleType']),
            timeRangeInfo :Immutable.List.isList(promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo']))?promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo']).toJS():[{
                validationStatus: 'success',
                helpMsg: null,
                start: undefined,
                end: undefined
            }],
            selectMonthValue: Immutable.List.isList(promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue']))?promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue']).toJS():[],
            selectWeekValue: Immutable.List.isList(promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue']))?promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue']).toJS():['1'],
            excludeDateArray: promotionBasicInfo.getIn(['$basicInfo', 'excludeDateArray']),
            expand:expand
        })

    };


    componentWillReceiveProps(nextProps) {
        // 是否更新
        if(this.props.promotionBasicInfo.getIn(['$basicInfo']) !== nextProps.promotionBasicInfo.getIn(['$basicInfo'])){

            let _promotionBasicInfo = nextProps.promotionBasicInfo;
            let expand = _promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo']).toJS()[0].start != undefined?true:false;
            this.setState({
                name: _promotionBasicInfo.getIn(['$basicInfo', 'name']),
                category: _promotionBasicInfo.getIn(['$basicInfo', 'category']),
                showName: _promotionBasicInfo.getIn(['$basicInfo', 'showName']),
                code: _promotionBasicInfo.getIn(['$basicInfo', 'code']),
                tags: Immutable.List.isList(_promotionBasicInfo.getIn(['$basicInfo', 'tags']))?_promotionBasicInfo.getIn(['$basicInfo', 'tags']).toJS() :[],
                description: _promotionBasicInfo.getIn(['$basicInfo', 'description']),
                dateRange: [_promotionBasicInfo.getIn(['$basicInfo', 'startDate']), _promotionBasicInfo.getIn(['$basicInfo', 'endDate'])],
                validCycleType: _promotionBasicInfo.getIn(['$basicInfo', 'validCycleType']),
                timeRangeInfo :Immutable.List.isList(_promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo']))?_promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo']).toJS():[{
                    validationStatus: 'success',
                    helpMsg: null,
                    start: undefined,
                    end: undefined
                }],
                selectMonthValue: Immutable.List.isList(_promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue']))?
                    _promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue']).toJS():
                    _promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue']),
                selectWeekValue: Immutable.List.isList(_promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue']))?
                    _promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue']).toJS():
                    _promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue']),
                excludeDateArray: _promotionBasicInfo.getIn(['$basicInfo', 'excludeDateArray']),
                expand:expand
            })
        }
        if(nextProps.promotionBasicInfo.getIn(["$categoryList", "initialized"])){
            this.setState({
                categoryName: nextProps.promotionBasicInfo.getIn(["$categoryList","data"])
                    .map((category) => {
                        return {
                            value: category.get("name")
                        }
                    })
                    .toJS(),
            });
        }

        if (nextProps.promotionBasicInfo.getIn(["$tagList","initialized"])) {
            this.setState({
                tagName: nextProps.promotionBasicInfo.getIn(["$tagList","data"])
                    .map((tags) => {
                        return {
                            value: tags.get("name")
                        }
                    })
                    .toJS(),
            });
        };
    };

    handleCancel = () => {
        this.setState({
            cateVisible: false
        })
    };

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    renderPromotionCycleSetting(){
        let self = this;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 17},
        };
        return (
            <FormItem label="选择周期" className={styles.FormItemStyle} {...formItemLayout}>
                <Select
                    size='default'
                    placeholder="请选择周期"
                    defaultValue={this.state.validCycleType}
                    onChange={(arg) => {
                        this.setPromotionCycle(arg);
                    }}
                >
                    <Option value="0">每日</Option>
                    <Option value="1">每周</Option>
                    <Option value="2">每月</Option>
                </Select>
                <div className={styles.SeniorDateMain}>
                    {this.renderPromotionCycleDetailSetting()}
                </div>

            </FormItem>
        )
    }

    renderPromotionCycleDetailSetting(){

        if (this.state.validCycleType == '1' ) {
            return (
                <div className={styles.SeniorDateWeek}>
                    <CheckboxGroup
                        options={options}
                        defaultValue={this.state.selectWeekValue}
                        value={this.state.selectWeekValue}
                        onChange={this.onDateWeekChange}/>
                </div>
            )
        } else if (this.state.validCycleType == '2' ) {
            return (
                <div className={styles.SeniorDateMonth}>
                    <CheckboxGroup
                        options={days}
                        defaultValue={this.state.selectMonthValue}
                        onChange={this.onDateMonthChange}
                        value={this.state.selectMonthValue}/>
                </div>
            )
        } else {
            return null
        }
    }

    onDateWeekChange(value){

        this.setState({
            selectWeekValue: value
        });
    }

    onDateMonthChange(value){

        this.setState({
            selectMonthValue:value
        });
    }

    setPromotionCycle(value) {

        this.setState({
            validCycleType: value
        });
        const {onChange} = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    renderExcludedDatePicker(){
        let self = this;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 17},
        };
        return (
            <FormItem label="活动排除日期" className={styles.FormItemStyle} {...formItemLayout}>
                <DatePicker  onChange={
                    (moment, dateString)=>{
                        self.excludeDatePicker(moment, dateString);
                    }
                }/>
                {
                    self.state.excludeDateArray.size >0 ?(
                        <div className={styles.showExcludeDate}>{self.renderExcludedDate()}</div>
                    ):null
                }

            </FormItem>
        )
    }

    unselectExcludeDate(index){//删除排除日期

        this.setState({
            excludeDateArray: this.state.excludeDateArray.delete(index)
        });
        const {onChange} = this.props;
        if (onChange) {
            onChange(this.state);
        }

    }

    renderExcludedDate(){
        return this.state.excludeDateArray.map((date, index)=>{

            let callback = (e)=>{
                e.preventDefault();
                this.unselectExcludeDate(index);
            };

            return (
                <Tag key={`${index}`} closable onClose={callback}>{date.format("YYYY-MM-DD")}</Tag>
            );
        });
    }

    excludeDatePicker(date, dateString){//排除日期

        if (date === null || dateString === ""){
            return null;
        }
        if (this.state.excludeDateArray.contains(date)) {
            return null;
        } else {
            this.setState({
                excludeDateArray: this.state.excludeDateArray.push(date)
            });

            const {onChange} = this.props;
            if (onChange) {
                onChange(this.state);
            }
        }

    }

    handleTimeRangeInfo(value, index){

        let _timeRangeInfo = this.state.timeRangeInfo;
        _timeRangeInfo[index] = value;

        //
        this.setState({
            'timeRangeInfo': _timeRangeInfo
        });
    }

    renderTimeSlot(){

        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 17},
        };

        let _timeRangeInfo = this.state.timeRangeInfo.map((timeRangeInfo, index)=>{
            let _label = "活动时段";
            if (index) {
                _label = " ";
            }
            return (
                <Row key={`${index}`}>
                    <Col>
                        <FormItem
                            label={_label}
                            className={styles.FormItemStyle}
                            validateStatus={this.state.timeRangeInfo[index].validateStatus}
                            help={this.state.timeRangeInfo[index].errMsg}
                            {...formItemLayout}>
                            <CustomTimeRangeInput
                                onChange={(value)=>{
                                    let _index = index;
                                    this.handleTimeRangeInfo(value, _index);
                                }}
                                value={Object.assign({}, this.state.timeRangeInfo[index])}
                                format="HH:mm"
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        {this.renderOperationIcon(index)}
                    </Col>
                </Row>
            )
        })
        return (
            <div>
                {_timeRangeInfo}
            </div>
        )
    }

    addTimeRange(){

        let _tmp = this.state.timeRangeInfo;
        _tmp.push({
            validationStatus: 'success',
            helpMsg: null,
            start: undefined,
            end: undefined
        });

        this.setState({
            'timeRangeInfo': _tmp
        });
    }

    deleteTimeRange(index, e){

        let _tmp = this.state.timeRangeInfo;
        _tmp.splice(index, 1);

        this.setState({
            'timeRangeInfo': _tmp
        })
    }

    renderOperationIcon(index){
        let _len = this.state.timeRangeInfo.length;

        if(_len == 1 && this.state.maxCount > _len) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addTimeRange}/>
                </span>
            )
        }
        if(_len == this.state.maxCount  && index == this.state.maxCount-1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.deleteIconLeft} type="minus-circle-o" onClick={(e) => {
                        let _index = index;
                        this.deleteTimeRange(_index, e)
                    }}/>
                </span>
            )
        } else {
            if (index == _len - 1 && _len == this.state.maxCount -1) {
                return (
                    <span className={styles.iconsStyle}>
                        <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addTimeRange}/>
                        <Icon className={styles.deleteIcon} type="minus-circle-o" onClick={(e) => {
                            let _index = index;
                            this.deleteTimeRange(_index, e)
                        }}/>
                    </span>
                )
            } else {
                return null
            }
        }
    }

    handleDateChange(date, dateString){
        this.setState({
            dateRange: date
        })
    }

    getDateCount(){
        if (undefined === this.state.dateRange[0] || undefined === this.state.dateRange[1]) {
            return 0
        }

        if (null === this.state.dateRange[0] || null === this.state.dateRange[1]) {
            return 0
        }

        return this.state.dateRange[1]
                .diff(this.state.dateRange[0], 'days') + 1;

    }

    handleCategoryChange(value) {
        this.setState({
            category: value
        });
    }

    handleNameChange(e) {
        this.setState({
            name:e.target.value
        });
    }

    handleShowNameChange(e){
        this.setState({
            showName:e.target.value
        });
    }

    handleCodeChange(e){
        this.setState({
            code:e.target.value
        });
    }

    handleDescriptionChange(e){
        this.setState({
            description: e.target.value
        });
    }

    handleTagsChange(value){

        this.setState({
            tags:value
        });
        this.props.addPhrase({
            data:{
                _groupID: this.props.user.accountInfo.groupID,
                phraseType:'TAG_NAME',
                name:value[value.length-1]
            }
        });
        this.props.fetchPromotionTags({
            _groupID: this.props.user.accountInfo.groupID,
            phraseType:'TAG_NAME'
        })
    }

    renderCategorys(){
        if(this.state.categoryName === undefined){
           return(<Option value={'0'} key={'0'} disabled>数据加载中...</Option >) ;
        }else if(typeof this.state.categoryName === 'object' && this.state.categoryName.length == 0){
            return(<Option value={'0'} key={'0'} disabled>暂无数据,请新建类别</Option >) ;
        }else{
            return this.state.categoryName
                .map((category,index)=> {
                    return (<Option value={category.value} key={`${index}`}>{category.value}</Option >)
                })
        }
    }

    rendertags(){
        if(this.state.tagName === undefined){
            return(<Option value={'0'} key={'0'} disabled>数据加载中...</Option >) ;
        }else if(typeof this.state.tagName === 'object' && this.state.tagName.length == 0){
            return(<Option value={'0'} key={'0'} disabled>暂无标签,输入新建</Option >) ;
        }else{
            return this.state.tagName
                .map((tag,index)=> {
                    return (<Option value={tag.value} key={`${index}`}>{tag.value}</Option >)
                })
        }
    }

    render(){
        //TODO:编码不能重复
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 17},
        };
        const {promotionBasicInfo } = this.props;

        let tagList = {
            placeholder:'请选择活动标签',
            tags: true,
            allowClear:true,
            className:styles.linkSelectorRight,
        };
        let categoryList = {
            rules: [{required: true, message: '请选择活动类别'}],
        };

        this.state.category && (categoryList.initialValue = this.state.category);

        let dateRangeProps;

        if (this.state.dateRange[0] !== undefined && this.state.dateRange[1] !== undefined) {
            dateRangeProps = {
                className: styles.ActivityDateDayleft,
                onChange: this.handleDateChange,
                value: this.state.dateRange
            }
        } else {
            dateRangeProps = {
                className: styles.ActivityDateDayleft,
                onChange: this.handleDateChange
            }
        }
        return (

            <Form  className={styles.FormStyle}>
                <FormItem label="活动统计类别" className={styles.FormItemStyle} labelCol={{span: 4}}
                          wrapperCol={{span: 17}} style={{position:'relative'}}>
                    {
                        getFieldDecorator('categoryName', {
                            ...categoryList,
                            onChange: this.handleCategoryChange
                        })(
                            <Select placeholder='请选择活动类别' size='default'>
                                {this.renderCategorys()}
                            </Select>
                        )
                    }
                    <AddCategorys categoryName={this.state.categoryName}
                                  addPhrase={this.props.addPhrase}
                                  fetchPromotionCategories={this.props.fetchPromotionCategories}
                                  user={this.props.user}
                                  callback={(arg)=>{
                                      this.setState({
                                          categoryName:arg
                                      })
                                  }}
                    />

                </FormItem>

                <FormItem label="活动名称" className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('promotionName', {
                        rules: [{
                            whitespace:true,
                            required: true,
                            message: '汉字、字母、数字组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                        }],
                        initialValue: this.state.name,
                    })(
                        <Input placeholder="请输入活动名称"  onChange={this.handleNameChange}/>
                    )}
                </FormItem>

                <FormItem label="活动展示名称" className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('promotionShowName', {
                        rules: [{
                            whitespace:true,
                            message: '汉字、字母、数字组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                        }],
                        initialValue:this.state.showName,
                    })(
                        <Input placeholder="请输入展示名称" onChange={this.handleShowNameChange}/>
                    )}
                </FormItem>

                <FormItem label="活动编码" className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('promotionCode', {
                        rules: [{
                            whitespace:true,
                            required: true,
                            message: '字母、数字组成，不多于20个字符',
                            pattern: /^[A-Za-z0-9]{1,20}$/,
                        }],
                        initialValue:this.state.code,

                    })(
                        <Input placeholder="请输入活动编码" disabled={!this.props.isNew} onChange={this.handleCodeChange}/>
                    )}
                </FormItem>

                <FormItem label="活动标签" className={styles.FormItemStyle} {...formItemLayout}>
                    <Select {...tagList}
                            onChange={this.handleTagsChange}
                            value={this.state.tags}
                            size='default'
                    >
                        {this.rendertags()}
                    </Select>
                </FormItem>

                <FormItem label="活动起止日期" className={styles.FormItemStyle} labelCol={{span:4}}
                          wrapperCol={{span: 17}}>
                    <Row>
                        <Col span={21}>
                            <RangePicker {...dateRangeProps}/>
                        </Col>
                        <Col offset={1} span={2}>
                            <div className={styles.ActivityDateDay}>
                                {
                                    this.getDateCount() >0 &&<span>
                                    {
                                        this.getDateCount()
                                    }
                                    </span>
                                }
                                <span>天</span>
                            </div>

                        </Col>
                    </Row>
                </FormItem>

                <FormItem className={[styles.FormItemStyle,styles.formItemForMore].join(' ')} wrapperCol={{span: 17,offset:4}}>
                    <span className={styles.gTip}>更多活动日期与时间的设置请使用</span>
                    <span className={styles.gDate} onClick={this.toggle}>高级日期设置</span>
                </FormItem>

                {this.state.expand && this.renderTimeSlot()}
                {this.state.expand && this.renderPromotionCycleSetting()}
                {this.state.expand && this.renderExcludedDatePicker()}



                <FormItem label="活动说明" className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('description', {
                        rules: [{
                            message: '不多于200个字符',
                            pattern:/.{1,200}/,
                        }],
                        initialValue:this.state.description,
                    })(
                        <Input type="textarea" placeholder="请输入活动说明" onChange={this.handleDescriptionChange}/>
                    )}
                </FormItem>
            </Form>
        )
    }
}



const mapStateToProps = (state)=>{
    return {
        fullCut: state.fullCut,
        promotionBasicInfo:state.promotionBasicInfo,
        user:state.user.toJS()
    }
};

const mapDispatchToProps = (dispatch) =>{
    return {
        addPhrase:(opts)=>{
            dispatch(saleCenterAddPhrase(opts))
        },

        saleCenterSetBasicInfo : (opts) =>{
            dispatch(saleCenterSetBasicInfoAC(opts))
        },

        fetchPromotionCategories: (opts) => {
            dispatch(fetchPromotionCategoriesAC(opts));
        },

        fetchPromotionTags: (opts) => {
            dispatch(fetchPromotionTagsAC(opts));
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(PromotionBasicInfo));

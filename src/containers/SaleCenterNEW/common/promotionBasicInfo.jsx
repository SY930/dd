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
import { Row, Col, Icon, Input, DatePicker, Tag, Modal, Form, Select, message, Spin, Checkbox, Button } from 'antd';

const CheckboxGroup = Checkbox.Group;
import { connect } from 'react-redux'


import SeniorDateSetting from './SeniorDateSetting/SeniorDateSetting';// 日期高级设置
import styles from '../ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import { WrappedAdvancedTimeSetting } from './AdvancedTimeSetting';
import CustomTimeRangeInput from './CustomTimeRangeInput';

const Immutable = require('immutable');

import {
    fetchPromotionCategoriesAC,
    fetchPromotionTagsAC,
    saleCenterAddPhrase,
    saleCenterSetBasicInfoAC,
    saleCenterDeletePhrase,
    fetchFilterShops,
} from '../../../redux/actions/saleCenterNEW/promotionBasicInfo.action';

import {
    MONTH_OPTIONS,
    WEEK_OPTIONS,
} from '../../../redux/actions/saleCenterNEW/fullCutActivity.action';


import {
    CYCLE_TYPE,
    FULL_CUT_ACTIVITY_CYCLE_TYPE,
} from '../../../redux/actions/saleCenterNEW/types';


const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;

const moment = require('moment');

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const AddCategorys = Form.create()(class AddCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cateVisible: false,
        };

        this.showAddCategory = this.showAddCategory.bind(this);
        this.hideAddCategory = this.hideAddCategory.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    showAddCategory() {
        this.setState({
            cateVisible: true,
        })
    }
    hideAddCategory() {
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) return;
            this.setState({
                loading: false,
            })
            const options = this.props.categoryName || [];
            options.push({
                value: this.state.newCategory,
            });
            this.props.addPhrase({
                data: {
                    groupID: this.props.user.accountInfo.groupID,
                    shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                    phraseType: this.props.catOrtag == 'cat' ? 'CATEGORY_NAME' : 'TAG_NAME',
                    // name:this.state.newCategory,
                    nameList: [this.state.newCategory],
                },
                success: () => {
                    if (this.props.catOrtag == 'cat') {
                        this.props.fetchPromotionCategories({
                            groupID: this.props.user.accountInfo.groupID,
                            shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                            phraseType: 'CATEGORY_NAME',
                        });
                    } else {
                        this.props.fetchPromotionTags({
                            groupID: this.props.user.accountInfo.groupID,
                            shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                            phraseType: 'TAG_NAME',
                        });
                    }
                    this.props.callback && this.props.callback(options);
                    this.setState({
                        loading: false,
                        newCategory: '',
                    });
                    this.props.form.setFieldsValue({ 'addName': '' })
                    message.success('添加成功');
                },
                fail: () => {
                    this.setState({
                        loading: false,
                    });
                    message.error('添加失败');
                },
            });
        });
    }
    handleCancel() {
        this.setState({
            loading: false,
            cateVisible: false,
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        };
        const title = this.props.catOrtag == 'cat' ? '类别' : '标签'
        return (
            <div>
                <a className={styles.linkSelectorBtn} title={`管理${title}`} onClick={this.showAddCategory}>{`管理${title}`}</a>
                <Modal
                    title={`管理${title}`}
                    visible={this.state.cateVisible}
                    confirmLoading={this.state.loading}
                    onCancel={this.handleCancel}
                    wrapClassName={styles.linkSelectorModalHasTag}
                    footer={
                        [<Button key="0" style={{ display: 'none' }}></Button>,
                        <Button key="1" type="primary" onClick={this.handleCancel}>关闭</Button>]
                    }
                >
                    {
                        this.state.cateVisible ? (
                            <Form className={styles.FormStyleSmall}>
                                <FormItem label={`添加${title}`} className={styles.FormItemStyle} {...formItemLayout}>
                                    {getFieldDecorator('addName', {
                                        rules: [{
                                            whitespace: true,
                                            required: true,
                                            message: '汉字、字母、数字组成，不多于50个字符',
                                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                                        }],
                                        onChange: (e) => {
                                            this.setState({
                                                newCategory: e.target.value,
                                            })
                                        },
                                    })(
                                        <Input style={{ width: '285px', marginRight: '10px' }} placeholder={`请输入${title}名称`} />
                                        )}
                                    <Button type="default" onClick={this.hideAddCategory}>{`添加${title}`}</Button>
                                </FormItem>
                                <FormItem style={{ marginLeft: '19px' }}>
                                    <h5>删除{title}</h5>
                                    <div style={{ height: 135, overflow: 'auto', marginTop: 10, paddingRight: 14 }}>
                                        {
                                            this.props.list.map((cat) => {
                                                return (
                                                    <Tag
                                                        key={cat.itemID}
                                                        closable={true}
                                                        onClose={(e) => {
                                                            {/* console.log(cat.name); */ }
                                                            const catOrtag = this.props.catOrtag == 'cat' ? 'CATEGORY_NAME' : 'TAG_NAME'
                                                            this.props.onTagClose(catOrtag, cat.name, cat.itemID)
                                                        }}
                                                    >
                                                        {cat.name}
                                                    </Tag>
                                                )
                                            })
                                        }
                                    </div>
                                </FormItem>
                            </Form>
                        ) : null
                    }

                </Modal>
            </div>
        )
    }
});

class PromotionBasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.basicForm1 = null;
        this.state = {
            cateVisible: false,
            dayNum: '',
            data: {},
            error: false,
            expand: false,
            seniorDateSetting: null,

            excludeDateArray: Immutable.fromJS([]),

            validCycleType: FULL_CUT_ACTIVITY_CYCLE_TYPE.EVERYDAY,
            selectWeekValue: ['1'], //
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
                    end: undefined,
                },
            ],
            maxCount: 3,
            rangePickerstatus: 'success',
            hasQuery: false,
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
        this.handleDeletePhrase = this.handleDeletePhrase.bind(this);
        this.handleAutoAddTags = this.handleAutoAddTags.bind(this);
        this.handleAutoAddCat = this.handleAutoAddCat.bind(this);
    }

    handleSubmit() {
        let nextFlag = true;
        nextFlag = this.state.shopsAllSet ? false : nextFlag;
        const basicInfo = this.props.promotionBasicInfo.get('$basicInfo').toJS();
        const promotionType = basicInfo.promotionType;
        if (promotionType == 'FOOD_CUMULATION_GIVE' || promotionType == 'BILL_CUMULATION_FREE' || promotionType == 'RECOMMEND_FOOD') {
            if (this.state.dateRange[0] && this.state.dateRange[1]) {
                this.setState({ rangePickerstatus: 'success' })
            } else {
                nextFlag = false;
                this.setState({ rangePickerstatus: 'error' })
            }
        }
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                nextFlag = false;
            }

            if (this.state.error == true) {
                nextFlag = false;
            }
        });
        if (nextFlag) {
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
                timeRangeInfo: this.state.timeRangeInfo,
                selectMonthValue: this.state.selectMonthValue,
                selectWeekValue: this.state.selectWeekValue,
                excludeDateArray: this.state.excludeDateArray,
            });
        }

        const maintenanceLevel = this.props.myActivities.getIn(['$promotionDetailInfo', 'data', 'promotionInfo', 'master', 'maintenanceLevel']);
        if ((this.props.user.shopID > 0 && maintenanceLevel == 'SHOP_LEVEL') || (!this.props.user.shopID && maintenanceLevel == 'GROUP_LEVEL')) {
            // 判断分类列表是否包含已选统计分类,不包含则手动添加分类
            this.handleAutoAddCat();
            // 判断标签列表是否包含已选,不包含则手动添加
            this.handleAutoAddTags();
        }
        return nextFlag;
    }
    handleAutoAddCat() {
        const include = (this.state.categoryList || []).map((cat) => {
            return cat.name
        }).includes(this.state.category);
        if (!include && this.state.category) {
            this.props.addPhrase({
                data: {
                    groupID: this.props.user.accountInfo.groupID,
                    shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                    phraseType: 'CATEGORY_NAME',
                    nameList: [this.state.category],
                },
                success: () => {
                    this.props.fetchPromotionCategories({
                        groupID: this.props.user.accountInfo.groupID,
                        shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                        phraseType: 'CATEGORY_NAME',
                    });
                },
            })
        }
    }
    handleAutoAddTags() {
        const excludeTags = [];
        const tagNameArr = (this.state.tagList || []).map((tagObj) => {
            return tagObj.name
        });
        this.state.tags.map((tag) => {
            if (!tagNameArr.includes(tag)) {
                excludeTags.push(tag)
            }
        });
        if (excludeTags.length > 0) {
            this.props.addPhrase({
                data: {
                    groupID: this.props.user.accountInfo.groupID,
                    shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                    phraseType: 'TAG_NAME',
                    nameList: excludeTags,
                },
                success: () => {
                    this.props.fetchPromotionTags({
                        groupID: this.props.user.accountInfo.groupID,
                        shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                        phraseType: 'TAG_NAME',
                    });
                },
            })
        }
    }
    setSeniorDateSetting(value) {
        this.setState({
            seniorDateSetting: value,
        })
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const { promotionBasicInfo, fetchPromotionCategories, fetchPromotionTags } = this.props;

        fetchPromotionCategories({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
            phraseType: 'CATEGORY_NAME',
        });

        fetchPromotionTags({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
            phraseType: 'TAG_NAME',
        });

        if (promotionBasicInfo.getIn(['$categoryList', 'initialized'])) {
            this.setState({
                categoryList: promotionBasicInfo.getIn(['$categoryList', 'data']) ? promotionBasicInfo.getIn(['$categoryList', 'data']).toJS() : [],
                categoryName: promotionBasicInfo.getIn(['$categoryList', 'data']) ? promotionBasicInfo.getIn(['$categoryList', 'data'])
                    .map((category) => {
                        return {
                            value: category.get('name'),
                        }
                    })
                    .toJS() : [],
            })
        }
        if (promotionBasicInfo.getIn(['$tagList', 'initialized'])) {
            this.setState({
                tagList: promotionBasicInfo.getIn(['$tagList', 'data']) ? promotionBasicInfo.getIn(['$tagList', 'data']).toJS() : [],
                tagName: promotionBasicInfo.getIn(['$tagList', 'data']) ? promotionBasicInfo.getIn(['$tagList', 'data'])
                    .map((tags) => {
                        return {
                            value: tags.get('name'),
                        }
                    })
                    .toJS() : [],
            })
        }
        // const expand = promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo']).toJS()[0].start != undefined;
        const basicInfo = promotionBasicInfo.getIn(['$basicInfo']).toJS();
        const expand = basicInfo.timeRangeInfo[0].start != undefined || basicInfo.validCycleType != 0 || basicInfo.excludeDateArray.length > 0;
        // restore date from redux to component state
        this.setState({
            name: promotionBasicInfo.getIn(['$basicInfo', 'name']),
            category: promotionBasicInfo.getIn(['$basicInfo', 'category']),
            showName: promotionBasicInfo.getIn(['$basicInfo', 'showName']),
            code: promotionBasicInfo.getIn(['$basicInfo', 'code']),
            tags: Immutable.List.isList(promotionBasicInfo.getIn(['$basicInfo', 'tags'])) ? promotionBasicInfo.getIn(['$basicInfo', 'tags']).toJS() : [],
            description: promotionBasicInfo.getIn(['$basicInfo', 'description']),
            dateRange: [promotionBasicInfo.getIn(['$basicInfo', 'startDate']), promotionBasicInfo.getIn(['$basicInfo', 'endDate'])],
            validCycleType: promotionBasicInfo.getIn(['$basicInfo', 'validCycleType']),
            timeRangeInfo: Immutable.List.isList(promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo'])) ? promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo']).toJS() : [{
                validationStatus: 'success',
                helpMsg: null,
                start: undefined,
                end: undefined,
            }],
            selectMonthValue: Immutable.List.isList(promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue'])) ? promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue']).toJS() : [],
            selectWeekValue: Immutable.List.isList(promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue'])) ? promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue']).toJS() : ['1'],
            excludeDateArray: promotionBasicInfo.getIn(['$basicInfo', 'excludeDateArray']),
            expand,
        })
    }


    componentWillReceiveProps(nextProps) {
        // 是否更新
        if (this.props.promotionBasicInfo.getIn(['$basicInfo']) !== nextProps.promotionBasicInfo.getIn(['$basicInfo'])) {
            const _promotionBasicInfo = nextProps.promotionBasicInfo;
            const basicInfo = _promotionBasicInfo.getIn(['$basicInfo']).toJS();
            const expand = basicInfo.timeRangeInfo[0].start != undefined || basicInfo.validCycleType != 0 || basicInfo.excludeDateArray.length > 0;
            this.setState({
                name: _promotionBasicInfo.getIn(['$basicInfo', 'name']),
                category: _promotionBasicInfo.getIn(['$basicInfo', 'category']),
                showName: _promotionBasicInfo.getIn(['$basicInfo', 'showName']),
                code: _promotionBasicInfo.getIn(['$basicInfo', 'code']),
                tags: Immutable.List.isList(_promotionBasicInfo.getIn(['$basicInfo', 'tags'])) ? _promotionBasicInfo.getIn(['$basicInfo', 'tags']).toJS() : [],
                description: _promotionBasicInfo.getIn(['$basicInfo', 'description']),
                dateRange: [_promotionBasicInfo.getIn(['$basicInfo', 'startDate']), _promotionBasicInfo.getIn(['$basicInfo', 'endDate'])],
                validCycleType: _promotionBasicInfo.getIn(['$basicInfo', 'validCycleType']),
                timeRangeInfo: Immutable.List.isList(_promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo'])) ? _promotionBasicInfo.getIn(['$basicInfo', 'timeRangeInfo']).toJS() : [{
                    validationStatus: 'success',
                    helpMsg: null,
                    start: undefined,
                    end: undefined,
                }],
                selectMonthValue: Immutable.List.isList(_promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue'])) ?
                    _promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue']).toJS() :
                    _promotionBasicInfo.getIn(['$basicInfo', 'selectMonthValue']),
                selectWeekValue: Immutable.List.isList(_promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue'])) ?
                    _promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue']).toJS() :
                    _promotionBasicInfo.getIn(['$basicInfo', 'selectWeekValue']),
                excludeDateArray: _promotionBasicInfo.getIn(['$basicInfo', 'excludeDateArray']),
                expand,
            })
        }
        if (nextProps.promotionBasicInfo.getIn(['$categoryList', 'initialized'])) {
            this.setState({
                categoryList: nextProps.promotionBasicInfo.getIn(['$categoryList', 'data']) ? nextProps.promotionBasicInfo.getIn(['$categoryList', 'data']).toJS() : [],
                categoryName: nextProps.promotionBasicInfo.getIn(['$categoryList', 'data']) ? nextProps.promotionBasicInfo.getIn(['$categoryList', 'data'])
                    .map((category) => {
                        return {
                            value: category.get('name'),
                        }
                    })
                    .toJS() : [],
            });
        }
        if (nextProps.promotionBasicInfo.getIn(['$tagList', 'initialized'])) {
            this.setState({
                tagList: nextProps.promotionBasicInfo.getIn(['$tagList', 'data']) ? nextProps.promotionBasicInfo.getIn(['$tagList', 'data']).toJS() : [],
                tagName: nextProps.promotionBasicInfo.getIn(['$tagList', 'data']) ? nextProps.promotionBasicInfo.getIn(['$tagList', 'data'])
                    .map((tags) => {
                        return {
                            value: tags.get('name'),
                        }
                    })
                    .toJS() : [],
            });
        }
        const promotionType = nextProps.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        if (promotionType == 'RECOMMEND_FOOD' && nextProps.promotionBasicInfo.getIn(['$basicInfo', 'promotionID']) && !this.state.hasQuery) {
            const opts = {
                data: {
                    groupID: this.props.user.accountInfo.groupID,
                    promotionType,
                    startDate: this.state.dateRange[0].format('YYYYMMDD'),
                    endDate: this.state.dateRange[1].format('YYYYMMDD'),
                },
                fail: (val) => { message.error(val) },
            }
            opts.data.promotionID = nextProps.promotionBasicInfo.getIn(['$basicInfo', 'promotionID'])
            this.setState({ hasQuery: true }, () => {
                this.props.fetchFilterShops(opts);
            })
        }
        if (undefined !== nextProps.promotionBasicInfo.getIn(['shopsAllSet'])) {
            if (nextProps.promotionBasicInfo.getIn(['shopsAllSet'])) {
                this.setState({ rangePickerstatus: 'error', shopsAllSet: true })
            } else {
                this.setState({ rangePickerstatus: 'success', shopsAllSet: false })
            }
        }
    }

    handleCancel = () => {
        this.setState({
            cateVisible: false,
        })
    };

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    renderPromotionCycleSetting() {
        const self = this;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        return (
            <FormItem label="选择周期" className={styles.FormItemStyle} {...formItemLayout}>
                <Select
                    size="default"
                    placeholder="请选择周期"
                    className={`promotionBasicInfoMountClassJs`}
                    getPopupContainer={() => document.querySelector('.promotionBasicInfoMountClassJs')}
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

    renderPromotionCycleDetailSetting() {
        if (this.state.validCycleType == '1') {
            return (
                <div className={styles.SeniorDateWeek}>
                    <CheckboxGroup
                        options={options}
                        defaultValue={this.state.selectWeekValue}
                        value={this.state.selectWeekValue}
                        onChange={this.onDateWeekChange}
                    />
                </div>
            )
        } else if (this.state.validCycleType == '2') {
            return (
                <div className={styles.SeniorDateMonth}>
                    <CheckboxGroup
                        options={days}
                        defaultValue={this.state.selectMonthValue}
                        onChange={this.onDateMonthChange}
                        value={this.state.selectMonthValue}
                    />
                </div>
            )
        }
        return null
    }

    onDateWeekChange(value) {
        this.setState({
            selectWeekValue: value,
        });
    }

    onDateMonthChange(value) {
        this.setState({
            selectMonthValue: value,
        });
    }

    setPromotionCycle(value) {
        this.setState({
            validCycleType: value,
        });
        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    renderExcludedDatePicker() {
        const self = this;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        return (
            <FormItem label="活动排除日期" className={styles.FormItemStyle} {...formItemLayout}>
                <DatePicker onChange={
                    (moment, dateString) => {
                        self.excludeDatePicker(moment, dateString);
                    }
                }
                />
                {
                    self.state.excludeDateArray.size > 0 ? (
                        <div className={styles.showExcludeDate}>{self.renderExcludedDate()}</div>
                    ) : null
                }

            </FormItem>
        )
    }

    unselectExcludeDate(index) { // 删除排除日期
        this.setState({
            excludeDateArray: this.state.excludeDateArray.delete(index),
        });
        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    renderExcludedDate() {
        return this.state.excludeDateArray.map((date, index) => {
            const callback = (e) => {
                e.preventDefault();
                this.unselectExcludeDate(index);
            };

            return (
                <Tag key={`${index}`} closable={true} onClose={callback}>{date.format('YYYY-MM-DD')}</Tag>
            );
        });
    }

    excludeDatePicker(date, dateString) { // 排除日期
        if (date === null || dateString === '') {
            return null;
        }
        if (this.state.excludeDateArray.contains(date)) {
            return null;
        }
        this.setState({
            excludeDateArray: this.state.excludeDateArray.push(date),
        });

        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    handleTimeRangeInfo(value, index) {
        const _timeRangeInfo = this.state.timeRangeInfo;
        _timeRangeInfo[index] = value;

        //
        this.setState({
            'timeRangeInfo': _timeRangeInfo,
        });
    }

    renderTimeSlot() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };

        const _timeRangeInfo = this.state.timeRangeInfo.map((timeRangeInfo, index) => {
            let _label = '活动时段';
            if (index) {
                _label = ' ';
            }
            return (
                <Row key={`${index}`}>
                    <Col>
                        <FormItem
                            label={_label}
                            className={styles.FormItemStyle}
                            validateStatus={this.state.timeRangeInfo[index].validateStatus}
                            help={this.state.timeRangeInfo[index].errMsg}
                            {...formItemLayout}
                        >
                            <CustomTimeRangeInput
                                onChange={(value) => {
                                    const _index = index;
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

    addTimeRange() {
        const _tmp = this.state.timeRangeInfo;
        _tmp.push({
            validationStatus: 'success',
            helpMsg: null,
            start: undefined,
            end: undefined,
        });

        this.setState({
            'timeRangeInfo': _tmp,
        });
    }

    deleteTimeRange(index, e) {
        const _tmp = this.state.timeRangeInfo;
        _tmp.splice(index, 1);

        this.setState({
            'timeRangeInfo': _tmp,
        })
    }

    renderOperationIcon(index) {
        const _len = this.state.timeRangeInfo.length;

        if (_len == 1 && this.state.maxCount > _len) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addTimeRange} />
                </span>
            )
        }
        if (_len == this.state.maxCount && index == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon
                        className={styles.deleteIconLeft}
                        type="minus-circle-o"
                        onClick={(e) => {
                            const _index = index;
                            this.deleteTimeRange(_index, e)
                        }}
                    />
                </span>
            )
        }
        if (index == _len - 1 && _len == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addTimeRange} />
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        onClick={(e) => {
                            const _index = index;
                            this.deleteTimeRange(_index, e)
                        }}
                    />
                </span>
            )
        }
        return null
    }

    handleDateChange(date, dateString) {
        this.setState({
            dateRange: date,
        }, () => {
            const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
            if (promotionType == 'FOOD_CUMULATION_GIVE' || promotionType == 'BILL_CUMULATION_FREE' || promotionType == 'RECOMMEND_FOOD') {
                if (this.state.dateRange[0] && this.state.dateRange[1]) {
                    this.setState({ rangePickerstatus: 'success' })
                } else {
                    this.setState({ rangePickerstatus: 'error' })
                }
            }
            if (promotionType == 'RECOMMEND_FOOD' && this.state.dateRange[0] && this.state.dateRange[1]) {
                const opts = {
                    data: {
                        groupID: this.props.user.accountInfo.groupID,
                        promotionType,
                        startDate: this.state.dateRange[0].format('YYYYMMDD'),
                        endDate: this.state.dateRange[1].format('YYYYMMDD'),
                    },
                    fail: (val) => { message.error(val) },
                }
                if (this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionID'])) {
                    opts.data.promotionID = this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionID'])
                }
                this.props.fetchFilterShops(opts)
            }
        })
    }

    getDateCount() {
        if (undefined === this.state.dateRange[0] || undefined === this.state.dateRange[1]) {
            return 0
        }

        if (this.state.dateRange[0] === null || this.state.dateRange[1] === null) {
            return 0
        }

        return this.state.dateRange[1]
            .diff(this.state.dateRange[0], 'days') + 1;
    }

    handleCategoryChange(value) {
        this.setState({
            category: value,
        });
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value,
        });
    }

    handleShowNameChange(e) {
        this.setState({
            showName: e.target.value,
        });
    }

    handleCodeChange(e) {
        this.setState({
            code: e.target.value,
        });
    }

    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value,
        });
    }

    handleTagsChange(value) {
        const _value = value.map((val, index) => {
            return val.replace(/[^\u4E00-\u9FA5A-Za-z0-9\s\.]/g, '');
        })
        this.setState({
            tags: _value,
        }, () => { this.handleAutoAddTags() });
    }

    renderCategorys() {
        if (this.state.categoryName === undefined) {
            return (<Option value={'0'} key={'0'} disabled={true}>数据加载中...</Option >);
        } else if (typeof this.state.categoryName === 'object' && this.state.categoryName.length == 0) {
            return (<Option value={'0'} key={'0'} disabled={true}>暂无数据,请新建类别</Option >);
        }
        return this.state.categoryName
            .map((category, index) => {
                return (
                    <Option value={category.value} key={`${index}`}>{category.value}</Option >
                )
            })
    }

    rendertags() {
        if (this.state.tagName === undefined) {
            return (<Option value={'0'} key={'0'} disabled={true}>数据加载中...</Option >);
        } else if (typeof this.state.tagName === 'object' && this.state.tagName.length == 0) {
            return (<Option value={'0'} key={'0'} disabled={true}>暂无标签,输入新建</Option >);
        }
        return this.state.tagName
            .map((tag, index) => {
                return (<Option value={tag.value} key={`${index}`}>{tag.value}</Option >)
            })
    }
    handleDeletePhrase(phraseType, name, itemID) {
        this.props.deletePhrase({
            data: {
                groupID: this.props.user.accountInfo.groupID,
                shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                phraseType,
                name,
                itemID,
            },
            success: () => {
                const type = phraseType == 'CATEGORY_NAME' ? 'fetchPromotionCategories' : 'fetchPromotionTags';
                this.props[type]({
                    groupID: this.props.user.accountInfo.groupID,
                    shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                    phraseType,
                });
                message.success('删除成功');
            },
        });
        if (phraseType == 'CATEGORY_NAME' && this.state.category == name) {
            // 手动删除已选添加类别（而不是加载时），清空已选类别
            this.setState({ category: '' })
        }
        if (phraseType == 'TAG_NAME' && this.state.tags.includes(name)) {
            // 手动删除已选添加标签（而不是加载时），清空已选
            const set = new Set(this.state.tags);
            set.delete(name)
            this.setState({ tags: Array.from(set) })
        }
    }

    render() {
        // TODO:编码不能重复
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        const { promotionBasicInfo } = this.props;

        const tagList = {
            placeholder: '请选择活动标签',
            tags: true,
            allowClear: true,
            className: styles.linkSelectorRight,
        };
        let dateRangeProps;

        if (this.state.dateRange[0] !== undefined && this.state.dateRange[1] !== undefined) {
            dateRangeProps = {
                className: styles.ActivityDateDayleft,
                onChange: this.handleDateChange,
                value: this.state.dateRange,
            }
        } else {
            dateRangeProps = {
                className: styles.ActivityDateDayleft,
                onChange: this.handleDateChange,
            }
        }
        const disabledDate = (current) => {
            const cur = current.format('YYYYMMDD');
            const now = moment(new Date()).format('YYYYMMDD');
            return current && cur < now;
        };
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        return (

            <Form className={styles.FormStyle}>
                <FormItem
                    label="活动统计类别"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{ position: 'relative' }}
                >
                    <Select
                        showSearch={true}
                        placeholder="请选择活动类别"
                        className={`promotionBasicInfoMountClassJs`}
                        getPopupContainer={() => document.querySelector('.promotionBasicInfoMountClassJs')}
                        size="default"
                        value={this.state.category}
                        onChange={this.handleCategoryChange}
                    >
                        {this.renderCategorys()}
                    </Select>
                    <AddCategorys
                        catOrtag={'cat'}
                        categoryName={this.state.categoryName}
                        addPhrase={this.props.addPhrase}
                        fetchPromotionCategories={this.props.fetchPromotionCategories}
                        user={this.props.user}
                        callback={(arg) => {
                            this.setState({
                                categoryName: arg,
                            })
                        }}
                        list={this.state.categoryList || []}
                        onTagClose={this.handleDeletePhrase}
                    />
                </FormItem>

                <FormItem label="活动名称" className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('promotionName', {
                        rules: [{
                            // whitespace: true,
                            required: true,
                            message: '汉字、字母、数字、（）、- 组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\（\）\(\)\-\-]{1,50}$/,
                        }],
                        initialValue: this.state.name,
                    })(
                        <Input placeholder="请输入活动名称" onChange={this.handleNameChange} />
                        )}
                </FormItem>

                <FormItem label="活动展示名称" className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('promotionShowName', {
                        rules: [{
                            whitespace: true,
                            message: '汉字、字母、数字组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                        }],
                        initialValue: this.state.showName,
                    })(
                        <Input placeholder="请输入展示名称" onChange={this.handleShowNameChange} />
                        )}
                </FormItem>

                <FormItem label="活动编码" className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('promotionCode', {
                        rules: [{
                            whitespace: true,
                            required: true,
                            message: '字母、数字组成，不多于20个字符',
                            pattern: /^[A-Za-z0-9]{1,20}$/,
                        }],
                        initialValue: this.state.code,

                    })(
                        <Input placeholder="请输入活动编码" disabled={!this.props.isNew} onChange={this.handleCodeChange} />
                        )}
                </FormItem>

                <FormItem label="活动标签" className={styles.FormItemStyle} {...formItemLayout}>
                    <Select
                        {...tagList}
                        onChange={this.handleTagsChange}
                        className={`promotionBasicInfoMountClassJs`}
                        getPopupContainer={() => document.querySelector('.promotionBasicInfoMountClassJs')}
                        value={this.state.tags}
                        size="default"
                        placeholder="汉字、字母、数字组成"
                    >
                        {this.rendertags()}
                    </Select>
                    <AddCategorys
                        catOrtag={'tag'}
                        categoryName={this.state.tagName}
                        addPhrase={this.props.addPhrase}
                        fetchPromotionTags={this.props.fetchPromotionTags}
                        user={this.props.user}
                        callback={(arg) => {
                            this.setState({
                                tagName: arg,
                            })
                        }}
                        list={this.state.tagList || []}
                        onTagClose={this.handleDeletePhrase}
                    />
                </FormItem>
                <div style={{ position: 'relative' }}>
                    {
                        promotionType == 'FOOD_CUMULATION_GIVE' || promotionType == 'BILL_CUMULATION_FREE' || promotionType == 'RECOMMEND_FOOD' ?
                            <p style={{ position: 'absolute', top: '13px', left: '12px', fontSize: '18px', color: 'red' }}>*</p>
                            : null
                    }
                    <FormItem
                        label="活动起止日期"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                        validateStatus={this.state.rangePickerstatus}
                        help={this.state.rangePickerstatus == 'success' ? null : this.state.shopsAllSet ? '同时段内，店铺已被其它同类活动全部占用, 请重新选择时段' : '请选择活动起止日期'}
                    >
                        <Row>
                            <Col span={21}>
                                <RangePicker {...dateRangeProps} disabledDate={promotionType == 'FOOD_CUMULATION_GIVE' || promotionType == 'BILL_CUMULATION_FREE' || promotionType == 'RECOMMEND_FOOD' ? disabledDate : null} />
                            </Col>
                            <Col offset={1} span={2}>
                                <div className={styles.ActivityDateDay}>
                                    <span>
                                        {
                                            this.getDateCount()
                                        }
                                    </span>
                                    <span>天</span>
                                </div>

                            </Col>
                        </Row>
                    </FormItem>
                </div>
                <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }}>
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
                            pattern: /.{1,200}/,
                        }],
                        initialValue: this.state.description,
                    })(
                        <Input type="textarea" placeholder="请输入活动说明" onChange={this.handleDescriptionChange} />
                        )}
                </FormItem>
            </Form>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        // if(this.props.promotionBasicInfo === nextProps.promotionBasicInfo){
        //     return false;
        // }
        //
        // if(this.props.fullCut === nextProps.fullCut){
        //     return false;
        // }

        return true;
    }
}


const mapStateToProps = (state) => {
    return {
        fullCut: state.sale_fullCut_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        myActivities: state.sale_myActivities_NEW,
        user: state.user.toJS(),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addPhrase: (opts) => {
            dispatch(saleCenterAddPhrase(opts))
        },

        saleCenterSetBasicInfo: (opts) => {
            dispatch(saleCenterSetBasicInfoAC(opts))
        },

        fetchPromotionCategories: (opts) => {
            dispatch(fetchPromotionCategoriesAC(opts));
        },

        fetchPromotionTags: (opts) => {
            dispatch(fetchPromotionTagsAC(opts));
        },
        deletePhrase: (opts) => {
            dispatch(saleCenterDeletePhrase(opts));
        },
        fetchFilterShops: (opts) => {
            dispatch(fetchFilterShops(opts));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PromotionBasicInfo));

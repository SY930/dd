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

import styles from '../ActivityPage.less';
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
    ACTIVITY_CYCLE_TYPE,
} from '../../../redux/actions/saleCenterNEW/types';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';



const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;

const moment = require('moment');

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
@injectIntl()
export const AddCategorys = Form.create()(class AddCategory extends React.Component {
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
                    phraseType: this.props.catOrtag == 'cat' ? '0' : '1',
                    // name:this.state.newCategory,
                    nameList: [this.state.newCategory],
                },
                success: () => {
                    if (this.props.catOrtag == 'cat') {
                        this.props.fetchPromotionCategories({
                            groupID: this.props.user.accountInfo.groupID,
                            shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                            phraseType: '0',
                        });
                    } else {
                        this.props.fetchPromotionTags({
                            groupID: this.props.user.accountInfo.groupID,
                            shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                            phraseType: '1',
                        });
                    }
                    this.props.callback && this.props.callback(options);
                    this.setState({
                        loading: false,
                        newCategory: '',
                    });
                    this.props.form.setFieldsValue({ 'addName': '' })
                    message.success(SALE_LABEL.k5do0ps6);
                },
                fail: () => {
                    this.setState({
                        loading: false,
                    });
                    message.error(SALE_LABEL.k5doax7i);
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
        const { intl } = this.props;
        const k5m5axac = intl.formatMessage(SALE_STRING.k5m5axac);
        const k5nh2229 = intl.formatMessage(SALE_STRING.k5nh2229);
        const k5nh21tx = intl.formatMessage(SALE_STRING.k5nh21tx);
        const k5dlpi06 = intl.formatMessage(SALE_STRING.k5dlpi06);
        const k5m6e4vf = intl.formatMessage(SALE_STRING.k5m6e4vf);

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        };
        const title = this.props.catOrtag == 'cat' ? k5nh21tx : k5dlpi06;
        return (
            <div>
                <a className={styles.linkSelectorBtn} title={`${k5nh2229}${title}`} onClick={this.showAddCategory}>{`${k5nh2229}${title}`}</a>
                <Modal
                    title={`${k5nh2229}${title}`}
                    visible={this.state.cateVisible}
                    width={580}
                    confirmLoading={this.state.loading}
                    onCancel={this.handleCancel}
                    wrapClassName={styles.linkSelectorModalHasTag}
                    footer={
                        [<Button key="0" style={{ display: 'none' }}></Button>,
                    <Button key="1" type="primary" onClick={this.handleCancel}>{COMMON_LABEL.close}</Button>]
                    }
                >
                    {
                        this.state.cateVisible ? (
                            <Form className={styles.FormStyleSmall}>
                                <FormItem label={`${k5m6e4vf}${title}`} className={styles.FormItemStyle} {...formItemLayout}>
                                    {getFieldDecorator('addName', {
                                        rules: [{
                                            whitespace: true,
                                            required: true,
                                            message: k5m5axac,
                                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                                        }],
                                        onChange: (e) => {
                                            this.setState({
                                                newCategory: e.target.value,
                                            })
                                        },
                                    })(
                                        <Input style={{ width: '285px', marginRight: '10px' }} placeholder={`${title}`} />
                                        )}
                                    <Button type="default" onClick={this.hideAddCategory}>{`${k5m6e4vf}${title}`}</Button>
                                </FormItem>
                                <FormItem style={{ marginLeft: '19px' }}>
                                    <h5>{COMMON_LABEL.delete}{title}</h5>
                                    <div style={{ height: 135, overflow: 'auto', marginTop: 10, paddingRight: 14 }}>
                                        {
                                            this.props.list.map((cat) => {
                                                return (
                                                    <Tag
                                                        key={cat.itemID}
                                                        closable={true}
                                                        onClose={(e) => {
                                                            {/* console.log(cat.name); */ }
                                                            const catOrtag = this.props.catOrtag == 'cat' ? '0' : '1'
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

@injectIntl()
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

            validCycleType: ACTIVITY_CYCLE_TYPE.EVERYDAY,
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
        this.promotionNameInputRef = null;
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
        if (promotionType == '1080' || promotionType == '2070' || promotionType == '5010') {
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
            if (this.props.shopIDLst > 0) {
                this.props.saleCenterSetBasicInfo({shopIDLst: this.props.shopIDLst})
            }
        }


        const maintenanceLevel = this.props.myActivities.getIn(['$promotionDetailInfo', 'data', 'promotionInfo', 'master', 'maintenanceLevel']);
        if ((this.props.user.shopID > 0 && maintenanceLevel == '1') || (!this.props.user.shopID && maintenanceLevel == '0')) {
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
                    phraseType: '0',
                    nameList: [this.state.category],
                },
                success: () => {
                    this.props.fetchPromotionCategories({
                        groupID: this.props.user.accountInfo.groupID,
                        shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                        phraseType: '0',
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
                    phraseType: '1',
                    nameList: excludeTags,
                },
                success: () => {
                    this.props.fetchPromotionTags({
                        groupID: this.props.user.accountInfo.groupID,
                        shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                        phraseType: '1',
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
    onFakeDatePickerBlur = (e) => {
        if (this.fakeDatePicker) {
            let element = e.target;
            while (element.parentNode) {
                if (element === this.fakeDatePicker
                    || (element.className || '').includes('ant-calendar-picker-container')) {
                    break;
                }
                element = element.parentNode
            }
            if (!element.parentNode) {
                this.setState({ open: false })
            }
        }
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const { promotionBasicInfo, fetchPromotionCategories, fetchPromotionTags } = this.props;
        document.addEventListener('click', this.onFakeDatePickerBlur)
        fetchPromotionCategories({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
            phraseType: '0',
        });

        fetchPromotionTags({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
            phraseType: '1',
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
        // 活动名称 auto focus
        try {
            this.promotionNameInputRef.focus()
        } catch (e) {
            // oops
        }
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.onFakeDatePickerBlur)
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
        if (promotionType == '5010' && nextProps.promotionBasicInfo.getIn(['$basicInfo', 'promotionID']) && !this.state.hasQuery) {
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

    renderPromotionCycleSetting = () => {
        const { intl } = this.props;
        const k5nh22ix = intl.formatMessage(SALE_STRING.k5nh22ix);
        const k5nh22r9 = intl.formatMessage(SALE_STRING.k5nh22r9);
        const k5nh22zl = intl.formatMessage(SALE_STRING.k5nh22zl);

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        return (
            <FormItem label={SALE_LABEL.k5nh22al} className={styles.FormItemStyle} {...formItemLayout}>
                <Select
                    size="default"
                    placeholder=""
                    getPopupContainer={(node) => node.parentNode}
                    defaultValue={this.state.validCycleType}
                    onChange={(arg) => {
                        this.setPromotionCycle(arg);
                    }}
                >
                <Option value="0">{k5nh22ix}</Option>
                <Option value="1">{k5nh22r9}</Option>
                <Option value="2">{k5nh22zl}</Option>
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
            <FormItem label={SALE_LABEL.k5m5axio} className={styles.FormItemStyle} {...formItemLayout}>
                <DatePicker
                    ref={e => this.realDatePicker = e}
                    open={this.state.open}
                    style={{ visibility: 'hidden', position: 'absolute'}}
                    value={undefined}
                    onChange={
                        (moment, dateString) => {
                            this.excludeDatePicker(moment, dateString);
                            this.setState({
                                open: false,
                            })
                        }
                    }
                />
                <div
                    ref={node => this.fakeDatePicker = node}
                    onClick={() => this.setState({ open: true })}
                    className={styles.showExcludeDate}
                >
                    <Icon style={{ position: 'absolute', right: 9, top: 8 }} type="calendar" />
                    {this.renderExcludedDate()}
                </div>
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
                e.stopPropagation();
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
        // 太累了, 额外加一层 try catch 防bug 吧
        try {
            if (this.state.excludeDateArray.contains(date)) {
                return null;
            }
            if (this.state.excludeDateArray.some(item => item.format('YYYY-MM-DD') === dateString)) {
                return null;
            }
        } catch (e) {
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
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };

        const _timeRangeInfo = this.state.timeRangeInfo.map((timeRangeInfo, index) => {
            let _label = SALE_LABEL.k5m5axr0;
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
                {
                    this.props.propmotionType == '1010' && (
                        <p style={{ color: 'orange', marginLeft: 110, marginTop: '-5px' }}>
                            {SALE_LABEL.k5m5axzc}
                        </p>
                    )
                }
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
            if (promotionType == '1080' || promotionType == '2070' || promotionType == '5010') {
                if (this.state.dateRange[0] && this.state.dateRange[1]) {
                    this.setState({ rangePickerstatus: 'success' })
                } else {
                    this.setState({ rangePickerstatus: 'error' })
                }
            }
            if (promotionType == '5010' && this.state.dateRange[0] && this.state.dateRange[1]) {
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

    renderCategorys = () => {
        const { intl } = this.props;
        const k5nh23g9 = intl.formatMessage(SALE_STRING.k5nh23g9);
        const k5nh23ol = intl.formatMessage(SALE_STRING.k5nh23ol);

        if (this.state.categoryName === undefined) {
            return (<Option value={'0'} key={'0'} disabled={true}>{SALE_LABEL.k5m5ay7o}...</Option >);
        } else if (typeof this.state.categoryName === 'object' && this.state.categoryName.length == 0) {
        return (<Option value={'0'} key={'0'} disabled={true}>{k5nh23g9}</Option >);
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
            return (<Option value={'0'} key={'0'} disabled={true}>{SALE_LABEL.k5m5ay7o}...</Option >);
        } else if (typeof this.state.tagName === 'object' && this.state.tagName.length == 0) {
        return (<Option value={'0'} key={'0'} disabled={true}>{k5nh23ol}</Option >);
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
                const type = phraseType == '0' ? 'fetchPromotionCategories' : 'fetchPromotionTags';
                this.props[type]({
                    groupID: this.props.user.accountInfo.groupID,
                    shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
                    phraseType,
                });
                message.success(SALE_LABEL.k5do0ps6);
            },
        });
        if (phraseType == '0' && this.state.category == name) {
            // 手动删除已选添加类别（而不是加载时），清空已选类别
            this.setState({ category: '' })
        }
        if (phraseType == '1' && this.state.tags.includes(name)) {
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
            placeholder: '',
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

        const { intl } = this.props;
        const k5hkj1ef = intl.formatMessage(SALE_STRING.k5hkj1ef);
        const k5m5ayg0 = intl.formatMessage(SALE_STRING.k5m5ayg0);
        const k5m678if = intl.formatMessage(SALE_STRING.k5m678if);
        const k5m679wf = intl.formatMessage(SALE_STRING.k5m679wf);

        return (

            <Form className={styles.FormStyle}>
                <FormItem
                    label={SALE_LABEL.k5dljb1v}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{ position: 'relative' }}
                >
                    <Select
                        showSearch={true}
                        notFoundContent={SALE_LABEL.k5dod8s9}
                        placeholder=""
                        getPopupContainer={(node) => node.parentNode}
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

                <FormItem label={SALE_LABEL.k5dlcm1i} className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('promotionName', {
                        rules: [
                            { required: true, message: k5hkj1ef },
                            { max: 50, message: k5m5ayg0 },
                        /*    {
                            // whitespace: true,
                            required: true,
                            message: '汉字、字母、数字、（）、- 组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\（\）\(\)\-\-]{1,50}$/,
                        }*/
                        ],
                        initialValue: this.state.name,
                    })(
                        <Input
                            placeholder=""
                            onChange={this.handleNameChange}
                            ref={node => this.promotionNameInputRef = node}
                        />
                        )}
                </FormItem>

                <FormItem label={SALE_LABEL.k5krn5l9} className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('promotionShowName', {
                        rules: [{
                            whitespace: true,
                            message: k5m5ayg0,
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                        }],
                        initialValue: this.state.showName,
                    })(
                        <Input placeholder="" onChange={this.handleShowNameChange} />
                        )}
                </FormItem>

                <FormItem label={SALE_LABEL.k5dmmiar} className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('promotionCode', {
                        rules: [{
                            whitespace: true,
                            required: true,
                            message: k5m678if,
                            pattern: /^[A-Za-z0-9]{1,20}$/,
                        }],
                        initialValue: this.state.code,

                    })(
                        <Input placeholder="" disabled={!this.props.isNew} onChange={this.handleCodeChange} />
                        )}
                </FormItem>

                <FormItem label={SALE_LABEL.k5dlpi06} className={styles.FormItemStyle} {...formItemLayout}>
                    <Select
                        {...tagList}
                        onChange={this.handleTagsChange}
                        getPopupContainer={(node) => node.parentNode}
                        value={this.state.tags}
                        size="default"
                        placeholder={SALE_LABEL.k5m678qr}
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
                        promotionType == '1080' || promotionType == '2070' || promotionType == '5010' ?
                            <p style={{ position: 'absolute', top: '13px', left: '12px', fontSize: '18px', color: 'red' }}>*</p>
                            : null
                    }
                    <FormItem
                        label={SALE_LABEL.k5m6797f}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                        validateStatus={this.state.rangePickerstatus}
                        help={this.state.rangePickerstatus == 'success' ? null : this.state.shopsAllSet ? SALE_LABEL.k5m67b23 : SALE_LABEL.k5m6797f}
                    >
                        <Row>
                            <Col span={21}>
                                <RangePicker {...dateRangeProps} disabledDate={promotionType == '1080' || promotionType == '2070' || promotionType == '5010' ? disabledDate : null} />
                            </Col>
                            <Col offset={1} span={2}>
                                <div className={styles.ActivityDateDay}>
                                    <span>
                                        {
                                            this.getDateCount()
                                        }
                                    </span>
                                    <span>{SALE_LABEL.k5nh237x}</span>
                                </div>

                            </Col>
                        </Row>
                    </FormItem>
                </div>
                <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }}>
                                    <span className={styles.gTip}>{SALE_LABEL.k5m679fr}</span>
                                    <span className={styles.gDate} onClick={this.toggle}>{SALE_LABEL.k5m679o3}</span>
                </FormItem>

                {this.state.expand && this.renderTimeSlot()}
                {this.state.expand && this.renderPromotionCycleSetting()}
                {this.state.expand && this.renderExcludedDatePicker()}


                <FormItem label={SALE_LABEL.k5krn6a9} className={styles.FormItemStyle} {...formItemLayout}>
                    {getFieldDecorator('description', {
                        rules: [
                            { max: 200, message: k5m679wf },
                        ],
                        initialValue: this.state.description,
                    })(
                        <Input type="textarea" placeholder="" onChange={this.handleDescriptionChange} />
                        )}
                </FormItem>
            </Form>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        fullCut: state.sale_fullCut_NEW,
        propmotionType: state.sale_promotionBasicInfo_NEW.getIn(['$basicInfo', 'promotionType']),
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

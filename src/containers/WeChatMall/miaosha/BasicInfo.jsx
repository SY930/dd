import React from 'react'
import {
    Input,
    Form,
    Select,
    Icon,
    Button,
    DatePicker,
    message,
} from 'antd';
import { connect } from 'react-redux';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import {
    fetchPromotionTagsAC,
    saleCenterAddPhrase, saleCenterDeletePhrase
} from "../../../redux/actions/saleCenterNEW/promotionBasicInfo.action";
import {AddCategorys} from "../../SaleCenterNEW/common/promotionBasicInfo";
import {axiosData} from "../../../helpers/util";

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const moment = require('moment');

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: props.data.description,
            startTime: props.data.startTime,
            endTime: props.data.endTime,
            tags: props.data.tag ? props.data.tag.split(',') : [],
            name: props.data.name,
            loading: false,
            tipDisplay: 'none',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDeletePhrase = this.handleDeletePhrase.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.renderPromotionType = this.renderPromotionType.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const { promotionBasicInfo, fetchPromotionTags } = this.props;
        fetchPromotionTags({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID && this.props.user.shopID !== '' ? this.props.user.shopID : undefined,
            phraseType: '1',
        });

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
    }

    componentWillReceiveProps(nextProps) {
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
    }

    handleSubmit() {
        let nextFlag = true;
        if (this.props.form.getFieldError('rangePicker')) {
            return false;
        }
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                nextFlag = false;
            }
        });
        // 存到wrapper
        if (nextFlag) {
            const {description, name, tags, endTime, startTime} = this.state;
            const tag = tags.join(',');
            this.props.onChange && this.props.onChange({startTime, endTime, name, description, tag});
        }
        return nextFlag;
    }

    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value,
        });
    }

    handleDateRangeChange(value, dateString) { // value: Selected Time, dateString: Formatted Selected Time
        if (value.length > 1) {
            const startTime = value[0].format('YYYYMMDDHHmm');
            const endTime = value[1].format('YYYYMMDDHHmm');
            this.setState({
                startTime,
                endTime,
            }); // this.queryExtraEventsByTime(startTime, endTime)
        }
    }

    queryExtraEventsByTime(startTime, endTime) {
        const shopID = this.props.user.shopID;
        if (shopID == undefined || shopID === 'undefined' || !(shopID > 0)) {
            return;
        }
        this.setState({
            loading: true,
        });
        const params = {startTime, endTime, shopID, pageNo: 1, pageSize: 10};
        if (this.props.itemID) {
            params.itemID = this.props.itemID;
        }
        axiosData('/promotion/extra/extraEventService_getExtraEventsByTime.ajax', params, null, {path: 'data.page'}).then(res => {
            this.setState({
                loading: false,
            });
            if (res && res.totalSize) {
                this.props.form.setFields({
                    rangePicker: {
                        errors: [new Error('该商城在所选日期段内已有秒杀活动正在进行, 请重新选择日期')],
                    },
                })
            }
        }, err => {
            this.setState({
                loading: false,
            });
        })
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value,
        });
    }

    renderPromotionType() {
        const tip = (
            <div style={{ display: this.state.tipDisplay, height: 135, width: 470 }} className={styles.tip}>
                <p>{'同一时间一个商城的秒杀活动只能有一个，即不允许同一时间一个商城存在两个都处于启用状态的秒杀活动'}</p>
                <div>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={() => {
                                this.setState({ tipDisplay: 'none' });
                            }}
                        >我知道了
                        </Button>
                    </div>
                </div>
            </div>
        );
        return (
            <FormItem
                label={'活动类型'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <p>{'商城秒杀'}</p>
                {
                    <Icon
                        type="question-circle-o"
                        className={styles.question}
                        style={{ marginLeft: 6 }}
                        onMouseOver={() => {
                            this.setState({ tipDisplay: 'block' })
                        }}
                    />
                }
                {tip}
            </FormItem>
        )
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
                message.success('删除成功');
            },
        });
        if (phraseType == '0' && this.state.category == name) {
            // 手动删除已选添加类别（而不是加载时），清空已选类别
            this.setState({ category: '' })
        }
        if (phraseType == '1' && this.state.tags.includes(name)) {
            // 手动删除已选添加标签（而不是加载时），清空已选
            const set = new Set(this.state.tags);
            set.delete(name);
            this.setState({ tags: Array.from(set) })
        }
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

    handleTagsChange = (value) => {
        const _value = value.map((val, index) => {
            return val.replace(/[^\u4E00-\u9FA5A-Za-z0-9\s\.]/g, '');
        })
        this.setState({
            tags: _value,
        }, () => { this.handleAutoAddTags() });
    };

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

    render() {
        const { getFieldDecorator } = this.props.form;
        const tagList = {
            placeholder: '请选择活动标签',
            tags: true,
            allowClear: true,
            className: styles.linkSelectorRight,
        };
        return (
            <Form className={styles.FormStyle}>
                {this.renderPromotionType()}
                <FormItem
                    label="活动名称"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('promotionName', {
                        rules: [{
                            whitespace: true,
                            required: true,
                            message: '汉字、字母、数字组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\（\）\(\)\-\-]{1,50}$/,
                        }],
                        initialValue: this.state.name,
                    })(
                        <Input placeholder="请输入活动名称" onChange={this.handleNameChange} />
                    )}
                </FormItem>

                <FormItem
                    label="活动起止时间"
                    className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('rangePicker', {
                        rules: [{
                            required: true,
                            message: '请选择活动起止时间',
                        }],
                        onChange: this.handleDateRangeChange,
                        initialValue: this.state.startTime && this.state.endTime ? [moment(this.state.startTime, 'YYYYMMDDHHmm'), moment(this.state.endTime, 'YYYYMMDDHHmm')] : [],
                    })(
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            className={styles.ActivityDateDayleft}
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['开始时间', '结束时间']}
                        />
                    )}
                </FormItem>
                <FormItem label="活动标签"
                          className={styles.FormItemStyle}
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 17 }}
                >
                    <Select
                        {...tagList}
                        onChange={this.handleTagsChange}
                        getPopupContainer={(node) => node.parentNode}
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

                <FormItem
                    label="活动说明"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('description', {
                        rules: [
                            {
                                required: true,
                                message: '不得为空, 不多于200个字符',
                            },{
                                message: '不多于200个字符',
                                pattern: /^.{1,200}$/,
                            },
                        ],
                        initialValue: this.state.description,
                        onChange: this.handleDescriptionChange,
                    })(
                        <Input type="textarea" placeholder="请输入活动说明"/>
                    )}
                </FormItem>

            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        saleCenter: state.sale_saleCenter_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        user: state.user.toJS(),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPromotionTags: (opts) => {
            dispatch(fetchPromotionTagsAC(opts));
        },
        addPhrase: (opts) => {
            dispatch(saleCenterAddPhrase(opts))
        },
        deletePhrase: (opts) => {
            dispatch(saleCenterDeletePhrase(opts));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BasicInfo));

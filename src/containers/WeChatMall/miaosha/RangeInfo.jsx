import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
    Radio,
    Upload,
    message,
    Button,
    Row,
    Col,
    Icon,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {queryGroupMembersList} from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";
import ENV from "../../../helpers/env";
import styles1 from '../../GiftNew/GiftAdd/GiftAdd.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');
const RadioGroup = Radio.Group;

const RADIO_OPTIONS = Object.freeze([
    {
        key: '小时',
        value: '小时',
        name: '小时',
    }, {
        key: '天',
        value: '天',
        name: '天',
    },
]);

class RangeInfo extends React.Component {
    constructor(props) {
        super(props);
        const advancedAnnouncingTimeInHour = props.data.advancedAnnouncingTime;
        this.state = {
            reservationTime: props.data.reservationTime,
            bannerUrl: props.data.bannerUrl,
            advancedAnnouncingTime: advancedAnnouncingTimeInHour ? advancedAnnouncingTimeInHour >= 24 && advancedAnnouncingTimeInHour % 24 === 0 ? advancedAnnouncingTimeInHour / 24 : advancedAnnouncingTimeInHour : undefined,
            dayOrHour: '小时',
            tipDisplay: 'none',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onReservationChange = this.onReservationChange.bind(this);
        this.handleWarmUpTimeChange = this.handleWarmUpTimeChange.bind(this);
        this.handleDayOrHourChange = this.handleDayOrHourChange.bind(this);
    }

    handleSubmit() {
        console.log(this.state);
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                flag = false;
            }
        });
        if (!flag) {
            return false;
        }
        if (!this.state.bannerUrl) {
            message.warning('请上传合适的宣传图');
            flag = false;
        }
        if (flag) {
            let {bannerUrl, dayOrHour, advancedAnnouncingTime, reservationTime} = this.state;
            if (dayOrHour === '天') {
                advancedAnnouncingTime *= 24;
            }
            this.props.onChange && this.props.onChange({
                bannerUrl,
                reservationTime,
                advancedAnnouncingTime,
            })
        }
        return flag;
    }
    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
    }

    componentWillReceiveProps(nextProps) {

    }

    onReservationChange(value) {
        this.setState({reservationTime: value.number});
    }

    handleWarmUpTimeChange(value) {
        this.setState({advancedAnnouncingTime: value.number});
    }

    handleDayOrHourChange(event) {
        this.setState({
            dayOrHour: event.target.value,
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const tip = (
            <div style={{ display: this.state.tipDisplay, height: 135, width: 470 }} className={styles.tip}>
                <p>{'提交订单后商品可以预留的时间。如果超过预留时间，订单失效，对应商品回到库存。'}</p>
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
            <Form>
                <FormItem
                    label={
                        <span>
                           商品预留时间
                            <Icon
                                type="question-circle-o"
                                className={styles.question}
                                style={{ marginLeft: 6 }}
                                onMouseOver={() => {
                                    this.setState({ tipDisplay: 'block' })
                                }}
                            />
                        </span>
                    }
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {tip}
                    {getFieldDecorator('reservation', {
                        rules: [
                            {
                                required: true,
                                message: '不得为空',
                            },
                            {
                                validator: (rule, v, cb) => {
                                    Number(v && v.number ? v.number : 0) >= 3 &&  Number(v && v.number ? v.number : 0) <= 120 ? cb() : cb(rule.message);
                                },
                                message: '预留时间为3 ~ 120 分钟',
                            },
                        ],
                        initialValue: this.state.reservationTime,
                        onChange: this.onReservationChange,
                    })(
                        <PriceInput
                            addonAfter={'分钟'}
                            modal={'int'}
                            placeholder="预留时间为3 ~ 120 分钟"
                        />
                    )}
                </FormItem>
                <FormItem
                    label="首页提前宣传时长"
                    className={styles.FormItemStyle}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 17,
                    }}
                >
                    <RadioGroup
                        value={this.state.dayOrHour}
                        onChange={this.handleDayOrHourChange}
                    >
                        {RADIO_OPTIONS.map((type) => {
                            return (<Radio key={type.value} value={type.value}>{type.name}</Radio >);
                        })}
                    </RadioGroup >
                </FormItem>

                <FormItem
                    label="提前"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('advancedAnnouncingTime', {
                        rules: [{
                            required: true,
                            message: '不得为空',
                        }],
                        initialValue: this.state.advancedAnnouncingTime,
                        onChange: this.handleWarmUpTimeChange
                    })(
                        <PriceInput
                            addonAfter={`${this.state.dayOrHour}`}
                            modal={'int'}
                            placeholder={`提前宣传${this.state.dayOrHour}数`}
                        />
                    )}
                </FormItem>

                <FormItem
                    label="宣传图"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {this.renderImgUrl()}
                </FormItem>
            </Form>
        )
    }
    renderImgUrl = () => {
        const props = {
            name: 'myFile',
            showUploadList: false,
            action: '/api/common/imageUpload',
            className: styles1.avatarUploader,
            accept: 'image/*',
            beforeUpload: file => {
                const isAllowed = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isAllowed) {
                    message.error('仅支持png和jpeg/jpg格式的图片');
                }
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    message.error('图片不要大于1MB');
                }
                return isAllowed && isLt1M;
            },
            onChange: (info) => {
                const status = info.file.status;
                if (status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                    this.setState({
                        bannerUrl: `${ENV.FILE_RESOURCE_DOMAIN}/${info.file.response.url}`,
                    })
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        return (
            <Row>
                <Col>
                    <FormItem style={{ height: 200 }}>
                        <Upload {...props}>
                            {
                                this.state.bannerUrl ?
                                    <img src={this.state.bannerUrl} alt="" className={styles1.avatar} /> :
                                    <Icon type="plus" className={styles1.avatarUploaderTrigger} />
                            }
                        </Upload>
                        <p className="ant-upload-hint">点击上传图片，图片格式为jpg、png, 小于1MB</p>
                    </FormItem>
                </Col>
            </Row>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RangeInfo));

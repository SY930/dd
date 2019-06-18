import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
    Radio,
    Icon,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import SingleGoodSelector from '../../../components/common/GoodSelector'


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const RADIO_OPTIONS = Object.freeze([
    {
        value: 0,
        name: '普通拼团',
    }, {
        value: 1,
        name: '老带新拼团',
    },
]);

class SettingInfo extends React.Component {
    constructor(props) {
        super(props);
        const advancedAnnouncingTimeInHour = props.data.advancedAnnouncingTime;
        this.state = {
            activeType: props.data.activeType || 0,
            selectedGood: null,
            bannerUrl: props.data.bannerUrl,
            advancedAnnouncingTime: advancedAnnouncingTimeInHour ? advancedAnnouncingTimeInHour >= 24 && advancedAnnouncingTimeInHour % 24 === 0 ? advancedAnnouncingTimeInHour / 24 : advancedAnnouncingTimeInHour : undefined,
            dayOrHour: advancedAnnouncingTimeInHour ? advancedAnnouncingTimeInHour >= 24 && advancedAnnouncingTimeInHour % 24 === 0 ? '天' : '小时' : '小时',
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: () => true,
            finish: this.handleSubmit,
            cancel: undefined,
        });
    }

    handleSubmit = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                flag = false;
            }
        });
        if (!flag) {
            return false;
        }
        let {bannerUrl, dayOrHour, advancedAnnouncingTime, reservationTime} = this.state;
        if (dayOrHour === '天') {
            advancedAnnouncingTime *= 24;
        }
        this.props.onChange && this.props.onChange({
            bannerUrl,
            reservationTime,
            advancedAnnouncingTime,
        })
        return flag;
    }

    onReservationChange = (value) => {
        this.setState({reservationTime: value.number});
    }

    handleWarmUpTimeChange = (value) => {
        this.setState({advancedAnnouncingTime: value.number});
    }

    handleGoodChange = (good) => {
        this.setState({
            selectedGood: good,
        })
    }

    handleActiveTypeChange = (event) => {
        this.setState({
            activeType: event.target.value,
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <FormItem
                    label="拼团类型"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{span: 17 }}
                >
                    <RadioGroup
                        value={this.state.activeType}
                        onChange={this.handleActiveTypeChange}
                    >
                        {RADIO_OPTIONS.map((type) => {
                            return (<Radio key={`${type.value}`} value={type.value}>{type.name}</Radio >);
                        })}
                    </RadioGroup >
                </FormItem>
                <FormItem
                    label="选择商品"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <SingleGoodSelector
                        allDishes={this.props.goods.toJS()}
                        allCategories={this.props.goodCategories.toJS()}
                        value={this.state.selectedGood ? this.state.selectedGood.value : undefined}
                        onChange={this.handleGoodChange}
                    />
                </FormItem>
                <FormItem
                    label="提前"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('advancedAnnouncingTime', {
                        rules: [
                            {
                                required: true,
                                message: '不得为空',
                            },
                            {
                                validator: (rule, v, cb) => {
                                    Number(v && v.number ? v.number : 0) > 0 ? cb() : cb(rule.message);
                                },
                                message: '必须大于0',
                            },
                        ],
                        initialValue: this.state.reservationTime ? {number: this.state.advancedAnnouncingTime} : undefined,
                        onChange: this.handleWarmUpTimeChange
                    })(
                        <PriceInput
                            addonAfter={`${this.state.dayOrHour}`}
                            modal={'int'}
                            placeholder={`提前宣传${this.state.dayOrHour}数`}
                        />
                    )}
                </FormItem>
            </Form>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        goodCategories: state.sale_promotionDetailInfo_NEW.get('goodCategories'),
        goods: state.sale_promotionDetailInfo_NEW.get('goods'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SettingInfo));

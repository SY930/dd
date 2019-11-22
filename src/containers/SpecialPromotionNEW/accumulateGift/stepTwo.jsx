import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
    Form,
    Select,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetShopOfEventByDate } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput'; // 编辑
import { FetchCrmCardTypeLst } from '../../../redux/actions/saleCenterNEW/crmCardType.action';


const FormItem = Form.Item;
const Option = Select.Option;

const CONSUME_AMOUNT_OPTIONS = [
    {
        value: '任意消费满',
        label: '1',
    },
    {
        value: '任意消费每满',
        label: '1',
    },
    {
        value: '活动菜品消费满',
        label: '1',
    },
    {
        value: '活动菜品消费每满',
        label: '1',
    },
];
const CONSUME_TIMES_OPTIONS = [
    {
        value: '任意菜品数量满',
        label: '1',
    },
    {
        value: '任意菜品数量每满',
        label: '1',
    },
    {
        value: '活动菜品数量满',
        label: '1',
    },
    {
        value: '活动菜品数量每满',
        label: '1',
    },
];

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pointTotalNumber: props.specialPromotionInfo.getIn(['$eventInfo', 'pointTotalNumber']) || undefined,
            consumeTotalAmount: props.specialPromotionInfo.getIn(['$eventInfo', 'consumeTotalAmount']) || undefined, // 不想显示0
            consumeTotalTimes: props.specialPromotionInfo.getIn(['$eventInfo', 'consumeTotalTimes']) || undefined,
            consumeType: props.specialPromotionInfo.getIn(['$eventInfo', 'consumeTotalTimes'], 0),
        }
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.props.fetchCrmCardTypeLst({});
    }

    handleSubmit = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
        });
        if (!this.state.defaultCardType) {
            flag = false;
        }
        if (flag) {
            this.props.setSpecialBasicInfo({
                ...this.state,
            });
        }
        return flag;
    }

    handleDefaultCardTypeChange = (defaultCardType) => {
        this.setState({
            defaultCardType
        })
    }

    handlePartInTimesChange = ({ number }) => {
        this.setState({
            partInTimes: number,
        })
    }

    handlePointTotalNumberChange = ({ number }) => {
        this.setState({
            pointTotalNumber: number,
        })
    }

    render() {
        let cardTypeList = this.props.crmCardTypeNew.get('cardTypeLst');
        cardTypeList = Immutable.List.isList(cardTypeList) ? cardTypeList.toJS().filter(({regFromLimit}) => !!regFromLimit) : [];
        const userCount = this.props.specialPromotionInfo.getIn(['$eventInfo', 'userCount']);
        return (
            <Form className={styles.cardLevelTree}>
                <FormItem
                    label="新用户注册卡类"
                    optionFilterProp="children"
                    className={styles.FormItemStyle}
                    required
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        this.props.form.getFieldDecorator('defaultCardType', {
                            rules: [
                                { required: true, message: '必须选择一个卡类型' }
                            ],
                            initialValue: this.state.defaultCardType,
                            onChange: this.handleDefaultCardTypeChange,
                        })(
                            <Select
                                showSearch={true}
                                notFoundContent={'未搜索到结果'}
                                placeholder="请选择新用户注册成为会员的卡类型"
                                getPopupContainer={(node) => node.parentNode}
                            >
                                {
                                    cardTypeList.map(cate => <Select.Option key={cate.cardTypeID} value={cate.cardTypeID}>{cate.cardTypeName}</Select.Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem
                    label={'总计点数'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    required
                    wrapperCol={{ span: 17 }}
                >
                    {this.props.form.getFieldDecorator('pointTotalNumber', {
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || (!v.number && v.number !== 0)) {
                                            return cb('总计点数为必填项');
                                        } else if (v.number === 0) {
                                            return cb('总计点数必须大于0');
                                        }
                                        cb()
                                    },
                                }
                            ],
                            initialValue: {number: this.state.pointTotalNumber},
                            onChange: this.handlePointTotalNumberChange
                        })(
                            <PriceInput
                                addonAfter="个"
                                disabled={userCount > 0}
                                modal="int"
                                maxNum={3}
                            />
                        )
                    } 
                </FormItem>
                <FormItem
                    label={'邀请人参与次数'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <PriceInput
                        addonAfter="次"
                        value={{ number: this.state.partInTimes }}
                        onChange={this.handlePartInTimesChange}
                        placeholder="邀请人数每达到参与人数要求时，邀请人可多次获得礼品，为空表示不限次数"
                        modal="int"
                        maxNum={6}
                    />
                </FormItem>
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotionInfo: state.sale_specialPromotion_NEW,
        crmCardTypeNew: state.sale_crmCardTypeNew,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchCrmCardTypeLst: (opts) => {
            dispatch(FetchCrmCardTypeLst(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));

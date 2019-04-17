/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-15T10:50:38+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetShopOfEventByDate } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import CardLevel from '../common/CardLevel'
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput'; // 编辑


const FormItem = Form.Item;
const Option = Select.Option;

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            needCount: props.specialPromotionInfo.getIn(['$eventInfo', 'needCount']) || undefined,
            partInTimes: props.specialPromotionInfo.getIn(['$eventInfo', 'partInTimes']) || undefined, // 不想显示0
            defaultCardType: '',
        }
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
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

    onCardLevelChange = ({ defaultCardType = '' }) => {
        this.setState({
            defaultCardType
        })
    }

    handlePartInTimesChange = ({ number }) => {
        this.setState({
            partInTimes: number,
        })
    }

    handleNeedCountChange = ({ number }) => {
        this.setState({
            needCount: number,
        })
    }

    render() {
        return (
            <Form className={styles.cardLevelTree}>
                <CardLevel
                        cardLevelRangeType={'0'}
                        onChange={this.onCardLevelChange}
                        type={'65'}
                        form={this.props.form}
                    />
                <FormItem
                    label={'参与人数'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    required
                    wrapperCol={{ span: 17 }}
                >
                    {this.props.form.getFieldDecorator('needCount', {
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || (!v.number && v.number !== 0)) {
                                            return cb('参与人数为必填项');
                                        } else if (v.number === 0) {
                                            return cb('参与人数必须大于0');
                                        }
                                        cb()
                                    },
                                }
                            ],
                            initialValue: {number: this.state.needCount},
                            onChange: this.handleNeedCountChange
                        })(
                            <PriceInput
                                addonAfter="人"
                                placeholder="请输入成功参与多少人后可获得礼品"
                                modal="int"
                                maxNum={6}
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
                        placeholder="邀请人可发起邀请次数, 为空表示不限制"
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
        user: state.user.toJS(),
        specialPromotionInfo: state.sale_specialPromotion_NEW,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));

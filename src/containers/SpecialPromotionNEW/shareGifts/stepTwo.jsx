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
import Immutable from 'immutable';
import {
    Form,
    Select,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetShopOfEventByDate } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput'; // 编辑
import { FetchCrmCardTypeLst } from '../../../redux/actions/saleCenterNEW/crmCardType.action';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';




const FormItem = Form.Item;
const Option = Select.Option;
@injectIntl
class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            needCount: props.specialPromotionInfo.getIn(['$eventInfo', 'needCount']) || undefined,
            partInTimes: props.specialPromotionInfo.getIn(['$eventInfo', 'partInTimes']) || undefined, // 不想显示0
            defaultCardType: props.specialPromotionInfo.getIn(['$eventInfo', 'defaultCardType']) || undefined,
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

    handleNeedCountChange = ({ number }) => {
        this.setState({
            needCount: number,
        })
    }

    render() {
        let cardTypeList = this.props.crmCardTypeNew.get('cardTypeLst');
        cardTypeList = Immutable.List.isList(cardTypeList) ? cardTypeList.toJS().filter(({regFromLimit}) => !!regFromLimit) : [];
        const userCount = this.props.specialPromotionInfo.getIn(['$eventInfo', 'userCount']);
        return (
            <Form className={styles.cardLevelTree}>
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.dd5a3f52gg51143)}
                    optionFilterProp="children"
                    className={styles.FormItemStyle}
                    required
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        this.props.form.getFieldDecorator('defaultCardType', {
                            rules: [
                                { required: true, message: `${this.props.intl.formatMessage(STRING_SPE.da8omhe07i508)}` }
                            ],
                            initialValue: this.state.defaultCardType,
                            onChange: this.handleDefaultCardTypeChange,
                        })(
                            <Select
                                showSearch={true}
                                notFoundContent={`${this.props.intl.formatMessage(STRING_SPE.d2c8a4hdjl248)}`}
                                placeholder={this.props.intl.formatMessage(STRING_SPE.d1700a2d61fb3202)}
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
                    label={`${this.props.intl.formatMessage(STRING_SPE.d7h83bcde7c0156)}`}
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
                                            return cb(`${this.props.intl.formatMessage(STRING_SPE.dd5aa74dce2176)}`);
                                        } else if (v.number === 0) {
                                            return cb(`${this.props.intl.formatMessage(STRING_SPE.d7elcpehii2283)}`);
                                        }
                                        cb()
                                    },
                                }
                            ],
                            initialValue: {number: this.state.needCount},
                            onChange: this.handleNeedCountChange
                        })(
                            <PriceInput
                                addonAfter={this.props.intl.formatMessage(STRING_SPE.d170093144c13204)}
                                disabled={userCount > 0}
                                placeholder={this.props.intl.formatMessage(STRING_SPE.d34ikssd62352)}
                                modal="int"
                                maxNum={6}
                            />
                        )
                    } 
                </FormItem>
                <FormItem
                    label={`${this.props.intl.formatMessage(STRING_SPE.du3bv3so2464)}`}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <PriceInput
                        addonAfter={this.props.intl.formatMessage(STRING_SPE.d2164523635bb18198)}
                        value={{ number: this.state.partInTimes }}
                        onChange={this.handlePartInTimesChange}
                        placeholder={this.props.intl.formatMessage(STRING_SPE.d7h83bcde7c5292)}
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

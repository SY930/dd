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
    Radio,
    Tooltip,
    Icon,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { FetchCrmCardTypeLst } from '../../../redux/actions/saleCenterNEW/crmCardType.action';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const $mpIDList = props.specialPromotionInfo.getIn(['$eventInfo', 'mpIDList']);
        this.state = {
            autoRegister: props.specialPromotionInfo.getIn(['$eventInfo', 'autoRegister']) || 1,
            recommendRule: props.specialPromotionInfo.getIn(['$eventInfo', 'recommendRule']) || undefined,
            recommendRange: props.specialPromotionInfo.getIn(['$eventInfo', 'recommendRange']) || 0,
            defaultCardType: props.specialPromotionInfo.getIn(['$eventInfo', 'defaultCardType']) || undefined,
            mpIDList: Immutable.List.isList($mpIDList) ? $mpIDList.toJS() : [],
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
    handleRecommendRuleChange = (recommendRule) => {
        this.setState({
            recommendRule,
        })
    }
    handleMpIDListChange = (mpIDList) => {
        this.setState({
            mpIDList,
        })
    }

    handleAutoRegisterChange = ({ target: { value } }) => {
        this.setState({
            autoRegister: +value,
        })
    }
    handleRecommendRangeChange = ({ target: { value } }) => {
        this.setState({
            recommendRange: +value,
        })
    }

    render() {
        let cardTypeList = this.props.crmCardTypeNew.get('cardTypeLst');
        cardTypeList = Immutable.List.isList(cardTypeList) ? cardTypeList.toJS().filter(({regFromLimit}) => !!regFromLimit) : [];
        const {
            recommendRange,
            recommendRule,
            autoRegister,
            mpIDList,
        } = this.state;
        const {
            allWeChatAccountList,
            isAllOccupied,
            occupiedIDs,
            isQuerying,
        } = this.props;
        const mpInfoList = Immutable.List.isList(allWeChatAccountList) ? allWeChatAccountList.toJS() : [];
        return (
            <Form className={styles.cardLevelTree}>
                <FormItem
                    label="适用公众号"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select
                        placeholder="请选择活动展现公众号"
                        multiple
                        value={mpIDList}
                        onChange={this.handleMpIDListChange}
                        getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            mpInfoList.map(({mpID, mpName}) => (
                                <Select.Option
                                    key={mpID}
                                    value={mpID}
                                    disabled={isAllOccupied || isQuerying || occupiedIDs.includes(mpID)}
                                >
                                    {mpName}
                                </Select.Option>
                            ))
                        }
                    </Select>
                    <Tooltip title={
                        <p>
                            <p>对于非公众号使用场景的情况下，不用选择适用公众号</p>
                            <p>对于公众号使用场景情况下，同一时间一个公众号只能配置一个推荐有礼活动</p>
                        </p>
                    }>
                        <Icon
                            type={'question-circle'}
                            style={{ color: '#787878' }}
                            className={styles.cardLevelTreeIcon}
                        />
                    </Tooltip>
                </FormItem>
                <FormItem
                    label="活动规则"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    required
                    wrapperCol={{ span: 17 }}
                >
                    {
                        this.props.form.getFieldDecorator('recommendRule', {
                            rules: [
                                { required: true, message: '必须选择一种活动规则' }
                            ],
                            initialValue: recommendRule !== undefined ? `${recommendRule}` : undefined,
                            onChange: this.handleRecommendRuleChange,
                        })(
                            <Select
                                placeholder="请选择活动规则"
                                getPopupContainer={(node) => node.parentNode}
                            >
                                <Select.Option value="1">注册开卡后获得奖励</Select.Option>
                                <Select.Option value="2">储值后获得奖励</Select.Option>
                                <Select.Option value="3">消费后获得奖励</Select.Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem
                    label="新用户注册成为会员的卡类选择"
                    className={styles.FormItemStyle}
                    required
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 13 }}
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
                    label={'是否静默注册'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        onChange={this.handleAutoRegisterChange}
                        value={`${autoRegister}`}
                    >
                        <Radio value="1">无需用户填写注册信息</Radio>
                        <Radio value="0">用户需填写注册信息</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    label={'参与范围'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        onChange={this.handleRecommendRangeChange}
                        value={`${recommendRange}`}
                    >
                        <Radio value="0">仅直接推荐人参与</Radio>
                        <Radio value="1">直接和间接推荐人同时参与</Radio>
                    </RadioGroup>
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
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList'),
        occupiedIDs: state.queryWeixinAccounts.get('occupiedIDs'),
        isAllOccupied: state.queryWeixinAccounts.get('isAllOccupied'),
        isQuerying: state.queryWeixinAccounts.get('isLoading')
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

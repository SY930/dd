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
    message as messageAlert,
    Checkbox
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import { FetchCrmCardTypeLst } from '../../../redux/actions/saleCenterNEW/crmCardType.action';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import { activeRulesList } from './constant'


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
@injectIntl
class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const $mpIDList = props.specialPromotionInfo.getIn(['$eventInfo', 'mpIDList']);
        const autoRegister = props.specialPromotionInfo.getIn(['$eventInfo', 'autoRegister']);
        this.state = {
            autoRegister: autoRegister === undefined ? 1 : autoRegister,
            recommendRule: props.specialPromotionInfo.getIn(['$eventInfo', 'recommendRule']) ||  ['1'],
            recommendRange: props.specialPromotionInfo.getIn(['$eventInfo', 'recommendRange']) || 0,
            defaultCardType: props.specialPromotionInfo.getIn(['$eventInfo', 'defaultCardType']) || undefined,
            mpIDList: Immutable.List.isList($mpIDList) ? $mpIDList.toJS() : [],
            message: props.specialPromotionInfo.getIn(['$eventInfo', 'smsTemplate']) || '',
            accountNo: '',
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

    componentDidUpdate(prevProps) {
        if (prevProps.specialPromotionInfo.getIn(['$eventInfo', 'eventStartDate']) !== this.props.specialPromotionInfo.getIn(['$eventInfo', 'eventStartDate'])
            || prevProps.specialPromotionInfo.getIn(['$eventInfo', 'eventEndDate']) !== this.props.specialPromotionInfo.getIn(['$eventInfo', 'eventEndDate'])) {
                this.setState({
                    mpIDList: [],
                })
            }
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
            const smsGate = this.props.specialPromotionInfo.getIn(['$eventInfo', 'smsGate']);
            const sendFlag = smsGate == '1' || smsGate == '3' || smsGate == '4';
            const {
                message,
                accountNo,
                ...restState,
            } = this.state;
            const opts = {
                smsTemplate: sendFlag ? message : '',
                ...restState,
            };
            if (sendFlag) {
                if (accountNo > 0) {
                    const equityAccountInfoList = this.props.specialPromotionInfo.getIn(['$eventInfo', 'equityAccountInfoList']).toJS();
                    const selectedAccount = equityAccountInfoList.find(entity => entity.accountNo === accountNo) || {};
                    if (!selectedAccount.smsCount) { // 校验一下所选账户的可用条数
                        messageAlert.warning(`${this.props.intl.formatMessage(STRING_SPE.d31f129919j0138)}`);
                        return false;
                    } else {
                        opts.accountNo = accountNo;
                    }
                } else {
                    messageAlert.warning(`${this.props.intl.formatMessage(STRING_SPE.d34iceo4ec1176)}`)
                    return false;
                }
            } else {
                opts.accountNo = '0';
            }
            this.props.setSpecialBasicInfo({
                ...opts,
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
        const smsGate = this.props.specialPromotionInfo.getIn(['$eventInfo', 'smsGate']);
        const sendFlag = smsGate == '1' || smsGate == '3' || smsGate == '4';
        const userCount = this.props.specialPromotionInfo.getIn(['$eventInfo', 'userCount']);// 当有人参与后，规则不可切换
        return (
            <Form className={styles.cardLevelTree}>
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.dd5aa437e501230)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select
                        placeholder={this.props.intl.formatMessage(STRING_SPE.db60ca08c5252131)}
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
                            <p>{this.props.intl.formatMessage(STRING_SPE.d5672c12d9673113)}</p>
                            <p>{this.props.intl.formatMessage(STRING_SPE.db60ca08c5254230)}</p>
                        </p>
                    }>
                        <Icon
                            type={'question-circle'}
                            style={{ color: '#787878' }}
                            className={styles.cardLevelTreeIcon}
                        />
                    </Tooltip>
                </FormItem>
                {/* <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.d454apk46o45133)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    required
                    wrapperCol={{ span: 17 }}
                >
                    {
                        this.props.form.getFieldDecorator('recommendRule', {
                            rules: [
                                { required: true, message: `${this.props.intl.formatMessage(STRING_SPE.du3brskjh5191)}` }
                            ],
                            initialValue: recommendRule !== undefined ? `${recommendRule}` : undefined,
                            onChange: this.handleRecommendRuleChange,
                        })(
                            <Select
                                placeholder={this.props.intl.formatMessage(STRING_SPE.db60ca08c525691)}
                                disabled={userCount > 0}
                                getPopupContainer={(node) => node.parentNode}
                            >
                                <Select.Option value="1">{this.props.intl.formatMessage(STRING_SPE.d31f129919j725)}</Select.Option>
                                <Select.Option value="2">{this.props.intl.formatMessage(STRING_SPE.d1qe7tmfob8230)}</Select.Option>
                                <Select.Option value="3">{this.props.intl.formatMessage(STRING_SPE.d1kgf7b4bke9179)}</Select.Option>
                            </Select>
                        )
                    }
                </FormItem> */}
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.d454apk46o45133)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    required
                    wrapperCol={{ span: 17 }}
                >
                    {
                        this.props.form.getFieldDecorator('recommendRule', {
                            rules: [
                                { required: true, message: `${this.props.intl.formatMessage(STRING_SPE.du3brskjh5191)}` }
                            ],
                            initialValue: recommendRule !== undefined ? [`${recommendRule}`] :  ["1"],
                            onChange: this.handleRecommendRuleChange,
                        })(
                            <Checkbox.Group
                                options={activeRulesList}
                                disabled={userCount > 0}
                            />
                        )
                    }
                </FormItem>
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.dd5a3f52gg51143)}
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
                                optionFilterProp="children"
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
                    label={`${this.props.intl.formatMessage(STRING_SPE.d7h8397222b10218)}`}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        onChange={this.handleAutoRegisterChange}
                        value={`${autoRegister}`}
                    >
                        <Radio value="1">{this.props.intl.formatMessage(STRING_SPE.db60b7b7495c23238)}</Radio>
                        <Radio value="0">{this.props.intl.formatMessage(STRING_SPE.d4h19415ga424182)}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    label={`${this.props.intl.formatMessage(STRING_SPE.d1kgeaciak15137)}`}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        onChange={this.handleRecommendRangeChange}
                        value={`${recommendRange}`}
                    >
                        <Radio value="0">{this.props.intl.formatMessage(STRING_SPE.d31f129919j11250)}</Radio>
                        <Radio value="1">{this.props.intl.formatMessage(STRING_SPE.d1e09ku34n12207)}</Radio>
                    </RadioGroup>
                </FormItem>
                <SendMsgInfo
                    sendFlag={sendFlag}
                    form={this.props.form}
                    value={this.state.message}
                    onChange={
                        (val) => {
                            if (val instanceof Object) {
                                if (val.accountNo) {
                                    this.setState({ accountNo: val.accountNo })
                                }
                            } else {
                                this.setState({ message: val });
                            }
                        }
                    }
                />
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

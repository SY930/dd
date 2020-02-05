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
    Icon,
    message,
    Tooltip
} from 'antd';
import {isEqual, uniq, isEmpty} from 'lodash';
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetShopOfEventByDate } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {queryWechatMpInfo} from "../../GiftNew/_action";
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: props.mpListLoading,
            selectedIDs: props.specialPromotionInfo.getIn(['$eventInfo', 'mpIDList']).toJS(),                // 本活动已选公众号, 编辑时不会为空[]      a: String[]
            occupiedIDs: props.occupiedIDs.toJS(),                // 所选日期段内已被绑定公众号            b: String[]     在c中的映射集合应为disabled; 除非编辑时a b 有交集,则交集内元素不为disabled
            isAllOccupied: props.isAllOccupied,
            allAccounts: props.mpList.toJS(),      // 集团内所有公众号                  c: [{mpName: String, mpID: String}]
        };
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getWechatAccountsList = this.getWechatAccountsList.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        if (!this.state.allAccounts.length && !this.state.isLoading) {
            this.props.queryWechatMpInfo();
        }
    }

    getWechatAccountsList() {
        this.props.queryWechatMpInfo();
    }

    componentWillReceiveProps(nextProps) {
        // 当时写这里的时候太年轻, 把props转一遍state毫无意义, 徒增bug
        let { allAccounts, isLoading, selectedIDs, occupiedIDs, isAllOccupied} = this.state;
        if (this.props.specialPromotionInfo.getIn(['$eventInfo', 'mpIDList']) !== nextProps.specialPromotionInfo.getIn(['$eventInfo', 'mpIDList'])) {
            selectedIDs = nextProps.specialPromotionInfo.getIn(['$eventInfo', 'mpIDList']).toJS();
        }
        if (this.props.mpListLoading !== nextProps.mpListLoading) {
            isLoading = nextProps.mpListLoading;
        }
        if (this.props.mpList !== nextProps.mpList) {
            allAccounts = nextProps.mpList.toJS();
        }
        if (this.props.isAllOccupied !== nextProps.isAllOccupied) {
            isAllOccupied = nextProps.isAllOccupied;
        }
        if (this.props.occupiedIDs !== nextProps.occupiedIDs) {
            occupiedIDs = nextProps.occupiedIDs.toJS();
        }
        this.setState({
            selectedIDs,
            isLoading,
            isAllOccupied,
            occupiedIDs,
            allAccounts
        })
    }

    renderWeiXinAccountsFormItem() {
        let availableAccounts;
        let selectedIDs = this.state.selectedIDs;
        if (this.state.isAllOccupied) {
            selectedIDs = [];
            availableAccounts = this.state.allAccounts.map(account => ({...account, disabled: true}));
        } else {
            const disabledIDs = this.state.occupiedIDs;
            selectedIDs = selectedIDs.filter(id => !disabledIDs.includes(id));
            availableAccounts = this.state.allAccounts.map(account => {
                if (disabledIDs.find(id => id === account.mpID)) {
                    return {...account, disabled: true}
                }
                return account;
            });
        }

        let options;
        if (!this.state.isLoading) {
            if (availableAccounts.length > 0) {
                options = availableAccounts.map((account, idx) => {
                    return (
                        <Option value={account.mpID} key={account.mpID} disabled={!!account.disabled}>{account.mpName}</Option>
                    );
                });
            } else {
                options = (<Option value={'0'} disabled={true}>{this.props.intl.formatMessage(STRING_SPE.d7h81cf02c1090)}</Option>);
            }
        } else {
            options = (<Option value={'0'} disabled={true}>{this.props.intl.formatMessage(STRING_SPE.d4h198ef43g1130)}....</Option>);
        }

        const opts = {
            placeholder: `${this.props.intl.formatMessage(STRING_SPE.d5g39ah151233)}`,
            onChange: this.handleSelectionChange,
            value: Array.isArray(selectedIDs) ? selectedIDs[0] : undefined,
        };
        const isSomeAccountsOccupied = this.state.isAllOccupied || !!this.state.occupiedIDs.length;
        const occupiedTips = `${this.props.intl.formatMessage(STRING_SPE.d1kged9hi013115)}`;
        return (
            <Form.Item
                label={this.props.intl.formatMessage(STRING_SPE.db60ba3c92724205)}
                wrapperCol={{
                    span: 17,
                }}
                labelCol={{
                    span: 4,
                }}
                required={true}
                hasFeedback={true}
                className={styles.FormItemStyle}
            >

                <Select {...opts} size="default">
                    {options}
                </Select>
                {
                    this.state.isLoading ?
                    <Icon
                        type={'loading'}
                        style={{color:'inherit'}}
                        className={styles.cardLevelTreeIcon}
                    /> : null
                }
                {
                    !this.state.isLoading && !this.state.allAccounts.length ?
                    <Tooltip title={this.props.intl.formatMessage(STRING_SPE.d34ihmnchp5239)}>
                        <Icon   onClick={this.getWechatAccountsList}
                                type={'exclamation-circle'}
                                style={{cursor: 'pointer'}}
                                className={styles.cardLevelTreeIcon}
                            />
                    </Tooltip> : null
                }
                {   // 正常情况
                    !this.state.isLoading && this.state.allAccounts.length && this.state.selectedIDs.every(id => this.state.allAccounts.some(account => String(account.mpID) === String(id)))
                        && isSomeAccountsOccupied ?
                    <Tooltip title={occupiedTips}>
                        <Icon type={'exclamation-circle'}
                                className={styles.cardLevelTreeIcon}
                            />
                    </Tooltip> : null
                }
                {   // 部分已选公众号现在已不再集团公众号列表内
                    !this.state.isLoading && this.state.allAccounts.length && this.state.selectedIDs.some(id => this.state.allAccounts.every(account => String(account.mpID) !== String(id))) ?
                        <Tooltip title={
                            <div style={{width: '250px'}}>{`,  ${isSomeAccountsOccupied ? `${occupiedTips},  ` : ''}${this.props.intl.formatMessage(STRING_SPE.d7el7b973f7173)}`}</div>
                        }>{this.props.intl.formatMessage(STRING_SPE.d2b1c1a924146166)}
                        <Icon type={'exclamation-circle'}
                              onClick={this.getWechatAccountsList}
                              style={{cursor: 'pointer'}}
                              className={styles.cardLevelTreeIcon}
                            />
                    </Tooltip> : null
                }
            </Form.Item>
        );
    }

    handleSelectionChange(value) {
        // 关注送礼以前是多选, 后来变成了单选, 后端协议不变所以前端处理
        this.setState({selectedIDs: [value]});
    }

    handleSubmit() {
        if (this.state.isLoading) {
            message.warning(`${this.props.intl.formatMessage(STRING_SPE.d1qe5p36ch888)}`);
            return false;
        }
        if (!this.state.allAccounts.length) {
            message.warning(`${this.props.intl.formatMessage(STRING_SPE.dd5a7bed7a79258)}`);
            return false;
        }
        const mpIDList = this.state.selectedIDs.filter(id => !this.state.occupiedIDs.includes(id));
        if (!this.state.selectedIDs.length) {
            message.warning(`${this.props.intl.formatMessage(STRING_SPE.dd5a7bed7a710288)}`);
            return false;
        }
        this.props.setSpecialBasicInfo({
            mpIDList,
            smsGate: '2',
        });
        return true;
    }

    render() {
        return (
            <Form className={styles.cardLevelTree}>
                {this.renderWeiXinAccountsFormItem()}
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user.toJS(),
        specialPromotionInfo: state.sale_specialPromotion_NEW,
        occupiedIDs: state.queryWeixinAccounts.get('occupiedIDs'),
        isAllOccupied: state.queryWeixinAccounts.get('isAllOccupied'),
        mpList: state.sale_giftInfoNew.get('mpList'), // 微信公众号list
        mpListLoading: state.sale_giftInfoNew.get('mpListLoading'), // 微信公众号list loading status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        queryWechatMpInfo: (opts) => {
            dispatch(queryWechatMpInfo())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StepTwo);

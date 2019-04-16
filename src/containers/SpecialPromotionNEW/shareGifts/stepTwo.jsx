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
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetShopOfEventByDate } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {queryWechatMpInfo} from "../../GiftNew/_action";
import CardLevel from '../common/CardLevel'

const FormItem = Form.Item;
const Option = Select.Option;

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
                options = (<Option value={'0'} disabled={true}>未查询到可绑定的微信公众号</Option>);
            }
        } else {
            options = (<Option value={'0'} disabled={true}>数据加载中....</Option>);
        }

        const opts = {
            placeholder: '集团下全部微信公众号',
            onChange: this.handleSelectionChange,
            value: Array.isArray(selectedIDs) ? selectedIDs[0] : undefined,
        };
        const isSomeAccountsOccupied = this.state.isAllOccupied || !!this.state.occupiedIDs.length;
        const occupiedTips = '当前所选日期段内,有公众号已设置关注送礼活动';
        return (
            <Form.Item
                label="微信公众号"
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
                    <Tooltip title="未查询到可绑定的微信公众号, 点击重试">
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
                            <div style={{width: '250px'}}>{`该活动之前绑定的一个或几个公众号已不在集团公众号列表中,  ${isSomeAccountsOccupied ? `${occupiedTips},  ` : ''}点击重新查询集团公众号列表`}</div>
                        }>
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
            message.warning('正在查询集团下可用微信公众号, 请稍候');
            return false;
        }
        if (!this.state.allAccounts.length) {
            message.warning('未查询到该集团下可绑定的微信公众号');
            return false;
        }
        const mpIDList = this.state.selectedIDs.filter(id => !this.state.occupiedIDs.includes(id));
        if (!this.state.selectedIDs.length) {
            message.warning('请至少选择一个可用微信公众号');
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

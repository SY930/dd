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

const FormItem = Form.Item;
const Option = Select.Option;
const mock = [
    {
    value: '10',
    label: 'XX公众号1'
    },
    {
    value: '11',
    label: 'XX公众号2'
    },
    {
    value: '12',
    label: 'XX公众号3'
    },
];

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedAccounts: [],
            availableAccounts: [],
        };
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getWeiXinAccountsList = this.getWeiXinAccountsList.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.getWeiXinAccountsList([]);
        this.loadSelections();

        // {groupID: this.props.user.accountInfo.groupID}
    }

    loadSelections(props = this.props) {
        const selections = props.specialPromotionInfo.getIn(['$eventInfo', 'weixinAccounts']);
        this.setState({selectedAccounts: selections ? selections.split(',') : []})
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.specialPromotionInfo.getIn(['$eventInfo', 'weixinAccounts']) !== nextProps.specialPromotionInfo.getIn(['$eventInfo', 'weixinAccounts'])) {
            this.loadSelections(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.state, nextState) ||
            this.props.specialPromotionInfo.getIn(['$eventInfo', 'weixinAccounts']) !== nextProps.specialPromotionInfo.getIn(['$eventInfo', 'weixinAccounts']);
    }

    getWeiXinAccountsList(list) {
        this.setState({isLoading: true});
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(list instanceof Array ? [] : mock);
            }, 5000)
        }).then(res => {
            this.setState({availableAccounts: res, isLoading: false});
        })
    }

    renderWeiXinAccountsFormItem() {
        const availableAccounts = this.state.availableAccounts;
        let options;
        if (!this.state.isLoading) {
            if (availableAccounts.length > 0) {
                options = availableAccounts.map((account, idx) => {
                    return (
                        <Option value={account.value} key={account.value}>{account.label}</Option>
                    );
                });
                options.unshift(<Option value={'-1'} key={'-1'}>{`全部`}</Option>) // 产品让加的, 点击相当于全选, 但是~~~
            } else {
                options = (<Option value={'0'} disabled={true}>未查询到可绑定的微信公众号</Option>);
            }
        } else {
            options = (<Option value={'0'} disabled={true}>数据加载中....</Option>);
        }

        const _brandList = {
            multiple: true,
            allowClear: true,
            showSearch: false,
            filterOption: false,
            placeholder: '集团下全部微信公众号',
            onChange: this.handleSelectionChange,
            // defaultValue: this.state.brands,
            value: this.state.selectedAccounts,
        };
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

                <Select {..._brandList} size="default">
                    {options}
                </Select>
                {
                    this.state.isLoading &&
                    <Icon
                        type={'loading'}
                        style={{color:'inherit'}}
                        className={styles.cardLevelTreeIcon}
                    />
                }
                {
                    !this.state.isLoading && !this.state.availableAccounts.length &&
                    <Tooltip title="未查询到可绑定的微信公众号">
                        <Icon   onClick={this.getWeiXinAccountsList}
                                type={'exclamation-circle'}
                                style={{cursor: 'pointer'}}
                                className={styles.cardLevelTreeIcon}
                            />
                    </Tooltip>
                }
            </Form.Item>
        );
    }

    handleSelectionChange(value) {
        if (value.includes('-1')) {
            this.setState({selectedAccounts: ['-1']});
        } else {
            this.setState({selectedAccounts: value});
        }

    }

    handleSubmit() {
        let flag = true;
        if (this.state.isLoading) {
            message.warning('正在查询集团下可用微信公众号, 请稍候');
            return false;
        }
        if (!this.state.availableAccounts.length) {
            message.warning('未查询到该集团下可绑定的微信公众号');
            return false;
        }
        const isAll = this.state.selectedAccounts[0] === '-1'; // 前端虚拟的全部选项
        let weixinAccounts;
        if (isAll) {
            weixinAccounts = this.state.availableAccounts.map(accounts => accounts.value).join(',');
        }else {
            weixinAccounts = this.state.selectedAccounts.join(',')
        }
        this.props.setSpecialBasicInfo({weixinAccounts});
        return flag;
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

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StepTwo);

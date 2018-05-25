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
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.getWeiXinAccountsList();
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

    getWeiXinAccountsList() {
        this.setState({isLoading: true});
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(mock);
            }, 10000)
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
                })
            } else {
                options = (<Option value={'0'} disabled={true}>暂无数据</Option>);
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
                hasFeedback={true}
                className={styles.FormItemStyle}
            >
                <Select {..._brandList} size="default">
                    {options}
                </Select>
            </Form.Item>
        );
    }

    handleSelectionChange(value) {
        this.setState({selectedAccounts: value});
    }

    handleSubmit() {
        let flag = true;
        this.props.setSpecialBasicInfo({weixinAccounts: this.state.selectedAccounts.join(',')});
        return flag;
    }

    render() {
        return (
            <Form>
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

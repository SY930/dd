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

const FormItem = Form.Item;
const Option = Select.Option;

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: props.mpListLoading,
            selectedIDs: [],                // 本活动已选公众号, 编辑时不会为空[]      a: String[]
            occupiedIDs: [],                // 所选日期段内已被绑定公众号            b: String[]     在c中的映射集合应为disabled; 除非编辑时a b 有交集,则交集内元素不为disabled
            allAccounts: props.mpList.toJS(),      // 集团内所有公众号                  c: [{mpName: String, mpID: String}]
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
        if (!this.state.allAccounts.length) {
            this.props.queryWechatMpInfo();
        }
    }

    componentWillReceiveProps(nextProps) {
        let { allAccounts, isLoading, selectedIDs} = this.state;
        if (this.props.specialPromotionInfo.getIn(['$eventInfo', 'mpIDList']) !== nextProps.specialPromotionInfo.getIn(['$eventInfo', 'mpIDList'])) {
            selectedIDs = nextProps.specialPromotionInfo.getIn(['$eventInfo', 'mpIDList']);
        }
        if (this.props.mpListLoading !== nextProps.mpListLoading) {
            isLoading = nextProps.mpListLoading;
        }
        if (this.props.mpList !== nextProps.mpList) {
            allAccounts = nextProps.mpList.toJS();
        }
        this.setState({
            selectedIDs,
            isLoading,
            allAccounts
        })
    }

    renderWeiXinAccountsFormItem() {
        const availableAccounts = this.state.allAccounts.map(account => );
        let options;
        if (!this.state.isLoading) {
            if (availableAccounts.length > 0) {
                options = availableAccounts.map((account, idx) => {
                    return (
                        <Option value={account.mpID} key={account.mpID}>{account.mpName}</Option>
                    );
                });
                options.unshift(<Option value={'-1'} key={'-1'}>{`全部`}</Option>) // 产品让加的, 点击相当于全选, 但是~~~ emmmm
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
                    !this.state.isLoading && !this.state.allAccounts.length &&
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
            this.setState({selectedIDs: ['-1']});
        } else {
            this.setState({selectedIDs: value});
        }

    }

    handleSubmit() {
        let flag = true;
        if (this.state.isLoading) {
            message.warning('正在查询集团下可用微信公众号, 请稍候');
            return false;
        }
        if (!this.state.allAccounts.length) {
            message.warning('未查询到该集团下可绑定的微信公众号');
            return false;
        }
        const isAll = this.state.selectedIDs[0] === '-1'; // 前端虚拟的全部选项
        let mpIDlist;
        if (isAll) {
            mpIDlist = this.state.allAccounts.filter(accounts => !accounts.disabled).map(accounts => accounts.mpID);
        }else {
            mpIDlist = this.state.selectedIDs;
        }
        this.props.setSpecialBasicInfo({mpIDlist});
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

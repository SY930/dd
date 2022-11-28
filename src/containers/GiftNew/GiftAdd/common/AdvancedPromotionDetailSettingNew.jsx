/**
 * @Author: chenshuang
 * @Date:   2017-03-30T14:17:50+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T17:27:56+08:00
 */


import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Radio, Button, Icon, Checkbox, Tooltip } from 'antd';
import { is, fromJS } from 'immutable';
import styles from './ActivityPage.less';
import {
    saleCenterSetPromotionDetailAC,
    fetchPromotionListAC,
    fetchRoleListInfoAC,
    fetchSubjectListInfoAC,
} from '../../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { fetchShopCardLevel, queryTagDetailList, queryAllTagGroupList } from '../../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import ShareRuleBox from '../../../SaleCenterNEW/common/ShareRuleBox';
import { injectIntl } from './IntlDecor';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { WJLPGroupID } from '../../../../constants/WhiteList';
@injectIntl()
class AdvancedPromotionDetailSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            promotionList: {},
            mutexPromotions: [],
            mutexSubjects: [],
            selectedRole: [],
            userSetting: '0',
            subjectType: '0',
            blackListRadio: '0',
            display: 'none',
            cardScopeType: 0,
            cardInfo: [],
            cardScopeIDs: [],
            userSettingOPtios: [],
            isTotalLimited: '0',
            crmCardTypeIDs: '',
            cardBalanceLimitType: 0,


            ruleUseType: '0',

            mutexActivityId: [],
            sharedAndOverlieActivityId: [],
            sharedAndNotOverlieActivityId: [],
            mutexActivityType: [],
            sharedAndOverlieType: [],
            sharedAndNotOverlieType: [],

        };

        this.renderUserSetting = this.renderUserSetting.bind(this);
        this.renderExcludedPromotionSelection = this.renderExcludedPromotionSelection.bind(this);
        this.onPromotionChange = this.onPromotionChange.bind(this);

    }
    componentDidMount() {
        // todo 编辑回显 props

        const $promotionDetailInfo = this.props.mutedata

        if ($promotionDetailInfo) {
            const mutexActivityId = $promotionDetailInfo.mutexActivityIdList || []
            const mutexActivityType = $promotionDetailInfo.mutexActivityTypeList || []
            const sharedAndNotOverlieActivityId = $promotionDetailInfo.sharedAndNotOverlieActivityIdList || []
            const sharedAndNotOverlieType = $promotionDetailInfo.sharedAndNotOverlieTypeList || []
            const sharedAndOverlieActivityId = $promotionDetailInfo.sharedAndOverlieActivityIdList || []
            const sharedAndOverlieType = $promotionDetailInfo.sharedAndOverlieTypeList || []
            const ruleUseType = $promotionDetailInfo.ruleUseType || '0'
            this.setState({
                mutexActivityId,
                mutexActivityType,
                sharedAndNotOverlieActivityId,
                sharedAndNotOverlieType,
                sharedAndOverlieActivityId,
                sharedAndOverlieType,
                ruleUseType
            })
            this.props.setPromotionDetail({
                mutexActivityId,
                mutexActivityType,
                sharedAndNotOverlieActivityId,
                sharedAndNotOverlieType,
                sharedAndOverlieActivityId,
                sharedAndOverlieType,
                ruleUseType
            })
        }

    }

    renderUserSetting() {
        return (
            <div>
                <FormItem
                    label={'互斥叠加规则'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >

                    <RadioGroup value={String(this.state.ruleUseType)} onChange={(e) => {
                        this.setState({ ruleUseType: e.target.value }, () => {
                            this.props.cb(this.state)
                        })

                        this.props.setPromotionDetail({ ruleUseType: e.target.value })
                    }}>
                        <Radio key={'0'} value={'0'}>{'使用系统规则'}</Radio>
                        <Radio key={'1'} value={'1'}>{'单独配置活动规则'}</Radio>
                    </RadioGroup>
                </FormItem>
                <div style={{ marginLeft: 120 }}>
                    {this.state.ruleUseType == '0' && <a onClick={() => {
                        if(WJLPGroupID.includes(this.props.user.accountInfo.groupID)){
                            if (HUALALA.ENVIRONMENT === 'production-release') {
                                window.open('http://vip.shop.hualala.com/meta/2/2000839')
                            } else {
                                window.open('http://dohko.hw.shop.hualala.com/meta/2/2000839')
                            }
                        }else{
                            if (HUALALA.ENVIRONMENT === 'production-release') {
                                window.open('http://zhy.shop.hualala.com/meta/2/2002606')
                            } else {
                                window.open('http://zhytest.hualala.com/meta/2/2002606')
                            }
                        }
                    }}>查看系统规则</a>}

                    {this.state.ruleUseType == '1' && <div>
                        <div style={{ marginTop: 10 }}>与其他活动互斥</div>
                        <div style={{ marginTop: 10, marginLeft: 20, display: this.state.mutexActivityId.length > 0 || this.state.mutexActivityType.length > 0 ? 'block' : 'none' }}>已添加{this.state.mutexActivityId.length}个活动，{this.state.mutexActivityType.length}个类型</div>
                        <div style={{ marginTop: 10, marginLeft: 20 }}>
                            <a onClick={() => {
                                this.setState({ modalVisible: true, modalTitle: '与其他活动互斥' })
                            }}>添加</a>
                        </div>
                        <div style={{ marginTop: 10 }}>与其他活动共享</div>
                        <div style={{ marginTop: 10, marginLeft: 20, display: this.state.sharedAndNotOverlieActivityId.length > 0 || this.state.sharedAndNotOverlieType.length > 0 ? 'block' : 'none' }}>已添加{this.state.sharedAndNotOverlieActivityId.length}个活动，{this.state.sharedAndNotOverlieType.length}个类型</div>
                        <div style={{ marginTop: 10, marginLeft: 20 }}>
                            <a onClick={() => {
                                this.setState({ modalVisible: true, modalTitle: '与其他活动共享' })
                            }}>添加</a>
                        </div>
                        <div style={{ marginTop: 10 }}>与其他活动共享叠加</div>
                        <div style={{ marginTop: 10, marginLeft: 20, display: this.state.sharedAndOverlieActivityId.length > 0 || this.state.sharedAndOverlieType.length > 0 ? 'block' : 'none' }}>已添加{this.state.sharedAndOverlieActivityId.length}个活动，{this.state.sharedAndOverlieType.length}个类型</div>
                        <div style={{ marginTop: 10, marginLeft: 20 }}>
                            <a onClick={() => {
                                this.setState({ modalVisible: true, modalTitle: '与其他活动共享叠加' })
                            }}>添加</a>
                        </div>
                    </div>
                    }
                </div>

            </div>
        )
    }

    onPromotionChange(val) {


        let activityIdList = val.activityIdList.map(item => { return item })

        let activityTypeList = val.activityTypeList.map(item => { return item })

        if (val.title == '与其他活动互斥') {
            this.setState({ mutexActivityId: activityIdList, mutexActivityType: activityTypeList }, () => {
                this.props.cb(this.state)
            })
            this.props.setPromotionDetail({
                mutexActivityId: activityIdList,
                mutexActivityType: activityTypeList,
            });
        } else if (val.title == '与其他活动共享') {
            this.setState({ sharedAndNotOverlieActivityId: activityIdList, sharedAndNotOverlieType: activityTypeList }, () => {
                this.props.cb(this.state)
            })
            this.props.setPromotionDetail({
                sharedAndNotOverlieActivityId: activityIdList,
                sharedAndNotOverlieType: activityTypeList,
            });
        } else {
            this.setState({ sharedAndOverlieActivityId: activityIdList, sharedAndOverlieType: activityTypeList }, () => {
                this.props.cb(this.state)
            })
            this.props.setPromotionDetail({
                sharedAndOverlieActivityId: activityIdList,
                sharedAndOverlieType: activityTypeList
            });
        }

    }


    renderExcludedPromotionSelection() {
        return (
            <FormItem
                label=''
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {this.state.modalVisible &&
                    <ShareRuleBox
                        orgs={this.props.orgs}
                        giftType={this.props.giftType}
                        bizType={this.props.bizType}
                        giftItemID={this.props.giftItemID}
                        modalTitle={this.state.modalTitle}
                        mutexActivityId={this.state.mutexActivityId}
                        mutexActivityType={this.state.mutexActivityType}
                        sharedAndNotOverlieActivityId={this.state.sharedAndNotOverlieActivityId}
                        sharedAndNotOverlieType={this.state.sharedAndNotOverlieType}
                        sharedAndOverlieActivityId={this.state.sharedAndOverlieActivityId}
                        sharedAndOverlieType={this.state.sharedAndOverlieType}
                        onChange={(val) => {
                            this.onPromotionChange(val)
                        }}
                        closeModal={() => {
                            this.setState({ modalVisible: false })
                        }} />}
            </FormItem>
        )
    }
    handleCustomerUseCountLimitChange = (value) => {
        this.setState({
            customerUseCountLimit: value.number,
        })
        this.props.setPromotionDetail({
            customerUseCountLimit: value.number,
        });
    }

    render() {

        return (
            <div>
                {this.renderUserSetting()}
                {this.renderExcludedPromotionSelection()}
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {

        myActivities: state.sale_myActivities_NEW,
        birthdayLimit: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail', 'birthdayLimit'], 0),
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        groupCardTypeList: state.sale_mySpecialActivities_NEW.getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
        tagList: state.sale_mySpecialActivities_NEW.toJS().tagList,
        tagGroupList: state.sale_mySpecialActivities_NEW.toJS().tagGroupList,
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
        user: state.user.toJS(),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },

        fetchPromotionList: (opts) => {
            dispatch(fetchPromotionListAC(opts))
        },

        fetchRoleList: (opts) => {
            dispatch(fetchRoleListInfoAC(opts));
        },

        fetchSubjectListInfo: (opts) => {
            dispatch(fetchSubjectListInfoAC(opts));
        },
        fetchShopCardLevel: (opts) => {
            dispatch(fetchShopCardLevel(opts));
        },
        fetchTagList: (opt) => {
            dispatch(queryTagDetailList(opt))
        },
        fetchTagGroupList: (opt) => {
            dispatch(queryAllTagGroupList(opt))
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedPromotionDetailSetting);


import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Radio, Button, Icon, Tooltip } from 'antd';
import PriceInput from '../common/PriceInput';
import styles from '../ActivityPage.less';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class Approval extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            approvalInfo: {
                activityCost: undefined,//活动费用
                estimatedSales: undefined,//预计销售额
                activityRate: undefined,//活动费用/预计销售额(折扣率)
                headquartersCost: 1,//是否总部费用
                storeAttribute: 1,//门店属性
                auditRemark: undefined //审核备注
            },
            headquartersCost: 1,
            storeAttribute: 1

        };

    }
    componentDidMount() {
        let activityCost;
        let estimatedSales;
        let activityRate;
        let headquartersCost;
        let storeAttribute;
        let auditRemark;

        if (this.props.type == 'special') {
            //营销
            activityCost = this.props.specialPromotion.getIn(["$eventInfo", "activityCost"]);
            estimatedSales = this.props.specialPromotion.getIn(["$eventInfo", "estimatedSales"]);
            activityRate = this.props.specialPromotion.getIn(["$eventInfo", "activityRate"]);
            headquartersCost = this.props.specialPromotion.getIn(["$eventInfo", "headquartersCost"]);
            storeAttribute = this.props.specialPromotion.getIn(["$eventInfo", "storeAttribute"]);
            auditRemark = this.props.specialPromotion.getIn(["$eventInfo", "auditRemark"]);
        } else {
            //促销
            activityCost = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'activityCost']);
            estimatedSales = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'estimatedSales']);
            activityRate = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'activityRate']);
            headquartersCost = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'headquartersCost']);
            storeAttribute = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'storeAttribute']);
            auditRemark = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'auditRemark']);
        }

        headquartersCost = headquartersCost != undefined ? headquartersCost : 1;
        storeAttribute = storeAttribute != undefined ? storeAttribute : 1;

        this.setState({
            activityCost,
            estimatedSales,
            activityRate,
            headquartersCost,
            storeAttribute,
            auditRemark,

            approvalInfo: {
                activityCost,
                estimatedSales,
                activityRate,
                headquartersCost,
                storeAttribute,
                auditRemark
            }
        })

        this.props.onApprovalInfoChange({
            activityCost,
            estimatedSales,
            activityRate,
            headquartersCost,
            storeAttribute,
            auditRemark
        })
    }

    renderUserSetting() {
        const { showTitle = true, disabled = false } = this.props;
        let activityCost = this.state.activityCost
        let estimatedSales = this.state.estimatedSales
        let activityRate
        if (activityCost && estimatedSales > 0) {
            activityRate = (activityCost / estimatedSales).toFixed(2)
        }

        return (
            <Row>
                {showTitle && <h4 style={{ marginBottom: 10 }}>审批设置</h4>}
                <FormItem
                    label={'活动费用'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    validateStatus={this.state.activityCost ? "success" : "error"}
                    help={this.state.activityCost ? null : '请输入活动费用'}
                    required
                >

                    <PriceInput
                        value={{ number: this.state.activityCost }}
                        defaultValue={{ number: this.state.activityCost }}
                        maxNum={8}
                        placeholder='请输入预计活动费用'
                        onChange={(val) => {
                            this.setState({ activityCost: val.number });
                            this.state.approvalInfo.activityCost = val.number
                            this.state.approvalInfo.activityRate = undefined;
                            if (val.number && this.state.estimatedSales > 0) {
                                this.state.approvalInfo.activityRate = (val.number / this.state.estimatedSales).toFixed(2)
                            }
                            this.props.onApprovalInfoChange(this.state.approvalInfo)
                        }}
                        modal="float"
                        disabled={disabled}
                    />
                </FormItem>
                <FormItem
                    label={'预计销售额'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    validateStatus={this.state.estimatedSales ? "success" : "error"}
                    help={this.state.estimatedSales ? null : '请输入预计销售额'}
                    required
                >
                    <PriceInput
                        value={{ number: this.state.estimatedSales }}
                        defaultValue={{ number: this.state.estimatedSales }}
                        maxNum={8}
                        placeholder='请输入预计活动费用'
                        onChange={(val) => {
                            this.setState({ estimatedSales: val.number });
                            this.state.approvalInfo.estimatedSales = val.number
                            this.state.approvalInfo.activityRate = undefined;
                            if (val.number > 0 && this.state.activityCost) {
                                this.state.approvalInfo.activityRate = (this.state.activityCost / val.number).toFixed(2)
                            }
                            this.props.onApprovalInfoChange(this.state.approvalInfo)
                        }}
                        modal="float"
                        disabled={disabled}
                    />
                </FormItem>
                <FormItem
                    label={'折扣率'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required
                >
                    <PriceInput
                        placeholder='活动费用/预计销售额'
                        modal="float"
                        value={{ number: activityRate }}
                        disabled
                    />
                </FormItem>
                <FormItem
                    label={'是否总部费用'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required
                >

                    <RadioGroup disabled={disabled} value={this.state.headquartersCost} onChange={(e) => {
                        this.setState({ headquartersCost: e.target.value });
                        this.state.approvalInfo.headquartersCost = e.target.value
                        this.props.onApprovalInfoChange(this.state.approvalInfo)
                    }}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem
                    label={'门店属性'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required
                >

                    <RadioGroup disabled={disabled} value={this.state.storeAttribute} onChange={(e) => {
                        this.setState({ storeAttribute: e.target.value });
                        this.state.approvalInfo.storeAttribute = e.target.value
                        this.props.onApprovalInfoChange(this.state.approvalInfo)
                    }}>
                        <Radio value={1}>直营</Radio>
                        <Radio value={0}>特许</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem
                    label="备注"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    validateStatus={this.state.auditRemark ? "success" : "error"}
                    help={this.state.auditRemark ? null : '请输入备注'}
                    required
                >
                    <Input type="textarea" disabled={disabled} value={this.state.auditRemark} placeholder="请输入备注信息" maxLength={200} onChange={(e) => {
                        this.setState({ auditRemark: e.target.value })
                        this.state.approvalInfo.auditRemark = e.target.value
                        this.props.onApprovalInfoChange(this.state.approvalInfo)
                    }} />
                </FormItem>
            </Row>
        )
    }

    render() {

        return (
            <div>
                {this.renderUserSetting()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Approval);
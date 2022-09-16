import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import BasicInfoForm from "./components/BasicInfoForm";
import UsageRuleForm from "./components/UsageRuleForm";
import styles from "./styles.less";
import { asyncParseForm } from "../../../helpers/util";
import { FetchCrmCardTypeLst } from "../../../redux/actions/saleCenterNEW/crmCardType.action";

class OnlineRestaurantGiftGiving extends Component {
    constructor() {
        super();
        this.state = {
            basicForm: null, //基本信息表单
            basicFormData: {}, //基本信息表单数据
            ruleForm: null, //使用规则表单
            ruleFormData: {}, //使用规则表单数据
        };
    }
    componentDidMount() {
        this.props.FetchCrmCardTypeLst({});
        this.props.getSubmitFn(this.handleSubmit);
    }

    handleSubmit = () => {
        const { basicForm, ruleForm } = this.state;
        const forms = [basicForm, ruleForm];
        asyncParseForm(forms).then(({ values }) => {
            console.log(values);
        });
    };

    render() {
        const { basicForm, ruleForm, basicFormData, ruleFormData } = this.state;
        const { accountInfo, user, cardTypeLst } = this.props;
        const itemProps = {
            accountInfo,
            user,
            cardTypeLst,
        };
        return (
            <div className={styles.formContainer}>
                <div className={styles.logoGroupHeader}>基本信息</div>
                <BasicInfoForm
                    basicForm={basicForm}
                    getForm={(form) => this.setState({ basicForm: form })}
                    formData={basicFormData}
                    {...itemProps}
                />
                <div className={styles.logoGroupHeader}>使用规则</div>
                <UsageRuleForm
                    ruleForm={ruleForm}
                    getForm={(form) => this.setState({ ruleForm: form })}
                    formData={ruleFormData}
                    {...itemProps}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountInfo: state.user.get("accountInfo").toJS(),
        user: state.user.toJS(),
        cardTypeLst: state.sale_crmCardTypeNew.get("cardTypeLst").toJS(),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        FetchCrmCardTypeLst: (opts) => {
            dispatch(FetchCrmCardTypeLst(opts));
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OnlineRestaurantGiftGiving);

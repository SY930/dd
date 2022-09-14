import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Steps, Spin, message, Radio } from "antd";
import moment from "moment";
import _ from "lodash";
import { jumpPage, closePage, axios } from "@hualala/platform-base";
import BasicInfoForm from "./components/BasicInfoForm";
import styles from "./styles.less";

class OnlineRestaurantGiftGiving extends Component {
    constructor() {
        super();
        this.state = {
            basicForm: null, //基本信息表单
            basicFormData: {},//基本信息表单数据
        };
    }
    render() {
        const { basicForm, basicFormData } = this.state;
        return (
            <div className={styles.formContainer}>
                <div className={styles.logoGroupHeader}>基本信息</div>
                <BasicInfoForm
                    basicForm={basicForm}
                    getForm={(form) => this.setState({ basicForm: form })}
                    formData={basicFormData}
                    
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountInfo: state.user.get("accountInfo"),
        user: state.user.toJS(),
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OnlineRestaurantGiftGiving);

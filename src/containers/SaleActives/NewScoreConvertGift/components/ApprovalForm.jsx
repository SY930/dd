import React, { PureComponent as Component } from "react";
import moment from "moment";
import { uniq } from "lodash";
import BaseForm from "components/common/BaseForm";
import { approvalFormItems, formItemLayout, approvalFormKeys } from "../common";
import Approval from '../../../../containers/SaleCenterNEW/common/Approval';
import { isGeneral } from "../../../../constants/WhiteList";

class BasicInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: approvalFormKeys,
            shopStatus: true,
        };
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    onChangeBasicForm = (key, value) => {};

    resetFormItems = () => {
        const { approval } = approvalFormItems;
        const { setRuleForm, formData, mode } = this.props;
        const { auditStatus } = formData;
        const isDisabled = mode === 'view' || (mode === 'edit' && !isGeneral() && (auditStatus == 2 || auditStatus == 4));
        
        return {
            ...approvalFormItems,
            approval: {
                ...approval,
                render: (d) => (
                    <Approval type="special" disabled={isDisabled} showTitle={false} onApprovalInfoChange={(val) => {
                        setRuleForm({
                            approvalInfo: {
                                ...val
                            }
                        })
                    }} />
                ),
            },
        };
    };
    render() {
        let { formData, getForm, mode } = this.props;
        formData = {
            ...formData,
        }
        const { formKeys } = this.state;
        return (
            <div style={{ width: 800, marginBottom: 16 }}>
                <BaseForm
                    getForm={getForm}
                    formItems={this.resetFormItems()}
                    formKeys={formKeys}
                    onChange={this.onChangeBasicForm}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        );
    }
}

export default BasicInfoForm;

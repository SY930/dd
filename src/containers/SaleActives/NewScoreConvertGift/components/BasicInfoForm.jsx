import React, { PureComponent as Component } from "react";
import moment from "moment";
import { uniq } from "lodash";
import BaseForm from "components/common/BaseForm";
import { baseFormItems, formItemLayout, baseFormKeys } from "../common";
import DateRange from "../../../PromotionV3/Camp/DateRange";

class BasicInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: baseFormKeys,
            shopStatus: true,
        };
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    onChangeBasicForm = (key, value) => {};

    resetFormItems = () => {
        const { eventRange } = baseFormItems;
        let { } = this.state;
        
        return {
            ...baseFormItems,
            eventRange: {
                ...eventRange,
                render: (d) => d({})(<DateRange type={"85"} />),
            },
        };
    };
    render() {
        let { formData, getForm, mode } = this.props;
        const initEventCode = `YX${moment(new Date()).format('YYYYMMDDHHmmss') + new Date().getMilliseconds()}`;
        formData = {
            ...formData,
            eventCode: mode == 'add' || mode == 'copy' ? initEventCode : formData.eventCode
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

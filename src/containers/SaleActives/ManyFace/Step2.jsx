import React, { PureComponent as Component } from 'react';
import BaseForm from 'components/common/BaseForm';
import { formKeys32, formItems3, formItemLayout, KEY6, KEY3, KEY4, KEY5 } from './Common';
import MyFaceRule from './MyFaceRule/MyFaceRule';
import EveryDay from '../../PromotionV3/Camp/EveryDay';
import css from './style.less';


class Step2 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        newFormKeys: formKeys32,
    };

    componentDidMount() { }

    onChange = (key, value) => {
        const { form2: form, formData = {} } = this.props;
        let newFormKeys = [...KEY6];
        // 日期高级
        if (key === 'advMore') {
            if (value) {
                newFormKeys = [...KEY6, ...KEY3, ...KEY5];
            }

            this.setState({ newFormKeys });
        }
        // 周期
        if (key === 'cycleType') {
            let advMore = '';
            if (form) {
                advMore = form.getFieldValue('advMore'); // 高级时间
            }
            if (advMore) {
                newFormKeys = [...KEY6, ...KEY3, ...KEY5];
            }
            if (value) {
                newFormKeys = [...KEY6, ...KEY3, ...KEY4, ...KEY5];
            } else {
                if (formData.advMore) {
                    newFormKeys = [...KEY6, ...KEY3, ...KEY5];
                }
            }
            this.setState({ newFormKeys });
        }
    }
    
    /** formItems 重新设置 */
    resetFormItems() {
        const { form1, form2, formData } = this.props;
        const render = d => d()(<MyFaceRule
            form2={this.props.form2}
            decorator={d}
            clientType={((form1 && form1.getFieldValue('clientType')) || '2')}
            sceneList={((form1 && form1.getFieldValue('sceneList')) || '1')}
            triggerSceneList={((form1 && form1.getFieldValue('triggerSceneList')) || [])}
            allActivityList={this.props.allActivity}
            allMallActivity={this.props.allMallActivity}
            // originClientType={this.props.originClientType}
            isEdit={this.props.isEdit}
            form1={this.props.form1}
        />);
        const { faceRule, validCycle, ...others } = formItems3;

        let cycleType = '';
        if (form2) {
            const { getFieldValue } = form2;
            const { cycleType: t } = formData || {};
            cycleType = getFieldValue('cycleType') || t;
        }
        const render3 = d => d()(<EveryDay type={cycleType} />);
        return {
            ...others,
            faceRule: { ...faceRule, render },
            validCycle: { ...validCycle, render: render3 },
        };
    }

    render() {
        const { newFormKeys } = this.state;
        const { formData, getForm } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div className={css.useRule}>
                <BaseForm
                    getForm={getForm}
                    formItems={newFormItems}
                    formKeys={newFormKeys}
                    onChange={this.onChange}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}
export default Step2

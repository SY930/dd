import React, { PureComponent as Component } from 'react';
import { Button } from 'antd';
import BaseForm from 'components/common/BaseForm';
import styles from './index.less';
import { CARDS, EDIT_PAGE_FORM_ITEMS, formItemLayout, PAGE_TYPE } from './Common';
import { addCardTemplate } from './AxiosFactory'

export default class EditPage extends Component {
    state = {
        brands: [],
        templateType: 'pCard',
    }


    /** 得到form */
    getForm = (form) => {
        this.form = form;
    }

    /* 整理formItems对象 */
    resetFormItems = () => {
        const { brandIDs, templateType } = EDIT_PAGE_FORM_ITEMS;
        brandIDs.options = this.state.brands;
        templateType.options = this.props.cardTypeList;
        return {
            ...EDIT_PAGE_FORM_ITEMS,
            brandIDs,
            templateType
        };
    }

    handleFormChange = (key, value) => {
        if (key === 'templateType') {
            this.setState({ templateType: value == 'A' ? 'eCard' : 'pCard' });
        }

    }

    onSave = _.throttle(() => {
        this.form.validateFields((e, val) => {
            if (!e) {
                const { groupID, detail } = this.props;
                const { brandIDs = [] } = val;
                const params = {
                    ...val,
                    brandIDs: brandIDs.length ? brandIDs.join(',') : undefined,
                    groupID,
                    itemID: detail.itemID
                }
                addCardTemplate(params, detail.itemID ? 'edit' : 'add').then((res) => {
                    if (res) {
                        this.props.cancelEditPage(true);
                    }

                });
            }
        });

    }, 1500, { trailing: true })

    render() {
        const { detail, disabled, cancelEditPage, type } = this.props;
        const { templateType } = this.state;
        const { editPageFormKeys } = CARDS[templateType];
        const formItems = this.resetFormItems(detail);
        const { title, getDisabledKeys } = PAGE_TYPE[type]
        const disabledKeys = getDisabledKeys(detail);

        return (
            <section className={styles.formBox}>
                <div className={styles.header}>
                    {title}
                    <p className={styles.opBox}>
                        <Button onClick={cancelEditPage}>取消</Button>
                        <Button type="primary" disabled={disabled} onClick={this.onSave}>保存</Button>
                    </p>
                </div>
                <div>
                    <BaseForm
                        getForm={this.getForm}
                        formItems={formItems}
                        formKeys={editPageFormKeys}
                        formData={detail}
                        formItemLayout={formItemLayout}
                        onChange={this.handleFormChange}
                        disabledKeys={disabledKeys}
                    />
                </div>
            </section>
        );
    }
}


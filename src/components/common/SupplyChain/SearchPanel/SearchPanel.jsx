import React, { Component } from 'react'
import {
    Input,
    Select,
    Button,
    DatePicker,
    Radio,
} from 'antd'
import {
    SelectGood,
    SelectRepertory,
    SCTreeSelect,
    SCMonthPicker,
    SCDatePicker,
    SCSimpleSelect,
    SCMultipleSelect,
    SCRadioGroup,
} from '../../SupplyChain'
import {
    Form,
    Field,
} from 'redux-form'
import styles from './SearchPanel.less'
import moment from 'moment'

const {
    Option,
} = Select

const dataFormat = 'YYYY-MM-DD'
const monthFormat = 'YYYY-MM'
const now = moment(new Date())

const SearchPanel = (props) => {
    const {
        init,
        handleSubmit,
        onSubmit,
    } = props

    // 普通输入框
    const renderInputText = ({
        input,
        width,
        label,
        el,
    }) => {
        return (
            <div
                className={styles.element}
                style={{ width }}
            >
                <div
                    className={styles.label}
                    style={{ width: label.width }}
                >
                    <span className={styles.label}>
                        {label.name}
                    </span>
                </div>
                <div
                    className={styles.el}
                    style={{ width: el.width }}
                >
                    <Input {...input} />
                </div>
            </div>
        )
    }

    // 绑定redux字段
    const renderElement = (form, element, i) => {
        if (!element) return null

        switch (element.type) {
            case 'select-simple':
                return (
                    <Field
                        key={i}
                        name={element.name}
                        component={SCSimpleSelect}
                        wrapperStyles={styles}
                        width={element.width}
                        label={element.label}
                        el={element.el}
                    >
                        {
                            element.data.map((option, i) => {
                                return (
                                    <Option key={i} value={option.value}>
                                        {option.name}
                                    </Option>
                                )
                            })
                        }
                    </Field>
                )
            case 'select-multiple':
                return (
                    <Field
                        key={i}
                        name={element.name}
                        component={SCMultipleSelect}
                        wrapperStyles={styles}
                        width={element.width}
                        label={element.label}
                        el={element.el}
                    >
                        {
                            element.data.map((option, i) => {
                                return (
                                    <Option key={i} value={option.value}>
                                        {option.name}
                                    </Option>
                                )
                            })
                        }
                    </Field>
                )
            case 'select-tree':
                return (
                    <Field
                        key={i}
                        name={element.name}
                        component={SCTreeSelect}
                        wrapperStyles={styles}
                        width={element.width}
                        label={element.label}
                        multiple={
                            element.multiple || element.treeCheckable
                        }
                        showSearch={
                            element.showSearch ? element.showSearch : false
                        }
                        treeCheckable={
                            element.treeCheckable ? element.treeCheckable : false
                        }
                        treeData={element.data}
                        el={element.el}
                    >
                    </Field>
                )
            case 'select-good':
                return (
                    <Field
                        key={i}
                        formName={form}
                        name={element.name}
                        component={SelectGood}
                        wrapperStyles={styles}
                        width={element.width}
                        label={element.label}
                        multiple={element.multiple}
                        el={element.el}
                        valueKey={element.valueKey}
                        inputValueKey={element.inputValueKey}
                    >
                    </Field>
                )
            case 'select-repertory':
                return (
                    <Field
                        key={i}
                        formName={form}
                        name={element.name}
                        component={SelectRepertory}
                        wrapperStyles={styles}
                        width={element.width}
                        multiple={element.multiple}
                        label={element.label}
                        el={element.el}
                    >
                    </Field>
                )
            case 'input-text':
                return (
                    <Field
                        key={i}
                        name={element.name}
                        component={renderInputText}
                        width={element.width}
                        label={element.label}
                        el={element.el}
                    >
                    </Field>
                )
            case 'input-date':
                return (
                    <Field
                        key={i}
                        name={element.name}
                        component={SCDatePicker}
                        wrapperStyles={styles}
                        width={element.width}
                        label={element.label}
                        el={element.el}
                    >
                    </Field>
                )
            case 'input-month':
                return (
                    <Field
                        key={i}
                        name={element.name}
                        component={SCMonthPicker}
                        wrapperStyles={styles}
                        width={element.width}
                        label={element.label}
                        el={element.el}
                    >
                    </Field>
                )
            case 'radio-group':
                return (
                    <Field
                        key={i}
                        name={element.name}
                        component={SCRadioGroup}
                        wrapperStyles={styles}
                        width={element.width}
                        label={element.label}
                        el={element.el}
                    >
                        {
                            element.data.map((v, i) => {
                                return (
                                    <Radio key={i} value={v.value}>
                                        {v.name}
                                    </Radio>
                                )
                            })
                        }
                    </Field>
                )
            default: return null
        }
    }

    return (
        <div className={styles.SearchPanel}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {
                        init.normal && init.normal.map((element, i) => {
                            return renderElement(init.name, element, i)
                        })
                    }
                    <div className={styles.button}>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
							查询
                        </Button>
                    </div>
                </div>
                <div>
                    {
                        init.more && init.more.map((element, i) => {
                            return renderElement(init.name, element, i)
                        })
                    }
                </div>
            </Form>
        </div>
    )
}

export default SearchPanel

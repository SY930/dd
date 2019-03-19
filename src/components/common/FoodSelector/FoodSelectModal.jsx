import React, {Component} from 'react';
import {
    Modal,
    Row,
} from 'antd';
import classnames from 'classnames'
import CheckboxList from '../CheckboxList'
import SelectedList from '../FilterSelector/SelectedList'
import style from '../FilterSelector/assets/FilterSelector.less'

const DEFAULT_CATEGORY_COLUMNS = [
    {
        title: '所属品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        fixed: 'left',
        width: 100,
        className: 'TableTxtLeft',
        render: (text, record, index) => {
            return <span title={text}>{text}</span>
        },
    },
    {
        title: '菜品分类',
        dataIndex: 'foodCategoryName',
        key: 'foodCategoryName',
        fixed: 'left',
        className: 'TableTxtLeft',
        render: (text, record, index) => {
            return <span title={text}>{text}</span>
        },
    },
];
const DEFAULT_FOOD_COLUMNS = [
    {
        title: '所属品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        fixed: 'left',
        width: 60,
        className: 'TableTxtLeft',
        render: (text, record, index) => {
            return <span title={text}>{text}</span>
        },
    },
    {
        title: '菜品分类',
        dataIndex: 'foodCategoryName',
        key: 'foodCategoryName',
        fixed: 'left',
        width: 60,
        className: 'TableTxtLeft',
        render: (text, record, index) => {
            return <span title={text}>{text}</span>
        },
    },
    {
        title: '菜品名称',
        dataIndex: 'foodName',
        key: 'foodName',
        fixed: 'left',
        className: 'TableTxtLeft',
        render: (text, record, index) => {
            const {
                foodName,
                unit
            } = record;
            const displayName = `${foodName}(${unit})`
            return <span title={displayName}>{displayName}</span>
        },
    },
];

export default class FoodSelectModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            /** 菜品分类模式状态 */
            selectedBrandIDs: [],
            selectedCategoryResults: props.mode === 'category' ? props.initialValue.slice() : [],
            /** 单品模式状态 */
            currentBrandID: '0',
            selectedCategories: [],
            selectedDishResults: props.mode === 'dish' ? props.initialValue.slice() : [],
        }
    }

    handleOk = () => {
        const { onOk, mode} = this.props;
        const {
            selectedCategoryResults,
            selectedDishResults,
        } = this.props;
        onOk(mode === 'category' ? selectedCategoryResults : selectedDishResults);
    }
    /** 分类模式相关handler开始 */
    handleCategoryResultsChange = (valueArray) => {
        this.setState({
            selectedCategoryResults: valueArray,
        })
    }
    handleSelectedBrandIDsChange = (valueArray) => {
        this.setState({
            selectedBrandIDs: valueArray,
        })
    }
    /** 分类模式相关handler结束 */

    /** 单品模式相关handler开始 */
    handleCurrentBrandChange = (brand) => {
        if (brand !== this.state.currentBrandID) {
            this.setState({
                currentBrandID: brand,
                selectedCategories: [],
            })
        }
    }
    handleCategoriesChange = (valueArray) => {
        this.setState({
            selectedCategories: valueArray,
        })
    }
    handleDishResultsChange = (valueArray) => {
        this.setState({
            selectedDishResults: valueArray,
        })
    }
    /** 单品模式相关handler结束 */

    /** 分类模式窗口内容 */
    renderCategorySelector() {
        const {
            tableColumns = DEFAULT_CATEGORY_COLUMNS,
            allBrands = [], // [{value: String}]
            allCategories = [], // [{value: String}]
        } = this.props;
        const {
            selectedBrandIDs,
            selectedCategoryResults
        } = this.state;
        const filteredCategoryOptions = selectedBrandIDs.length ? allCategories
            .filter(({brandID}) => selectedBrandIDs.includes(`${brandID}`)) : allCategories;
        const selectedItems = allCategories.filter(category => selectedCategoryResults.includes(category.value))
        return (
            <div className={style.hllFilterSelector}>
                <Row type="flex">
                    <div className={style.filterList}>
                        <CheckboxList
                            width={200}
                            showCheckAll={false}
                            options={allBrands}
                            value={selectedBrandIDs}
                            onChange={this.handleFilterChange}
                        />
                    </div>
                    <div className={style.resultList}>
                        <CheckboxList
                            display="table"
                            showCollapse={false}
                            options={filteredCategoryOptions}
                            value={selectedCategoryResults}
                            tableColumns={tableColumns}
                            onChange={this.handleCategoryResultsChange}
                        />
                    </div>
                </Row>
                <SelectedList
                    title="所选分类"
                    className={style.selectedList}
                    display="table"
                    items={selectedItems}
                    tableColumns={tableColumns}
                    onChange={this.handleCategoryResultsChange}
                />
            </div>
        )
    }
    /** 单品模式窗口内容 */
    renderDishSelector() {
        const {
            tableColumns = DEFAULT_FOOD_COLUMNS,
            allBrands = [], // [{value: String}]
            allCategories = [], // [{value: String}]
            allDishes = [], // [{value: String}]
        } = this.props;
        const {
            currentBrandID,
            selectedCategories,
            selectedDishResults,
        } = this.state;
        const filteredCategoryOptions = allCategories
            .filter(item => currentBrandID === `${item.brandID}`)
        const filteredDishesOptions = filteredCategoryOptions.length ?
            allDishes.filter(({localFoodCategoryID}) => selectedCategories.includes(localFoodCategoryID)) :
            allDishes.filter(({brandID}) => currentBrandID === `${brandID}`)
        const selectedItems = allDishes.filter(({value}) => selectedDishResults.includes(value))
        return (
            <div className={style.hllFilterSelector}>
                <div className={style.filterKeyList}>
                    {allBrands.map(({ value, label }) => (
                        <span
                            key={value}
                            className={classnames(style.filterKey, {
                                [style.active]: value === currentBrandID,
                            })}
                            role="button"
                            tabIndex="0"
                            onClick={() => this.handleCurrentBrandChange(value)}
                        >
                            {label}
                        </span>
                    ))}
                </div>
                <Row type="flex">
                    <div className={style.filterList}>
                        <CheckboxList
                            width={200}
                            showCheckAll={false}
                            options={filteredCategoryOptions}
                            value={selectedCategories}
                            onChange={this.handleCategoriesChange}
                        />
                    </div>
                    <div className={style.resultList}>
                        <CheckboxList
                            display="table"
                            showCollapse={false}
                            options={filteredDishesOptions}
                            value={selectedDishResults}
                            tableColumns={tableColumns}
                            onChange={this.handleDishResultsChange}
                        />
                    </div>
                </Row>
                <SelectedList
                    title="所选菜品"
                    className={style.selectedList}
                    display="table"
                    items={selectedItems}
                    tableColumns={tableColumns}
                    onChange={this.handleDishResultsChange}
                />
            </div>
        )
    }
    render() {
        const {
            tableColumns,
            options,
            mode = 'category',
            onCancel,
        } = this.props;
        return (
            <Modal
                onOk={this.handleOk}
                onCancel={onCancel}
                visible={true}
                maskClosable={false}
            >
                {
                    mode === 'category' ? this.renderCategorySelector() : this.renderDishSelector()
                }
            </Modal>
        )
    }
}

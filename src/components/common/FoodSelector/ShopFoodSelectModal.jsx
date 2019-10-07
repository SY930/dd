import React, {Component} from 'react';
import {
    Modal,
    Row,
    Tooltip,
} from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import CheckboxList from '../CheckboxList'
import SelectedList from '../FilterSelector/SelectedList'
import style from '../FilterSelector/assets/FilterSelector.less'
import { isProfessionalTheme } from '../../../helpers/util'

const CATEGORY_TYPES = [
    {
        value: '0',
        label: '常规分类',
    },
    {
        value: '1',
        label: '线上分类',
    },
]

const DEFAULT_CATEGORY_COLUMNS = [
    {
        title: '菜品分类',
        dataIndex: 'foodCategoryName',
        key: 'foodCategoryName',
        fixed: 'left',
        className: 'TableTxtLeft',
        render: (text) => {
            return <Tooltip title={text}>{text}</Tooltip>
        },
    },
];

const DEFAULT_FOOD_COLUMNS = [
    {
        title: '菜品分类',
        dataIndex: 'foodCategoryName',
        key: 'foodCategoryName',
        fixed: 'left',
        width: 100,
        className: 'TableTxtLeft',
        render: (text) => {
            return <Tooltip title={text}>{text}</Tooltip>
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
            return <Tooltip title={displayName}>{displayName}</Tooltip>
        },
    },
];
class FoodSelectModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            /** 菜品分类模式状态 */
            selectedCategoryTypes: [],
            selectedCategoryResults: props.mode === 'category' ? props.initialValue.slice() : [],
            /** 单品模式状态 */
            selectedCategories: [],
            selectedDishResults: props.mode === 'dish' ? props.initialValue.slice() : [],
        }
    }

    handleOk = () => {
        const { onOk, mode} = this.props;
        const {
            selectedCategoryResults,
            selectedDishResults,
        } = this.state;
        onOk(mode === 'category' ? selectedCategoryResults : selectedDishResults);
    }

    /** 分类模式相关handler开始 */
    handleCategoryResultsChange = (valueArray) => {
        this.setState({
            selectedCategoryResults: valueArray,
        })
    }
    handleSelectedTypesChange = (valueArray) => {
        this.setState({
            selectedCategoryTypes: valueArray,
        })
    }
    /** 分类模式相关handler结束 */

    /** 单品模式相关handler开始 */
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
            allCategories = [], // [{value: String}]
        } = this.props;
        const {
            selectedCategoryTypes,
            selectedCategoryResults
        } = this.state;
        let filteredCategoryOptions = allCategories;
        if (selectedCategoryTypes.length === 1) { // 目前只有2种分类类型，不选或选2个都等于不过滤
            filteredCategoryOptions = filteredCategoryOptions.filter(item => item.typeSet.has(selectedCategoryTypes[0]))
        }
        const selectedItems = allCategories.filter(category => selectedCategoryResults.includes(category.value));
        return (
            <div className={style.hllFilterSelector}>
                <Row type="flex">
                    <div className={style.filterList}>
                        <CheckboxList
                            width={200}
                            showCheckAll={false}
                            options={CATEGORY_TYPES}
                            value={selectedCategoryTypes}
                            onChange={this.handleSelectedTypesChange}
                        />
                    </div>
                    <div className={style.resultList}>
                        <CheckboxList
                            display="table"
                            showCollapse={false}
                            showCheckAll={true}
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
            allCategories = [], // [{value: String}]
            allDishes = [], // [{value: String}]
            multiple,
        } = this.props;
        const {
            selectedCategories,
            selectedDishResults,
        } = this.state;        
        let filteredDishesOptions = selectedCategories.length ?
            allDishes.filter(({localFoodCategoryID, onlineFoodCategoryID}) => 
            selectedCategories.includes(localFoodCategoryID) ||
            selectedCategories.includes(onlineFoodCategoryID)
        ) :
            allDishes;
        // 单选模式，禁用掉其它菜
        if (!multiple && selectedDishResults.length) {
            filteredDishesOptions = filteredDishesOptions.map(dish => ({...dish, disabled: !selectedDishResults.includes(dish.value)}))
        }
        const selectedItems = allDishes.filter(({value}) => selectedDishResults.includes(value))
        return (
            <div className={isProfessionalTheme() ? style.hllFilterSelectorPro : style.hllFilterSelector}>
                <Row type="flex">
                    <div className={style.filterList}>
                        <CheckboxList
                            width={200}
                            showCheckAll={false}
                            options={allCategories}
                            value={selectedCategories}
                            onChange={this.handleCategoriesChange}
                        />
                    </div>
                    <div className={style.resultList}>
                        <CheckboxList
                            display="table"
                            showCollapse={false}
                            showCheckAll={multiple}
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
            mode = 'dish',
            onCancel,
        } = this.props;
        return (
            <Modal
                onOk={this.handleOk}
                onCancel={onCancel}
                title={mode === 'category' ? '选择菜品分类' : '选择菜品'}
                width={700}
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

FoodSelectModal.propTypes = {
    mode: PropTypes.oneOf(['category', 'dish']),
    /** 是否是多选模式(目前只支持菜品) */
    multiple: PropTypes.bool,
};

FoodSelectModal.defaultProps = {
    multiple: true,
};

export default FoodSelectModal;

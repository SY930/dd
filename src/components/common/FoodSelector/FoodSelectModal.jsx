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
        label: 'POS菜品分类',
    },
    {
        value: '1',
        label: '线上菜品分类',
    },
]

const DEFAULT_CATEGORY_COLUMNS = [
    {
        title: '所属品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        fixed: 'left',
        width: 160,
        className: 'TableTxtLeft',
        render: (text) => {
            return <Tooltip title={text}>{text}</Tooltip>
        },
    },
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
        title: '所属品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        fixed: 'left',
        width: 100,
        className: 'TableTxtLeft',
        render: (text) => {
            return <Tooltip title={text}>{text}</Tooltip>
        },
    },
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
const FAKE_ALL_BRANDID = '0';
const getNonBrandVal = (str) => {
    const index = str.indexOf('__');
    if (index === -1) return str;
    return str.substring(index)
}
/**
 * 不限品牌和某一品牌的值不能共存
 * @param {String[]} prev 
 * @param {String[]} curr 
 */
const excludeDuplicates = (prev, curr) => {
    // 取消某一项勾选的情况，不处理
    if (curr.length < prev.length) return curr;
    const groupLevel = [];
    let brandLevel = [];
    // 找出现在比以前多选的那些值,并把这些值按不限品牌还是特定品牌分开
    curr.filter(val => !prev.includes(val)).forEach(val => {
        if (val.startsWith(FAKE_ALL_BRANDID))  {
            groupLevel.push(val)
        } else {
            brandLevel.push(val)
        }
    })
    let filteredPrev = prev.slice();
    groupLevel.forEach(val => {
        brandLevel = brandLevel.filter(item => getNonBrandVal(item) !== getNonBrandVal(val));
        filteredPrev = filteredPrev.filter(item => getNonBrandVal(item) !== getNonBrandVal(val))
    })
    brandLevel.forEach(val => {
        filteredPrev = filteredPrev.filter(item => !item.startsWith(FAKE_ALL_BRANDID) || getNonBrandVal(item) !== getNonBrandVal(val))
    })
    
    return [...filteredPrev, ...groupLevel, ...brandLevel]
}

class FoodSelectModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            /** 共享状态 */
            currentBrandID: props.allBrands.length? props.allBrands[0].brandID : FAKE_ALL_BRANDID,
            /** 菜品分类模式状态 */
            selectedCategoryResults: props.mode === 'category' ? props.initialValue.slice() : [],
            selectedCategoryTypes: [],
            /** 单品模式状态 */
            selectedCategories: [],
            selectedDishResults: props.mode === 'dish' ? props.initialValue && props.initialValue.slice() : [],
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.allBrands !== this.props.allBrands) {
            this.setState({
                currentBrandID: nextProps.allBrands.length? nextProps.allBrands[0].brandID : FAKE_ALL_BRANDID,
            })
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
    handleCurrentBrandChange = (brand) => {
        if (brand !== this.state.currentBrandID) {
            this.setState({
                currentBrandID: brand,
                selectedCategories: [],
                selectedCategoryTypes: [],
            })
        }
    }
    /** 分类模式相关handler开始 */
    handleCategoryResultsChange = (valueArray) => {
        const { selectedCategoryResults: prevSelected } = this.state;
        this.setState({
            selectedCategoryResults: excludeDuplicates(prevSelected, valueArray),
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
        const { selectedDishResults: prevSelected } = this.state;
        this.setState({
            selectedDishResults: excludeDuplicates(prevSelected, valueArray),
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
            selectedCategoryTypes,
            currentBrandID,
            selectedCategoryResults
        } = this.state;
        let filteredCategoryOptions = allCategories.filter(({brandID}) => currentBrandID === brandID);
        if (selectedCategoryTypes.length === 1) { // 目前只有2种分类类型，不选或选2个都等于不过滤
            filteredCategoryOptions = filteredCategoryOptions.filter(item => item.typeSet.has(selectedCategoryTypes[0]))
        }
        const selectedItems = allCategories.filter(category => selectedCategoryResults.includes(category.value));
        return (
            <div className={style.hllFilterSelector}>
                <div
                    className={style.filterKeyList}
                    style={{
                        maxHeight: 80,
                        overflowY: 'auto',
                    }}
                >
                    {allBrands.map(({ value, label }) => (
                        <span
                            key={value}
                            style={{
                                marginBottom: 5,
                            }}
                            className={classnames(style.filterKey, {
                                [style.active]: value === currentBrandID,
                            })}
                            role="button"
                            tabIndex="0"
                            onClick={() => this.handleCurrentBrandChange(value)}
                            title={label}
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
            allBrands = [], // [{value: String}]
            allCategories = [], // [{value: String}]
            allDishes = [], // [{value: String}]
            multiple,
        } = this.props;
        const {
            currentBrandID,
            selectedCategories,
            selectedDishResults,
        } = this.state;        
        const filteredCategoryOptions = allCategories
            .filter(item => currentBrandID === `${item.brandID}`);
        let filteredDishesOptions = selectedCategories.length ?
            allDishes.filter(({localFoodCategoryID, onlineFoodCategoryID}) => 
            selectedCategories.includes(localFoodCategoryID) ||
            selectedCategories.includes(onlineFoodCategoryID)
        ) :
            allDishes.filter(({brandID}) => currentBrandID === `${brandID}`);
        // 单选模式，禁用掉其它菜
        if (!multiple && selectedDishResults.length) {
            filteredDishesOptions = filteredDishesOptions.map(dish => ({...dish, disabled: !selectedDishResults.includes(dish.value)}))
        }
        const selectedItems = allDishes.filter(({value}) => selectedDishResults.includes(value))
        return (
            <div className={isProfessionalTheme() ? style.hllFilterSelectorPro : style.hllFilterSelector}>
                <div
                    className={style.filterKeyList}
                    style={{
                        maxHeight: 80,
                        overflowY: 'auto',
                    }}
                >
                    {allBrands.map(({ value, label }) => (
                        <span
                            key={value}
                            style={{
                                marginBottom: 5,
                            }}
                            className={classnames(style.filterKey, {
                                [style.active]: value === currentBrandID,
                            })}
                            role="button"
                            tabIndex="0"
                            onClick={() => this.handleCurrentBrandChange(value)}
                            title={label}
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
            mode = 'category',
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

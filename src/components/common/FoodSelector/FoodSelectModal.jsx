import React, {Component} from 'react';
import {
    Modal,
    Row,
} from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import CheckboxList from '../CheckboxList'
import SelectedList from '../FilterSelector/SelectedList'
import style from '../FilterSelector/assets/FilterSelector.less'
import { isProfessionalTheme } from '../../../helpers/util'

const DEFAULT_CATEGORY_COLUMNS = [
    {
        title: '所属品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        fixed: 'left',
        width: 200,
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
        width: 120,
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
        width: 120,
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
            /** 菜品分类模式状态 */
            selectedBrandIDs: [],
            selectedCategoryResults: props.mode === 'category' ? props.initialValue.slice() : [],
            /** 单品模式状态 */
            currentBrandID: props.allBrands.length? props.allBrands[0].brandID : FAKE_ALL_BRANDID,
            selectedCategories: [],
            selectedDishResults: props.mode === 'dish' ? props.initialValue.slice() : [],
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
    /** 分类模式相关handler开始 */
    handleCategoryResultsChange = (valueArray) => {
        const { selectedCategoryResults: prevSelected } = this.state;
        this.setState({
            selectedCategoryResults: excludeDuplicates(prevSelected, valueArray),
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
            selectedBrandIDs,
            selectedCategoryResults
        } = this.state;
        const filteredCategoryOptions = selectedBrandIDs.length ? allCategories
            .filter(({brandID}) => selectedBrandIDs.includes(`${brandID}`)) : allCategories;
        const selectedItems = allCategories.filter(category => selectedCategoryResults.includes(category.value));
        /**
         * 当分类选择器右侧有 不限品牌 + 其它品牌时，由于excludeDuplicates（文件上方） 逻辑，全选框需要去掉
         */
        const isExcludeMode = (selectedBrandIDs.length === 0 && allBrands.length > 1) ||
            (selectedBrandIDs.length > 1 && selectedBrandIDs.includes(FAKE_ALL_BRANDID))
        return (
            <div
                className={style.hllFilterSelector}
            >
                <Row type="flex">
                    <div className={style.filterList}>
                        <CheckboxList
                            width={200}
                            showCheckAll={false}
                            options={allBrands}
                            value={selectedBrandIDs}
                            onChange={this.handleSelectedBrandIDsChange}
                        />
                    </div>
                    <div className={style.resultList}>
                        <CheckboxList
                            display="table"
                            showCollapse={false}
                            showCheckAll={!isExcludeMode}
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
            .filter(item => currentBrandID === `${item.brandID}` && allDishes.some(({localFoodCategoryID}) => localFoodCategoryID === item.value ));
        let filteredDishesOptions = selectedCategories.length ?
            allDishes.filter(({localFoodCategoryID}) => selectedCategories.includes(localFoodCategoryID)) :
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
                                marginBottom: 10,
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

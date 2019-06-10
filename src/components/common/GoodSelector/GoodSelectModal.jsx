import React, {Component} from 'react';
import {
    Modal,
    Row,
} from 'antd';
import PropTypes from 'prop-types';
import CheckboxList from '../CheckboxList'
import SelectedList from '../FilterSelector/SelectedList'
import style from '../FilterSelector/assets/FilterSelector.less'
import selfStyle from './style.less'

const DEFAULT_GOOD_COLUMNS = [
    {
        title: '图片',
        dataIndex: 'masterImagePath',
        key: 'masterImagePath',
        width: 100,
        className: 'TableTxtCenter',
        render: (text, record, index) => {
            return (
                <div className={selfStyle.imgTableCell}>
                    <img src={`http://res.hualala.com/${text}`} alt=""/>
                </div>
            )
        },
    },
    {
        title: '商品名称',
        dataIndex: 'goodName',
        key: 'goodName',
        className: 'TableTxtLeft',
        render: (text, record, index) => {
            return <span title={text}>{text}</span>
        },
    },
];

class GoodSelectModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCategories: [],
            selectedGoodResults: props.initialValue.slice(),
        }
    }

    handleOk = () => {
        const { onOk } = this.props;
        const {
            selectedGoodResults,
        } = this.state;
        onOk(selectedGoodResults);
    }

    handleCategoriesChange = (valueArray) => {
        this.setState({
            selectedCategories: valueArray,
        })
    }
    handleGoodResultsChange = (valueArray) => {
        this.setState({
            selectedGoodResults: valueArray,
        })
    }
    /** 单品模式相关handler结束 */

    /** 单品模式窗口内容 */
    renderDishSelector() {
        const {
            tableColumns = DEFAULT_GOOD_COLUMNS,
            allCategories = [], // [{value: String}]
            allDishes = [], // [{value: String}]
            multiple,
        } = this.props;
        const {
            selectedCategories,
            selectedGoodResults,
        } = this.state;
        let filteredDishesOptions = selectedCategories.length ?
            allDishes.filter(({categoryID}) => selectedCategories.includes(categoryID)) :
            allDishes;
            console.log('filteredDishesOptions', filteredDishesOptions)        

        // 单选模式，禁用掉其它
        if (!multiple && selectedGoodResults.length) {
            filteredDishesOptions = filteredDishesOptions.map(dish => ({...dish, disabled: !selectedGoodResults.includes(dish.value)}))
        }
        const selectedItems = allDishes.filter(({value}) => selectedGoodResults.includes(value))
        return (
            <div className={style.hllFilterSelector}>
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
                            value={selectedGoodResults}
                            tableColumns={tableColumns}
                            onChange={this.handleGoodResultsChange}
                        />
                    </div>
                </Row>
                <SelectedList
                    title="所选商品"
                    className={style.selectedList}
                    display="table"
                    items={selectedItems}
                    tableColumns={tableColumns}
                    onChange={this.handleGoodResultsChange}
                />
            </div>
        )
    }
    render() {
        const {
            onCancel,
        } = this.props;
        return (
            <Modal
                onOk={this.handleOk}
                onCancel={onCancel}
                title="选择商品"
                width={700}
                visible={true}
                maskClosable={false}
            >
                {this.renderDishSelector()} 
            </Modal>
        )
    }
}

GoodSelectModal.propTypes = {
    /** 是否是多选模式 */
    multiple: PropTypes.bool,
};

GoodSelectModal.defaultProps = {
    multiple: true,
};

export default GoodSelectModal;

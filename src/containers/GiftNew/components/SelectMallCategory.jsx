import React, {Component} from 'react';
import {
    Select,
    Form
} from 'antd';
const Option = Select.Option;

class SelectMallCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mallCategoryArr: props.dataSource instanceof Array ? props.dataSource : [],
            value: undefined,
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    componentDidMount() {
        // const { dataSource } = this.props;
    }

    componentWillReceiveProps(newProps) {
        const { dataSource } = newProps;

        if(this.props.dataSource !== dataSource) {
            this.setState({
                mallCategoryArr: dataSource instanceof Array ? dataSource : [],
            })
        }

    }


    handleSelectChange(value) {
        
        this.setState({
            value
        }, ()=>{
            if(typeof this.props.onChange == 'function') {
                this.props.onChange(value);
            }
        });
    }

    render() {
        let { mallCategoryArr = [], value } = this.state;
        return (
            <Select
                placeholder="请选择商品分类"
                notFoundContent={'未搜索到结果'}
                multiple={true}        // 单选
                allowClear={true}
                showSearch={false}
                optionFilterProp="children"
                value={value}
                onChange={this.handleSelectChange}
            >
                {
                    mallCategoryArr.map(category => <Option key={category.categoryID} value={category.categoryID}>{category.categoryName}</Option>)
                }
            </Select>
        )
    }
}

export default SelectMallCategory;

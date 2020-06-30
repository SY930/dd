import React, {Component} from 'react';
import {
    Select,
    Form
} from 'antd';
const Option = Select.Option;

class SelectMall extends Component {

    constructor(props) {
        super(props);
        this.state = {
            malls: []
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    componentDidMount() {
    
    }

    componentWillReceiveProps(newProps) {

    }


    handleSelectChange(value) {
        // const brandsToBeSentToParent = [];
        // const mergetBrands = this.getMergedBrands();
        // (value || []).forEach(id => {
        //     const index = mergetBrands.findIndex(brand => brand.value === id);
        //     if (index > -1) {
        //         brandsToBeSentToParent.push({targetID: mergetBrands[index].value, targetName: mergetBrands[index].label})
        //     }
        // });
        // this.props.onChange(brandsToBeSentToParent);
    }

    render() {
        const realValue = (this.props.value || []).map(target => String(target.targetID))
        return (
            <Select
                placeholder="请选择使用店铺"
                notFoundContent={'未搜索到结果'}
                multiple={false}        // 单选
                allowClear={true}
                showSearch={false}
                optionFilterProp="children"
                value={realValue}
                onChange={this.handleSelectChange}
            >
                {/* {
                    this.getMergedBrands().map(brand => <Option key={brand.value} value={brand.value}>{brand.label}</Option>)
                } */}
            </Select>
        )
    }
}

export default SelectMall;

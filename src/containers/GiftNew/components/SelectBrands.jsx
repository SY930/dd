import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Select,
    Row,
    Col,
    Form
} from 'antd';
import {fetchData} from "../../../helpers/util";
import { saveBrandsToStore } from '../_action'
const Option = Select.Option;
const FormItem = Form.Item;
const mapDispatchToProps = (dispatch) => {
    return {
        saveBrandsToStore: opt => dispatch(saveBrandsToStore(opt)),
    }
}

class SelectBrands extends Component {

    constructor(props) {
        super(props);
        this.state = {
            brands: []
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    componentDidMount() {
        fetchData('getShopBrand', { isActive: 1 }, null, { path: 'data.records' })
        .then((data) => {
            if (!data) return;
            const brands = [];
            data.map((d) => {
                brands.push({ value: d.brandID, label: d.brandName })
            });
            this.props.saveBrandsToStore(data);
            this.setState({ brands });
        });
    }

    getMergedBrands() {
        const { value } = this.props;
        const brandsFromValue = (value || []).map(target => ({value: String(target.targetID), label: target.targetName}));
        const mergedBrands = this.state.brands.slice();
        if (brandsFromValue.length) {
            brandsFromValue.forEach(item => {
                if (mergedBrands.findIndex(brand => brand.value === item.value) === -1) {
                    mergedBrands.push(item)
                }
            })
        }
        return mergedBrands;
    }

    handleSelectChange(value) {
        const brandsToBeSentToParent = [];
        const mergetBrands = this.getMergedBrands();
        (value || []).forEach(id => {
            const index = mergetBrands.findIndex(brand => brand.value === id);
            if (index > -1) {
                brandsToBeSentToParent.push({targetID: mergetBrands[index].value, targetName: mergetBrands[index].label})
            }
        });
        this.props.onChange(brandsToBeSentToParent);
    }

    render() {
        const realValue = (this.props.value || []).map(target => String(target.targetID))

        return (
            <Select
                placeholder="默认为全部品牌"
                notFoundContent={'未搜索到结果'}
                multiple={true}
                allowClear={true}
                showSearch={false}
                filterOption={false}
                value={realValue}
                onChange={this.handleSelectChange}
            >
                {
                    this.getMergedBrands().map(brand => <Option key={brand.value} value={brand.value}>{brand.label}</Option>)
                }
            </Select>
        )
    }
}

export default connect(null, mapDispatchToProps)(SelectBrands);

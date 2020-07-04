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
            malls: props.dataSource instanceof Array ? props.dataSource : [],
            value: undefined,
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    componentDidMount() {
        // const { dataSource } = this.props;
    }

    componentWillReceiveProps(newProps) {
        const { dataSource } = newProps;
        if(this.props.dataSource == dataSource) {
            this.setState({
                malls: dataSource
            });
        }
    }


    handleSelectChange(value) {        
        this.setState({
            value
        }, ()=>{
            // onChange 方法被表单代理
            if(typeof this.props.onChange == 'function') {
                this.props.onChange(value);
            }
            if(typeof this.props.onMallChange == 'function') {
                this.props.onMallChange(value);
            }
            
        });

        

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
        // const realValue = (this.props.value || []).map(target => String(target.targetID));
        let { malls = [], value } = this.state;
        if (malls == null)  {
            malls = [];
        }
        return (
            <Select
                placeholder="请选择使用店铺"
                notFoundContent={'未搜索到结果'}
                multiple={false}        // 单选
                allowClear={true}
                showSearch={false}
                optionFilterProp="children"
                value={value}
                onChange={this.handleSelectChange}
            >
                {
                    malls.map(shop => <Option key={shop.shopID} value={shop.shopID}>{shop.shopName}</Option>)
                }
            </Select>
        )
    }
}

export default SelectMall;

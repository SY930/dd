/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-05T16:09:22+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: HualalaGroupSelect.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-05-03T18:57:05+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import { Checkbox, Col, message } from 'antd';
import React from 'react';
import styles from './treeSelect.less';

const CheckboxGroup = Checkbox.Group;

class HualalaGroupSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allDisabled: false,     //选项是否可用
            options: [],
            title: '全选',

            checkAll: false,
            selected: [],
        };

        this.onCheckAllChange = this.onCheckAllChange.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onCheckAllChange() {
        let {limitNum = 0, selectedNum = 0} = this.props
        let selected = [];
        if (!this.state.checkAll) {
            selected = this.state.options.map((option) => {
                return option.value;
            });
        }
        // 兼容无限制参数组件
        if(limitNum || selectedNum){
            if(selected.length + selectedNum <= limitNum){
                this.setState({
                    checkAll: !this.state.checkAll,
                    selected,
                });
            }else{
                message.warning(`共享组选项不能超过${limitNum}个`)
                return;
            }
        }else{
            this.setState({
                checkAll: !this.state.checkAll,
                selected,
            });
        }

        if (this.props.onChange) {
            this.props.onChange(selected)
        }
    }

    onChange(value) {
        // by default, the checkAll is false
        let checkAll = false;

        if (value instanceof Array) {
            if (value.length === this.state.options.length) {
                checkAll = true
            }
        }
        this.setState({
            selected: value,
            checkAll,
        });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    /**
     * 从微信商城商品中取到price 和 point
     * @param price
     * @param point
     * @returns {string}
     */
    helper = ({price, foodScore: point}) => {
        if (price >= 0 && point >= 0) {
            return `${point}积分+${price}元`
        } else if (price >= 0) {
            return `${price}元`
        } else if (point >= 0) {
            return `${point}积分`
        }
    }

    componentDidMount() {
        if (this.props.options instanceof Array) {
            const options = this.props.options;
            this.setState({
                options: options.map((item, index) => {
                    return {
                        key: item[this.props.labelKey],
                        // label: item[this.props.labelKey] || `${item[this.props.labelKey]}+${item.unit}`,
                        label: item[this.props.labelKey] || `${item.foodName}  (${item.unit}) ( ${!this.props.isWeChatMall ?
                            `售价：${item.prePrice==-1?item.price:item.prePrice}元` : `积分/现金售价：${this.helper(item)}`})`,
                        value: item[this.props.valueKey],
                    }
                }),
            });
        }
    }
    /*
    selected: nextProps.value || [],
    checkAll: false
    isLimit  是否数量限制
     */
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                options: nextProps.options.map((item, index) => {
                    return {
                        key: `${index}`,
                        label: item[this.props.labelKey] || `${item.foodName}  (${item.unit}) ( ${!this.props.isWeChatMall ?
                            `售价：${item.prePrice == -1 ? item.price : item.prePrice}元` : `积分/现金售价：${this.helper(item)}`})`,
                        value: item[nextProps.valueKey],
                    }
                }),
                selected: nextProps.value || [],
                checkAll: nextProps.value.length !== 0 && nextProps.options.length === nextProps.value.length,
                allDisabled: nextProps.isLimit
            })
        }
    }

    render() {
        let {selected, allDisabled} = this.state
        if (this.state.checkAll) {
            selected = [];

            selected = this.state.options.map((options) => {
                return options.value
            });
        }

        return (
            <Col
                span={16}
                style={{
                    paddingLeft: 10,
                }}
            >
                <div className={styles.SelectLevel2}>
                    <div className={styles.SelectLevelTop}>
                        <div className={styles.Sche}>
                            <Checkbox onChange={this.onCheckAllChange} disabled={allDisabled} defaultChecked={this.state.checkAll} checked={this.state.checkAll}></Checkbox>
                        </div>
                        <div className={styles.Stit}>
                            {this.state.title}
                        </div>
                    </div>
                    <div className={styles.SelectLevelB} style={{ height:300 }}>
                        <CheckboxGroup options={this.state.options} disabled={allDisabled} value={selected} onChange={this.onChange} />
                    </div>
                </div>
            </Col>
        );
    }
}

HualalaGroupSelect.propTypes = {
    onChange: React.PropTypes.func,
    options: React.PropTypes.array,
    labelKey: React.PropTypes.string,
    valueKey: React.PropTypes.string,
}

HualalaGroupSelect.defaultProps = {
    onChange: () => {},
    options: [],
    labelKey: 'itemName',
    valueKey: 'itemID',
}

export default HualalaGroupSelect;

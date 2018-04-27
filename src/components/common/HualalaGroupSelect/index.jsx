/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-05T16:09:22+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: HualalaGroupSelect.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-05-03T18:57:05+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import { Checkbox, Col } from 'antd';
import React from 'react';
import styles from './treeSelect.less';

const CheckboxGroup = Checkbox.Group;

class HualalaGroupSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [],
            title: '全选',

            checkAll: false,
            selected: [],
        };

        this.onCheckAllChange = this.onCheckAllChange.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onCheckAllChange() {
        let selected = [];
        if (!this.state.checkAll) {
            selected = this.state.options.map((option) => {
                return option.value;
            });
        }
        this.setState({
            checkAll: !this.state.checkAll,
            selected,
        });

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

    componentDidMount() {
        if (this.props.options instanceof Array) {
            const options = this.props.options;
            this.setState({
                options: options.map((item, index) => {
                    return {
                        key: item[this.props.labelKey],
                        // label: item[this.props.labelKey] || `${item[this.props.labelKey]}+${item.unit}`,
                        label: item[this.props.labelKey] || `${item.foodName}  (${item.unit}) (售价：${item.prePrice==-1?item.price:item.prePrice}元)`,
                        value: item[this.props.valueKey],
                    }
                }),
            });
        }
    }
    /*
    selected: nextProps.value || [],
    checkAll: false
     */
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                options: nextProps.options.map((item, index) => {
                    return {
                        key: `${index}`,
                        label: item[nextProps.labelKey] || `${item.foodName}  (${item.unit}) (售价：${item.prePrice==-1?item.price:item.prePrice}元)`,
                        value: item[nextProps.valueKey],
                    }
                }),
                selected: nextProps.value || [],
                checkAll: nextProps.value.length !== 0 && nextProps.options.length === nextProps.value.length,
            })
        }
    }

    render() {
        let selected = this.state.selected;
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
                            <Checkbox onChange={this.onCheckAllChange} defaultChecked={this.state.checkAll} checked={this.state.checkAll}></Checkbox>
                        </div>
                        <div className={styles.Stit}>
                            {this.state.title}
                        </div>
                    </div>
                    <div className={styles.SelectLevelB} style={{ height:300 }}>
                        <CheckboxGroup options={this.state.options} value={selected} onChange={this.onChange} />
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

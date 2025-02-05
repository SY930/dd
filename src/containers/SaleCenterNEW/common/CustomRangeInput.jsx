/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-15T15:29:22+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: CustomRangeInput.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-06T20:18:11+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React, { PropTypes } from 'react';
import {
    Form, Input, Button, Col, Row, InputNumber, Icon,
} from 'antd';
import PriceInput from './PriceInput';
import styles from '../ActivityPage.less';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';

@injectIntl()
class CustomRangeInput extends React.Component {
    constructor(props) {
        super(props);
        const { intl } = props;
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);
        const { value } = this.props;
        this.state = {
            start: value ? value.start : null,
            end: value ? value.end : null,
            last: value ? value.last : null,
            addonBefore: this.props.addonBefore || SALE_LABEL.k5nh214x,
            addonAfter: this.props.addonAfter || k5ezdbiy,
            addonAfterUnit: this.props.addonAfterUnit,
        };

        this.onStartChange = this.onStartChange.bind(this);
        this.onEndChange = this.onEndChange.bind(this);
    }

    componentDidMount() {
        const value = this.props.value;
        this.setState({
            start: value.start,
            end: value.end,
        });
    }

    componentWillReceiveProps(nextProps) {
        const value = nextProps.value;
        this.setState({
            start: value.start,
            end: value.end,
        });
        if (this.props.addonAfterUnit != nextProps.addonAfterUnit) {
            this.setState({ addonAfterUnit: nextProps.addonAfterUnit });
        }
        if (this.props.addonAfter != nextProps.addonAfter) {
            this.setState({ addonAfter: nextProps.addonAfter });
        }
        if (this.props.addonBefore != nextProps.addonBefore) {
            this.setState({ addonBefore: nextProps.addonBefore })
        }
    }

    onStartChange(value) {
        this.setState({
            'start': value.number,
        });

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, { 'start': value.number }));
        }
    }

    onEndChange(value) {
        this.setState({
            'end': value.number,
        });
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, { 'end': value.number }));
        }
    }

    onLastChange = (value) => {
        this.setState({
            last: value.number,
        });
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, { last: value.number }));
        }
    }

    render() {
        const {
            firstInputAppend,
            discountMode,
            promotionType,
            ruleType,
        } = this.props
        if(promotionType == '2010' && (ruleType == '1' || ruleType == '4')) {
            return (
                <Row className={styles.rightInput} gutter={6} style={{ display: 'flex', alignItems: 'center' }}>
                    <Col span={10}>
                        <PriceInput
                            disabled={this.props.disabled}
                            addonBefore={this.state.addonBefore}
                            placeholder={this.props.startPlaceHolder}
                            addonAfter={this.state.addonAfter}
                            onChange={this.onStartChange}
                            value={{ number: this.state.start }}
                            modal={"float"}
                        />
                    </Col>
                    <Col style={{ margin: '0 5px' }}>减</Col>
                    <Col span={4}>
                        <PriceInput
                            discountMode={this.props.discountMode}
                            placeholder={this.props.endPlaceHolder}
                            addonAfter={this.state.addonAfterUnit}
                            onChange={this.onEndChange}
                            value={{ number: this.state.end }}
                            modal={"float"}
                        />
                    </Col>
                    <Col style={{ margin: '0 5px' }}>最高优惠</Col>
                    <Col span={5}>
                        <PriceInput
                            discountMode={this.props.discountMode}
                            placeholder={'不填则不限制'}
                            addonAfter={'元'}
                            onChange={this.onLastChange}
                            value={{ number: this.state.last }}
                            modal={"float"}
                        />
                    </Col>
                </Row>
            )
        }
        return (
            <Row
                className={styles.rightInput}
                gutter={6}
            >
                <Col span={firstInputAppend ? 5 : discountMode ? 10 : 13}>
                    <PriceInput
                        disabled={this.props.disabled}
                        addonBefore={firstInputAppend ? "" : this.state.addonBefore}
                        placeholder={firstInputAppend ? "" : this.props.startPlaceHolder}
                        addonAfter={firstInputAppend ? "" : this.state.addonAfter}
                        onChange={this.onStartChange}
                        value={{ number: this.state.start }}
                        modal={firstInputAppend ? "int" : "float"}
                    />
                </Col>

                <Col span={firstInputAppend ? 6 : discountMode ? 3 : 4}>
                    <div style={firstInputAppend ? { marginTop: 7, marginLeft: 5, } : {}}>{this.props.relation || SALE_LABEL.k5nh21d9}</div>
                </Col>

                <Col span={firstInputAppend ? 5 : discountMode ? 11 : 7}>
                    <PriceInput
                        discountMode={this.props.discountMode}
                        placeholder={this.props.endPlaceHolder}
                        addonAfter={firstInputAppend ? '份' : this.state.addonAfterUnit}
                        onChange={this.onEndChange}
                        // addonAfter={firstInputAppend ? "份" : '1'}
                        value={{ number: this.state.end }}
                        modal={firstInputAppend ? "int" : "float"}
                    />
                </Col>
            </Row >
        );
    }
}

export default CustomRangeInput;

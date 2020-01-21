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
import { Form, Input, Button, Col, Row, InputNumber, Icon,
} from 'antd';
import PriceInput from './PriceInput';
import styles from '../ActivityPage.less';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

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
            addonBefore: this.props.addonBefore || SALE_LABEL.k5nh214x,
            addonAfter: this.props.addonAfter || k5ezdbiy,
            addonAfterUnit: this.props.addonAfterUnit || k5ezdbiy,
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
        if (this.props.addonAfterUnit != nextProps.addonAfterUnit && this.props.addonAfter != nextProps.addonAfter) {
            this.setState({ addonAfterUnit: nextProps.addonAfterUnit, addonAfter: nextProps.addonAfter });
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

    render() {
        return (
            <Row
                className={styles.rightInput}
            >
                <Col span={13}>
                    <PriceInput
                        disabled={this.props.disabled}
                        addonBefore={this.state.addonBefore}
                        placeholder={this.props.startPlaceHolder}
                        addonAfter={this.state.addonAfter}
                        onChange={this.onStartChange}
                        value={{ number: this.state.start }}
                        modal="float"
                    />
                </Col>

                <Col span={4}>
                    <div>{this.props.relation || SALE_LABEL.k5nh21d9}</div>
                </Col>

                <Col span={7}>
                    <PriceInput
                        discountMode={this.props.discountMode}
                        placeholder={this.props.endPlaceHolder}
                        addonAfter={this.state.addonAfterUnit}
                        onChange={this.onEndChange}
                        value={{ number: this.state.end }}
                        modal="float"
                    />
                </Col>
            </Row>
        );
    }
}

export default CustomRangeInput;

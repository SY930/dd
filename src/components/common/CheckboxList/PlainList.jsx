import React, { Component } from 'react';
import { Checkbox } from 'antd';
import LazyLoad, { forceCheck } from '@hualala/react-lazyload';
import PropTypes from 'prop-types';

import styles from './styles.less';

class PlainList extends Component {
    componentDidUpdate() {
        forceCheck();
    }

    render() {
        const { value, options, onCheck } = this.props;
        return (
            <ul className={styles.list}>
                {options.map(({ value: optVal, label, disabled }) => (
                    <LazyLoad
                        key={optVal}
                        height={28}
                        overflow={true}
                        offset={560}
                    >
                        <li className={styles.item}>
                            <Checkbox
                                checked={value.indexOf(optVal) > -1}
                                disabled={disabled}
                                onChange={evt => onCheck(evt.target.checked, optVal)}
                            >
                                {label}
                            </Checkbox>
                        </li>
                    </LazyLoad>
                ))}
            </ul>
        );
    }
}

PlainList.defaultProps = {
    value: [],
    options: [],
    onCheck() {},
};

PlainList.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
        disabled: PropTypes.bool,
    })),
    onCheck: PropTypes.func,
};

export default PlainList;

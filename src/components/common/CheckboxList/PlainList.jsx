import React, { Component } from 'react';
import { Checkbox } from 'antd';
import { forceCheck } from '@hualala/react-lazyload';
import PropTypes from 'prop-types';
import { CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import './styles.less';
import styles from './styles.less';

class PlainList extends Component {
    componentDidUpdate() {
        forceCheck();
    }

    render() {
        const { value, options, onCheck } = this.props;        
        const cache = new CellMeasurerCache({
            defaultHeight: 28,
        });

        function rowRenderer ({ index, isScrolling, key, parent, style }) {
            let currentItem = options[index];
            let { value: optVal, label, disabled } = currentItem;
            return (
                <CellMeasurer
                    cache={cache}
                    columnIndex={0}
                    key={key}
                    parent={parent}
                    rowIndex={index}
                >
                    {({ measure, registerChild }) => (
                        <li className="item" key={key} style={style} ref={registerChild}>
                            <Checkbox
                                checked={value.indexOf(optVal) > -1}
                                disabled={disabled}
                                onChange={evt => onCheck(evt.target.checked, optVal)}
                            >
                                { label }
                            </Checkbox>
                        </li>
                    )}
                </CellMeasurer>
            );
        }
        
        return (
            <ul>
                {
                    <List
                        width={300}
                        height={193}
                        rowCount={options.length}
                        rowHeight={cache.rowHeight}
                        rowRenderer={rowRenderer}
                        className={styles.virtualizedListBox}
                    />
                }
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag, Icon } from 'antd';

import style from './EditableTags.less';

class EditableTags extends Component {
    handleClose = (evt, value) => {
        evt.preventDefault();
        this.props.onClose(value);
    }

    render() {
        const { title, placeholder, items, onAdd } = this.props;

        return items.length > 0 ? (
            <div className={style.wrapper}>
                <div className={style.itemsWrapper}>
                    {items.map(item => (
                        <Tag
                            key={item.value}
                            className={style.item}
                            closable={true}
                            onClose={evt => this.handleClose(evt, item.value)}
                        >
                            {item.label}
                        </Tag>
                    ))}
                </div>
                <Icon type="plus-circle-o" title={`添加${title}`} onClick={onAdd} />
            </div>
        ) : (
            <div className={`${style.wrapper} ${style.empty}`}>
                <Icon type="plus-circle-o" title={`添加${title}`} onClick={onAdd} />
                {placeholder && <div>{placeholder}</div>}
            </div>
        );
    }
}

EditableTags.defaultProps = {
    title: '',
    placeholder: '',
    items: [],
    onAdd() {},
    onClose() {},
};

EditableTags.propTypes = {
    /** 待添加项目的名称 */
    title: PropTypes.string,
    /** 未添加项目时显示的内容 */
    placeholder: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    /** 当前显示的项目 */
    items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.label,
        [PropTypes.any]: PropTypes.any,
    })),
    /** 添加项目时的回调 */
    onAdd: PropTypes.func,
    /** 移除项目时的回调 */
    onClose: PropTypes.func,
};

export default EditableTags;

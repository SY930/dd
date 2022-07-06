import React from 'react';
import { checkPermission } from '../../../helpers/util';

class Authority extends React.Component {
    disabled = true

    componentWillMount() {
        this.disabled = !checkPermission(this.props.rightCode);
    }

    componentWillReceiveProps(nextProps) {
        this.disabled = this.props.rightCode === nextProps.rightCode ? this.disabled
            : !checkPermission(nextProps.rightCode);
    }

    renderChild(child) {
        if (!React.isValidElement(child)) return child;
        const { rightCode, children, ...otherProps } = this.props;
        const disabled = this.disabled === true || child.props.disabled;
        return React.cloneElement(child, {
            ...otherProps,
            disabled,
            style: disabled ? {
                ...child.props.style,
                'cursor': 'not-allowed',
                'pointerEvents': 'none',
                'opacity': '.65',
                'filter': 'alpha(opacity=65)',
            } : child.props.style,
        });
    }

    render() {
        const { children } = this.props;
        return (!children || !children.length) ? this.renderChild(children) : (
            <span>
                {React.Children.map(children, child => this.renderChild(child))}
            </span>
        );
    }
}

export default Authority;

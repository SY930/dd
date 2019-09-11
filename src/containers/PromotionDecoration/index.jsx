import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
} from 'antd';

import registerPage from '../../../index';
import { jumpPage, closePage } from '@hualala/platform-base';
import style from './style.less'
import {
    PROMOTION_DECORATION,
} from '../../constants/entryCodes';
import SimpleDecorationBoard from './SimpleDecorationBoard';
import CommentSendGiftDecorationBoard from './CommentSendGiftDecorationBoard';
const mapStateToProps = (state) => {
    return {
        id: state.sale_promotion_decoration.getIn(['currentPromotion', 'id']),
        title: state.sale_promotion_decoration.getIn(['currentPromotion', 'title']),
        type: state.sale_promotion_decoration.getIn(['currentPromotion', 'type']),
        decorationInfo: state.sale_promotion_decoration.get('decorationInfo'),
    };
};

@registerPage([PROMOTION_DECORATION])
@connect(mapStateToProps)
export default class PromotionDecoration extends Component {

    componentDidMount() {
        if (!this.props.id) {
            closePage();
        }
    }

    handleCancel = () => {

    }
    handleSave = () => {

    }
    handleReset = () => {

    }

    renderHeader() {
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    活动装修
                </span>
                <div className={style.spacer} />
                <Button
                    type="ghost"
                    icon="rollback"
                    onClick={this.handleCancel}
                    style={{ marginRight: 12 }}
                >
                    返回
                </Button>
                <Button
                    type="ghost"
                    onClick={this.handleReset}
                    style={{ marginRight: 12 }}
                >
                    恢复默认
                </Button>
                <Button
                    type="primary"
                    onClick={this.handleSave}
                >
                    保存
                </Button>
            </div>
        )
    }

    renderContent() {
        const { type, decorationInfo } = this.props;
        switch (type) {
            case '3010':
            case '23':
                return <SimpleDecorationBoard decorationInfo={decorationInfo.toJS()} type={type} />
            case '64':
                return <CommentSendGiftDecorationBoard decorationInfo={decorationInfo.toJS()} type={type} />
            default:
                return <div></div>
        }
    }

    render() {
        return (
            <div style={{ height: '100%'}}>
                {this.renderHeader()}
                <div className={style.blockLine} />
                <div style={{ overflow: 'auto' }} className={style.contentWrapper}>
                    {this.renderContent()}
                </div>
            </div>
        )
    }
}

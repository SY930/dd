import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    message,
} from 'antd';

import registerPage from '../../../index';
import { jumpPage, closePage } from '@hualala/platform-base';
import style from './style.less'
import {
    PROMOTION_DECORATION,
    SPECIAL_PAGE,
    SALE_CENTER_PAGE,
} from '../../constants/entryCodes';
import SimpleDecorationBoard from './SimpleDecorationBoard';
import CommentSendGiftDecorationBoard from './CommentSendGiftDecorationBoard';
import {
    getDecorationInfo,
    saveDecorationInfo,
    updateDecorationItem,
    resetDecorationInfo,
} from '../../redux/actions/decoration'
const mapStateToProps = (state) => {
    return {
        id: state.sale_promotion_decoration.getIn(['currentPromotion', 'id']),
        title: state.sale_promotion_decoration.getIn(['currentPromotion', 'title']),
        type: state.sale_promotion_decoration.getIn(['currentPromotion', 'type']),
        loading: state.sale_promotion_decoration.getIn(['loading']),
        decorationInfo: state.sale_promotion_decoration.get('decorationInfo'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDecorationInfo: (opts)=>{
            dispatch(getDecorationInfo(opts))
        },
        saveDecorationInfo: (opts)=>{
            return dispatch(saveDecorationInfo(opts))
        },
        updateDecorationItem: (opts)=>{
            dispatch(updateDecorationItem(opts))
        },
        resetDecorationInfo: (opts)=>{
            dispatch(resetDecorationInfo(opts))
        },
    }
};
@registerPage([PROMOTION_DECORATION])
@connect(mapStateToProps, mapDispatchToProps)
export default class PromotionDecoration extends Component {

    componentDidMount() {
        this.props.resetDecorationInfo();
        const { type, id } = this.props;
        if (!id) {
            closePage();
            return;
        }
        this.props.getDecorationInfo({type, id})
    }

    handleCancel = () => {
        closePage();
        jumpPage({ pageID: SPECIAL_PAGE});
    }
    handleSave = () => {
        const { type, id, decorationInfo } = this.props;
        this.props.saveDecorationInfo({
            type,
            id,
            decorationInfo: decorationInfo.toJS(),
        }).then(() => {
            message.success('保存成功');
            closePage();
            switch (type) {
                default: jumpPage({ pageID: SPECIAL_PAGE})
            }
        })
    }
    handleReset = () => {
        this.props.resetDecorationInfo();
    }

    renderHeader() {
        const { loading, title } = this.props;
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    {title || '活动装修' }
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
                    loading={loading}
                    onClick={this.handleReset}
                    style={{ marginRight: 12 }}
                >
                    恢复默认
                </Button>
                <Button
                    type="primary"
                    loading={loading}
                    onClick={this.handleSave}
                >
                    保存
                </Button>
            </div>
        )
    }

    renderContent() {
        const { type, decorationInfo, updateDecorationItem } = this.props;
        switch (type) {
            case '3010':
            case '5010':
            case '23':
                return <SimpleDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '64':
                return <CommentSendGiftDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
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

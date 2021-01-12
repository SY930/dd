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
import GatherPointsDecorateBoard from './GatherPointsDecorateBoard';
import ExpasionGiftDecorationBoard from './ExpasionGiftDecorationBoard';
import ShareGiftDecorationBoard from './ShareGiftDecorationBoard';
import FreeGiftDecorationBoard from './FreeGiftDecorationBoard';
import LotteryDecorationBoard from './LotteryDecorationBoard';
import SignInDecorationBoard from './SignInDecorationBoard'
import RecommendHaveGift from './RecommendHaveGift'
import BlindBoxDecorationBoard from './BlindBoxDecorationBoard'
import {
    getDecorationInfo,
    saveDecorationInfo,
    updateDecorationItem,
    resetDecorationInfo,
} from '../../redux/actions/decoration';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';


const mapStateToProps = (state) => {
    return {
        id: state.sale_promotion_decoration.getIn(['currentPromotion', 'id']),
        title: state.sale_promotion_decoration.getIn(['currentPromotion', 'title']),
        type: state.sale_promotion_decoration.getIn(['currentPromotion', 'type']),
        needCount: state.sale_promotion_decoration.getIn(['currentPromotion', 'needCount']),
        giftArr: state.sale_promotion_decoration.getIn(['currentPromotion', 'giftArr']).toJS(),
        loading: state.sale_promotion_decoration.getIn(['loading']),
        decorationInfo: state.sale_promotion_decoration.get('decorationInfo'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDecorationInfo: (opts) => {
            dispatch(getDecorationInfo(opts))
        },
        saveDecorationInfo: (opts) => {
            return dispatch(saveDecorationInfo(opts))
        },
        updateDecorationItem: (opts) => {
            dispatch(updateDecorationItem(opts))
        },
        resetDecorationInfo: (opts) => {
            dispatch(resetDecorationInfo(opts))
        },
    }
};
@registerPage([PROMOTION_DECORATION])
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
export default class PromotionDecoration extends Component {

    state = {
        ifVaild: true,
    }

    componentDidMount() {
        this.props.resetDecorationInfo();
        const { type, id } = this.props;
        if (!id) {
            closePage();
            return;
        }
        this.props.getDecorationInfo({ type, id })
    }
    componentWillUnmount() {
        this.props.resetDecorationInfo();
    }

    handleVaild = (flag) => {
        this.setState({
            ifVaild: flag
        })
    }

    handleCancel = () => {
        closePage();
        jumpPage({ pageID: SPECIAL_PAGE });
    }

    checkGatherPointsImgAll = () => {
        const {
            type,
            decorationInfo,
        } = this.props;
        const {
            pointImg,
            pointLightUpImg,
            giftImg,
            giftLightUpImg,
            giftTakenImg,
        } = decorationInfo.toJS()
        if (type != '75') {
            return true
        } else {
            if (!pointImg || !pointLightUpImg || !giftImg || !giftLightUpImg || !giftTakenImg) {
                return false
            }
            return true
        }
    }

    handleSave = () => {
        const { ifVaild } = this.state
        const { type, id, decorationInfo } = this.props;
        if (!this.checkGatherPointsImgAll()) {
            message.error('集点图自定义没有填写完整')
            return
        }
        this.props.saveDecorationInfo({
            type,
            id,
            decorationInfo: decorationInfo.toJS(),
        }).then(() => {
            message.success(SALE_LABEL.k5do0ps6);
            closePage();
            switch (type) {
                default: jumpPage({ pageID: SPECIAL_PAGE })
            }
        })
    }
    handleReset = () => {
        this.props.resetDecorationInfo();
    }

    renderHeader() {
        const { loading, type, title } = this.props;
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    {title || SALE_LABEL.k636p2td}
                </span>
                <div className={style.spacer} />
                <Button
                    type="ghost"
                    icon="rollback"
                    onClick={this.handleCancel}
                    style={{ marginRight: 12 }}
                >
                    {COMMON_LABEL.goback}
                </Button>
                {/** 膨胀大礼包的恢复默认在内部 */}
                {
                    type !== '66' && (
                        <Button
                            type="ghost"
                            loading={loading}
                            onClick={this.handleReset}
                            style={{ marginRight: 12 }}
                        >
                            {SALE_LABEL.k636f5qg}
                        </Button>
                    )
                }

                <Button
                    type="primary"
                    loading={loading}
                    onClick={this.handleSave}
                >
                    {COMMON_LABEL.save}
                </Button>
            </div>
        )
    }

    handleGiftArr = () => {
        let { giftArr = [], needCount } = this.props
        giftArr.pop()
        giftArr.push(needCount)
        let result = []
        for (let i = 1; i <= needCount; i++) {
            result.push(giftArr.indexOf(i) === -1 ? false : true)
        }
        return result
    }

    renderContent() {
        const { type, decorationInfo, updateDecorationItem, needCount = '', } = this.props;
        const giftArr = this.handleGiftArr()
        switch (type) {
            case '20':
                return <LotteryDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '21':
                return <FreeGiftDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '23':
                return <SimpleDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '64':
                return <CommentSendGiftDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '65':
                return <ShareGiftDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '66':
                return <ExpasionGiftDecorationBoard onReset={this.handleReset} onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '75':
                return <GatherPointsDecorateBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} handleVaild={this.handleVaild} needCount={needCount} giftArr={giftArr} />
            case '76':
                return <SignInDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '68':
                return <RecommendHaveGift onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '79':
                return <BlindBoxDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            default:
                return <div></div>
        }
    }

    render() {
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                <div className={style.blockLine} />
                <div style={{ overflow: 'auto' }} className={style.contentWrapper}>
                    {this.renderContent()}
                </div>
            </div>
        )
    }
}

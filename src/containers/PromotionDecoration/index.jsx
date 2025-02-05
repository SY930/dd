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
    GIFT_PAGE,
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
import BlindBoxDecorationBoard from './BlindBoxDecorationBoard';
import TicketBagDecoration from './TicketBagDecoration'
import ManyFaceDecoration from './ManyFaceDecoration';
import PassWordCouponDecorationBoard from './PWCouponDecorationBoard'
import H5GiftDecorationBoard from './H5GiftDecorationBoard';

import {
    getDecorationInfo,
    saveDecorationInfo,
    updateDecorationItem,
    updateDecorationFaceItem,
    resetDecorationInfo,
    getCouponsDecorationInfo,
} from '../../redux/actions/decoration';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';
import { axiosData } from '../../helpers/util';
import { isEqual } from 'lodash';


const mapStateToProps = (state) => {
    return {
        id: state.sale_promotion_decoration.getIn(['currentPromotion', 'id']),
        title: state.sale_promotion_decoration.getIn(['currentPromotion', 'title']),
        type: state.sale_promotion_decoration.getIn(['currentPromotion', 'type']),
        needCount: state.sale_promotion_decoration.getIn(['currentPromotion', 'needCount']),
        giftArr: state.sale_promotion_decoration.getIn(['currentPromotion', 'giftArr']).toJS(),
        faceArr: state.sale_promotion_decoration.getIn(['currentPromotion', 'faceArr']).toJS(),
        loading: state.sale_promotion_decoration.getIn(['loading']),
        decorationInfo: state.sale_promotion_decoration.get('decorationInfo'),
        faceDecorationInfo: state.sale_promotion_decoration.get('faceDecorationInfo').toJS(),
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDecorationInfo: (opts) => {
            dispatch(getDecorationInfo(opts))
        },
        getCouponsDecorationInfo: (opts) => {
            dispatch(getCouponsDecorationInfo(opts))
        },
        saveDecorationInfo: (opts) => {
            return dispatch(saveDecorationInfo(opts))
        },
        updateDecorationItem: (opts) => {
            dispatch(updateDecorationItem(opts))
        },
        updateDecorationFaceItem: (opts) => {
            dispatch(updateDecorationFaceItem(opts))
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
        gatherPointFlag: false,
        activeTabRecommend: '1', // 推荐有礼激活tab
    }

    componentDidMount() {
        this.props.resetDecorationInfo();
        const { type, id } = this.props;
        if (!id) {
            closePage();
            return;
        }
        if (type === 'ticketbag') {
            this.props.getCouponsDecorationInfo({ type, id })
            return
        }
        this.props.getDecorationInfo({ type, id })
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.id, nextProps.id)
        ) {
            this.props.resetDecorationInfo();
            const { type, id } = nextProps;
            if (!id) {
                closePage();
                return;
            }
            if (type === 'ticketbag') {
                this.props.getCouponsDecorationInfo({ type, id })
                return
            }
            this.props.getDecorationInfo({ type, id })
        }

    }

    componentWillUnmount() {
        this.props.resetDecorationInfo();
    }

    getfaceDecorationInfo = (info = []) => {
        const { faceArr } = this.props;
        const faceArrCopy = faceArr.map((item, index) => {
            const findImg = info.find((ditem) => {
                if (ditem && ditem.condition) { return ditem.condition == item.itemID}
            }) || {};
            item.image = findImg.image || 'http://res.hualala.com/basicdoc/884351d8-1788-4c2d-b0fd-949936d92369.png';
            return {
                ...item,
            }
        })
       return faceArrCopy
    }
    handleVaild = (flag) => {
        this.setState({
            ifVaild: flag
        })
    }

    handleCancel = () => {
        const { type } = this.props
        closePage();
        jumpPage({ pageID: type === 'ticketbag' ? GIFT_PAGE : SPECIAL_PAGE });
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

    handleFaceSave = () => {
        const { type, id, faceDecorationInfo, faceArr } = this.props;
        let faceDecorationData = faceDecorationInfo;
        if (!faceDecorationInfo.length) {
            faceDecorationData = faceArr.map((item, index) => {
                return {
                    condition: item.itemID,
                    image: 'http://res.hualala.com/basicdoc/884351d8-1788-4c2d-b0fd-949936d92369.png'
                }
            })
        } else {
            faceDecorationData = faceArr.map((item, index) => {
                const findImg = faceDecorationData.find((ditem) => {
                    if (ditem && ditem.condition) { return ditem.condition == item.itemID}
                }) || {};
                return {
                    condition: item.itemID,
                    image: findImg.image || 'http://res.hualala.com/basicdoc/884351d8-1788-4c2d-b0fd-949936d92369.png'
                }
            })
        }
        this.props.saveDecorationInfo({
            type,
            id,
            decorationInfo: faceDecorationData,
        }).then(() => {
            message.success(SALE_LABEL.k5do0ps6);
            closePage();
            switch (type) {
                default: jumpPage({ pageID: SPECIAL_PAGE })
            }
        })
    }

    handleSave = () => {
        const { ifVaild } = this.state
        const { type, id, decorationInfo, user } = this.props;
        if (type == '85') {
            return this.handleFaceSave();
        }
        const cinfo = {
            TipColor: '#fd6631',//购买提示文本
            couponImg: 'http://res.hualala.com/basicdoc/ef060596-786a-4aa7-8d99-4846d753d7e9.png',//背景图
            couponBtnBgColor: '#fd6631',//券包按钮背景色
            couponBtnColor: '#fff',//券包按钮字体颜色
            priceCheckedvalue:1,//划线价格
            decorateType: 1,//装修类型 1:公众号, 2:小程序
            ...decorationInfo.toJS(),
        }
        const decorateInfo = {
            templateID: id,
            templateType: 1,
            decorateType: cinfo.decorateType,
            decorateInfo: JSON.stringify(cinfo),
        }
        //如果是券包装修
        if (type === 'ticketbag') {
            axiosData(
                '/decorate/decorate.ajax',
                {
                    decorateInfo,
                    groupID: user.getIn(['accountInfo', 'groupID'])
                },
                null,
                { path: '', },
                'HTTP_SERVICE_URL_PROMOTION_NEW'
            )
                .then((data) => {
                    const {
                        code,
                        message: mes,
                    } = data
                    if (code === '000') {
                        message.success('保存成功')
                        closePage();
                        jumpPage({ pageID: GIFT_PAGE })
                    } else {
                        message.error(mes)
                    }
                }, (err) => { // network error catch
                    message.error(err)
                })
            return
        }
        //如果是营销活动装修
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

    handleRecommendReset = () => {
        const { activeTabRecommend } = this.state;
        const { updateDecorationItem, decorationInfo } = this.props;
        switch (activeTabRecommend) {
            case '1': // 推荐页
                const _decorateInfo = {
                    ...decorationInfo.toJS(), 
                    bgColor: '#FBB335',
                    bgImg: null,
                    btnBgColor: 'linear-gradient(#F27267,#D24C41)',
                    btnColor: '#FFFFFF',
                    faceToFaceBtnBgColor: 'linear-gradient(#F27267,#D24C41)',
                    faceToFaceBtnColor: '#FFFFFF',
                }
                updateDecorationItem({key: null, value: _decorateInfo})
                return;
        
            default:
                const _decorateInfoed = {
                    ...decorationInfo.toJS(), 
                    bgColorInvited: '#FBB335',
                    bgImgInvited: null,
                    btnBgColorInvited:'linear-gradient(#F27267,#D24C41)',
                    btnColorInvited: '#FFFFFF',
                }
                updateDecorationItem({key: null, value: _decorateInfoed})

                return;
        }
    }
    handleFaceReset = () => {
        const { updateDecorationFaceItem, faceArr } = this.props;
        const faceArrs = faceArr.map((item, index) => {
            item.image = 'http://res.hualala.com/basicdoc/884351d8-1788-4c2d-b0fd-949936d92369.png';

            return {
                image: item.image,
                condition: item.itemID,
            }
        })
        updateDecorationFaceItem({ key: null, value: faceArrs })

    }
    handleReset = () => {
        const { type } = this.props
        
        if (type == '85') {
           return this.handleFaceReset();
        }

        if (type == '68') {
            return this.handleRecommendReset();
         }

        this.props.resetDecorationInfo();
        this.setState({
            gatherPointFlag: true,
        })
    }

    handelTabRecommendChange = (v) => {
        this.setState({
            activeTabRecommend: v,
        })
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

    disableGatherPointFlag = () => {
        this.setState({
            gatherPointFlag: false
        })
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
        const { type, decorationInfo, updateDecorationItem, needCount = '', faceArr = [], faceDecorationInfo, updateDecorationFaceItem } = this.props;
        let _faceDecorationInfo = [];
        if (type == '85') {
            _faceDecorationInfo = this.getfaceDecorationInfo(faceDecorationInfo);
        }
        const { gatherPointFlag } = this.state
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
                return <GatherPointsDecorateBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} handleVaild={this.handleVaild} needCount={needCount} giftArr={giftArr} gatherPointFlag={gatherPointFlag} disableGatherPointFlag={this.disableGatherPointFlag} />
            case '76':
                return <SignInDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '68':
                return <RecommendHaveGift onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} activeTab={this.state.activeTabRecommend} handelTabRecommendChange={this.handelTabRecommendChange}/>
            case '79':
                return <BlindBoxDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case 'ticketbag':
                return <TicketBagDecoration onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '85':
                return <ManyFaceDecoration onChange={updateDecorationFaceItem} decorationInfo={_faceDecorationInfo} type={type} faceArr={faceArr}/>
            case '83':
                return <PassWordCouponDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
            case '69':
            return <H5GiftDecorationBoard onChange={updateDecorationItem} decorationInfo={decorationInfo.toJS()} type={type} />
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

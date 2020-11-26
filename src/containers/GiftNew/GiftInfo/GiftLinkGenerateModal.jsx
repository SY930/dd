import React, { Component } from 'react';
import {
    Spin,
    Button,
    Modal,
    Input,
    Select,
    Alert,
    message,
} from 'antd';
import { jumpPage } from '@hualala/platform-base';
import QRCode from 'qrcode.react';
import emptyPage from '../../../assets/empty_page.png';
import { axiosData, fetchData } from '../../../helpers/util'
import { NEW_SALE_BOX } from '../../../constants/entryCodes'
import style from './GiftInfo.less';


export default class GiftLinkGenerateModal extends Component {

    constructor() {
        super();
        this.state = {
            mpInfoList: [],
            eventList: [],
            loading: false,
            selectedMpID: undefined,
            selectedEventID: undefined,
        }
    }

    componentDidMount() {
        this.queryMpInfoList();
        this.queryEventList();
    }

    queryEventList = () => {
        const {
            entity: {
                giftItemID,
            },
        } = this.props;
        this.setState({
            loading: true,
        })
        axiosData(
            '/specialPromotion/queryEventByGift.ajax',
            {giftItemID},
            {},
            { path: 'datas' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(datas => {
            const list = Array.isArray(datas) ? datas : [];
            this.setState({
                eventList: list,
                selectedEventID: (list[0] || {}).itemID,
                loading: false,
            })
        }).catch(err => {
            this.setState({
                loading: false,
            })
        })
    }

    queryMpInfoList = () => {
        fetchData('queryWechatMpInfo', {}, null, { path: 'mpList', throttle: false })
            .then((mpInfoList) => {
                const list = Array.isArray(mpInfoList) ? mpInfoList : [];
                this.setState({
                    mpInfoList: list,
                    selectedMpID: (list[0] || {}).mpID
                })
            }, err => {})
    }

    handleJumpAway = () => {
        jumpPage({pageID: NEW_SALE_BOX});
        this.props.onCancel();
    }

    getORURL = () => {
        const {
            selectedEventID,
            selectedMpID,
        } = this.state;
        const { groupID } = this.props;
        let preFix;
        switch(HUALALA.ENVIRONMENT) {
            case 'production-release': preFix = '';break;
            case 'production-pre': preFix = 'pre.';break;
            default: preFix = 'dohko.';break;
        }
        return `https://${preFix}m.hualala.com/newm/eventFree?groupID=${groupID}&mpID=${selectedMpID}&eventWay=21&eventID=${selectedEventID}`
    }
    tryToCopy = () => {
        try {
            this.inputRef.refs.input.select();
            const isSuccess = document.execCommand('copy');
            if (isSuccess) {
                message.success('复制成功');
            } else {
                message.warning('您的浏览器不支持自动复制，请手动复制')
            }
        } catch(e) {
            message.warning('您的浏览器不支持自动复制，请手动复制')
        }
    }

    handleQrCodeDownload = () => {
        const canvas = document.getElementById('__promotion_qr_canvas');
        const dom = document.createElement('a');
        dom.href = canvas.toDataURL('image/png');
        dom.download = '二维码.png';
        dom.click();
    }
    handleMpIDChange = (v) => {
        this.setState({ selectedMpID: v })
    }
    handleEventIDChange = (v) => {
        this.setState({ selectedEventID: v })
    }

    renderQRContent() {
        const {
            selectedEventID,
            selectedMpID,
            eventList,
            mpInfoList,
        } = this.state;
        const url = this.getORURL();
        return (
            <div style={{ minHeight: 400 }}>
                <div className={style.flexHeader}>
                    <div className={style.fakeLabel}>引导关注公众号</div>
                    <Select
                        style={{ width: 200 }}
                        value={selectedMpID}
                        placeholder="请选择引导关注公众号"
                        onChange={this.handleMpIDChange}
                    >
                        {
                            mpInfoList.map(({mpName, mpID}) => (
                                <Select.Option key={mpID}>{mpName}</Select.Option>
                            ))
                        }
                    </Select>
                    <div className={style.fakeLabel}>选择活动</div>
                    <Select
                        style={{ width: 200 }}
                        value={selectedEventID}
                        onChange={this.handleEventIDChange}
                    >
                        {
                            eventList.map(({eventName, itemID}) => (
                                <Select.Option key={itemID}>{eventName}</Select.Option>
                            ))
                        }
                    </Select>
                </div>
                {
                    !selectedMpID ? (
                        <Alert style={{ margin: '10px 0' }} message="请选择引导关注公众号" type="warning" />
                    ) : (
                        <div className={style.QRArea}>
                            <div className={style.QRAreaHeader}>
                                <div className={style.flexRow}>
                                    <span>活动链接</span>
                                    <Input ref={e => this.inputRef = e} value={url} style={{ width: 470 }}/>
                                    <Button onClick={this.tryToCopy} type="ghost" className={style.copyButton}>复制</Button>
                                </div>
                                <div style={{ marginTop: -5, paddingLeft: 70, color: '#999'}}>活动链接可配置到微信公众号菜单对应功能,用户可点击参与活动</div>
                            </div>
                            <div className={style.QRAreaBody}>
                                <QRCode
                                    size={160}
                                    value={url}
                                    id="__promotion_qr_canvas"
                                />
                                <div className={style.qrTip}>
                                    二维码可下载打印、用于线上或线下投放，用户可使用微信扫码参与活动
                                </div>
                                <Button
                                    type="primary"
                                    onClick={this.handleQrCodeDownload}
                                    style={{ width: 160, height: 40 }}
                                >
                                    下载二维码
                                </Button>
                            </div>
                        </div>
                    )
                }

            </div>
        )
    }

    renderNotAvailableContent() {
        return (
            <div className={style.emptyContentWrapper}>
                <img style={{ marginBottom: 15 }} height="100px" src={emptyPage} alt=""/>
                <div className={style.titleText}>当前礼品券暂不可投放哦～</div>
                <div className={style.subText}>您需要为当前礼品创建一个免费领取活动</div>
                <Button
                    type="primary"
                    className={style.largeButton}
                    onClick={this.handleJumpAway}
                >
                    去创建
                </Button>

                <div className={style.infoArea}>
                    <div className={style.titleText} style={{ marginBottom: 5 }}>礼品投放创建步骤：</div>
                    <div>1、请前往“营销中心-营销盒子-会员拉新”创建“免费领取”活动</div>
                    <div>2、活动参与范围请选择“礼品链接投放”，并选取该礼品</div>
                </div>
            </div>
        )
    }

    render() {
        const { onCancel } = this.props;
        const {
            loading,
            eventList,
        } = this.state;
        return (
            <Modal
                onCancel={onCancel}
                title="礼品投放"
                width={700}
                visible={true}
                maskClosable={false}
                footer={false}
            >
                <Spin spinning={loading}>
                    {!!eventList.length ? this.renderQRContent() : this.renderNotAvailableContent()}
                </Spin>
            </Modal>
        )
    }
}

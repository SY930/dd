import React, { Component } from 'react';
import { Tabs, Button, Icon, Input, Select, Slider, InputNumber, Row, endColor, Col, Radio } from 'antd';
import CropperUploaderDefault from 'components/common/CropperUploaderDefault'
// import CropperUploader from 'components/common/CropperUploader'
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone,
    giftExample,
    recommend1 as defaultEnterImg,
    recommend2 as defaultEndImg,
    phoneTop,
} from './assets';
import tagImg from './assets/tag.svg'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';

const limitType = '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF';
const fileSize = 1 * 1024 * 1024;
const { TabPane } = Tabs;
const Option = Select.Option;
const url = 'http://res.hualala.com/'
@injectIntl()
export default class GatherPointsDecorateBoard extends Component {

    state = {
        tabKey: '1',
        numErr: false,
        inputValue: 1,
        initFlag: false,
    }

    componentDidMount() {
        setTimeout(() => {
            const {
                decorationInfo: {
                    ImageType,
                },
                onChange,
            } = this.props;
            if (!ImageType) {
                onChange({ key: ['ImageType'], value: 1, })
                this.onChangeImageOnType(1)
            }
        }, 0)
    }

    componentWillReceiveProps(nextProps) {
        const { initFlag } = this.state
        const { gatherPointFlag } = nextProps
        if (!initFlag || gatherPointFlag) {
            const {
                decorationInfo: {
                    ImageType,
                },
                onChange,
            } = nextProps;
            if (!ImageType) {
                onChange({ key: ['ImageType'], value: 1, })
                this.onChangeImageOnType(1)
            }
            this.initDecorationInfo(gatherPointFlag)
        }
    }

    initDecorationInfo = (gatherPointFlag) => {
        const {
            decorationInfo: {
                pointsNum,
            },
            needCount,
            onChange,
        } = this.props;
        if(!pointsNum || gatherPointFlag) {
            onChange({ key: ['bgImg'], value: url + 'basicdoc/c9b4ce1e-c4ef-4bd8-b352-8a596a7a3ac0.png', })
            onChange({ key: ['pointsNum'], value: needCount > 15 ? '4' : '3', })
            onChange({ key: ['pointSize'], value: 70, })
            onChange({ key: ['zoneWidth'], value: 60, })
            onChange({ key: ['verticalPosition'], value: 0, })
            onChange({ key: ['horizonPosition'], value: 0, })
            onChange({ key: ['popImg'], value: url + 'basicdoc/a9a0ed49-ebe3-4a7c-8b2d-cf6772141fd9.png', })
        }
        this.setState({
            initFlag: true,
        })
        this.props.disableGatherPointFlag()
    }

    onChangeImageOnType = (type) => {
        const {
            onChange,
            decorationInfo: {
                pointImg,
                pointLightUpImg,
                giftImg,
                giftLightUpImg,
                giftTakenImg,
            }
        } = this.props
        switch(type) {
            case 1 :
                onChange({ key: ['pointImg'], value: url + 'basicdoc/679fbbac-eaa8-4a7e-aa88-3a51331b6731.png' })
                onChange({ key: ['pointLightUpImg'], value: url + 'basicdoc/68ea22bf-7941-4b7f-a57a-1d855d8db8b7.png' })
                onChange({ key: ['giftImg'], value: url + 'basicdoc/e1199010-1160-433f-9e45-d0af75e2463d.png' })
                onChange({ key: ['giftLightUpImg'], value: url + 'basicdoc/cad54b4b-ff45-4d66-af6c-3f638dd5e627.png' })
                onChange({ key: ['giftTakenImg'], value: url + 'basicdoc/ecb4b2aa-c6cf-4e99-ba0d-667ee1a46ef2.png' })
                break
            case 2 :
                onChange({ key: ['pointImg'], value: url + 'basicdoc/08b382e6-187a-4985-bd1a-77568f02dfc7.png' })
                onChange({ key: ['pointLightUpImg'], value: url + 'basicdoc/a5338ba7-5bd5-4525-a503-b0a027ade3b3.png' })
                onChange({ key: ['giftImg'], value: url + 'basicdoc/685c2d27-23b3-411e-bf8f-b4a51babd9ce.png' })
                onChange({ key: ['giftLightUpImg'], value: url + 'basicdoc/65dd197c-4a13-4101-8ad9-4990d1fcbfa1.png' })
                onChange({ key: ['giftTakenImg'], value: url + 'basicdoc/713175fb-92ee-450d-b738-35ae3937c6b4.png' })
                break
            case 3 :
                onChange({ key: ['pointImg'], value: url + 'basicdoc/960b37f2-3edd-40bd-97e5-f37aa5fee8da.png' })
                onChange({ key: ['pointLightUpImg'], value: url + 'basicdoc/392273db-7020-40e1-a48e-8e6f15b34d6c.png' })
                onChange({ key: ['giftImg'], value: url + 'basicdoc/3f0e52bf-c09c-43ad-8d97-4fc94c4dfc2c.png' })
                onChange({ key: ['giftLightUpImg'], value: url + 'basicdoc/e48d82d8-ee0b-4bec-8243-7ccd9c70be81.png' })
                onChange({ key: ['giftTakenImg'], value: url + 'basicdoc/b8ed1063-08df-497d-9aaa-a98cd9545baa.png' })
                break
            case 4 :
                onChange({ key: ['pointImg'], value: url + 'basicdoc/67251a92-5ae8-4c57-90dd-236bec7678d6.png' })
                onChange({ key: ['pointLightUpImg'], value: url + 'basicdoc/ff524a28-e08b-4bf7-9646-974d16547e87.png' })
                onChange({ key: ['giftImg'], value: url + 'basicdoc/3f0e52bf-c09c-43ad-8d97-4fc94c4dfc2c.png' })
                onChange({ key: ['giftLightUpImg'], value: url + 'basicdoc/e48d82d8-ee0b-4bec-8243-7ccd9c70be81.png' })
                onChange({ key: ['giftTakenImg'], value: url + 'basicdoc/b8ed1063-08df-497d-9aaa-a98cd9545baa.png' })
                break
            case 5 :
                onChange({ key: ['pointImg'], value: url + 'basicdoc/d2537f79-9653-4d17-8333-2d56c6456f01.png' })
                onChange({ key: ['pointLightUpImg'], value: url + 'basicdoc/47a71c8f-079d-4b51-a5e6-72d2cad0a4fa.png' })
                onChange({ key: ['giftImg'], value: url + 'basicdoc/3f0e52bf-c09c-43ad-8d97-4fc94c4dfc2c.png' })
                onChange({ key: ['giftLightUpImg'], value: url + 'basicdoc/e48d82d8-ee0b-4bec-8243-7ccd9c70be81.png' })
                onChange({ key: ['giftTakenImg'], value: url + 'basicdoc/b8ed1063-08df-497d-9aaa-a98cd9545baa.png' })
                break
            case 6 :
                onChange({ key: ['pointImg'], value: '' })
                onChange({ key: ['pointLightUpImg'], value: '' })
                onChange({ key: ['giftImg'], value: '' })
                onChange({ key: ['giftLightUpImg'], value: '' })
                onChange({ key: ['giftTakenImg'], value: '' })
                break
        }
    }

    handleNumChange = (e) => {
        const {
            onChange,
        } = this.props
        onChange({ key: ['pointsNum'], value: e })
    }

    renderOpts = () => {
        const { needCount } = this.props
        let begin = 2;
        let end = 6;
        if (needCount > 10 && needCount <= 15) {
            begin = 3
        }
        if (needCount > 15) {
            begin = 4
        }
        let children = [];
        for (let i = begin; i < end; i++) {
            children.push(<Option key={i}>{i}</Option>);
        }
        return children
    }

    formatter = (value) => {
        return `${value}%`;
    }

    onPointSizeChange = value => {
        const {
            onChange,
        } = this.props
        onChange({ key: ['pointSize'], value, })
    };

    onZoneWidthChange = value => {
        const {
            onChange,
        } = this.props
        onChange({ key: ['zoneWidth'], value, })
    };

    onHorizonPositionChange = value => {
        const {
            onChange,
        } = this.props
        onChange({ key: ['horizonPosition'], value, })
    };

    onVerticalPositionChange = value => {
        const {
            onChange,
        } = this.props
        onChange({ key: ['verticalPosition'], value, })
    };

    onTypeChange = value => {
        const {
            onChange,
        } = this.props
        onChange({ key: ['ImageType'], value: value.target.value, })
        this.onChangeImageOnType(value.target.value)
    };
    renderDotsArea() {
        let { needCount } = this.props
        const {
            decorationInfo: {
                bgImg,
                pointsNum = pointsNum || (needCount > 15 ? '4' : '3'),
                pointSize = 70,
                zoneWidth = 60,
                verticalPosition = 0,
                horizonPosition,
                pointImg = '',
                pointLightUpImg = '',
                giftImg = '',
                giftLightUpImg = '',
                giftTakenImg = '',
                ImageType,
            },
            giftArr,
        } = this.props;
        return (
            <div className={style.dotsBgArea}>
                <div
                    className={style.dotsAreaBox}
                    style={{
                        width: `${zoneWidth}%`,
                        top:`${verticalPosition}%`,
                        left: `${horizonPosition}%`,
                    }}
                    >
                        {
                            giftArr.map((item, index) => {
                                return (
                                    <div
                                        className={style.dotAreaBox}
                                        style={{
                                            width: `${100/pointsNum}%`,
                                            paddingTop: `${100/pointsNum}%`,
                                            height: 0,
                                            position: 'relative',
                                        }}
                                    >
                                       {    
                                            item ?
                                                <img
                                                    className={style.dotImg}
                                                    src={ index === needCount-1 ? giftTakenImg : giftImg}
                                                    style={{
                                                        height: `${pointSize}%`,
                                                    }}
                                                ></img> :
                                                <img
                                                    className={style.dotImg}
                                                    src={pointImg}
                                                    style={{
                                                        height: `${pointSize}%`,
                                                    }}
                                                ></img>
                                       }
                                    </div>
                                )
                            })
                        }
                </div>
            </div>
        )
    }

    renderPhonePreview() {
        const { tabKey } = this.state;
        const {
            decorationInfo: {
                popImg = url + 'basicdoc/a9a0ed49-ebe3-4a7c-8b2d-cf6772141fd9.png',
                bgImg = url + 'basicdoc/c9b4ce1e-c4ef-4bd8-b352-8a596a7a3ac0.png',
                popContent = url + 'basicdoc/53f1f865-93a0-40ef-83f2-28881e045f28.png',
                endColor = '#FF6125',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <img src={iphone} alt="" />
                {
                    tabKey === '1' ? (
                        <div className={style.displayBgBlock}>
                            <img className={style.topFakeHeader} src={phoneTop} alt=""/>
                            <div className={style.bgImageWrapper}>
                                <div style={{ width: '100%', height: 548, overflowY: 'auto' }} className={style.imgBoxScroll}>
                                    <div className={style.imgBoxFull}>
                                        <img src={bgImg} style={{ width: '100%' }} alt="" />
                                        {
                                            this.renderDotsArea()
                                        }
                                    </div>
                                </div>
                                <div className={style.tagWrapper}>
                                    <img src={tagImg} alt="" />
                                    <span>活动背景图</span>
                                </div>
                            </div>
                            <div className={style.grayGiftDiv}>
                                <span>
                                    <Icon type="gift" style={{ marginRight: 3}}/>
                                    满足兑换条件 立即领取 {'>'}
                                </span>
                            </div>
                            
                        </div>
                    ) : (
                        <div className={style.displayBgBlock}>
                            <img className={style.topFakeHeader} src={phoneTop} alt=""/>
                            <div className={style.bgImageWrapper}>
                                <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                    <img src={bgImg} style={{ width: '100%' }} alt="" />
                                </div>
                                {/* <div className={style.tagWrapper}>
                                    <img src={tagImg} alt="" />
                                    <span>活动背景图</span>
                                </div> */}
                            </div>
                            <div className={style.grayForder}>
                                    <div style={{ borderRadius: 10, width: '100%', height: '100%', overflow: 'hidden' }}>
                                        <img src={popImg} className={style.popTopImg} style={{ width: '101%' }} alt="" />
                                        <img src={popContent} className={style.popContentImg} style={{ width: '100%' }} alt="" />
                                    </div>
                                    <Icon className={style.closeBtnIcon} type="close"/>
                                </div>
                        </div>
                        )
                }
            </div>
        )
    }
    renderPointsPositionPanel() {
        const {
            decorationInfo: {
                pointsNum,
                endColor = '#FF6125',
                pointImg = '',
                pointLightUpImg = '',
                giftImg = '',
                giftLightUpImg = '',
                giftTakenImg = '',
                bgImg,
                pointSize = 70,
                zoneWidth = 60,
                horizonPosition,
                verticalPosition = 0,
                ImageType,
            },
            needCount,
            onChange,
        } = this.props;
        console.log('ImageType', ImageType == 6 ? true : false)
        const {
            numErr,
        } = this.state
        return (
            <div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动背景图</div>
                    <div style={{ width: 500 }} className={style.uploaderWrapper}>
                        <CropperUploaderDefault
                            static={true}
                            isAbsoluteUrl={true}
                            limit={1000}
                            value={bgImg || url + 'basicdoc/c9b4ce1e-c4ef-4bd8-b352-8a596a7a3ac0.png'}
                            cropperRatio={1080 / 2400}
                            width={96}
                            canEdit={true}
                            onChange={value => onChange({ key: ['bgImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* {SALE_LABEL.k6346css}1080*2400</p>
                            <p>* 支持JPG、PNG图片文件</p>
                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>集点单行点数</div>
                    <div style={{ width: 100 }} className={style.uploaderWrapper}>
                        <Select
                            value={pointsNum || (needCount > 15 ? '4' : '3')}
                            onChange={this.handleNumChange}
                        >
                            {this.renderOpts()}
                        </Select>
                        {/* {numErr && <span className={style.errorMsg}>请输入0到5的整数</span>} */}
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>图标大小</div>
                    <div style={{ width: 220 }} className={style.uploaderWrapper}>
                        <Row style={{width: '100%'}}>
                            <Col span={17}>
                            <Slider
                                min={30}
                                max={100}
                                onChange={this.onPointSizeChange}
                                value={typeof pointSize === 'number' ? pointSize : 70}
                            />
                            </Col>
                            <Col span={7}>
                            <InputNumber
                                min={30}
                                max={100}
                                style={{ margin: '0 16px' }}
                                value={pointSize}
                                onChange={this.onPointSizeChange}
                                formatter={value => `${value == 0 ? '0' : value}%`}
                                parser={value => value.replace('%', '')}
                            />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>区域相对宽度</div>
                    <div style={{ width: 220 }} className={style.uploaderWrapper}>
                        <Row style={{width: '100%'}}>
                            <Col span={17}>
                            <Slider
                                min={30}
                                max={100}
                                onChange={this.onZoneWidthChange}
                                value={typeof zoneWidth === 'number' ? zoneWidth : 30}
                            />
                            </Col>
                            <Col span={7}>
                            <InputNumber
                                min={30}
                                max={100}
                                style={{ margin: '0 16px' }}
                                value={zoneWidth}
                                formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')}
                                onChange={this.onZoneWidthChange}
                            />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label} style={{top: 17}}>集点整体位置</div>
                    <div style={{ width: 500, display: 'block' }} className={style.uploaderWrapper}>
                        <div className={style.barDiv}>
                            <span className={style.desSpan}>上下间距</span>
                            {/* <Slider className={style.sliderDiv} tipFormatter={this.formatter} /> */}
                            <Slider
                                className={style.sliderDiv}
                                min={-50}
                                max={50}
                                onChange={this.onVerticalPositionChange}
                                value={ verticalPosition ? verticalPosition : 0}
                            />
                            <InputNumber
                                className={style.inputDiv}
                                min={-50}
                                max={50}
                                style={{ margin: '0 16px' }}
                                value={verticalPosition}
                                formatter={value => `${value == 0 ? '0' : value}%`}
                                parser={value => value.replace('%', '')}
                                onChange={this.onVerticalPositionChange}
                            />
                            <div className={style.explainTwoDiv}>
                                <span>上移</span>
                                <span style={{
                                    marginLeft: 103
                                }}>下移</span>
                            </div>
                        </div>
                        <div className={style.barDiv} style={{position: 'relative', top: 20}}>
                            <span className={style.desSpan}>左右间距</span>
                            {/* <Slider className={style.sliderDiv} tipFormatter={this.formatter} /> */}
                            <Slider
                                className={style.sliderDiv}
                                min={-50}
                                max={50}
                                onChange={this.onHorizonPositionChange}
                                value={horizonPosition ? horizonPosition : 0}
                            />
                            <InputNumber
                                className={style.inputDiv}
                                min={-50}
                                max={50}
                                style={{ margin: '0 16px' }}
                                value={horizonPosition}
                                formatter={value => `${value == 0 ? '0' : value}%`}
                                parser={value => value.replace('%', '')}
                                onChange={this.onHorizonPositionChange}
                            />
                            <div className={style.explainTwoDiv}>
                                <span>左移</span>
                                <span style={{
                                    marginLeft: 103
                                }}>右移</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>集点图自定义</div>
                    <div style={{ width: 500, paddingTop: 29 }} className={style.selfBox}>
                        {/* <div className={style.titleLine}>
                            <div className={style.tabActiveDiv}>
                                基础样式
                            </div>
                        </div> */}
                        <Radio.Group onChange={this.onTypeChange} value={ImageType || 1}>
                            <Radio value={1}>五角星</Radio>
                            <Radio value={2}>吸管杯</Radio>
                            <Radio value={3}>咖啡杯</Radio>
                            <Radio value={4}>鱼</Radio>
                            <Radio value={5}>火锅</Radio>
                            <Radio value={6}>自定义</Radio>
                        </Radio.Group>
                        <div className={style.tabPanelDiv}>
                            <p className={style.explainP}><span className={style.redFont}>*</span>可设置默认图样、获得点数图片和已兑换礼品图样 </p>
                            <div className={style.dotsArea}>
                                <div className={style.dotArea}>
                                    <div className={style.dotTitle}>集点图样</div>
                                    <div className={style.dotDefine}>
                                        <div className={style.uploadBox} style={{
                                            pointerEvents: `${ImageType == 6 ? 'all' : 'none'}`,
                                        }}>
                                            <CropperUploaderDefault
                                                isAbsoluteUrl={true}
                                                limit={1000}
                                                canEdit={ImageType == 6 ? true : false}
                                                value={ImageType === 1 ? `${url}basicdoc/679fbbac-eaa8-4a7e-aa88-3a51331b6731.png` : pointImg}
                                                cropperRatio={1 / 1}
                                                width={45}
                                                height={45}
                                                selfIcon={
                                                    <div className={style.blackbg}>
                                                        <Icon style={{
                                                            color: ' #F4F4F4',
                                                            fontSize: 24,
                                                            fontWeight: 'bold',
                                                            position: 'absolute',
                                                            top: -3,
                                                            left: 9,
                                                            lineHeight: 2,
                                                        }} type="plus" />
                                                    </div>
                                                }
                                                onChange={value => onChange({ key: ['pointImg'], value })}
                                            />
                                            <div className={style.explainDiv}>
                                                默认
                                            </div>
                                        </div>
                                        <div className={style.uploadBox} style={{
                                            pointerEvents: `${ImageType == 6 ? 'all' : 'none'}`,
                                        }}>
                                            <CropperUploaderDefault
                                                isAbsoluteUrl={true}
                                                limit={1000}
                                                canEdit={ImageType == 6 ? true : false}
                                                value={ImageType === 1 ? `${url}basicdoc/68ea22bf-7941-4b7f-a57a-1d855d8db8b7.png` : pointLightUpImg}
                                                cropperRatio={1 / 1}
                                                width={45}
                                                height={45}
                                                selfIcon={
                                                    <div className={style.blackbg}>
                                                        <Icon style={{
                                                            color: ' #F4F4F4',
                                                            fontSize: 24,
                                                            fontWeight: 'bold',
                                                            position: 'absolute',
                                                            top: -3,
                                                            left: 9,
                                                            lineHeight: 2,
                                                        }} type="plus" />
                                                    </div>
                                                }
                                                onChange={value => onChange({ key: ['pointLightUpImg'], value })}
                                            />
                                            <div className={style.explainDiv}>
                                                点亮
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className={style.grayLine}></span>
                                <div className={style.dotArea}>
                                    <div className={style.dotTitle}>领取图样</div>
                                    <div className={style.dotDefine}>
                                        <div className={style.uploadBox} style={{
                                            pointerEvents: `${ImageType == 6 ? 'all' : 'none'}`,
                                        }}>
                                            <CropperUploaderDefault
                                                isAbsoluteUrl={true}
                                                limit={1000}
                                                canEdit={ImageType == 6 ? true : false}
                                                value={ImageType === 1 ? `${url}basicdoc/e1199010-1160-433f-9e45-d0af75e2463d.png` : giftImg}
                                                cropperRatio={1 / 1}
                                                width={45}
                                                height={45}
                                                selfIcon={
                                                    <div className={style.blackbg}>
                                                        <Icon style={{
                                                            color: ' #F4F4F4',
                                                            fontSize: 24,
                                                            fontWeight: 'bold',
                                                            position: 'absolute',
                                                            top: -3,
                                                            left: 9,
                                                            lineHeight: 2,
                                                        }} type="plus" />
                                                    </div>
                                                }
                                                onChange={value => onChange({ key: ['giftImg'], value })}
                                            />
                                            <div className={style.explainDiv}>
                                                默认
                                            </div>
                                        </div>
                                        <div className={style.uploadBox} style={{
                                            pointerEvents: `${ImageType == 6 ? 'all' : 'none'}`,
                                        }}>
                                            <CropperUploaderDefault
                                                isAbsoluteUrl={true}
                                                limit={1000}
                                                canEdit={ImageType == 6 ? true : false}
                                                value={ImageType === 1 ? `${url}basicdoc/cad54b4b-ff45-4d66-af6c-3f638dd5e627.png` : giftLightUpImg}
                                                cropperRatio={1 / 1}
                                                width={45}
                                                height={45}
                                                selfIcon={
                                                    <div className={style.blackbg}>
                                                        <Icon style={{
                                                            color: ' #F4F4F4',
                                                            fontSize: 24,
                                                            fontWeight: 'bold',
                                                            position: 'absolute',
                                                            top: -3,
                                                            left: 9,
                                                            lineHeight: 2,
                                                        }} type="plus" />
                                                    </div>
                                                }
                                                onChange={value => onChange({ key: ['giftLightUpImg'], value })}
                                            />
                                            <div className={style.explainDiv}>
                                                点亮
                                            </div>
                                        </div>
                                        <div className={style.uploadBox} style={{
                                            pointerEvents: `${ImageType == 6 ? 'all' : 'none'}`,
                                        }}>
                                            <CropperUploaderDefault
                                                isAbsoluteUrl={true}
                                                limit={1000}
                                                canEdit={ImageType == 6 ? true : false}
                                                value={ImageType === 1 ? `${url}basicdoc/ecb4b2aa-c6cf-4e99-ba0d-667ee1a46ef2.png` : giftTakenImg}
                                                cropperRatio={1 / 1}
                                                width={45}
                                                height={45}
                                                selfIcon={
                                                    <div className={style.blackbg}>
                                                        <Icon style={{
                                                            color: ' #F4F4F4',
                                                            fontSize: 24,
                                                            fontWeight: 'bold',
                                                            position: 'absolute',
                                                            top: -3,
                                                            left: 9,
                                                            lineHeight: 2,
                                                        }} type="plus" />
                                                    </div>
                                                }
                                                onChange={value => onChange({ key: ['giftTakenImg'], value })}
                                            />
                                            <div className={style.explainDiv}>
                                                已兑换
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button style={{ margin: '50px 150px' }} type="primary" onClick={() => this.setState({ tabKey: '2' })}>{SALE_LABEL.k635s371}</Button>
            </div>

        )
    }
    renderPageOneSettingPanel() {
        const {
            decorationInfo: {
                endColor = '#FF6125',
            },
            onChange,
        } = this.props;
        return (
            <div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>活动背景色</div>
                    <ColorSettingBlock value={endColor} onChange={(value) => onChange({ key: ['endColor'], value })} />
                </div>
            </div>

        )
    }
    render() {
        const {
            decorationInfo: {
                popImg,
            },
            onChange,
        } = this.props;
        const { intl } = this.props;
        const k635s3fd = intl.formatMessage(SALE_STRING.k635s3fd);
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div>
                    <Tabs activeKey={this.state.tabKey} onTabClick={(tabKey) => this.setState({ tabKey })} className={style.customTabWrapper}>
                        <TabPane tab='集点配置' key='1'>
                            {this.renderPointsPositionPanel()}
                        </TabPane>
                        {/* <TabPane tab='活动皮肤装修' key='2'>
                            {this.renderPageOneSettingPanel()}
                        </TabPane> */}
                        <TabPane tab='弹窗配置' key='2'>
                            <div style={{ paddingTop: 45 }}>
                                <div className={style.sectionWrapper}>
                                    <div style={{ top: 30 }} className={style.label}>弹窗头图</div>
                                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                                        <CropperUploaderDefault
                                            isAbsoluteUrl={true}
                                            cropperRatio={1080 / 248}
                                            limit={1000}
                                            value={popImg || url + 'basicdoc/a9a0ed49-ebe3-4a7c-8b2d-cf6772141fd9.png'}
                                            onChange={value => onChange({ key: ['popImg'], value })}
                                            canEdit={true}
                                        />
                                        <div className={style.uploaderTip}>
                                            <p>* {SALE_LABEL.k6346css}1080*248像素</p>
                                            <p>* 支持JPG、PNG图片文件</p>
                                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                                        </div>
                                    </div>
                                </div>
                                <Button style={{ margin: '50px 150px' }} type="primary" onClick={() => this.setState({ tabKey: '1' })}>上一页</Button>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

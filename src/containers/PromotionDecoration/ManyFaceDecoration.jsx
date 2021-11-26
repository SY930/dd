import React, { Component } from 'react';
import { Tabs, Button, Icon } from 'antd';
import _ from 'lodash';
import CropperUploader from 'components/common/CropperUploader'
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone,
    giftExample,
    recommend1 as defaultEnterImg,
    recommend2 as defaultEndImg,
} from './assets';
import tagImg from './assets/tag.svg'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';

const { TabPane } = Tabs;
const num = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
@injectIntl()
export default class ManyFaceDecoration extends Component {

    state = {
        tabKey: '1',
        faceArrCopy: [],
    }

    componentDidMount() {
        // const { decorationInfo, faceArr, onChange } = this.props;
        // // console.log(this.state.decorationInfo, 'decorationInfo----')
        // let faceArrCopy = _.cloneDeep(faceArr);
        // // if (decorationInfo.length) {
        // faceArrCopy = faceArrCopy.map((item, index) => {
        //     // const findImg = decorationInfo.filter((ditem) => ditem.condition === item.itemID);
        //     item.image = 'http://res.hualala.com/basicdoc/eb519bc1-d7d6-410c-8bf9-8bfe92645bcf.png';
        //     return {
        //         ...item,
        //     }
        // })
        // // }
        // // onChange({ key: null, value: faceArrCopy})
        // this.setState({
        //     faceArrCopy
        // })
    }

    componentDidUpdate(nextProps) {
        //      const { decorationInfo = [] } = this.props;
        // console.log("🚀 ~ file: ManyFaceDecoration.jsx ~ line 50 ~ ManyFaceDecoration ~ componentWillReceiveProps ~ decorationInfo", nextProps.decorationInfo)
            
        //     let { faceArrCopy = [] } = this.state;
        //     faceArrCopy = faceArrCopy.map((item, index) => {
        //         const findImg = nextProps.decorationInfo.find((ditem) => ditem.condition === item.itemID) || {};
        //         item.image = findImg.image || 'http://res.hualala.com/basicdoc/eb519bc1-d7d6-410c-8bf9-8bfe92645bcf.png';
        //         return {
        //             ...item,
        //         }
        //     })
        //     this.setState({
        //         faceArrCopy
        //     })
    }

    // componentWillReceiveProps(nextProps) {
    //     const { decorationInfo = [] } = this.props;
    //     if (nextProps.decorationInfo.length > 0) {
    //     console.log("🚀 ~ file: ManyFaceDecoration.jsx ~ line 50 ~ ManyFaceDecoration ~ componentWillReceiveProps ~ decorationInfo", nextProps.decorationInfo)
            
    //         let { faceArrCopy = [] } = this.state;
    //         faceArrCopy = faceArrCopy.map((item, index) => {
    //             const findImg = decorationInfo.find((ditem) => ditem.condition === item.itemID) || {};
    //             item.image = findImg.image || 'http://res.hualala.com/basicdoc/eb519bc1-d7d6-410c-8bf9-8bfe92645bcf.png';
    //             return {
    //                 ...item,
    //             }
    //         })
    //         this.setState({
    //             faceArrCopy
    //         })
    //     }
    // }

    onChangeImage = (data) => {
        const { onChange } = this.props
        const { faceArrCopy } = this.state;
        // const index = data.key;
        // faceArrCopy[index] = { ...faceArrCopy[index], ...data.value }
        // console.log("🚀 ~ file: ManyFaceDecoration.jsx ~ line 52 ~ ManyFaceDecoration ~ faceArrCopy", faceArrCopy)
        onChange({ ...data })
        this.setState({
            faceArrCopy,
        })
    }

    renderPhonePreview() {
        const { tabKey } = this.state;
        const {
            decorationInfo: {
                enterImg = defaultEnterImg,
                endImg = defaultEndImg,
                endColor = '#FF5752',
                enterColor = '#EA0327'
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <img src={iphone} alt="" />

                <div className={style.simpleDisplayBlock}>
                    <div className={style.imgWrapper} style={{ height: '100%' }}>
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                            <img src={endImg} style={{ width: '100%', height: '100%' }} alt="" />
                        </div>
                        <div className={style.tagWrapper}>
                            <img src={tagImg} alt="" />
                            <span>活动主图</span>
                        </div>
                    </div>
                    {/* <div style={{ background: endColor }} className={style.bgWrapper}>
                        <img src={giftExample} alt="" />
                        <img src={giftExample} alt="" />
                        <img src={giftExample} alt="" />
                    </div> */}
                    <Icon className={style.closeBtn} type="close-circle-o" />
                </div>
            </div>
        )
    }
    render() {
        const {
            decorationInfo = [],
            // faceArr,
            onChange,
        } = this.props;
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div>
                    <Tabs activeKey={this.state.tabKey} onTabClick={(tabKey) => this.setState({ tabKey })} className={style.customTabWrapper}>
                        <TabPane tab={'点餐页弹窗海报图'} key="1">
                            <div style={{ paddingTop: 45 }}>
                            {
                                    decorationInfo.map((item, index) => {
                                        return (
                                            <div className={style.sectionWrapper} key={index}>
                                                <div style={{ margin: '0 0 10px -115px', fontSize: 14 }}>条件{num[index]}：<span>{item.targetName}</span></div>
                                                <div style={{ top: 60 }} className={style.label}>活动主图</div>
                                                <div style={{ width: 350 }} className={style.uploaderWrapper}>
                                                    <DecorationUploader
                                                        limit={0}
                                                        value={item.image}
                                                        onChange={(value) => {
                                                            const v = { image: value, condition: item.itemID }
                                                            const obj = { key: index, value: v };
                                                            // onChange({ key: index, value: v })
                                                           this.onChangeImage(obj)
                                                        }}
                                                    />
                                                    <div className={style.uploaderTip}>
                                                        <p>* 图片建议尺寸 526X788像素</p>
                                                        <p>* 不大于1000KB</p>
                                                        <p>* 支持png、jpg、jpeg、gif</p>
                                                    </div>
                                                    {/* <CropperUploader
                                                        isAbsoluteUrl={true}
                                                        cropperRatio={920 / 550}
                                                        limit={1000}
                                                        width={160}
                                                        value={item.image}
                                                        onChange={(value) => {
                                                            const v = { image: value, condition: item.itemID }
                                                            const obj = { key: index, value: v };
                                                            // onChange({ key: index, value: v })
                                                           this.onChangeImage(obj)
                                                        }}
                                                    />
                                                    <div className={style.uploaderTip}>
                                                        <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                                                        <p>* {SALE_LABEL.k6346css}920x1346像素</p>
                                                        <p>* 支持JPG、PNG图片文件</p>
                                                    </div> */}
                                               </div>
                                         </div>
                                   )
                                    })
                                }
                            </div>
                        </TabPane>
                        {/* <TabPane tab={'领取后'} key="2">
                            {this.renderPageOneSettingPanel()}
                        </TabPane> */}
                    </Tabs>
                </div>
            </div >
        )
    }
}

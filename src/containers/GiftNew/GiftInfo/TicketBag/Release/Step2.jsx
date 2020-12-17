import React, { PureComponent as Component } from 'react';
import { Button, Input, Select, message, Radio, Tooltip, Icon } from 'antd';
import { imgURI } from '../Common';
import styles from './index.less';
import QRCode from 'qrcode.react';
import { getQrCodeImg } from '../AxiosFactory';
import ShopSelector from "../../../../../components/common/ShopSelector/ShopSelector";
import { connect } from 'react-redux';
import { getPromotionShopSchema } from "../../../../../redux/actions/saleCenterNEW/promotionScopeInfo.action";



const Option = Select.Option;
const defaultImgTxt = { resTitle: '叮咚！天上掉下一堆券，点我点我点我', digest: '为小主准备的超级大礼包，点我查看' };
class Step2 extends Component {
    state = {
        mpID: '',
        imgID: '',
        item: defaultImgTxt,
        url2: [],       // 30天的
        type: 1,
        shops: [],
        mpError: false,
        imgError: false,
        shopInfo: [],
        zip: '',
        count: 0,
    };
    componentDidMount() {
        const { getPromotionShopSchema, groupID } = this.props;
        getPromotionShopSchema({groupID })
        this.onGetQrImg({ mpID: '', imgID: '', item: defaultImgTxt, shops: [] })    
    }
    componentWillReceiveProps(nextProps) {
        // console.log('before', this.props.downLoadFlag, 'next', nextProps.downLoadFlag)
        if (this.props.downLoadFlag !== nextProps.downLoadFlag && !nextProps.downLoadFlag) {
            if (this.passValidate()) {
                this.onQrCodeDownload()
            } else {
                const { cancelDownLoad } = this.props
                cancelDownLoad()
            }
        }
    }

    /*  */
    onCopy = () => {
        const err = '您的浏览器不支持自动复制，请手动复制';
        try {
            this.input.refs.input.select();
            const isSuccess = document.execCommand('copy');
            if (isSuccess) {
                message.success('复制成功');
            } else {
                message.warning(err);
            }
        } catch(e) {
            message.warning(err);
        }
    }
    /* 获取form对象 */
    onGetInput = (input) => {
        this.input = input;
    }
    onAccountChange = (mpID) => {
        const { imgID, item, shopInfo } = this.state;
        this.onGetQrImg({ mpID, imgID, item, shops: shopInfo })
        this.setState({
            mpID,
            mpError: false,
        });
    }
    onGetQrImg({ mpID, imgID, item, shops }) {
        const { groupID, url, firstImg, downLoadLoadingChange } = this.props;
        let { count } = this.state
        this.setState({
            count: count + 1,
        }, () => {
            // console.log('count', this.state.count)
            downLoadLoadingChange(true)
            const { type } = this.state
            if (type === 1) {
                // 当为普通二维码
                // if (!shops.length) {
                //     this.setState({ url2: [] });
                //     return;
                // }
                const temp = {
                    shops,
                    groupID,
                    qrcodeType: 1,
                    messageUrl: url,
                    width: 500,
                    height: 500,
                }
                this.getQrCode(temp)
                return
            }
            let newItem = item
            if (!imgID) {
                newItem = { ...defaultImgTxt, imgPath: firstImg };
                this.setState({ item: newItem });
            }
            const { imgPath, digest: description, resTitle: title } = newItem;
            const expireTime = 60 * 24 * 30;
            const imageUrl = imgURI + imgPath;
            const temp = {
                groupID,
                mpID,
                expireTime,
                messageUrl: url,
                imageUrl,
                description,
                title,
                shops,
                qrcodeType: 2,
                width: 500,
                height: 500,
            }
            this.getQrCode(temp)  
        })
    }
    onImgTxtChange = (imgID) => {
        const { mpID, item, shopInfo } = this.state;
        const { imgList } = this.props;
        let temp = {};
        if (imgID) {
            const { resContent = {} } = imgList.find(x => `${x.itemID}` === imgID);
            const { resources = [] } = JSON.parse(resContent);
            temp = resources[0];
            this.setState({ item: temp });
            this.onGetQrImg({ mpID, imgID, item: temp, shops: shopInfo })
            this.setState({
                imgID,
                imgError: false,
            });
            return
        }
        this.onGetQrImg({ mpID, imgID, item, shops: shopInfo })
        this.setState({
            imgID,
            imgError: false,
        });
    }
    onQrCodeDownload = (index) => {
        const { zip, shops } = this.state
        const { cancelDownLoad } = this.props
        if (!shops.length) {
            const canvas = document.getElementById('bag_qr_canvas');
            const dom = document.createElement('a');
            dom.href = canvas.toDataURL('image/png');
            dom.download = '二维码.png';
            dom.click();
        } else {
            const dom = document.createElement('a');
            if (zip) {
                dom.href = zip;
                // dom.download = '二维码.png';
                dom.click();
            }
        }
        cancelDownLoad()
    }
    onTypeChange = (e) => {
        this.setState({
            type: e.target.value,
        })
        const { mpID, item, shopInfo, imgID } = this.state;
        this.onGetQrImg({ mpID, imgID, item, shops: shopInfo })
    }

    getQrCode = (params) => {
        getQrCodeImg(params).then((x) => {
            const { downLoadLoadingChange } = this.props
            let { count } = this.state
            this.setState({
                count: count -1,
            })
            // console.log('now decrease the count to', this.state.count)
            if (x && this.state.count === 0) {
                downLoadLoadingChange(false)
            }
            this.setState({
                zip: x,
            })
        });
    }

    passValidate = () => {
        const { type, mpID, imgID } = this.state
        if (type == 1) {
            return true
        } 
        if (mpID && imgID) {
            return true
        }
        if (!mpID) {
            this.setState({
                mpError: true,
            })
        }
        if (!imgID) {
            this.setState({
                imgError: true,
            }) 
        }
    }

    handleShopSelectorChange = (values) => {
        const shopData = this.props.shopSchema.toJS().shopSchema || {}
        const temp = []
        values.forEach((item) => {
            let shopName = shopData.shops&& shopData.shops.filter((every) => {
                return every.shopID == item
            })[0].shopName
            temp.push({
                shopName,
                shopID: item,
            })
        })
        this.setState({
            shops: values,
            shopInfo: temp,
        });
        const { mpID, item, imgID } = this.state;
        this.onGetQrImg({ mpID, imgID, item, shops: temp })
    }
    filterShopData = () => {
        const shopData = this.props.shopSchema.toJS().shopSchema || {}
        const shopsInfo = this.props.shopsInfo
        if (!shopsInfo.length) {
            return shopData
        }
        const temp = []
        shopData.shops && shopData.shops.forEach((item) => {
            if (shopsInfo.some((every) => {
                return every == item.shopID
            })) {
                temp.push(item)
            }
        })
        shopData.shops = temp
        return shopData
    }
    render() {
        const { mpID, imgID, item, url2, type, shops, mpError, imgError, zip } = this.state;
        const { mpInfoList, imgList, url } = this.props;
        const validDate = url2.length ? '有效期30天' : '永久有效';
        return (
            <ul className={styles.step2Box}>
                <li>
                    <h3 className={styles.title}>链接投放</h3>
                    <div className={styles.top}>
                        <div className={styles.flex}>
                            <span>投放链接</span>
                            <Input ref={this.onGetInput} value={url} />
                            <Button onClick={this.onCopy}>复制</Button>
                        </div>
                        <p>投放链接可配置至公众号菜单或进行线上餐厅、小程序等场景功能配置</p>
                    </div>
                </li>
                <li>
                    <h3 className={styles.title}>二维码投放
                    </h3>
                    <div className={styles.bottom}>
                        <div className={styles.typeBox}>
                            <span className={styles.titleSpan}>二维码类型</span>
                            <Radio.Group onChange={this.onTypeChange} value={type}>
                                <Radio value={1}>普通二维码</Radio>
                                <Radio value={2}>公众号关注二维码</Radio>
                            </Radio.Group>
                            <div className={styles.tipBox}>
                                {
                                    type === 1 ? '二维码永久有效，用户扫码后无需关注公众号,支持使用微信、支付宝扫码直接打开H5购买券包。'
                                        : '二维码有效期30天，用户使用微信扫描二维码后，需要先关注公众号，再点击图文消息购买券包。'
                                }
                            </div>
                            {
                                type === 2 && <div style={{ marginBottom: 20 }}>
                                    <div className={styles.accountBox}>
                                        <span>引导关注公众号</span>
                                        <div>
                                            <Select allowClear={true} value={mpID} onChange={this.onAccountChange}>
                                                {mpInfoList.map(x => <Option value={x.mpID}>{x.mpName}</Option>)}
                                            </Select>
                                            {mpError && <span className={styles.errorSpan}>请选择公众号</span>}
                                            <p className={styles.tips}>如异业合作、无需关注公众号或无需用户使用微信扫码场景不用选择</p>
                                        </div>
                                    </div>
                                    {mpID &&
                                        <div className={styles.imgListBox}>
                                            <span>图文消息</span>
                                            <div>
                                                <Select allowClear={true} value={imgID} onChange={this.onImgTxtChange}>
                                                    {imgList.map(x => <Option value={`${x.itemID}`}>{x.resTitle}</Option>)}
                                                </Select>
                                                {imgError && <span className={styles.errorSpan}>请选择图文消息</span>}
                                                <p className={styles.tips}>选择图文消息后，生成链接会覆盖原图文素材配置的自定义链接</p>
                                            </div>
                                        </div>
                                    }
                                    {mpID &&
                                        <div className={styles.previewBox}>
                                            <span>图文预览</span>
                                            <div className={styles.view}>
                                                <dl>
                                                    <dt>{item.resTitle}</dt>
                                                    <dd>{item.digest}</dd>
                                                </dl>
                                                <img src={imgURI + item.imgPath} alt="" />
                                            </div>
                                        </div>}
                                </div>
                            }{
                                <div className={styles.qrPriview}>
                                    <QRCode
                                        size={95}
                                        value={shops.length ? '' : zip}
                                        id="bag_qr_canvas"
                                    />
                                </div>
                            }
                            <span className={styles.titleSpan}>按店铺投放
                                <Tooltip
                                    title={<div>
                                        <p>表示可以按照所选店铺生成多个店铺二维码，并记录每个店铺的券包售卖</p>
                                    </div>}
                                >
                                    <Icon style={{ marginLeft: 3, cursor: 'pointer' }} type="question-circle-o" />
                                </Tooltip>
                            </span>
                            <div className={styles.contentBox}>
                                <ShopSelector
                                    onChange={
                                        this.handleShopSelectorChange
                                    }
                                    value={shops}
                                    schemaData={this.filterShopData()}
                                />
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        );
    }
}
function mapStateToProps(state) {
    return {
        shopSchema: state.sale_shopSchema_New,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPromotionShopSchema: (opts) => {
            dispatch(getPromotionShopSchema(opts));
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        withRef: true,
    }
)(Step2)

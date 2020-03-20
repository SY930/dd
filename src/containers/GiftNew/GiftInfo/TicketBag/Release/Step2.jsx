import React, { PureComponent as Component } from 'react';
import { Button, Input, Select, message } from 'antd';
import { imgURI } from '../Common';
import styles from './index.less';
import QRCode from 'qrcode.react';
import { getQrCodeImg } from '../AxiosFactory';

const Option = Select.Option;
const defaultImgTxt = { resTitle: '叮咚！天上掉下一堆券，点我点我点我', digest: '为小主准备的超级大礼包，点我查看' };
export default class Step2 extends Component {
    state = {
        mpID: '',
        imgID: '',
        item: defaultImgTxt,
        url2: '',       // 30天的
    };
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
        const { imgID, item } = this.state;
        this.onGetQrImg({ mpID, imgID, item });
        this.setState({ mpID });
    }
    onGetQrImg({ mpID, imgID, item }){
        const { groupID, url, firstImg } = this.props;
        if(!mpID){
            this.setState({ url2: '' });
            return;
        }
        let newItem = item;
        if(!imgID) {
            newItem = { ...defaultImgTxt, imgPath: firstImg };
            this.setState({ item: newItem });
        }
        const { imgPath, digest: description, resTitle: title } = newItem;
        const expireTime = 60 * 24 * 30;
        const imageUrl = imgURI + imgPath;
        const params = { groupID, mpID, qrCodeType: '11', expireTime, messageUrl: url,
            imageUrl, description, title };
        getQrCodeImg(params).then(x => {
            this.setState({ url2: x });
        });
    }
    onImgTxtChange = (imgID) => {
        const { mpID } = this.state;
        const { imgList } = this.props;
        let item = {};
        if(imgID){
            const { resContent = {} } = imgList.find(x => `${x.itemID}` === imgID);
            const { resources = [] } = JSON.parse(resContent);
            item = resources[0];
            this.setState({ item });
        }
        this.onGetQrImg({ mpID, imgID, item });
        this.setState({ imgID });
    }
    onQrCodeDownload = () => {
        const canvas = document.getElementById('bag_qr_canvas');
        const dom = document.createElement('a');
        dom.href = canvas.toDataURL('image/png');
        dom.download = '二维码.png';
        dom.click();
    }
    render() {
        const { mpID, imgID, item, url2 } = this.state;
        const { mpInfoList, imgList, url } = this.props;
        const validDate = url2 ? '有效期30天' : '永久有效';
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
                    <h3 className={styles.title}>二维码投放</h3>
                    <div className={styles.bottom}>
                        <div className={styles.accountBox}>
                            <span>引导关注公众号</span>
                            <div>
                                <Select allowClear={true} value={mpID} onChange={this.onAccountChange}>
                                {mpInfoList.map(x => <Option value={x.mpID}>{x.mpName}</Option>)}
                                </Select>
                                <p className={styles.tips}>如果异业合作、无需关注公众号或无需用户使用微信扫码场景不用选择</p>
                            </div>
                        </div>
                        {mpID &&
                            <div className={styles.imgListBox}>
                                <span>图文消息</span>
                                <div>
                                    <Select allowClear={true} value={imgID} onChange={this.onImgTxtChange}>
                                    {imgList.map(x => <Option value={`${x.itemID}`}>{x.resTitle}</Option>)}
                                    </Select>
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
                        <div className={styles.qrPriview}>
                            <QRCode
                                size={95}
                                value={url2 || url}
                                id="bag_qr_canvas"
                            />
                            <em>{validDate}</em>
                            <Button onClick={this.onQrCodeDownload}>下载二维码</Button>
                            <p className={styles.tips}>当选择引导关注公众号后，用户可使用微信扫码进行关注公众号后购买相应券包。</p>
                        </div>
                    </div>
                </li>
            </ul>
        );
    }
}

import React, { PureComponent as Component } from 'react';
import { Button, Input, Select, message } from 'antd';
import { imgURI } from '../Common';
import styles from './index.less';

const Option = Select.Option;
const defaultImgTxt = { resTitle: '叮咚！天上掉下一堆券，点我点我点我', digest: '为小主准备的超级大礼包，点我查看' };
export default class Step2 extends Component {
    state = {
        mpID: '',
        imgID: '',
        item: defaultImgTxt,
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
        this.setState({ mpID });
    }
    onImgChange = (imgID) => {
        if(imgID){
            const { imgList } = this.props;
            const { resContent = {} } = imgList.find(x => `${x.itemID}` === imgID);
            const { resources = [] } = JSON.parse(resContent);
            this.setState({ item: resources[0] });
        }
        this.setState({ imgID });
    }
    render() {
        const { mpID, imgID, item } = this.state;
        const { mpInfoList, imgList, firstImg, url } = this.props;
        let newItem = item;
        if(!imgID) {
            newItem = { ...defaultImgTxt, imgPath: firstImg };
        }
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
                                    <Select allowClear={true} value={imgID} onChange={this.onImgChange}>
                                    {imgList.map(x => <Option value={`${x.itemID}`}>{x.resTitle}</Option>)}
                                    </Select>
                                    <p className={styles.tips}>如果异业合作、无需关注公众号或无需用户使用微信扫码场景不用选择</p>
                                </div>
                            </div>
                        }
                        {mpID &&
                            <div className={styles.previewBox}>
                            <span>图文预览</span>
                            <div className={styles.view}>
                                <dl>
                                    <dt>{newItem.resTitle}</dt>
                                    <dd>{newItem.digest}</dd>
                                </dl>
                                <img src={imgURI + newItem.imgPath} alt="" />
                            </div>
                        </div>}
                        <div className={styles.qrPriview}>
                            <img src={'http://res.hualala.com/basicdoc/b58ae139-73cf-4e60-bc79-1c216fbe1cd2.png'} alt="" />
                            <em>有效期30天</em>
                            <Button onClick={this.onOpenModal}>下载二维码</Button>
                            <p className={styles.tips}>当选择引导关注公众号后，用户可使用微信扫码进行关注公众号后购买相应券包。</p>
                        </div>
                    </div>
                </li>
            </ul>
        );
    }
}

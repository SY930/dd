import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Checkbox, Radio, Select, Form, Row, Col } from 'antd';
import css from './style.less';
import { formItemLayout, formKeys, formItems, } from './Common';
import { getCardTypeList } from './AxiosFactory';
import PhotoFrame from "../../../SpecialPromotionNEW/common/PhotoFrame";
// import TicketBag from '../TicketBag';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class Share extends Component {
    state = {
        tabKey: '1',
        cardList: [],
    }
    componentDidMount() {
        // this.add();
        // this.getCardType();
    }
    onChange = (tabKey) => {
        this.setState({ tabKey });
    }
    
    onAllChange(data){
        const { tabKey } = this.state;
        const { value, onChange } = this.props;
        const list = [...value];
        const item = list[tabKey - 1];
        list[tabKey - 1] = { ...item, ...data };
        let count = 0;
        list.forEach(x=>{
            count += +x.giftOdds;
        });
        this.count = count;
        onChange(list);
    }
    render() {
        const { tabKey, cardList } = this.state;
        const { shareTitle = '', shareSubtitle = '', restaurantShareImagePath, shareImagePath, shareTitlePL = '', shareSubtitlePL = '', type } = this.state;
        const { value, decorator } = this.props;
        if(!value[0]){ return null}
        const { length } = value;
        const disable = value[0].userCount > 0;    // 如果被用了，不能编辑
        return (
                <div className={css.mainBox}>
                    <div>
                        <p className={css.titleTip}>分享设置</p>
                    </div>
                    <div>
                        <FormItem
                            label="标题"
                            className={css.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {decorator("shareTitle", {
                                rules: [{ max: 35, message: "最多35个字符" }],
                                initialValue: shareTitle,
                                onChange: this.handleShareTitleChange,
                            })(<Input placeholder={shareTitlePL} />)}
                        </FormItem>
                        <FormItem
                            label="副标题"
                            className={css.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {decorator("shareSubtitle", {
                                rules: [{ max: 35, message: "最多35个字符" }],
                                initialValue: shareSubtitle,
                                onChange: this.handleShareSubTitleChange,
                            })(<Input placeholder={shareSubtitlePL} />)}
                        </FormItem>
                        <FormItem
                            label="分享图片"
                            className={css.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                            style={{ position: "relative" }}
                        >
                            <PhotoFrame
                                restaurantShareImagePath={restaurantShareImagePath}
                                shareImagePath={shareImagePath}
                                onChange={this.onRestImg}
                                type={type}
                            />
                        </FormItem>
                    </div>
                </div>

        )
    }
}

export default Share

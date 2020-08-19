import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Checkbox, Radio, Select, Form, Row, Col } from 'antd';
import css from './style.less';
import PhotoFrame from "../../../SpecialPromotionNEW/common/PhotoFrame";

const FormItem = Form.Item;
class Share extends Component {
    state = {
        
    }

    componentDidMount() {
        
    }

    handleShareTitleChange = ({target}) => {
        const { value } = target;
        this.onAllChange({ shareTitle: value });
    }
    
    handleShareSubTitleChange = ({target}) => {
        const { value } = target;
        this.onAllChange({ shareSubtitle: value });
    }

    onRestImg = ({ key, value }) => {
        this.onAllChange({ [key]: value });
    };
    
    onAllChange(data){
        const { value, onChange } = this.props;
        const list = { ...value, ...data };
        onChange(list);
    }
    render() {
        const { value, decorator } = this.props;
        console.log('va', value)
        let {type = '79', shareTitle = '', shareSubtitle = '', restaurantShareImagePath, shareImagePath} = value
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
                        <Input onChange={this.handleShareTitleChange} value={shareTitle} placeholder={'请输入标题'} />
                    </FormItem>
                    <FormItem
                        label="副标题"
                        className={css.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Input  onChange={this.handleShareSubTitleChange} value={shareSubtitle} placeholder={'请输入副标题'} />
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
                            isMoveRestaurant={true}
                        />
                    </FormItem>
                </div>
            </div>

        )
    }
}

export default Share

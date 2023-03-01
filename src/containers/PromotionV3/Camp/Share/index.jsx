

import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Checkbox, Radio, Select, Form, Row, Col, Switch } from 'antd';
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

    handleChangeSwitch = (value) => {
        this.onAllChange({ shareOpen: value });
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
        let {type = '79', shareTitle = '', shareSubtitle = '', restaurantShareImagePath, shareImagePath, shareOpen = true } = value
        return (
            <div className={css.mainBox}>
                <div>
                    <p className={css.titleTip}>分享设置</p>
                </div>
                <div>
                    <FormItem
                        label="是否可分享"
                        className={css.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            defaultChecked={true}
                            checked={shareOpen}
                            onChange={this.handleChangeSwitch}
                        />
                    </FormItem>
                    {
                        shareOpen && (<div>
                            <FormItem
                                label="标题"
                                className={css.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <Input onChange={this.handleShareTitleChange} value={shareTitle} placeholder={'请输入标题'} />
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
                        </div>)
                    }
                </div>
            </div>

        )
    }
}

export default Share

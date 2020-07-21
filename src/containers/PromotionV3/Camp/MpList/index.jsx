import React, { PureComponent as Component } from 'react';
import { Select, Form, Row, Col, Icon, Tooltip } from 'antd';
import CropperUploader from 'components/common/CropperUploader'
import css from './style.less';

const Option = Select.Option;
const FormItem = Form.Item;
class MpList extends Component {
    state= {
        
    }

    onAllChange = (data) => {
        const { value, onChange } = this.props;
        let list = {...value, ...data};
        onChange(list);
    }

    onChange = (value) => {
        this.onAllChange({ mpIDList: value });
    }

    render() {
        const { value, options, decorator } = this.props;
        
        return (
            <div className={css.mainBox}>
                <FormItem 
                    style={{width: '100%'}}
                >
                    <Row>
                        <Col span={22}>
                            <Select
                                style={{width: '100%'}}
                                showSearch
                                multiple
                                placeholder={'请选择适用公众号'}
                                defaultValue={value}
                                onChange={(value) => {
                                    this.onChange(value)
                                }}
                            >
                                {
                                    options.map((item) => {
                                        return (
                                            <Option value={item.value}>{item.label}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={1}>
                            <Tooltip title={ 
                                <div>
                                    <p>对于非公众号使用场景下，无需配置适用公众号</p>
                                    <p>对于限制在既定公众号才能参与活动场景下，可以配置活动执行指定公众号</p>
                                </div> 
                            }>
                                <Icon style={{cursor: 'pointer'}} type="question-circle-o" />    
                            </Tooltip>
                        </Col>
                    </Row>
                </FormItem>
            </div>
        )
    }
}

export default MpList

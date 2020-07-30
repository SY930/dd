import React from 'react'
import {
    Row,
    Col,
    Form,
    message,
    Radio,
    Upload,
    Icon,
    Input,
    Select,
    Switch,
    Popconfirm,
    Tooltip,
    Checkbox,
    Tabs,
} from 'antd';
import AddGifts from '../common/AddGifts';


export const freeGetStep3Render = function freeGetStep3Render() {
    const { type } = this.props;
    return (
        <div>
            <Row>
                <Col span={17} offset={4}>
                    <AddGifts
                        maxCount={type == '21' || type == '30' ? 1 : 10}
                        disabledGifts={type == '67' && this.state.disabledGifts}
                        type={this.props.type}
                        isNew={this.props.isNew}
                        value={
                            this.state.data
                                .filter(gift => gift.sendType === 0)
                                .sort((a, b) => a.needCount - b.needCount)
                        }
                        onChange={gifts => this.gradeChange(gifts, 0)}
                    />
                </Col>
            </Row>
            {this.renderShareInfo2()}
        </div>

    )
}

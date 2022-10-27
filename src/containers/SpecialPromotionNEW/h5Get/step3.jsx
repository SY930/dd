import React from 'react'
import {
    Row,
    Col
} from 'antd';
import AddGifts from '../common/AddGifts';

//H5领取模块在这
export const h5GetStep3Render = function h5GetStep3Render() {
    const { type, isNew, isCopy } = this.props;
    const { data } = this.state;

    return (
        <div>
            <Row>
                <Col span={17} offset={4}>
                    <AddGifts
                        maxCount={10}
                        type={type}
                        isNew={isNew}
                        isCopy={isCopy}
                        value={data
                            .filter(gift => gift.sendType === 0)
                            .sort((a, b) => a.needCount - b.needCount)}
                        onChange={gifts => this.gradeChange(gifts, 0)}
                    />
                </Col>
            </Row>
            {this.renderApproverSet()}
        </div>

    )
}

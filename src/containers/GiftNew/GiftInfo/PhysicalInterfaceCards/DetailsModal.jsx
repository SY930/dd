import React, { Component } from 'react';
import { Row, Col, Modal, Button } from 'antd';
import _ from 'lodash';
import { COLUMNS } from '../_tableSum';
import styles from '../GiftInfo.less';
import { BASE_INFO } from './DetailCommon';
import CardDetailTabs from './CardDetailTabs';

class DetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: false,
        };
        this.columns = COLUMNS;
    }


    render() {
        const { visible, onCancel, groupID, item, upDateParentState } = this.props;

        return (
            <Modal
                title="卡详情"
                visible={visible}
                maskClosable={false}
                onCancel={onCancel}
                width={1105}
                footer={[<Button key="0" type="primary" onClick={onCancel}>关闭</Button>]}
            >
                <div className={styles.giftDetailModal}>
                    <div>
                        <Row>
                            <h3>基本信息</h3>
                        </Row>
                        <Row style={{ margin: '0 10px' }}>
                            <Col span={4}>
                                <div className={styles.card_img}>
                                    <span><em style={{ fontSize: 28 }}>{item.templateTypeName}</em></span>
                                    {/* <p className={styles.ellipsisBlock}>{'卡类型'}</p> */}
                                </div>
                            </Col>
                            <Col span={19} push={1}>
                                {BaseInfo(item)}
                            </Col>
                        </Row>
                    </div>
                    {/* <div>
                        <Row>
                            <h3>卡统计</h3>
                        </Row>
                        <Row>
                            <Table
                                bordered={true}
                                columns={STATISTICS_COLUMS}
                                dataSource={dataSource}
                                pagination={false}
                                loading={loading}
                                className="gift-detail-modal-table"
                            />
                        </Row>
                    </div> */}
                    <div>
                        <Row>
                            <h3>卡操作</h3>
                        </Row>
                        <Row>
                            <CardDetailTabs item={item} groupID={groupID} upDateParentState={upDateParentState} />
                        </Row>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default DetailsModal;

function BaseInfo(item = {}) {

    return (
        <Row>
            {
                BASE_INFO.map(({ title, key }) => {
                    return (
                        <Col span={12} key={key}>
                            <Row className="info-display">
                                <Col span={6}>{title}：</Col>
                                <Col span={18} className={styles.breakWordsWrap}>{item[key]}</Col>
                            </Row>
                        </Col>
                    )
                })
            }
        </Row>
    )
}

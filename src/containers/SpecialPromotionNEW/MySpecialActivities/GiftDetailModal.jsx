import React, { Component } from 'react';
import {
    Modal,
    Table,
    Button,
    Tooltip,
} from 'antd';
import { COMMON_LABEL } from 'i18n/common';
import { axiosData } from '../../../helpers/util';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
export default class GiftDetailModal extends Component {

    state = {
        prizeInfos: [],
        loading: false,
        columns: [
            {
                title: COMMON_LABEL.serialNumber,
                dataIndex: 'idx',
                key: 'idx',
                className: 'TableTxtCenter',
                width: 30,
                render:(text, record, index)=> {
                    return (<p>{index + 1}</p>);
                }
            },
            {
                title: '礼品名称',
                dataIndex: 'giftName',
                key: 'giftName',
                className: 'TableTxtCenter',
                width: 180,
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: '礼品个数',
                dataIndex: 'giftCount',
                key: 'giftCount',
                width: 100,
                className: 'TableTxtCenter',
            },
        ]
    }

    componentDidMount() {
        this.handleQuery();
    }

    handleQuery = () => {
        const {
            eventID,
            customerID,
        } = this.props;
        this.setState({
            loading: true,
        })
        axiosData(
            '/specialPromotion/queryEventCustomerPrize.ajax',
            {
                eventID,
                customerID,
            },
            {},
            {path: 'data'},
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then(({prizeInfos = []}) => {
            this.setState({
                prizeInfos: Array.isArray(prizeInfos) ? prizeInfos : [],
                loading: false,
            })
        }).catch(() => {
            this.setState({
                loading: false,
            })
        })
    }

    // handlePageChange = (pageNo) => {
    //     this.handleQuery(pageNo)
    // } 

    render() {
        const handleModalClose = this.props.onClose;
        return (
            <Modal
                title={'礼品详情'}
                visible={true}
                onCancel={handleModalClose}
                maskClosable={false}
                width={600}
                footer={[<Button key="0" type="ghost" onClick={handleModalClose}>{COMMON_LABEL.close}</Button>]}
            >
                <Table
                    dataSource={this.state.prizeInfos}
                    columns={this.state.columns}
                    loading={this.state.loading}
                    bordered={true}
                    pagination={false}
                    // pagination={{
                    //     current: this.state.pageNo,
                    //     total: this.state.total,
                    //     showQuickJumper: true,
                    //     showSizeChanger: false, // 暂时不改变pageSize
                    //     pageSize: this.state.pageSize,
                    //     showTotal: (total, range) => `${this.props.intl.formatMessage(STRING_SPE.d2b1c6b31a93638)} ${range[0]} - ${range[1]} / ${this.props.intl.formatMessage(STRING_SPE.dk46lj779a7119)} ${total} ${this.props.intl.formatMessage(STRING_SPE.d34ikgs6o6845)}`,
                    //     onChange: this.handlePageChange
                    // }}
                />
            </Modal>
        )
    }
}

import React, {Component} from 'react';
import {
    Table,
    Modal,
    Button,
} from 'antd';
import {axiosData} from "../../helpers/util";
import style from './style.less';
import WeChatCouponDetail from "./WeChatCouponDetail";


class WeChatCouponDetailModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fulfilledWithError: false,
            couponEntity: null,
        }
    }

    render() {
        const {
            couponEntity,
            onClose,
        } = this.props;
        const columns = [
            {
                title: '总库存量',
                dataIndex: 'couponTotal',
                width: 120,
                key: 'couponTotal',
                className: 'TableTxtCenter',
            },
            {
                title: '已发券量',
                dataIndex: 'isSendNum',
                width: 120,
                className: 'TableTxtCenter',
                key: 'isSendNum',
            },
            {
                title: '发券比例',
                width: 120,
                dataIndex: 'null',
                className: 'TableTxtCenter',
                key: 'per',
                render: (text, {couponTotal, isSendNum}) => {
                    return `${( 100 * isSendNum / couponTotal).toFixed(2)}%`
                }
            },

        ];
        return (
            <Modal
                title="代金券详情"
                maskClosable={true}
                width={'720'}
                visible={true}
                onCancel={onClose}
                footer={[
                    <Button onClick={onClose} type="ghost">关闭</Button>
                ]}
            >
                <div style={{ padding: '10px 20px 20px 20px' }}>
                    <WeChatCouponDetail entity={couponEntity} />

                    <div className={style.colorBorderedHeader}>
                        代金券消耗汇总
                    </div>
                    <Table dataSource={[couponEntity]} columns={columns} bordered={true} pagination={false} />
                </div>
            </Modal>
        )
    }
}

export default WeChatCouponDetailModal

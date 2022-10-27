import React, { PureComponent as Component } from 'react';
import { Modal, Table, Button } from 'antd';
import { getDetailColums } from './DetailCommon'
import _ from 'lodash';

export default class SendDetailModal extends Component {

    showFooter = () => {
        return [<Button type='ghost' onClick={this.props.handleCancel}>关闭</Button>]
    }

    render() {

        const { visible, record, templateType } = this.props;

        return (
            <Modal
                title="详细信息"
                visible={visible}
                maskClosable={false}
                closable={false}
                footer={this.showFooter()}
                width={950}
            >
                <div>
                    <Table
                        className="tableStyles"
                        bordered={true}
                        columns={getDetailColums(templateType)}
                        dataSource={[record]}
                        scroll={{ x: true }}
                        pagination={false}
                    />
                </div>
            </Modal>
        );
    }
}



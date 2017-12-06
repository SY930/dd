/*
 * benLong 2017-08-30 导入组件 API
 * title:导入窗口的title
 * url:导入文件的 url 地址 (注：url类型为 from 类型)
 * downUrl:模板的下载地址
 * importVisible:导入窗口的显示和隐藏 默认为 false
 * importSuccess:导入成功时的回调
 * importCancel:取消导入的回调
 */

import React, { Component } from 'react';
import { Row, Col, Button, Input, Upload, Icon, Modal, message, Spin } from 'antd';
import { fetchData } from '../../../helpers/util';
import styles from './Imports.less';

class Imports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            importVisible: this.props.importVisible || false, // 导入弹出框的显示和隐藏 默认为 false
            loading: false, // 导入时的加载状态
            upload: {
                customRequest: this.customRequest, // 自定义上传请求
            },
            file: '', // 上传的文件
            fileName: '', // 上传的文件名称
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.importVisible !== nextProps.importVisible) {
            this.setState({
                importVisible: nextProps.importVisible,
            })
        }
        if (this.props.importLoading !== nextProps.importLoading) {
            this.setState({
                importLoading: nextProps.importLoading,
            })
        }
    }

    // 自定义上传请求
    customRequest = (info) => {
        this.setState({
            file: info.file,
            fileName: info.file.name,
        });
    }
    // 导入请求
    emploeeImport = () => {
        if (!this.state.file) {
            message.warning('请选择需要导入的文件~');
            return
        }
        this.setState({
            loading: true,
        });
        const _params = {};
        _params.file = this.state.file;
        // houseId 和 houseNameAndCode 这个是wms传的时候需要的，其它页面可能不需要
        if (this.props.houseId) {
            _params.houseId = this.props.houseId;
            _params.houseName = this.props.houseNameAndCode
        }
        fetchData(this.props.url, _params, null, { path: false })
            .then((data) => {
                if (this.props.importSuccess) {
                    this.props.importSuccess(); // 导入成功时的回调 成功提示可以在这里写
                } else {
                    message.success('导入成功~');
                }
                this.setState({
                    loading: false,
                })
            })
            .catch(({ code, msg }) => {
                this.setState({
                    loading: false,
                });
            })
    };

    render() {
        return (
            <Modal
                title={this.props.title || '导入'}
                visible={this.state.importVisible}
                onCancel={this.props.importCancel}
                footer={[<Button key="0" type="ghost" onClick={this.props.importCancel}>取消</Button>]}
                width={600}
            >
                <Spin spinning={this.state.loading}>
                    <Row className={styles.importMain}>
                        <Col span={24} className={styles.promptText}>请选择需要导入的文件</Col>
                        <Col span={16}>
                            <Input style={{ width: 447 }} value={this.state.fileName} />
                        </Col>
                        <Col span={4} className={styles.selectFile}>
                            <Upload {...this.state.upload}>
                                <Button type="ghost">选择文件</Button>
                            </Upload>
                        </Col>
                        <Col span={2}>
                            <Button type="primary" onClick={this.emploeeImport}>导入</Button>
                        </Col>
                        <Col span={24} className={styles.downName}>
                            <a href={this.props.downUrl}>
                                <Icon type="download" />{`${this.props.downName}`}
                            </a>
                        </Col>
                    </Row>
                    <Row style={{ paddingLeft: 20 }}>
                        <Col span={9} className={styles.hualalaDragon}>
                            <img src="/asserts/img/hualaldragon.png" />
                        </Col>
                        <Col span={15}>
                            <ul className={styles.descriptionText}>
                                <li>【哗啦啦龙小叮咛】</li>
                                <li>1.下载该模板前，请先配置好仓库。</li>
                                <li>2.不支持WPS软件，请使用Excel软件编辑。</li>
                                <li>3.请按错误提示修改，直至导入成功</li>
                                <li>4.如遇到使用问题，请及时联系对应的运营人员或者服务商</li>
                            </ul>
                        </Col>
                    </Row>
                </Spin>
            </Modal>
        );
    }
}

export default Imports;

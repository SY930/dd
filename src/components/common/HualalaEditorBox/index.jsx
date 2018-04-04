/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-05T15:12:02+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: index.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T14:54:09+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import {
    Icon,
    Modal,
    Tag,
    Row,
    Col,
    message,
} from 'antd';
import _ from 'lodash'

import styles from './hualalaEditorBox.less';
import { Iconlist } from '../../basic/IconsFont/IconsFont';
import { toJSON, genAction, genFetchOptions, fetchData } from '../../../helpers/util';

// if (process.env.__CLIENT__ === true) {
//     require('../../../../client/components.less')
// }
class HualalaEditorBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            validData: new Set(), // 有效值。
        }

        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: Array.from(nextProps.data),
        })
    }

    showModal() {
        this.setState({
            visible: true,
            validData: new Set(Array.from(this.state.data)),
        });
    }

    handleOk() {
        this.setState({
            visible: false,
            validData: new Set(Array.from(this.state.data)),
        }, () => {
            this.props.onChange && this.props.onChange(this.state.validData);
        });
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
        this.props.onChange && this.props.onChange(this.state.validData);
    }

    handleClose(value) {
        this.props.onTagClose && this.props.onTagClose(value);
    }


    renderTags = () => {
        const { data } = this.state;
        const { itemName, itemID, label } = this.props;

        if (data instanceof Array && data.length > 0) {
            return (
                <Row className={styles.proXz}>
                    {
                        data.map((item, idx) => {
                            return (
                                <div key={`${idx}`} className={styles.projectTag}>
                                    <Tag key={item[itemID]} closable={true} afterClose={() => this.handleClose(item)} className={styles.projectTags}>
                                        {this.props.itemNameJoinCatName ?
                                            `${item[this.props.itemNameJoinCatName] ? item[this.props.itemNameJoinCatName] + '---' : ''}${item[itemName]}` :
                                            item[itemName]}
                                    </Tag>
                                </div>
                            );
                        })
                    }
                </Row>
            )
        }
        return (
            <div onClick={this.showModal} className={styles.proRBtn1}>
                <Iconlist iconName={'plus'} className="plusSmall" />
                <br />
                <span className="colors">{`点击添加${label}`}</span>
            </div>
        )
    }

    render() {
        const data = this.state.data;
        const showStyle = (
            <div className={styles.proAll}>

                <div className={styles.proRight}>
                    <div className={styles.proRmain}>
                        {this.renderTags()}
                    </div>
                    <div className={styles.projectIco}>
                        {data && data.length != 0
                            ? (<Iconlist iconName={'plus'} className="plusBig" onClick={this.showModal} />)
                            : null}
                        <Modal title={`选择${this.props.label}`} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} width="922px">
                            <div style={{
                                width: '100%',
                                height: '100%',
                            }}
                            >
                                {
                                    this.props.children
                                }
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>

        )
        return showStyle;
    }
}

HualalaEditorBox.propTypes = {
    onChange: React.PropTypes.func,
    onTagClose: React.PropTypes.func,
}

HualalaEditorBox.defaultProps = {
    onChange: () => { },
    onTagClose: () => { },
}


export default HualalaEditorBox;

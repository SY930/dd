import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Modal,
    Tree,
    Button,
    Tooltip,
    Input,
    message,
    Form
} from 'antd';
import { _ } from 'lodash';
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';

const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);
const AVAILABLE_GIFTS = [
    '10', '20', '21', '110', '111', '22','115'
];

@injectIntl()
class CreateShareRulesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.debouncedHandleOk = _.debounce(this.handleOk,400)
        // this.handleIconHover = this.handleIconHover.bind(this);
        // this.handleClose = this.handleClose.bind(this);
    }
    handleOk = () => {
        
    }
    render() {
        
        return (
            <Modal
                maskClosable={true}
                title={'新建共享规则'}
                visible={true}
                footer={[
                    <Button key="0" type="ghost" size="large" onClick={this.props.handleCancel}>
                        取消
                    </Button>,
                    <Button  key="1" type="primary" size="large" onClick={this.debouncedHandleOk} loading={this.props.loading}>
                        确定
                    </Button>,
                ]}
                onCancel={this.props.handleCancel}
                width="922px"
            >
               
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        allPromotionList: state.sale_promotionDetailInfo_NEW.getIn(['$allPromotionListInfo', 'data', 'promotionTree']),
        allGiftList: state.sale_giftInfoNew.get('allGiftList'), // 所有哗啦啦券列表--共享用
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CreateShareRulesModal));
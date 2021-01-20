import React, {Component} from 'react';
import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../components/common';
import {connect} from 'react-redux';
import {
    Modal,
    Tree,
    Button,
    Tooltip,
    Input,
    message
} from 'antd';
import {debounce} from 'lodash';
import {BASIC_PROMOTION_MAP, GIFT_MAP} from "../../constants/promotionType";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

const TreeNode = Tree.TreeNode;

const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);

const AVAILABLE_GIFTS = [
    '10', '20', '21', '110', '111', '22',
];
@injectIntl()
class BatchGroupEditModal extends Component {

    state = {
        searchInput: '',
        currentCategory: null,
        selected: this.props.selectedPromotions || [],
        shareGroupName: this.props.shareGroupName,
        limitNum: 100,        //共享限制数量
    }

    handleSave = () => {

    }

    render() {
        return (
            <Modal
                maskClosable={false}
                title={this.props.isCreate ? COMMON_LABEL.create : bianji}
                visible={true}
                footer={[
                    <Button key="0" type="ghost" size="large" onClick={this.props.handleCancel}>
                        取消
                    </Button>,
                    <Button disabled={selected.length < 2} key="1" type="primary" size="large" onClick={this.handleSave} loading={this.props.loading}>
                        保存
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
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchGroupEditModal)

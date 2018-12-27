import React, {Component} from 'react';
import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../components/common';
import {connect} from 'react-redux';
import {
    Modal,
    Tree,
    Button,
    Tooltip
} from 'antd';
import {debounce} from 'lodash';
import {BASIC_PROMOTION_MAP, GIFT_MAP} from "../../constants/promotionType";
const TreeNode = Tree.TreeNode;

const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);

const AVAILABLE_GIFTS = [
    '10', '20', '21', '110', '111',
];

class PromotionSelectModal extends Component {

    state = {
        searchInput: '',
        currentCategory: null,
        selected: this.props.selectedPromotions || []
    }

    handleSearchInputChange = (searchInput) => {
        this.setState({
            searchInput,
            currentCategory: null,
        })
    }

    debouncedHandleSearchInputChange = debounce(this.handleSearchInputChange, 400)

    handleTreeNodeChange = (v) => {
        if (v[0]) {
            this.setState({
                searchInput: '',
                currentCategory: v[0],
            })
        }
    }

    getAllOptions = () => {
        const {
            allPromotionList,
            allGiftList,
        } = this.props;
        const allGiftsArray = allGiftList.toJS();
        const allPromotionArray = allPromotionList.toJS().map(item => item.promotionName.map(promotion => ({
            value: promotion.promotionIDStr,
            label: `${BASIC_PROMOTION_MAP[promotion.promotionType]} - ${promotion.promotionName}`,
            type: `${promotion.promotionType}`,
            activityType: '10',
            activitySource: '1'
        }))).reduce((acc, curr) => {
            acc.push(...curr);
            return acc;
        }, []).filter(item => AVAILABLE_PROMOTIONS.includes(item.type));
        return [
            ...allPromotionArray,
            ...allGiftsArray.filter(item => AVAILABLE_GIFTS.includes(String(item.giftType))).map(item => ({
                value: item.giftItemID,
                label: `${GIFT_MAP[item.giftType]} - ${item.giftName}`,
                type: `${item.giftType}`,
                activityType: '30',
                activitySource: '2'
            })),
            {
                value: '-10',
                label: '会员价',
                activityType: '20',
                type: '-10',
                activitySource: '3'
            },
            {
                value: '-20',
                label: '会员折扣',
                activityType: '20',
                type: '-20',
                activitySource: '3'
            },
        ];
    }

    handleGroupSelect = (selectedOptions) => {
        const { selected, searchInput, currentCategory } = this.state;
        const allOptions = this.getAllOptions();
        const filteredValue = searchInput ? allOptions.filter(item => item.label.includes(searchInput)).map(item => item.value)
            : allOptions.filter(item => item.type === currentCategory).map(item => item.value);
        const unfilteredValue = selected.filter(v => !filteredValue.includes(v));
        this.setState({
            selected: [...unfilteredValue, ...selectedOptions.map(item => item.value ? item.value : item)]
        })
    }

    handleSingleRemove = ({ value }) => {
        const { selected } = this.state;
        const index = selected.findIndex(v => v == value)
        if (index > -1) {
            const newSelectedValue = selected.slice();
            newSelectedValue.splice(index, 1);
            this.setState({
                selected: newSelectedValue
            })
        }
    }

    handleOk = () => {
        const { selected } = this.state;
        const allOptions = this.getAllOptions();
        return this.props.handleOk({
            shareGroupDetailList: allOptions.filter(item => selected.includes(item.value))
        })
    }

    debouncedHandleOk = debounce(this.handleOk, 400)

    render() {
        const allOptions = this.getAllOptions()
        const { searchInput, currentCategory, selected } = this.state;
        const filteredOptions = searchInput ? allOptions.filter(item => item.label.includes(searchInput)) : allOptions.filter(item => item.type === currentCategory);
        const selectedOptions = allOptions.filter(item => selected.includes(item.value));
        return (
            <Modal
                maskClosable={false}
                title={`${this.props.isCreate ? '创建' : '编辑'}营销活动规则`}
                visible={true}
                footer={[
                    <Button key="0" type="ghost" size="large" onClick={this.props.handleCancel}>取消</Button>,
                    selected.length >= 2 ?
                    <Button key="1" type="primary" size="large" onClick={this.debouncedHandleOk} loading={this.props.loading}>保存</Button>
                        :
                    <Tooltip title="至少要选择2项进行共享">
                        <Button key="1" disabled type="primary" size="large">保存</Button>
                    </Tooltip>
                    ,
                ]}
                onCancel={this.props.handleCancel}
                width="922px"
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                }}
                >
                    <HualalaTreeSelect level1Title={'全部营销活动'}>
                        {/* //搜索框 */}
                        <HualalaSearchInput onChange={this.debouncedHandleSearchInputChange} />
                        {/* //左侧树 */}
                        <Tree
                            onSelect={this.handleTreeNodeChange}
                            title={'content'}
                            selectedKeys={[currentCategory]}
                        >
                            <TreeNode key={'salePromotion'} title={'基础营销'}>
                                {
                                    AVAILABLE_PROMOTIONS.map(item => (
                                        <TreeNode key={item} value={item} title={BASIC_PROMOTION_MAP[item]} />
                                    ))
                                }
                            </TreeNode>
                            <TreeNode key={'hualala'} title={'哗啦啦券'}>
                                <TreeNode key={'10'} title={'代金券'} />
                                <TreeNode key={'20'} title={'菜品优惠券'} />
                                <TreeNode key={'21'} title={'菜品兑换券'} />
                                <TreeNode key={'111'} title={'折扣券'} />
                                <TreeNode key={'110'} title={'买赠券'} />
                            </TreeNode>
                            <TreeNode key={'userRight'} title={'会员权益'}>
                                <TreeNode key={'-10'} title={'会员价'} />
                                <TreeNode key={'-20'} title={'会员折扣'} />
                            </TreeNode>
                        </Tree>
                        {/* //右侧复选框 */}
                        <HualalaGroupSelect
                            options={filteredOptions}
                            labelKey={'label'}
                            valueKey={'value'}
                            value={filteredOptions.filter(item => selected.includes(item.value)).map(item => item.value)}
                            onChange={this.handleGroupSelect}
                        />
                        {/* //下方已选的tag */}
                        <HualalaSelected
                            itemName={'label'}
                            itemID={'value'}
                            selectdTitle={'已选营销活动'}
                            value={selectedOptions}
                            onChange={this.handleSingleRemove}
                            onClear={() => this.setState({selected: []})}
                        />
                    </HualalaTreeSelect>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PromotionSelectModal)

import React, { Component } from 'react';
import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../components/common';
import { connect } from 'react-redux';
import {
    Modal,
    Tree,
    Button,
    Tooltip,
    Input,
    message
} from 'antd';
import { debounce } from 'lodash';
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';

const TreeNode = Tree.TreeNode;

const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);

const AVAILABLE_GIFTS = [
    '10', '20', '21', '110', '111', '22',
];
const EXPANDTO500 = ['292428', '253686']
@injectIntl()
class PromotionSelectModal extends Component {
    state = {
        searchInput: '',
        currentCategory: null,
        selected: this.props.isBatch ? this.props.selected : this.props.selectedPromotions || [],
        shareGroupName: this.props.shareGroupName,
        limitNum: EXPANDTO500.includes(this.props.user.getIn(['accountInfo', 'groupID'])) ? 500 : 100,        //共享限制数量
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
        console.log('groupid', this.props.user.getIn(['accountInfo', 'groupID']))
        const {
            intl,
            isBatch
        } = this.props;
        const k5m4q0r2 = intl.formatMessage(SALE_STRING.k5m4q0r2);
        const k5m4q0ze = intl.formatMessage(SALE_STRING.k5m4q0ze);
        const {
            allPromotionList,
            allGiftList,
            gList,
            pList,
        } = this.props;
        let allGiftsArray = []
        let allPromotionArray = []
        console.log('allPromotionList: ', allPromotionList.toJS());
        if (!isBatch) {
            allGiftsArray = allGiftList ? allGiftList.toJS() : [];
            allPromotionArray = allPromotionList.toJS().map(item => item.promotionName.map(promotion => ({
                value: promotion.promotionIDStr,
                label: `${BASIC_PROMOTION_MAP[promotion.promotionType]} - ${promotion.promotionCode} - ${promotion.promotionName}`,
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
        } else {
            allGiftsArray = gList.map((item) => {
                return {
                    ...item,
                    giftItemID: `${item.giftItemID}`
                }
            })
            allPromotionArray = pList.map((promotion, index) => {
                return {
                    value: `${promotion.promotionID}`,
                    label: `${BASIC_PROMOTION_MAP[promotion.promotionType]} - ${promotion.promotionCode} - ${promotion.promotionName}`,
                    type: `${promotion.promotionType}`,
                    activityType: '10',
                    activitySource: '1'
                }
            }).filter(item => AVAILABLE_PROMOTIONS.includes(item.type));
            return [
                ...allPromotionArray,
                ...allGiftsArray.filter(item => AVAILABLE_GIFTS.includes(String(item.giftType))).map(item => ({
                    value: item.giftItemID,
                    label: `${GIFT_MAP[item.giftType]} - ${item.giftName}`,
                    type: `${item.giftType}`,
                    activityType: '30',
                    activitySource: '2'
                })),
            ];
        }

    }

    handleGroupSelect = (selectedOptions) => {
        const { selected, searchInput, currentCategory } = this.state;
        const allOptions = this.getAllOptions();
        const filteredValue = searchInput ? allOptions.filter(item => item.label.includes(searchInput)).map(item => item.value)
            : allOptions.filter(item => item.type === currentCategory).map(item => item.value);
        const unfilteredValue = selected.filter(v => !filteredValue.includes(v));
        // 最大选择数量限制  30
        if (selectedOptions.length >= this.state.limitNum + 1) {
            message.warning(`共享组选项不能超过${this.state.limitNum}个`)
            this.handleSingleRemove({})
            return
        }
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
        const { selected, shareGroupName } = this.state;
        const {
            isBatch,
            pList,
            gList
        } = this.props
        if (!isBatch) {
            if (!shareGroupName) {
                message.warn('共享组名称不能为空')
                return false
            }
            const allOptions = this.getAllOptions();
            return this.props.handleOk({
                shareGroupDetailList: allOptions.filter(item => selected.includes(item.value)),
                shareGroupName
            })
        } else {
            let addItems = pList.map((promotion, index) => {
                return {
                    type: `${promotion.promotionType}`,
                    activityType: '10',
                    activitySource: '1',
                    activityID: `${promotion.promotionID}`,
                    label: `${BASIC_PROMOTION_MAP[promotion.promotionType]} - ${promotion.promotionCode} - ${promotion.promotionName}`,
                    activitySourceType: `${promotion.promotionType}`,
                }
            }).filter(item => selected.includes(item.activityID));
            let result = addItems.concat(
                gList.map((promotion, index) => {
                    return {
                        activityID: `${promotion.giftItemID}`,
                        label: `${promotion.giftName}`,
                        activityType: '30',
                        activitySource: '2',
                        activitySourceType: `${promotion.giftType}`,
                    }
                }).filter(item => selected.includes(item.activityID))
            )
            this.props.handleAddAct(result)
            this.props.handleCancel()
        }
    }

    debouncedHandleOk = debounce(this.handleOk, 400)

    handleShareGroupName = (e) => {
        this.setState({
            shareGroupName: e.target.value
        })
    }

    render() {
        const allOptions = this.getAllOptions()
        const {
            searchInput,
            currentCategory,
            selected,
            shareGroupName,
        } = this.state;
        const filteredOptions = searchInput ? allOptions.filter(item => item.label.includes(searchInput)) : allOptions.filter(item => item.type === currentCategory);
        const {
            intl,
            isCreate,
            isBatch
        } = this.props;
        let selectedOptions = []
        selectedOptions = allOptions.filter(item => selected.includes(item.value));
        const k5m4q17q = intl.formatMessage(SALE_STRING.k5m4q17q);
        const k5m5av7b = intl.formatMessage(SALE_STRING.k5m5av7b);
        const k5m5avfn = intl.formatMessage(SALE_STRING.k5m5avfn);
        const k5m5avnz = intl.formatMessage(SALE_STRING.k5m5avnz);
        const k5m5avwb = intl.formatMessage(SALE_STRING.k5m5avwb);
        const k636qvha = intl.formatMessage(SALE_STRING.k636qvha);
        const k636qvpm = intl.formatMessage(SALE_STRING.k636qvpm);
        const k5m5aw4n = intl.formatMessage(SALE_STRING.k5m5aw4n);
        const k5m4q0r2 = intl.formatMessage(SALE_STRING.k5m4q0r2);
        const k5m4q0ze = intl.formatMessage(SALE_STRING.k5m4q0ze);
        const bianji = <p>{COMMON_LABEL.edit} {SALE_LABEL.k636f2q3}</p>;
        return (
            <Modal
                maskClosable={false}
                title={isBatch ? '添加活动' : isCreate ? COMMON_LABEL.create : bianji}
                visible={true}
                footer={[
                    <Button key="0" type="ghost" size="large" onClick={this.props.handleCancel}>
                        {COMMON_LABEL.cancel}
                    </Button>,
                    <Button disabled={isBatch ? false : selected.length < 2} key="1" type="primary" size="large" onClick={this.debouncedHandleOk} loading={this.props.loading}>
                        {COMMON_LABEL.save}
                    </Button>,
                ]}
                onCancel={this.props.handleCancel}
                width="922px"
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                }}
                >
                    {
                        !isBatch &&
                        <div style={{ marginBottom: '20px' }}>
                            <span>共享组名称</span>
                            <Input value={shareGroupName} onChange={this.handleShareGroupName} style={{ width: '300px', marginLeft: '16px' }} maxLength={20} />
                        </div>
                    }
                    <HualalaTreeSelect level1Title={SALE_LABEL.k5m5auyz}>
                        {/* //搜索框 */}
                        <HualalaSearchInput onChange={this.debouncedHandleSearchInputChange} />
                        {/* //左侧树 */}
                        {
                            isBatch ? <Tree
                                onSelect={this.handleTreeNodeChange}
                                title={'content'}
                                selectedKeys={[currentCategory]}
                            >
                                <TreeNode key={'salePromotion'} title={k5m4q17q}>
                                    {
                                        AVAILABLE_PROMOTIONS.map(item => (
                                            <TreeNode key={item} value={item} title={BASIC_PROMOTION_MAP[item]} />
                                        ))
                                    }
                                </TreeNode>
                                <TreeNode key={'hualala'} title={k5m5av7b}>
                                    <TreeNode key={'10'} title={k5m5avfn} />
                                    <TreeNode key={'20'} title={k5m5avnz} />
                                    <TreeNode key={'21'} title={k5m5avwb} />
                                    <TreeNode key={'111'} title={k636qvha} />
                                    <TreeNode key={'110'} title={k636qvpm} />
                                    <TreeNode key={'22'} title={'配送券'} />
                                </TreeNode>

                            </Tree> :
                                <Tree
                                    onSelect={this.handleTreeNodeChange}
                                    title={'content'}
                                    selectedKeys={[currentCategory]}
                                >
                                    <TreeNode key={'salePromotion'} title={k5m4q17q}>
                                        {
                                            AVAILABLE_PROMOTIONS.map(item => (
                                                <TreeNode key={item} value={item} title={BASIC_PROMOTION_MAP[item]} />
                                            ))
                                        }
                                    </TreeNode>
                                    <TreeNode key={'hualala'} title={k5m5av7b}>
                                        <TreeNode key={'10'} title={k5m5avfn} />
                                        <TreeNode key={'20'} title={k5m5avnz} />
                                        <TreeNode key={'21'} title={k5m5avwb} />
                                        <TreeNode key={'111'} title={k636qvha} />
                                        <TreeNode key={'110'} title={k636qvpm} />
                                        <TreeNode key={'22'} title={'配送券'} />
                                    </TreeNode>
                                    <TreeNode key={'userRight'} title={k5m5aw4n}>
                                        <TreeNode key={'-10'} title={k5m4q0r2} />
                                        <TreeNode key={'-20'} title={k5m4q0ze} />
                                    </TreeNode>
                                </Tree>
                        }

                        {/* //右侧复选框  isLimit 数量限制 */}
                        <HualalaGroupSelect
                            options={filteredOptions || []}
                            labelKey={'label'}
                            valueKey={'value'}
                            value={
                                filteredOptions.filter(item => selected.includes(item.value)).map(item => item.value)
                            }
                            onChange={this.handleGroupSelect}
                            isLimit={Array.from(selectedOptions).length >= this.state.limitNum || false}
                            limitNum={this.state.limitNum}
                            selectedNum={Array.from(selectedOptions).length}
                        />
                        {/* //下方已选的tag */}
                        <HualalaSelected
                            itemName={'label'}
                            itemID={'value'}
                            selectdTitle={SALE_LABEL.k5m5awd0}
                            value={selectedOptions || []}
                            onChange={this.handleSingleRemove}
                            onClear={() => this.setState({ selected: [] })}
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
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionSelectModal)

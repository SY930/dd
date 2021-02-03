import React, { Component } from 'react';
import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../components/common';
import { connect } from 'react-redux';
import {
    Modal,
    Tree,
    Button,
    Tooltip,
    Input,
    message,
    Icon,
    Radio,
} from 'antd';
import { debounce } from 'lodash';
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';
import { isEqual } from 'lodash';
import style from './style.less'
import { axiosData } from '../../helpers/util';
import PromotionSelectModal from "./PromotionSelectModal";
import axios from 'axios';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
@injectIntl()
class BatchGroupEditModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchInput: '',
            currentCategory: null,
            shareGroupArr: [],
            limitNum: 100,        //共享限制数量
            actType: 'batchAdd',
            addAct: [], //统一添加的活动id
            deleteAct: [], //统一删除的活动id
            ifOperat: false,
            pList: [],
            gList: [],
        }
    }

    componentDidMount() {
        let shareGroupArr = this.batchListInfo(this.props.filteredShareGroups, this.props.batchList)
        this.setState({
            shareGroupArr,
        })
    }

    componentWillReceiveProps(nextProps) {
        let shareGroupArr = this.batchListInfo(nextProps.filteredShareGroups, nextProps.batchList)
        this.setState({
            shareGroupArr,
        })
    }


    //在这里整合完整信息
    batchListInfo = (filteredShareGroups = [], batchList = []) => {
        let tempArr = []
        batchList.forEach((item, index) => {
            tempArr.push(...filteredShareGroups.filter((every) => {
                return every.itemID == item
            }))
        })
        this.searchAllShareActivity()
        return tempArr
    }

    //在确保只在batchList改变的时候调用这个请求
    //可以在点确定之后在筛选出添加的活动和删除的活动
    searchAllShareActivity = () => {
        const {
            batchList = [],
        } = this.props
        let opts = {
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
            shareGroupIDList: batchList
        }
        axiosData('/promotion/promotionShareGroupService_queryShareGroupEventList.ajax', opts, {}, { path: '' }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
            .then((res) => {
                let { giftDetails, promotionLst } = res
                this.setState({
                    pList: promotionLst,
                    gList: giftDetails
                })
            })
            .catch(err => {
                message.error(err)
            });
    }

    handleSave = () => {
        const {
            addAct
        } = this.state
        if (!addAct.length) {
            message.warning('请选择添加的活动')
            return
        }
        const {
            batchList
        } = this.props
        let opts = {
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
            shareGroupIds: batchList,
            modifyDetailList: addAct,
        }
        axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_PROMOTION_NEW', // ? domain :'HTTP_SERVICE_URL_CRM', //'HTTP_SERVICE_URL_PROMOTION_NEW'
            method: '/promotion/promotionShareGroupService_batchUpdateShareGroups.ajax',
            type: 'post',
            data: opts,
        }).then((res) => {
                if (res.code === '000') {
                    message.success('批量添加成功')
                    this.props.handleCancelBatch()
                    this.props.refresh()
                    this.props.handleClearChooseShareItems()
                    return
                }
                if (res.code === '1211200011') {
                    let arr = res.ultraLimitNames.map((item) => {
                        return `【${item}】`
                    })
                    Modal.warning({
                        title: '共享组设置项超限',
                        content: <div className={style.infoDiv}>
                            {res.message}
                            <div className={style.infoDivNames}>{arr.join('、')}</div>
                        </div>
                    })
                    return
                }
                message.error(res.message)
            })
            .catch(err => {
                    message.error(err)
            });
    }
 
    handleChangeActType = (e) => {
        this.setState({
            actType: e.target.value
        })
    }

    handleDeleteActivity = (id) => {
        let {
            addAct,
        } = this.state
        addAct = addAct.filter((item, index) => {
            if (item.activityID != id) {
                return true
            }
            return false
        })
        this.setState({
            addAct
        })
    }

    handleOpenModal = () => {
        this.setState({
            ifOperat: true
        })
    }

    handleCancel = () => {
        this.setState({
            ifOperat: false
        })
    }

    handleAddAct = (arr) => {
        this.setState({
            addAct: arr
        })
    }

    handleDeleteShareGroup = (item) => {
        this.setState({
            addAct: []
        })
        this.props.handleDeleteShareItem(item.itemID)
    }

    render() {
        const {
            shareGroupArr,
            actType,
            pList,
            gList,
            ifOperat,
            addAct,
        } = this.state
        return (
            <Modal
                maskClosable={false}
                title={'批量添加共享组内活动'}
                visible={true}
                footer={[
                    <Button key="0" type="ghost" size="large" onClick={this.props.handleCancelBatch}>
                        取消
                    </Button>,
                    <Button key="1" type="primary" size="large" onClick={this.handleSave} loading={this.props.loading}>
                        保存
                    </Button>,
                ]}
                onCancel={this.props.handleCancelBatch}
                width="700px"
            >
                {
                    ifOperat && <PromotionSelectModal
                        isCreate={false}
                        isBatch={true}
                        handleCancel={this.handleCancel}
                        handleAddAct={this.handleAddAct}
                        selected={addAct.map((item) => {
                            return item.activityID
                        })}
                        shareGroupName={''}
                        pList={pList}
                        gList={gList}
                    />
                }
                <div>
                    <div className={style.shareTitle}>已选共享组</div>
                    <div className={style.toBeChoosedBlock}>
                        {
                            shareGroupArr.map((item, index) => {
                                return (
                                    <span className={style.chooseItemSpan} key={`shareItem${index}`}>
                                        {item.shareGroupName}
                                        <Icon className={style.closeIcon} type="close" onClick={this.handleDeleteShareGroup.bind(this, item)} />
                                    </span>
                                )
                            })
                        }
                    </div>
                    <div className={style.activityBlock}>
                        {/* <RadioGroup
                            style={{
                                marginBottom: 16,
                            }}
                            onChange={this.handleChangeActType}
                            defaultValue="batchAdd"
                            size="large"
                            value={actType}
                        >
                            <RadioButton value="batchAdd">批量添加活动</RadioButton>
                            <RadioButton value="batchDelete">批量删除活动</RadioButton>
                        </RadioGroup> */}
                        <div className={style.shareTitle}>批量添加活动</div>
                        <div className={style.toBeChoosedBlock}>
                            {
                                addAct.map((item, index) => {
                                    return (
                                        <span className={style.chooseItemSpan} key={`activityItem${index}`}>
                                            {item.label}
                                            <Icon className={style.closeIcon} type="close" onClick={this.handleDeleteActivity.bind(this, item.activityID)} />
                                        </span>
                                    )
                                })
                            }
                        </div>
                        {
                            actType === 'batchAdd' && <span className={style.addActSpan} onClick={this.handleOpenModal}>+添加(至多添加100个)</span>
                        }
                    </div>
                </div>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        allPromotionList: state.sale_promotionDetailInfo_NEW.getIn(['$allPromotionListInfo', 'data', 'promotionTree']),
        allGiftList: state.sale_giftInfoNew.get('allGiftList'), // 所有哗啦啦券列表--共享用
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchGroupEditModal)

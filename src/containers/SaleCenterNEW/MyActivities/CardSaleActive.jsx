import React, { Component } from 'react';
import { Row, Col, Switch, Tooltip, message, Pagination } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import Authority from '../../../components/common/Authority';
import { ONLINE_PROMOTION_TYPES } from '../../../constants/promotionType';
import {
    ONLINE_PROMOTION_MANAGEMENT_GROUP,
} from '../../../constants/entryCodes';
import {
    BASIC_LOOK_PROMOTION_QUERY,
    BASIC_PROMOTION_UPDATE,
    BASIC_PROMOTION_DELETE,
} from '../../../constants/authorityCodes';
import { BASIC_PROMOTION_MANAGE_PAGE } from '../../../constants/entryIds';
import {
    ACTIVITY_CATEGORIES,
} from '../../../redux/actions/saleCenterNEW/types';
import { isBrandOfHuaTianGroupList, isGroupOfHuaTianGroupList, isMine, isHuaTian } from '../../../constants/projectHuatianConf';

import styles from '../../SpecialPromotionNEW/MySpecialActivities/mySpecialActivities.less'
import emptyPage from '../../../assets/empty_page.png'
import shopsImg from '../../../assets/shops.png'
import axios from 'axios';
import { isZhouheiya, isGeneral } from "../../../constants/WhiteList";


class CardSaleActive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
        }
    }


    getCreateBy = (record) => {
        if (record.maintenanceLevel == '0') {
            return '集团创建'
        }
        // const { shops } = this.props;
        // const res = shops.find(item => item.get('shopID') == shopID);
        // if (res) {
        //     return res.get('shopName');
        // }
        // return <p>{`由店铺${shopID}创建`}</p>;
    }

    getAllPromotionTypes = () => {
        const all = {
            key: 'ALL',
            title: '全部',
        }
        if (this.isOnlinePromotionPage()) { // 基础营销集团视角
            return [
                all,
                ...ONLINE_PROMOTION_TYPES,
            ]
        }
        return [
            all,
            ...ACTIVITY_CATEGORIES.slice(0, ACTIVITY_CATEGORIES.length - 1),
        ]
    }


    getEventWay = (promotionType) => {
        const promotion = this.getAllPromotionTypes().filter((item) => {
            return item.key === promotionType;
        });
        return promotion.length ? promotion[0].title : '--';
    }
    getTime = (validDate) => {
        if (validDate.start === '0' || validDate.end === '0' ||
            validDate.start === '20000101' || validDate.end === '29991231') {
            return '不限制';
        }
        return `${moment(validDate.start, 'YYYY-MM-DD').format('YYYY-MM-DD')} - ${moment(validDate.end, 'YYYY-MM-DD').format('YYYY-MM-DD')}`;
    }

    getOperator = (record) => {
        if (!record.createBy) {
            return '--';
        }
        let result;
        try {
            // const operator = JSON.parse(record.operator);
            result = `${record.createBy} / ${record.modifiedBy || record.modifiedBy}`;
        } catch (e) {
            return '--';
        }
        return result || '--';
    }

    getOperateTime = (record) => {
        if (record.actionTime === '' && record.createTime === '') {
            return '--';
        }
        const t = `${moment(new Date(parseInt(record.createTime))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionTime))).format('YYYY-MM-DD HH:mm:ss')}`
        return <Tooltip title={t}><em>{t}</em></Tooltip>;
    }

    isOnlinePromotionPage = () => {
        return this.props.entryCode === ONLINE_PROMOTION_MANAGEMENT_GROUP;
    }


    handleShowDetailModal = (e, record, index) => {
        if (Number(record.eventWay) === 70) {
            message.warning('该活动已下线');
            return;
        }
        if (record.eventWay === 78 || record.eventWay === 79 || record.eventWay === 83 || record.eventWay === 85) {
            this.props.onV3Click(record.itemID, true, record.eventWay);
            return;
        }
        if (record.eventWay === 80 || record.eventWay === 66 || record.eventWay === 81 || record.eventWay === 82) {
            this.props.handleShowDetail({
                record,
                isView: true,
                isEdit: false,
            })
            return;
        }
        this.props.toggleIsUpdate(false)
        this.props.handleUpdateOpe(null, record, index);
    }

    isToggleActiveDisabled = (record) => {
        const isGroupPro = record.maintenanceLevel == '0';
        if (!isGroupOfHuaTianGroupList()) { // 门店创建
            return false
        }
        if (isHuaTian()) {
            return record.userType == 2 || record.userType == 0;
        }
        if (isBrandOfHuaTianGroupList()) {
            return record.userType == 1 || record.userType == 3 || !isGroupPro;
        }
    }

    // 权限校验
    permissionVerify = async (record) => {
        const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'promotion/v2/', '/api/v1/universal?'];
        const datas = {
            groupID: this.props.accountInfo.groupID,
            accountID: this.props.accountInfo.accountID,
            promotionID: record.promotionIDStr
        };
        const method = `${api}checkDataAuth.ajax`;
        const params = { service, type, data: datas, method };
        try {
            const { data = {}, code, message: msg } = await axios.post(url + method, params);
            if(code == '000') {
                if(data.hasOperateAuth == 1) {
                    return true
                } else {
                    message.warning('没有操作权限');
                    return false
                }
            } else {
                message.warning('没有操作权限');
                return false
            }
        } catch (error) {
            message.warning('没有操作权限');
            return false
        }
    }

    //【活动过期后】或【审批中】编辑按钮禁用
    editIsDisabled = (record) => {
        return (new Date(moment(record.endDate, 'YYYY-MM-DD').format('YYYY-MM-DD')).getTime() < new Date(new Date(Date.now()).toLocaleDateString()).getTime()) || record.auditStatus == '1';
    }

    render() {
        const { dataSource: data } = this.props;
        return (
            <div>
                <div style={{ height: 'calc(100vh - 380px)', overflowY: 'auto' }}>
                    <div className={styles.cardContainer}>
                        {data && data.length > 0 ?
                            data.map((item, index) => {
                                const defaultChecked = (item.isActive == '1' ? true : false);
                                const isGroupPro = item.maintenanceLevel == '0';// 区分集团和店铺
                                return (
                                    <Col key={index} className={styles.columnsWrapper}>
                                        <p className={styles.activityTitle}>
                                            <span className={styles.titleText}><Tooltip title={item.promotionName}>{item.promotionName}</Tooltip></span>
                                            <span className={`${styles.status} ${styles.teamShare}`}>
                                                <Switch
                                                    size="small"
                                                    // className={styles.switcherSaleCard}
                                                    className={`${styles.switcherSaleCard} ${this.isToggleActiveDisabled(item) ? styles.switcherdisabled : ''}`}
                                                    checked={defaultChecked}
                                                    onChange={(e) => {
                                                        if (this.isToggleActiveDisabled(item)) return null
                                                        if(isZhouheiya(this.props.accountInfo.groupID)){
                                                            this.props.handleSattusActive(item)((isAudit) => {
                                                                this.props.handleDisableClickEvent(_, item, index, null, isAudit === 'audit' ? '已成功发起审批，审批通过后自动启用' : '使用状态修改成功')
                                                            })
                                                        }else{
                                                            this.props.handleSattusActive(item)(() => {
                                                                this.props.handleDisableClickEvent(_, item, index, null, '使用状态修改成功')
                                                            })
                                                        }
                                                    }}
                                                    // disabled={this.isToggleActiveDisabled(item)}
                                                />
                                            </span>
                                        </p>
                                        <div className={styles.centerBox}>
                                            <p><span>活动类型：</span> <em>{this.getEventWay(item.promotionType)}</em></p>
                                            <p><span>活动时间：</span> <em>{this.getTime(item.validDate)}</em>
                                                {
                                                    item.status == '1' ? <span className={styles.unBegin}>暂停中</span> : item.status == '2' ? <span className={styles.begin}>执行中</span> : <span className={styles.end}>已结束</span>
                                                }
                                            </p>
                                        </div>
                                        <div className={styles.activityBothCont}>
                                            <div className={styles.contBothBox}>
                                                <div className={styles.contList}>
                                                    <p><span>创建人/修改人：</span> <em>{this.getOperator(item)}</em></p>
                                                    <p><em>创建时间/修改时间：</em> {this.getOperateTime(item)}</p>
                                                </div>
                                            </div>

                                        </div>
                                        {
                                            item.maintenanceLevel == '0' &&
                                            <div className={styles.activityOrigin}>
                                                <img className={styles.tagImg} src={shopsImg} />
                                                <span>集团创建</span>
                                            </div>
                                        }
                                        <div className={styles.activityOperate}>
                                            <Authority rightCode={BASIC_LOOK_PROMOTION_QUERY} entryId={BASIC_PROMOTION_MANAGE_PAGE}>
                                                <span
                                                    className={styles.operateDetail}
                                                    onClick={() => {
                                                        this.props.toggleIsUpdate(false)
                                                        this.props.handleUpdateOpe(_, item, index);
                                                    }}
                                                >
                                                    查看
                                                </span>
                                            </Authority>
                                            {
                                                !isHuaTian() && (
                                                    <Authority rightCode={BASIC_PROMOTION_UPDATE} entryId={BASIC_PROMOTION_MANAGE_PAGE}>
                                                        <span
                                                            disabled={isZhouheiya(this.props.accountInfo.groupID)?this.editIsDisabled(item):false}
                                                            className={styles.operateEdit}
                                                            onClick={async (e) => {
                                                                if(isZhouheiya(this.props.accountInfo.groupID)){
                                                                    if(this.editIsDisabled(item)) {
                                                                        return;
                                                                    }
                                                                    const isPass = await this.permissionVerify(item);
                                                                    if(!isPass) {
                                                                        return;
                                                                    }
                                                                }
                                                                
                                                                this.props.handleEditActive(item)(() => {
                                                                    this.props.toggleIsUpdate(true)
                                                                    this.props.handleUpdateOpe(_, item, index);
                                                                })
                                                            }}
                                                        >
                                                            编辑
                                                        </span>
                                                    </Authority>
                                                )
                                            }
                                            <Authority rightCode={BASIC_PROMOTION_DELETE} entryId={BASIC_PROMOTION_MANAGE_PAGE}>
                                                <span
                                                    className={styles.operateDelete}
                                                    disabled={!isMine(item)}
                                                    onClick={async () => {
                                                        if (!isMine(item)) {
                                                            return
                                                        }
                                                        if(isZhouheiya(this.props.accountInfo.groupID)){
                                                        const isPass = await this.permissionVerify(item);
                                                            if(!isPass) {
                                                                return;
                                                            }
                                                        }
                                                        this.props.handleDelActive(item)(() => this.props.confirmDelete(item));
                                                    }}
                                                >
                                                    删除
                                                </span>
                                            </Authority>
                                            {
                                                item.promotionType === '1050' ?
                                                    <a
                                                        href="#"
                                                        disabled={isHuaTian()}
                                                        onClick={async () => {
                                                            if(isZhouheiya(this.props.accountInfo.groupID)){
                                                                const isPass = await this.permissionVerify(item);
                                                                if(!isPass) {
                                                                    return;
                                                                }
                                                            }
                                                            this.props.toggleIsUpdate(true)
                                                            this.props.updateCopy()
                                                            this.props.handleUpdateOpe(_, item, index);
                                                        }}
                                                    >复制</a>
                                                    :
                                                    <a
                                                        href="#"
                                                        disabled={!isGroupPro || isHuaTian()}
                                                        style={!isGroupPro || isHuaTian() ? { color: 'gray', opacity: '.5' } : {}}
                                                        onClick={async () => {
                                                            if(isZhouheiya(this.props.accountInfo.groupID)){
                                                                const isPass = await this.permissionVerify(item);
                                                                if(!isPass) {
                                                                    return;
                                                                }
                                                            }
                                                            this.props.toggleIsUpdate(true)
                                                            this.props.updateCopy()
                                                            this.props.handleUpdateOpe(_, item, index);
                                                        }}
                                                    >复制</a>
                                            }
                                        </div>
                                    </Col>

                                )
                            }
                            )
                            :
                            <div className={styles.emptyData}>
                                <img src={emptyPage} alt="" style={{ width: '50px' }} />
                                <p className={styles.emptyDataText} style={{ marginTop: '12px' }}>暂无数据</p>
                            </div>
                        }
                    </div>
                </div>
                <div className={styles.cardSaleActive}>
                    {
                        data.length > 0 && (
                            <div className={styles.paginationBox}>
                                <Pagination
                                    current={this.props.pageNo}
                                    pageSize={this.props.pageSizes}
                                    pageSizeOptions={['25', '50', '100', '200']}
                                    total={this.props.total || 0}
                                    showSizeChanger={true}
                                    onShowSizeChange={(page, pageSizes) => {
                                        this.props.onShowSizeChange(page, pageSizes)
                                    }}
                                    showQuickJumper={true}
                                    onChange={(page, pageSizes) => {
                                        this.props.onChangePage(page, pageSizes)
                                    }}
                                />
                            </div>
                        )
                    }

                </div>
            </div>
        )
    }
}

export default CardSaleActive

import React, { Component } from 'react';
import { Row, Col, Switch, Tooltip, message, Pagination } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import Authority from '../../../components/common/Authority';
import { isBrandOfHuaTianGroupList, isGroupOfHuaTianGroupList, isMine } from '../../../constants/projectHuatianConf';
import { isZhouheiya, isGeneral } from "../../../constants/WhiteList";
import {
    SPECIAL_LOOK_PROMOTION_QUERY,
    SPECIAL_PROMOTION_UPDATE,
    SPECIAL_PROMOTION_DELETE,
} from '../../../constants/authorityCodes';
import { SPECIAL_PROMOTION_MANAGE_PAGE } from '../../../constants/entryIds';
import styles from './mySpecialActivities.less'
import stylesPage from '../../SaleCenterNEW/ActivityPage.less';
import emptyPage from '../../../assets/empty_page.png'
import { axios } from '@hualala/platform-base'

function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label');
}
const DECORATABLE_PROMOTIONS = [
    '20',
    '21',
    '23',
    '64',
    '65',
    '66',
    '75',
    '76',
    '68',
    '79',
    '85',
    '83',
    '69'
]
const copyUrlList = [
    '21', // 免费领取
    '20', // 摇奖活动
    '30', // 积分兑换
    '22', // 报名活动
    '65', // 分享裂变
    '68', // 推荐有礼
    '79', // 盲盒
    '66', // 膨胀大礼包
    '83',// 口令领券
    '69',// H5领券
]
const isDecorationAvailable = ({ eventWay }) => {
    return DECORATABLE_PROMOTIONS.includes(`${eventWay}`)
}

const isCanCopyUrl = ({ eventWay }) => {
    return copyUrlList.includes(`${eventWay}`)
}

class CardSaleActive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
        }
    }
    getCreateBy = (shopID) => {
        // const { shops } = this.props;
        // const res = shops.find(item => item.get('shopID') == shopID);
        // if (res) {
        //     return res.get('shopName');
        // }
        // return <p>{`由店铺${shopID}创建`}</p>;
    }

    getEventWay = (eventWay) => {
        return eventWay == 70 ? '彩蛋猫送礼' : mapValueToLabel(this.props.cfg.eventWay, String(eventWay))
    }
    getTime = (validDate) => {
        if (validDate.start === '0' || validDate.end === '0' ||
            validDate.start === '20000101' || validDate.end === '29991231') {
            return '不限制';
        }
        return `${moment(validDate.start, 'YYYY-MM-DD').format('YYYY-MM-DD')} - ${moment(validDate.end, 'YYYY-MM-DD').format('YYYY-MM-DD')}`;
    }

    getOperator = (record) => {
        if (!record.operator) {
            return '--';
        }
        let result;
        try {
            const operator = JSON.parse(record.operator);
            result = `${operator.userName} / ${operator.u_userName || operator.userName}`;
        } catch (e) {
            return '--';
        }
        return result || '--';
    }

    getOperateTime = (record) => {
        if (record.actionStamp === '' && record.createStamp === '') {
            return '--';
        }
        const t = `${moment(new Date(parseInt(record.createStamp))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionStamp))).format('YYYY-MM-DD HH:mm:ss')}`
        return <Tooltip title={t}><em>{t}</em></Tooltip>;
    }

    handleShowDetailModal = (e, record, index) => {
        if (Number(record.eventWay) === 70) {
            message.warning('该活动已下线');
            return;
        }
        if (record.eventWay === 78 || record.eventWay === 79 || record.eventWay === 83 || record.eventWay === 85 || record.eventWay === 23) {
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
        if (record.eventWay == 87) {
            return this.props.handleNewEditActive(record, 'view');
        }
        this.props.toggleIsUpdate(false)
        this.props.handleUpdateOpe(null, record, index);
    }

    handleEditActive = (e, record, index) => {
        if (Number(record.eventWay) === 70) {
            message.warning('该活动已下线');
            return;
        }
        if (record.eventWay === 78 || record.eventWay === 79 || record.eventWay === 83 || record.eventWay === 85 || record.eventWay === 23) {
            this.props.handleEditActive(record)(() => this.props.onV3Click(record.itemID, false, record.eventWay, record.isActive))
            return;
        }
        if (record.eventWay === 66 || record.eventWay === 81 || record.eventWay === 82) {
            this.props.handleEditActive(record)(() => {
                this.props.handleShowDetail({
                    record,
                    isView: false,
                    isEdit: true,
                })
            })
            return null
        }
        if (record.eventWay == 87) {
            return this.props.handleNewEditActive(record, 'edit');
        }
        this.permissionVerify(record.itemID, () => {
            this.props.handleEditActive(record)(() => {
                this.props.toggleIsUpdate(true)
                // 不是集团经理角色并且是周黑鸭账号（并且审批状态是审批通过跟无需审批的）只能修改店铺
                if(!isGeneral(this.props.user.accountInfo.roleType) && isZhouheiya(this.props.user.accountInfo.groupID) && (record.auditStatus == 2 || record.auditStatus == 4)) {
                    //目前只针对周黑鸭的三个营销活动做此逻辑（H5领券、积分换礼、消费送礼）
                    if([69, 89, 88].includes(record.eventWay)) {
                        this.props.onlyModifyShop()
                    }
                }
                this.props.handleUpdateOpe(_, record, index);
            })
        })
	}
    }

    renderWXTip = (text, record, index) => {
        return (
            <div className={[stylesPage.Sale__Activite__moveMore, stylesPage.moveMoreShow].join(' ')}>
                <a
                    href="#"
                    className={isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record) ? stylesPage.textDisabled : null}
                    onClick={() => {
                        if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record)) {
                            return;
                        }
                        if (Number(record.eventWay) === 70) {
                            message.warning('该活动已下线');
                            return;
                        }
                        this.props.checkDetailInfo(text, record, index);
                    }}
                    disabled={record.eventWay == 85}
                >
                    活动跟踪
                </a>
                <a
                    href="#"
                    className={record.isActive == '-1' || isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) ? styles.textDisabled : null}
                    onClick={() => {
                        if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)) {
                            return;
                        }
                        record.isActive == '-1' ? null :
                            this.props.handelStopEvent(_, record, index, '-1', '活动终止成功');
                    }}
                >
                    终止
                </a>

            </div>
        )
    }

    renderTipTitle = (text, record, index) => {
        if (record.eventWay == '80') {
            return this.renderWXTip(text, record, index)
        }
        return (
            <div className={[stylesPage.Sale__Activite__moveMore, stylesPage.moveMoreShow].join(' ')}>
                <a
                    href="#"
                    className={isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record) ? stylesPage.textDisabled : null}
                    onClick={() => {
                        if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record)) {
                            return;
                        }
                        if (Number(record.eventWay) === 70) {
                            message.warning('该活动已下线');
                            return;
                        }
                        this.props.checkDetailInfo(text, record, index);
                    }}
                    disabled={record.eventWay == 85}
                >
                    活动跟踪
                </a>
                {/* 第一版只做群发礼品的复制功能 */}
                {/* 摇奖活动增加复制,并且活动不是禁用状态  */}
                {
                    (record.eventWay === 53 || record.eventWay === 20  || record.eventWay === 69  || record.eventWay === 89 || record.eventWay === 88 || record.eventWay === 90)
                    &&
                    // <Authority rightCode={SPECIAL_PROMOTION_UPDATE}>
                    <a
                        href="#"
                        onClick={() => {
                            // if ((isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record))) {
                            //     e.preventDefault()
                            // } else {
                            if (Number(record.eventWay) === 70) {
                                message.warning('该活动已下线');
                                return;
                            }
                            if (record.eventWay === 78 || record.eventWay === 79 || record.eventWay === 83) {
                                this.props.onV3Click(record.itemID, false, record.eventWay);
                                return;
                            }
                            if (record.eventWay === 66 || record.eventWay === 81 || record.eventWay === 82) {
                                this.props.handleShowDetail({
                                    record,
                                    isView: false,
                                    isEdit: true,
                                })
                                return;
                            }
                            this.permissionVerify(record.itemID, () => {
                                this.props.toggleIsUpdate(true)
                                this.props.isCopy()
                                this.props.handleUpdateOpe(text, record, index);
                            })
                            // }
                            // }
                        }}
                    >
                        复制
                    </a>
                    // </Authority>
                }
                {
                    isDecorationAvailable(record) && (
                        <a
                            href="#"
                            onClick={() => {
                                this.props.handleDecorationStart(record)
                            }}
                        >
                            装修
                        </a>
                    )
                }

                {
                    isCanCopyUrl(record) && (
                        <a
                            href="#"
                            onClick={() => {
                                this.props.handleCopyUrl(record)
                            }}
                        >
                            下载链接/二维码
                        </a>
                    )
                }
            </div>
        )
    }

    // 权限校验
    permissionVerify = async (itemID, cb) => {
        if(isZhouheiya()) {
            const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'specialPromotion/', '/api/v1/universal?'];
            const datas = {
                groupID: this.props.user.accountInfo.groupID,
                accountID: this.props.user.accountInfo.accountID,
                itemID
            };
            const method = `${api}checkEventDataAuth.ajax`;
            const params = { service, type, data: datas, method };
            const { data = {}, code } = await axios.post(url + method, params);
            try {
                if(code == '000') {
                    if(data.hasOperateAuth == 1) {
                        cb()
                    } else {
                        message.warning('没有操作权限');
                    }
                }
            } catch (error) {
                message.warning('请求失败');
            }
        } else {
            cb()
        }
    }

    //【活动过期后】或【审批中】编辑按钮禁用
    editIsDisabled = (record) => {
        return isZhouheiya() && ((new Date(moment(record.eventEndDate, 'YYYY-MM-DD').format('YYYY-MM-DD')).getTime() < new Date(new Date(Date.now()).toLocaleDateString()).getTime()) || record.auditStatus == '1');
    }

    render() {
        const { dataSource: data } = this.props
        return (
            <div>
                <div style={{ height: 'calc(100vh - 380px)', overflowY: 'auto' }}>
                    <div className={styles.cardContainer}>
                        {data && data.length > 0 ?
                            data.map((item, index) => {
                                const defaultChecked = (item.isActive == '1' ? true : false);
                                const BenefitDisabled = item.createScenesName === '权益卡'
                                return (
                                    <Col key={index} className={styles.columnsWrapper}>
                                        <p className={styles.activityTitle}>
                                            <span className={styles.titleText}><Tooltip title={item.eventName}>{item.eventName}</Tooltip></span>
                                            <span className={`${styles.status} ${styles.teamShare}`}>
                                                <Switch
                                                    size="small"
                                                    className={`${styles.switcherSaleCard} ${item.eventWay == '80' || isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) ? styles.switcherdisabled : ''}`}
                                                    checked={defaultChecked}
                                                    // disabled={item.eventWay == '80'}
                                                    onChange={() => {
                                                        if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) || item.eventWay === 80 || BenefitDisabled) {
                                                            // e.preventDefault();
                                                            return;
                                                        }
                                                        this.permissionVerify(item.itemID,() => {
                                                            this.props.handleSattusActive(item, index)
                                                        })
                                                    }}
                                                    disabled={BenefitDisabled}
                                                />
                                            </span>
                                        </p>
                                        <div className={styles.centerBox}>
                                            <p><span>活动类型：</span> <em>{this.getEventWay(item.eventWay)}</em></p>
                                            <p><span>活动时间：</span> <em>{this.getTime(item.validDate)}</em> </p>
                                            <p><span>来源渠道：</span> <em>{item.createScenesName}</em></p>
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
                                            item.createScenesName === '权益卡' ? (<div className={styles.activityOperate}>
                                                <Authority rightCode={SPECIAL_LOOK_PROMOTION_QUERY} entryId={SPECIAL_PROMOTION_MANAGE_PAGE}>
                                                    <span
                                                        className={styles.operateDetail}
                                                        onClick={e => this.handleShowDetailModal(e, item, index)}
                                                    >
                                                        查看
                                                    </span>
                                                </Authority>
                                                <a
                                                    href="#"
                                                    className={isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record) ? stylesPage.textDisabled : null}
                                                    onClick={() => {
                                                        if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record)) {
                                                            return;
                                                        }
                                                        if (Number(item.eventWay) === 70) {
                                                            message.warning('该活动已下线');
                                                            return;
                                                        }
                                                        this.props.checkDetailInfo('', item, index);
                                                    }}
                                                    disabled={item.eventWay == 85}
                                                >
                                                    活动跟踪
                                                </a>
                                            </div>) : (
                                                <div className={styles.activityOperate}>
                                                    <Authority rightCode={SPECIAL_LOOK_PROMOTION_QUERY} entryId={SPECIAL_PROMOTION_MANAGE_PAGE}>
                                                        <span
                                                            className={styles.operateDetail}
                                                            onClick={e => this.handleShowDetailModal(e, item, index)}
                                                        >
                                                            查看
                                                        </span>
                                                    </Authority>
                                                    {
                                                        item.eventWay != '80' && <Authority rightCode={SPECIAL_PROMOTION_UPDATE} entryId={SPECIAL_PROMOTION_MANAGE_PAGE}>
                                                            <span
                                                                className={styles.operateEdit}
                                                                disabled={
                                                                    item.eventWay == '64' ? null :
                                                                        (isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) && (item.isActive != '0' || !isMine(item)))
                                                                }
                                                                onClick={(e) => {
                                                                    this.handleEditActive(e, item, index)
                                                                }}
                                                            >
                                                                编辑
                                                            </span>
                                                        </Authority>
                                                    }
                                                    {
                                                        item.eventWay != '80' && <Authority rightCode={SPECIAL_PROMOTION_DELETE} entryId={SPECIAL_PROMOTION_MANAGE_PAGE}>
                                                            <span
                                                                className={styles.operateDelete}
                                                                disabled={isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)}
                                                                onClick={() => {
                                                                    if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) || item.eventWay === 80) {
                                                                        return;
                                                                    }
                                                                    if (Number(item.eventWay) === 70) {
                                                                        message.warning(`该活动已下线`);
                                                                        return;
                                                                    }
                                                                    this.props.handleDelActive(item)(() => this.props.checkDeleteInfo(_, item, index));
                                                                }}
                                                            >
                                                                删除
                                                            </span>
                                                        </Authority>
                                                    }
                                                    {
                                                        (![85, 87].includes(+item.eventWay)) && <Tooltip placement="bottomLeft" title={this.renderTipTitle(_, item, index)} overlayClassName={stylesPage.Sale__Activite__Tip}>
                                                            <span style={{
                                                                position: 'relative',
                                                                paddingRight: 9,
                                                            }}
                                                            > 更多  <em className={styles.arrow}></em></span>
                                                        </Tooltip>
                                                    }
                                                </div>
                                            )
                                        }

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

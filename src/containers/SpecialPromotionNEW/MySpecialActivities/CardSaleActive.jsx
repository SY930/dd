import React, { Component } from 'react';
import { Row, Col, Switch, Tooltip, message, Pagination } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import Authority from '../../../components/common/Authority';
import { isBrandOfHuaTianGroupList, isGroupOfHuaTianGroupList, isMine } from '../../../constants/projectHuatianConf';
import {
    SPECIAL_LOOK_PROMOTION_QUERY,
    SPECIAL_PROMOTION_UPDATE,
    SPECIAL_PROMOTION_DELETE,
} from '../../../constants/authorityCodes';
import styles from './mySpecialActivities.less'
import stylesPage from '../../SaleCenterNEW/ActivityPage.less';
import emptyPage from '../../../assets/empty_page.png'

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
    '83', // 口令领券
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

    handleEditActive = (e, record, index) => {
        if (Number(record.eventWay) === 70) {
            message.warning('该活动已下线');
            return;
        }
        if (record.eventWay === 78 || record.eventWay === 79 || record.eventWay === 83 || record.eventWay === 85) {
            this.props.handleEditActive(record)(() => this.props.onV3Click(record.itemID, false, record.eventWay))
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
        this.props.handleEditActive(record)(() => {
            this.props.toggleIsUpdate(true)
            this.props.handleUpdateOpe(_, record, index);
        })
    }

    renderWXTip = (text, record, index) => {
        return (
            <div className={[stylesPage.Sale__Activite__moveMore, stylesPage.moveMoreShow].join(' ')}>
                <Authority rightCode={SPECIAL_LOOK_PROMOTION_QUERY}>
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
                    >活动跟踪</a>
                </Authority>
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
                <Authority rightCode={SPECIAL_LOOK_PROMOTION_QUERY}>
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
                    >活动跟踪</a>
                </Authority>
                {/* 第一版只做群发礼品的复制功能 */}
                {/* 摇奖活动增加复制,并且活动不是禁用状态  */}
                {
                    (record.eventWay === 53 || record.eventWay === 20)
                    &&
                    // <Authority rightCode={SPECIAL_PROMOTION_UPDATE}>
                    <a
                        href="#"
                        onClick={(e) => {
                            if (record.isActive != '0' || (isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record))) {
                                e.preventDefault()
                            } else {
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
                                this.props.toggleIsUpdate(true)
                                this.props.isCopy()
                                this.props.handleUpdateOpe(text, record, index);
                            }
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

    render() {
        const { dataSource: data } = this.props
        return (
            <div>
                <div style={{ height: 'calc(100vh - 380px)', overflowY: 'auto' }}>
                    <div className={styles.cardContainer}>
                        {data && data.length > 0 ?
                            data.map((item, index) => {
                                const defaultChecked = (item.isActive == '1' ? true : false);
                                return (
                                    <Col key={index} className={styles.columnsWrapper}>
                                        <p className={styles.activityTitle}>
                                            <span className={styles.titleText}><Tooltip title={item.eventName}>{item.eventName}</Tooltip></span>
                                            <span className={`${styles.status} ${styles.teamShare}`}>
                                                <Switch
                                                    size="small"
                                                    className={styles.switcherSaleCard}
                                                    checked={defaultChecked}
                                                    onChange={(e) => {
                                                        if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) || item.eventWay === 80) {
                                                            e.preventDefault();
                                                            return;
                                                        }
                                                        this.props.handleSattusActive(item, index)
                                                    }}
                                                />
                                            </span>
                                        </p>
                                        <div className={styles.centerBox}>
                                            <p><span>活动类型：</span> <em>{this.getEventWay(item.eventWay)}</em></p>
                                            <p><span>活动时间：</span> <em>{this.getTime(item.validDate)}</em> </p>
                                        </div>
                                        <div className={styles.activityBothCont}>
                                            <div className={styles.contBothBox}>
                                                <div className={styles.contList}>
                                                    <p><span>创建人/修改人：</span> <em>{this.getOperator(item)}</em></p>
                                                    <p><em>创建时间/修改时间：</em> {this.getOperateTime(item)}</p>
                                                </div>
                                            </div>

                                        </div>
                                        {/* {
                                    item.shopID > 0 ?
                                        <div className={styles.activityOrigin}>
                                            <img className={styles.tagImg} src={shopImg} />
                                            <span>{this.getCreateBy(item.shopID)}</span>
                                        </div> : null
                                } */}
                                        <div className={styles.activityOperate}>
                                            <span
                                                className={styles.operateDetail}
                                                onClick={e => this.handleShowDetailModal(e, item, index)}
                                            >
                                                查看
                                            </span>
                                            {
                                                item.eventWay != '80' && <Authority rightCode={SPECIAL_PROMOTION_UPDATE}>
                                                    <span
                                                        className={styles.operateEdit}
                                                        onClick={(e) => { this.handleEditActive(e, item, index) }}
                                                    >
                                                        编辑
                                                    </span>
                                                </Authority>
                                            }
                                            {
                                                item.eventWay != '80' && <Authority rightCode={SPECIAL_PROMOTION_DELETE}>
                                                    <span
                                                        className={styles.operateDelete}
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
                                            <Tooltip placement="bottomLeft" title={this.renderTipTitle(_, item, index)} overlayClassName={stylesPage.Sale__Activite__Tip}>
                                                <span style={{
                                                    position: 'relative',
                                                    paddingRight: 9,
                                                }}
                                                > 更多 <em className={styles.arrow}></em></span>
                                            </Tooltip>
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

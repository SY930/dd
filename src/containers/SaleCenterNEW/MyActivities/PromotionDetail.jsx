/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-09T15:23:26+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: PromotionDetail.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-09T16:55:43+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import { Modal, Row, Col } from 'antd';
import Immutable from 'immutable';
import {
    SALE_CENTER_ACTIVITY_CHANNEL_LIST,
    SALE_CENTER_ACTIVITY_ORDER_TYPE,
    ACTIVITY_CATEGORIES,
    CLIENT_CATEGORY,
    CLIENT_CATEGORY_RETURN_GIFT,
    CLIENT_CATEGORY_ADD_UP,
    PAYMENTS_OPTIONS,
    arrayTransformAdapter,
} from '../../../redux/actions/saleCenterNEW/types';
import styles from './MyActivities.less'

const Moment = require('moment');

class PromotionDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.showInfo}>
                {this.renderBaseInfo()}
                {this.renderActivityRangeInfo()}
                {this.renderActivityDetailInfo()}
            </div>
        );
    }

    renderCategoryOrDish(record) {
        if (record.scopeLst !== undefined) {
            if (this.renderCategory(record.scopeLst, '2').length > 0) {
                return (
                    <Row>
                        <Col span={4} style={{ textAlign: 'right' }}>适用菜品</Col>
                        <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                        <Col span={18} style={{ textAlign: 'left' }}>{record.scopeLst ? this.renderCategory(record.scopeLst, '2') : '不限制'}</Col>
                    </Row>);
            }
            return (
                <div>
                    <Row>
                        <Col span={4} style={{ textAlign: 'right' }}>适用菜品分类</Col>
                        <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                        <Col span={18} style={{ textAlign: 'left' }}>{record.scopeLst ? this.renderCategory(record.scopeLst, '1') : '不限制'}</Col>
                    </Row>
                    <Row>
                        <Col span={4} style={{ textAlign: 'right' }}>排除菜品</Col>
                        <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                        <Col span={18} style={{ textAlign: 'left' }}>{record.scopeLst ? this.renderCategory(record.scopeLst, '4') : '不限制'}</Col>
                    </Row>


                </div>
            );
        }
        return (
            <Row>
                <Col span={4} style={{ textAlign: 'right' }}>菜品范围</Col>
                <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                <Col span={18} style={{ textAlign: 'left' }}>不限制</Col>
            </Row>);
    }
    renderActivityDetailInfo() {
        const record = this.props.record;
        return (
            <div >
                <h5><span></span>活动内容</h5>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动方式</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>
                        {
                            ACTIVITY_CATEGORIES.find((pt) => {
                                return pt.key === record.master.promotionType
                            }).title
                        }
                    </Col>
                    <Col span={19} offset={5}>
                        {
                            record.extensions.promotionContent ? (
                                record.extensions.promotionContent.map((pc, index) => {
                                    return <p key={`${index}`}>{pc}</p>
                                })
                            ) : null
                        }
                    </Col>
                </Row>
                {
                    this.renderCategoryOrDish(record)
                }

                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>适用用户</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>
                        {
                            record.master.promotionType == '2070' || record.master.promotionType == '1080' ?
                                CLIENT_CATEGORY_ADD_UP.find((pt) => {
                                    return pt.key === record.master.userType
                                }).name : CLIENT_CATEGORY.find((pt) => {
                                    return pt.key === record.master.userType
                                }).name
                        }
                    </Col>
                </Row>

                {/* <Row>
                    <Col span={4} style={{textAlign: 'right'}}>会员群体</Col>
                    <Col span={1} style={{textAlign: 'center'}}>:</Col>
                    <Col span={18} style={{textAlign: 'left'}}>{record.master.shopIDLst}</Col>
                </Row> */}

                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>支付限制</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>
                        {
                            PAYMENTS_OPTIONS.find((pt) => {
                                return pt.key === record.master.subjectType
                            }).name
                        }</Col>
                </Row>

                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>营销活动共享</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.extensions.sharedPromotions ? this.renderShopInfo(record.extensions.sharedPromotions) : '不限制'}</Col>
                </Row>

                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>结算方式互斥</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.extensions.subjects ? this.renderShopInfo(record.extensions.subjects) : '不限制'}</Col>
                </Row>

                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动执行角色</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.extensions.roles ? this.renderShopInfo(record.extensions.roles) : '不限制'}</Col>
                </Row>

            </div>
        );
    }

    renderCategory(scopeLst, temp) {
        return scopeLst.filter((sl) => {
            return sl.scopeType === temp
        })
            .map((scope, index) => {
                return <p key={index}>{scope.targetName}</p>
            });
    }

    renderpromotionTime(start, end) {
        if (start == 20000101 && end == 29991231) {
            return '不限制';
        }
        return `${Moment(start, 'YYYYMMDD').format('YYYY.MM.DD')}--${Moment(end, 'YYYYMMDD').format('YYYY.MM.DD')}`
    }
    renderChannelLst(channelLst) {
        //
        const temp = SALE_CENTER_ACTIVITY_CHANNEL_LIST.filter((channel) => {
            return channel.key == channelLst;
        });

        return temp.length > 0 ? temp[0].name : '不限制';
    }

    renderOrderTypeLst(orderTypeLst) {
        try {
            const orderList = arrayTransformAdapter(orderTypeLst);
            return orderList.map((order, index) => {
                return <p key={index}>{SALE_CENTER_ACTIVITY_ORDER_TYPE[order]}</p>;
            })
        } catch (error) {
            console.error(new Error(1, 'parse orderTypeLst failed'));
        }
    }

    renderShopInfo(shopList) {
        return shopList.map((shop, index) => {
            return <p key={index}>{shop.name}</p>
        }) || '不限制';


        // shopName
    }

    renderpromotionShowName(promotionShowName) {
        if (promotionShowName == '' || promotionShowName === undefined) {
            return '未填写';
        }

        return promotionShowName;
    }
    renderTimeLst(record) {
        if (record.timeLst != undefined) {
            return (
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动时段</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>
                        {
                            record.timeLst.map((time, index) => {
                                return <p key={`${index}`}>{Moment(time.startTime, 'HHmm').format('HH:mm')} -- {Moment(time.endTime, 'HHmm').format('HH:mm')}</p>
                            })
                        }
                    </Col>
                </Row>
            )
        }
    }
    renderCycles(cycle) {
        if (cycle[0] == 'w') {
            const weekName = [
                { chinese: '一', english: '1' },
                { chinese: '二', english: '2' },
                { chinese: '三', english: '3' },
                { chinese: '四', english: '4' },
                { chinese: '五', english: '5' },
                { chinese: '六', english: '6' },
                { chinese: '日', english: '7' },
            ];
            return cycle.split(',').map((cy, index) => {
                return (<p key={`${index}`}>{`周${
                    weekName.find((wk) => {
                        return wk.english === cy.substr(1)
                    }).chinese
                }`}</p>);
            })
        }
        return cycle.split(',').map((cy, index) => {
            return (<p key={`${index}`}>{`${cy.substr(1)}号`}</p>);
        })
    }
    renderValidCycle(record) {
        if (record.master.validCycle != undefined && record.master.validCycle != '') {
            return (
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动周期</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>
                        {
                            this.renderCycles(record.master.validCycle)
                        }
                    </Col>
                </Row>
            )
        }
    }
    renderExcludeDate(record) {
        if (record.master.excludedDate != undefined && record.master.excludedDate != '') {
            return (
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>排除日期</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>
                        {
                            record.master.excludedDate.split(',').map((ed, index) => {
                                return <p key={`${index}`}>{Moment(ed, 'YYYYMMDD').format('YYYY.MM.DD')}</p>
                            })
                        }
                    </Col>
                </Row>
            )
        }
    }
    renderActivityRangeInfo() {
        const record = this.props.record;
        const $promotionScopeInfo = this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands']);
        return (
            <div>
                <h5><span></span>活动范围</h5>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>适用品牌</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>
                        {record.extensions.brands ? this.renderShopInfo(record.extensions.brands) : '不限制'}
                    </Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>适用场景</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{this.renderChannelLst(record.master.channelLst)}</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>适用业务</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{this.renderOrderTypeLst(record.master.orderTypeLst)}</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>适用店铺</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.extensions.shops ? this.renderShopInfo(record.extensions.shops) : '不限制'}</Col>
                </Row>

            </div>
        );
    }

    renderBaseInfo() {
        const record = this.props.record;

        return (
            <div>
                <h5><span></span>基础信息</h5>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>统计类别</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.master.categoryName}</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动名称</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.master.promotionName}</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>展示名称</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{this.renderpromotionShowName(record.master.promotionShowName) || '未填写'}</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动编码</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.master.promotionCode}</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动标签</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.master.tagLst ? record.master.tagLst.split(',').map((tag, index) => {
                        return <p key={`${index}`}>{tag}</p>
                    }) : '未填写'}</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动日期</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{this.renderpromotionTime(record.master.startDate, record.master.endDate)}</Col>
                </Row>
                {
                    this.renderTimeLst(record)
                }
                {
                    this.renderValidCycle(record)
                }
                {
                    this.renderExcludeDate(record)
                }
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动说明</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.master.description || '未填写'}</Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetail);

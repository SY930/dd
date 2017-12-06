/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-15T10:50:38+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Table,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

class ExcludeGroupTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getExcludeEventList: [],
        };
    }

    componentDidMount() {
        this.setState({ getExcludeEventList: this.props.specialPromotion.get('$eventInfo').toJS().getExcludeEventList || [] });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ getExcludeEventList: nextProps.specialPromotion.get('$eventInfo').toJS().getExcludeEventList || [] });
    }

    render() {
        // table数据
        const getExcludeEventList = this.props.specialPromotion.get('$eventInfo').toJS().getExcludeEventList || [];


        const columns = [{
            title: '活动名称',
            dataIndex: 'eventName',
            key: 'eventName',
            className: 'TableTxtCenter',
            render: (text, record, index) => {
                return (
                    <div key={'eventName'}><h5 className={styles.cardName} key={'eventName'}>{`${record.eventName || '（无）'}`}</h5></div>
                )
            },
        }, {
            title: '起止日期',
            dataIndex: 'eventDate',
            key: 'eventDate',
            className: 'TableTxtCenter',
            render: (text, record, index) => {
                return (
                    <div key={'eventDate'}><h5 className={styles.cardName} key={'eventDate'}>{`${record.eventStartDate || '--'}/${record.eventEndDate || '--'}`}</h5></div>
                )
            },
            // }, {
            //     title: '占用会员群体信息' ,
            //     dataIndex: 'idNames',
            //     key: 'idNames',
            //     className: 'TableTxtCenter',
            //     render:(text, record, index)=>{
            //         return record.idNames.map((idName,i)=>{
            //             return (
            //                 <div key={`idName${i}`}><h5 className={styles.cardName} key={`cardName${i}`}>{idName}</h5></div>
            //             )
            //         })
            //     }
        },
        ];
        return (

            <Table
                dataSource={getExcludeEventList}
                columns={columns}
                pagination={false}
                className={styles.cardIdNames}
                bordered={true}
                size="middle"
                rowKey="uid"
                title={() => { return '同时段内，已有如下唤醒送礼活动正在进行，请重选时段' }}
            />

        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.specialPromotion_NEW,
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ExcludeGroupTable));

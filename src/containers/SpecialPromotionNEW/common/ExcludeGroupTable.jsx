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
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
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
            title: `${this.props.intl.formatMessage(STRING_SPE.d4546grade4128)}`,
            dataIndex: 'eventName',
            key: 'eventName',
            className: 'TableTxtCenter',
            render: (text, record, index) => {
                return (
                    <div key={'eventName'}><h5 className={styles.cardName} key={'eventName'}>{`${record.eventName || `${this.props.intl.formatMessage(STRING_SPE.d31eifji3f4063)}`}`}</h5></div>
                )
            },
        }, {
            title: `${this.props.intl.formatMessage(STRING_SPE.d5g337jqji179)}`,
            dataIndex: 'eventDate',
            key: 'eventDate',
            className: 'TableTxtCenter',
            render: (text, record, index) => {
                return (
                    <div key={'eventDate'}><h5 className={styles.cardName} key={'eventDate'}>{`${record.eventStartDate || '--'}/${record.eventEndDate || '--'}`}</h5></div>
                )
            },
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
                title={() => { return `${this.props.intl.formatMessage(STRING_SPE.d1e058jhop0290)}` }}
            />

        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ExcludeGroupTable));

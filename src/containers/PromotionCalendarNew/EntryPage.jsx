import React, { Component } from 'react';
import {
    Button,
    DatePicker,
    Select,
    Icon,
} from 'antd';
import { jumpPage } from '@hualala/platform-base';
import { axiosData } from '../../helpers/util'
import registerPage from '../../../index';
import { PROMOTION_CALENDAR_NEW, SALE_CENTER_PAGE } from '../../constants/entryCodes';
import style from './style.less';
import PromotionCreateModal from '../NewCreatePromotions/PromotionCreateModal'
import CalendarList from './CalendarList';
import moment from 'moment';

const Option = Select.Option;
const { MonthPicker } = DatePicker;

const SUPPORT_ORDER_TYPES = [
    {
        label: '预定',
        value: '10',
    },
    {
        label: '闪吃',
        value: '11',
    },
    {
        label: '外送',
        value: '20',
    },
    {
        label: '堂食',
        value: '31',
    },
    {
        label: '自提',
        value: '21',
    },
];
const CHANNEL_LIST = [
    {
        value: 'POS',
        label: '云店',
    },
    {
        value: 'WECHAT',
        label: '微信',
    },
        {
        value: 'YST',
        label: '饮食通',
    },
];

@registerPage([PROMOTION_CALENDAR_NEW])
export default class EntryPage extends Component {

    constructor() {
        super();
        this.state = {
            createModalVisible: false,
            shopIDList: [],
            channelList: [],
            supportOrderTypeList: [],
            startDate: moment(),
        }
    }

    openCreateModal = () => {
        this.setState({createModalVisible: true})
    }
    handleMonthChange = (v) => {
        this.setState({
            startDate: v,
        })
    }
    handleChannelListChange = (v) => {
        this.setState({
            channelList: v,
        })
    }
    handleSupportOrderTypeChange = (v) => {
        this.setState({
            supportOrderTypeList: v,
        })
    }

    renderFilterBar() {
        const {
            shopIDList,
            channelList,
            supportOrderTypeList,
            startDate,
        } = this.state;
        return (
            <div className={style.searchHeader}>
                <h5>月份</h5>
                <MonthPicker
                    style={{ width: 160, margin: '0 20px' }}
                    value={startDate}
                    onChange={this.handleMonthChange}
                />
                <h5>适用场景</h5>
                <Select
                    multiple={true}
                    style={{ width: 160, margin: '0 20px' }}
                    value={channelList}
                    placeholder="请选择场景"
                    onChange={this.handleChannelListChange}
                >
                    {
                        CHANNEL_LIST.map(({value, label}) => (
                            <Option key={value}>{label}</Option>
                        ))
                    }
                </Select>
                <h5>适用业务</h5>
                <Select
                    multiple={true}
                    value={supportOrderTypeList}
                    style={{ width: 160, margin: '0 20px' }}
                    placeholder="请选择业务"
                    onChange={this.handleSupportOrderTypeChange}
                >
                    {
                        SUPPORT_ORDER_TYPES.map(({value, label}) => (
                            <Option key={value}>{label}</Option>
                        ))
                    }
                </Select>
        
                <Button type="primary"><Icon type="search" />查询</Button>
            </div>
        );
    }

    renderBody() {
        const { createModalVisible } = this.state;
        return (
            <div>
                {this.renderFilterBar()}
                <CalendarList />
                {createModalVisible && (
                    <PromotionCreateModal onCancel={() => this.setState({createModalVisible: false})}/>
                )}
            </div>
        )
    }

    renderHeader() {
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    营销日历
                </span>
                <div className={style.spacer} />
                <Button
                    type="primary"
                    icon="plus"
                    onClick={this.openCreateModal}
                    style={{ marginRight: 12 }}
                >
                    创建活动
                </Button>
                <Button
                    type="ghost"
                    onClick={() => {
                        jumpPage({ pageID: SALE_CENTER_PAGE })
                    }}
                >
                    活动管理
                </Button>
            </div>
        )
    }

    render() {
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                <div className={style.blockLine} />
                {this.renderBody()}
            </div>
        )
    }
}

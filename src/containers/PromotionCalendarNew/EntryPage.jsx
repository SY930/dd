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

const Option = Select.Option;
const { MonthPicker } = DatePicker;

@registerPage([PROMOTION_CALENDAR_NEW])
export default class EntryPage extends Component {

    constructor() {
        super();
        this.state = {
            createModalVisible: false,
        }
    }

    openCreateModal = () => {
        this.setState({createModalVisible: true})
    }

    renderFilterBar() {
        return (
            <div className={style.searchHeader}>
                <h5>活动时间</h5>
                <MonthPicker style={{ width: '160px' }} placeholder="Select month" />
                <h5>使用状态</h5>
                <Select
                    style={{ width: '160px' }}
                    defaultValue="0"
                    placeholder="请选择使用状态"
                    onChange={(value) => {
                    }}
                >
                    <Option value='1' >全部</Option>
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

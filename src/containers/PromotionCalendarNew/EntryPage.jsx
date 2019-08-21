import React, { Component } from 'react';
import {
    Button,
    DatePicker,
    Select,
    Icon,
    TreeSelect,
} from 'antd';
import moment from 'moment';
import Immutable from 'immutable';
import { jumpPage } from '@hualala/platform-base';
import { connect } from 'react-redux';
import { axiosData } from '../../helpers/util'
import registerPage from '../../../index';
import { PROMOTION_CALENDAR_NEW, SALE_CENTER_PAGE } from '../../constants/entryCodes';
import style from './style.less';
import PromotionCreateModal from '../NewCreatePromotions/PromotionCreateModal'
import CalendarList from './CalendarList';
import {
    fetchPromotionScopeInfo,
} from '../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import {

} from '../../constants/promotionType';


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

const mapDispatchToProps = (dispatch) => {
    return {
        // 查询品牌、店铺等信息
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
    };
};
const mapStateToProps = (state) => {
    return {
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user,
    };
};

@registerPage([PROMOTION_CALENDAR_NEW])
@connect(mapStateToProps, mapDispatchToProps)
export default class EntryPage extends Component {

    constructor() {
        super();
        this.state = {
            createModalVisible: false,
            loading: false,
            selectedShops: [],
            shopIDList: [],
            channelList: [],
            supportOrderTypeList: [],
            startDate: moment(),
            promotionInfoList: [
                {"eventID":'6665094687050701717',"eventName":"0306完善资料送礼","eventCategory":20,"eventType":60,"eventStartDate":20000101,"eventEndDate":29991231},
                {"eventID": '950957556455571456',"eventName":"引擎满减","eventCategory":10,"eventType":2010,"eventStartDate":20000101,"eventEndDate":29991231},
            ],
        }
    }

    handleQuery = () => {
        const {
            shopIDList,
            channelList,
            supportOrderTypeList,
            startDate,
        } = this.state;
        this.setState({
            loading: true,
        })
        axiosData(
            '/calendar/eventCalendarService_queryPromotionList.ajax',
            {
                shopIDList,
                channelList,
                supportOrderTypeList,
                startDate: startDate.format('YYYYMM01')
            },
            {},
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(data => {
            console.log(data)
            this.setState({
                loading: false,
            })
        }).catch(err => {
            this.setState({
                loading: false,
            })
        })
    }

    componentDidMount() {
        this.props.fetchPromotionScopeInfo({
            _groupID: this.props.user.getIn(['accountInfo','groupID'])
        });
        this.handleQuery();
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

    onTreeSelect(value, treeData) {        
        const shopsInfo = [];
        treeData.forEach((td) => {
            if (td.children) {
                td.children.map((tdc) => {
                    shopsInfo.push(tdc);
                })
            }
        });
        const shopIDList = value.map(val => shopsInfo.find((si) => {
                    return si.value === val;
                }).shopID)
        this.setState({
            selectedShops: value,
            shopIDList,
        })
    }

    renderShopsInTreeSelectMode() {
        const treeData = Immutable.List.isList(this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData'])) ?
            this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData']).toJS() :
            this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData']);
        const tProps = {
                treeData,
                value: this.state.selectedShops,
                onChange: value => this.onTreeSelect(value, treeData),
                placeholder: '请选择店铺',
                allowClear: true,
            };
        return (
            <TreeSelect
                showSearch
                multiple
                {...tProps}
                style={{ width: 160, margin: '0 20px 0 10px' }}
                dropdownStyle={{ minWidth: 160 }}
                dropdownMatchSelectWidth={false}
                treeNodeFilterProp="label"
            />
        );
    }

    renderFilterBar() {
        const {
            shopIDList,
            channelList,
            supportOrderTypeList,
            startDate,
            loading,
        } = this.state;
        return (
            <div className={style.searchHeader}>
                <h5>月份</h5>
                <MonthPicker
                    allowClear={false}
                    style={{ width: 160, margin: '0 20px' }}
                    format="YYYY年MM月"
                    value={startDate}
                    onChange={this.handleMonthChange}
                />
                <h5>适用店铺</h5>
                {this.renderShopsInTreeSelectMode()}
                <h5>适用场景</h5>
                <Select
                    multiple={true}
                    style={{ width: 200, margin: '0 20px 0 10px' }}
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
                    style={{ width: 200, margin: '0 20px 0 10px' }}
                    placeholder="请选择业务"
                    onChange={this.handleSupportOrderTypeChange}
                >
                    {
                        SUPPORT_ORDER_TYPES.map(({value, label}) => (
                            <Option key={value}>{label}</Option>
                        ))
                    }
                </Select>
                <Button
                    type="primary"
                    loading={loading}
                    onClick={this.handleQuery}
                >
                    <Icon type="search" />
                    查询
                </Button>
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

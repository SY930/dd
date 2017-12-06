import React from 'react'
import { Modal, Spin } from 'antd'
import { connect } from 'react-redux';
import { fetchData } from '../../../helpers/util';
import { FILTERS } from './_config'
import FilterSelector from './FilterSelector'


const url_origin = {
    mul: {
        '0': 'queryMultipeOrgNoShopDemandOrg',
        '1': 'queryMultipeAllShopAndDemand',
        '2': 'queryDemandAndShopForOut',
        '3': 'queryMultipeAllShopAndDemand',
        '4': 'queryMultipeAllShopAndDemand',
        '5': 'queryMultipeDisAndDemand',
        '6': 'queryMultipeAllShopAndDemand',
        '7': 'queryMultipeAllShopAndDemand',
        '8': 'queryDemandAndShopForOut',
        '9': 'queryMultipeAllShopAndDemand',
        '10': 'queryDemandAndShopForOut',
        '11': 'queryMultipeAllShopAndDemand',
        '12': 'queryAllShop',
    },
    unMul: {
        '0': 'queryDemandAndShopNoShopDemandOrg',
        '1': 'queryAndOtherDemandOrg',
        '2': 'queryDemandAndShopForOut',
        '3': 'queryShopDemand',
        '4': 'queryDemandAndSubDem',
        '5': 'queryDisAndDemand',
        '6': 'queryDemandAndShopNoShopDemandOrg',
        '7': 'queryAndOtherDemandOrg',
        '8': 'queryAndOtherDemandOrg',
        '9': 'queryAndOtherDemandOrg',
        '10': 'queryDemandAndShopNoShopDemandOrg',
        '11': 'queryDemandAndSubDem',
        '12': 'queryShop',
    },
}
class ModalSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: FILTERS,
            selectedShopIds: props.defaultValue, // 选中的门店id 数组
            shopData: [], // 所有的门店信息
            loading: false, // loading 状态
        }
    }
    handleFilterKeyChange = (filterKey) => {
        // filterKey // FILTERS中的key
        const curFilter = this.state.filters.find(filter => filter.key === filterKey);
        if (!curFilter || curFilter.options) return Promise.resolve();
    }
    componentWillReceiveProps(nextProps) {
        // this.setState({ selectedShopIds: nextProps.defaultValue })
    }
    handleOk = () => {
        const { selectedShopIds, shopData } = this.state
        const { onOk } = this.props
        const arr = shopData.filter((val) => {
            return selectedShopIds.indexOf(val.orgID) >= 0
        })
        onOk && onOk(arr)
    }

    handleChange = (val) => {
        this.setState({ selectedShopIds: val })
    }
    componentWillMount() {
        const { filters } = this.state
        const params = {
            distributionID: this.props.$orgID,
        }
        let url
        const fetchList = (urls, param) => {
            fetchData(urls, param, null, { path: null }).then((res) => {
                if (res.code === '000') {
                    const data = res.data
                    filters.forEach((item, index) => {
                        if (index === 0) {
                            filters[index].options = data.orgRecords
                        } else if (index === 1) {
                            filters[index].options = data.brandRecords
                        } else if (index === 2) {
                            let arr = []
                            arr = data.shopCategory.map((val, ind) => {
                                val.Name = val.shopCategoryName
                                val.ID = val.shopCategoryID
                                return val
                            })
                            filters[index].options = arr
                        } else if (index === 3) {
                            filters[index].options = data.cityRecords
                        } else {
                            const arr = []
                            data.targRecords.forEach((val) => {
                                arr.push({
                                    Name: val,
                                    ID: val,
                                })
                            })
                            filters[index].options = arr
                        }
                    })
                    this.setState({ shopData: res.data.records })
                }
            })
        }
        if (this.props.urlFlag === 'all') { // 查询集团下的门店、仓位、加工间、配送中心、公司
            fetchList('queryOrgByGroup', null)
            return
        }
        fetchData('queryParams', {
            paramName: 'isMultipeDistribution',
        }, null, { path: 'data' })
            .then((datas) => {
                if (datas.records[0] && datas.records[0].paramValues === '1') {
                    url = url_origin.mul[this.props.urlFlag]
                } else {
                    url = url_origin.unMul[this.props.urlFlag]
                }
                fetchList(url, params)
            })
    }
    render() {
        const { title, visible, onCancel, width, defaultValue } = this.props
        const { filters, loading, shopData } = this.state
        return (
            <Spin spinning={loading}>
                {
                    visible && <Modal
                        width={width}
                        title={title}
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={onCancel}
                    >
                        <FilterSelector
                            filters={filters}
                            onFilterKeyChange={this.handleFilterKeyChange}
                            defaultValue={defaultValue}
                            onChange={this.handleChange}
                            options={shopData}
                        />
                    </Modal>
                }
            </Spin>
        )
    }
}

ModalSelector.defaultProps = {
    width: '90%',
    title: '选择组织',
    visible: false,
    onOk: () => { },
    onCancel: () => { },
    defaultValue: [],
}
export default connect(
    ({ user }) => ({
        $orgID: user.get('orgID'),
    }),
)(ModalSelector);

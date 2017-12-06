import React from 'react'
import { Modal, Spin } from 'antd'
import { connect } from 'react-redux';
import { fetchData } from '../../../helpers/util';
import { FILTERS } from './_config'
import FilterSelector from './FilterSelector'


const url_origin = {
    '2': 'querySupAndOrg', // 集团
    '3': 'querySupAndOrgDemand', // 配送中心
    '4': 'querySupAndOrgByShop', // 门店
}
const staticType = [{ categoryName: '全部供应商', suppliercID: 'all' }]
const typeObj = {
    '2': [{ categoryName: '配送中心', suppliercID: '4' }, { categoryName: '加工间', suppliercID: '9' }],
    '3': [{ categoryName: '配送中心', suppliercID: '4' }, { categoryName: '加工间', suppliercID: '9' }],
    '4': [{ categoryName: '配送中心', suppliercID: '4' }, { categoryName: '门店', suppliercID: '1' }],
}
// Arr = [{ categoryName: '全部供应商', suppliercID: 'all' } { categoryName: '门店', suppliercID: '1' }]
class SupplierSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: FILTERS,
            selectedShopIds: props.defaultValue, // 选中的门店id 数组
            shopData: [], // 所有的门店信息
            loading: false, // loading 状态
            leftOption: [],
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
            return selectedShopIds.indexOf(val.supplierID) >= 0
        })
        console.log(arr);
        onOk && onOk(arr)
    }

    handleChange = (val) => {
        this.setState({ selectedShopIds: val })
    }
    componentWillMount() {
        const { filters } = this.state
        const { $viewpointID, $orgID } = this.props
        const params = {
            isActive: '1',
        }
        if ($viewpointID === '4') {
            params.demandID = $orgID
        }
        const leftOption = [...staticType, ...typeObj[$viewpointID]]

        fetchData('querySupplierCategory', null, null, { path: null }).then((res) => {
            this.setState({ leftOption: [...leftOption, ...res.data.records] })
        })
        // fetch('http://www.easy-mock.com/mock/5a0578013c9efa696cf5c925/example/mock', { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, */*' } }).then((res) => {
        //     return res.json()
        // }).then((r) => {
        //     this.setState({ shopData: r.data.records })
        // }
        //     )
        fetchData(url_origin[$viewpointID], params, null, { path: null }).then((res) => {
            this.setState({ shopData: res.data.records })
        })
    }
    render() {
        const { title, visible, onCancel, width, defaultValue } = this.props
        const { filters, loading, shopData, leftOption } = this.state
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
                            leftOptions={leftOption}
                        />
                    </Modal>
                }
            </Spin>
        )
    }
}

SupplierSelector.defaultProps = {
    width: '585px',
    title: '选择供应商',
    visible: false,
    onOk: () => { },
    onCancel: () => { },
    defaultValue: [],
}
export default connect(
    ({ user }) => ({
        $viewpointID: user.get('viewpointID'),
        $orgID: user.get('orgID'),
    }),
)(SupplierSelector);

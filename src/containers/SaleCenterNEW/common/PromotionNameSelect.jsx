import React from 'react';
import {
    Select,
} from 'antd';
import _ from 'lodash'
import { axiosData } from '../../../helpers/util'
import CC2PY, { CC2PYSS } from '../../../components/common/CC2PY';

const Option = Select.Option;
const Immutable = require('immutable');

export default class PromotionNameSelect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            promotionNameLst: [],
        }
    }
    componentDidMount() {
        this.getNameList(this.props.getParams)
    }
    componentWillReceiveProps(nextProps) {
        if (!Immutable.is(Immutable.fromJS(this.props.getParams), Immutable.fromJS(nextProps.getParams))) {
            this.getNameList(nextProps.getParams)
        }
    }
    getNameList = (opt) => {
        axiosData('/promotionV1/listPromotionName.ajax', { ...opt, promotionName: undefined }, null, { path: '' }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
            .then((res) => {
                this.setState({
                    promotionNameLst: (res.promotionNameLst || []).filter((name) => {
                        return CC2PY(name).indexOf(CC2PY(opt.promotionName || '')) > -1 || CC2PYSS(name).indexOf(CC2PYSS(opt.promotionName || '')) > -1
                    }),
                })
            })
    }
    searchProName = _.debounce((_val) => {
        const val = _val.trim().toLowerCase()
        const opts = { promotionName: val }
        this.props.onChange(opts)
    }, 300)
    render() {
        return (
            <Select
                combobox={true}
                style={{ width: 160 }}
                onSearch={this.searchProName}
                filterOption={false}
                placeholder="请输入活动名称"
            >
                {
                    (this.state.promotionNameLst || []).map(v => <Option key={v} value={v}>{v}</Option>)

                }
            </Select>
        )
    }
}

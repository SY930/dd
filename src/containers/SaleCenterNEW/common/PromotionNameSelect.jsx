import React from 'react';
import {
    Select,
} from 'antd';
import _ from 'lodash'
import { axiosData } from '../../../helpers/util'
import CC2PY, { CC2PYSS } from '../../../components/common/CC2PY';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';

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
        this.getNameList()
    }
    componentWillReceiveProps(nextProps) {
        if (!Immutable.is(Immutable.fromJS(this.props.getParams), Immutable.fromJS(nextProps.getParams))) {
            this.getNameList(nextProps.getParams)
        }
    }
    getNameList = (opt = this.props.getParams) => {
        const param = {
            ...opt,
            promotionType: opt.promotionType > 0 ? opt.promotionType : undefined
        }
        axiosData('/promotion/docPromotionService_queryPromotionNameLst.ajax', param, null, { path: 'data' }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
            .then((res) => {
                this.setState({
                    allPromotionNameLst: res.promotionNameLst || [],
                    promotionNameLst: (res.promotionNameLst || []).filter((name) => {
                        return CC2PY(name).indexOf(CC2PY(this.state.promotionName || '')) > -1 || CC2PYSS(name).indexOf(CC2PYSS(this.state.promotionName || '')) > -1
                    }),
                })
            })
    }
    searchProName = _.debounce((_val) => {
        const val = _val.trim().toLowerCase()
        const opts = { promotionName: val }
        this.setState({
            ...opts,
            promotionNameLst: (this.state.allPromotionNameLst || []).filter((name) => {
                return CC2PY(name).indexOf(CC2PY(val || '')) > -1 || CC2PYSS(name).indexOf(CC2PYSS(val || '')) > -1
            }),
        })
        this.props.onChange(opts)
    }, 300)
    render() {
        return (
            <Select
                combobox={true}
                style={{ width: 160 }}
                onSearch={this.searchProName}
                getPopupContainer={(node) => node.parentNode}
                onSelect={(promotionName) => {
                    this.setState({ promotionName })
                    this.props.onChange({ promotionName })
                }}
                notFoundContent={SALE_LABEL.k5dod8s9}
                filterOption={false}
                placeholder={SALE_LABEL.k5dlcm1i}
            >
                {
                    (this.state.promotionNameLst || []).map(v => <Option key={v} value={v}>{v}</Option>)

                }
            </Select>
        )
    }
}

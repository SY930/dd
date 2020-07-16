import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message, Switch } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys3, formItems3, formItemLayout } from './Common';
import Lottery from '../Camp/BlindBoxLottery';
import OpenLottery from '../Camp/BlindBoxLottery/OpenLottery';
import Share from '../Camp/Share';
import css from './style.less';

class Step3 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
    };

    onChange = (key, value) => {
    }

    openBoxRender = (d) => {
        return (
            <div>
                <div className={css.titBox}>
                    <p className={css.titleTip}>明盒</p>
                    <Switch checkedChildren="开" unCheckedChildren="关" />
                </div>
                <p>盲盒活动中，部分可以直接展示给消费者礼品可以设置明盒礼品，全盲盒活动则不需要设置</p>
            </div>
        )
    }
    /** formItems 重新设置 */
    resetFormItems() {
        const render = d => d()(<Lottery decorator={d} />);
        const OpenRender = d => d()(<OpenLottery decorator={d} />);
        const shareRender = d => d()(<Share decorator={d} />);
        const openBoxRender = d => d()(this.openBoxRender());
        const { needShow, lottery, consumeTotalAmount, share, ...other } = formItems3;
        return {
            ...other,
            needShow: {...needShow, render: openBoxRender},
            consumeTotalAmount: {...consumeTotalAmount, render: OpenRender},
            lottery: { ...lottery, render },
            share: { ...share, render: shareRender },
        };
    }

    render() {
        console.log('fk3', formKeys3)
        const { } = this.state;
        const { formData, getForm } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div>
                <BaseForm
                    getForm={getForm}
                    formItems={newFormItems}
                    formKeys={formKeys3}
                    onChange={this.onChange}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}
export default Step3

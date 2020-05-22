import React, { PureComponent as Component } from 'react';
import { Button, Icon } from 'antd'
import css from './style.less';
import {  } from './Common';
import Gift from '../Gift';
import { getCardList } from './AxiosFactory';

class MutliGift extends Component {

    state = {
        giftList: [],
        treeData: [],
    }
    componentDidMount() {
        getCardList({}).then(x => {
            this.setState({ treeData: x });
        });
        this.onAdd();
    }
    onChange = ({ target }) => {
        const { checked } = target;
    }
    onAdd = () => {
        const { giftList } = this.state;
        const list = [...giftList];
        const id = Date.now().toString(36); // 随机不重复ID号
        list.push({ id });
        this.setState({ giftList: list });
    }
    render() {
        const { treeData, giftList } = this.state;
        const { type, value, disabled } = this.props;
        return (
            <div className={css.multiGiftBox}>
                {
                    giftList.map(x=>{
                        return (
                            <div className={css.giftBox}><Gift
                                treeData={treeData}
                            /></div>)
                    })
                }
                <Button onClick={this.onAdd}>
                    <Icon type="plus" />点击添加礼品
                </Button>
            </div>
        )
    }
}

export default MutliGift

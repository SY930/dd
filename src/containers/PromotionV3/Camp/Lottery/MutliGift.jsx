import React, { PureComponent as Component } from 'react';
import { Button, Icon } from 'antd'
import css from './style.less';
import Gift from '../Gift';
import { getCardList } from './AxiosFactory';

const href = 'javascript:;';
class MutliGift extends Component {

    state = {
        treeData: [],
    }
    componentDidMount() {
        getCardList({}).then(x => {
            this.setState({ treeData: x });
        });
    }
    onChange = (idx, params) => {
        const { value, onChange } = this.props;
        const list = [...value];
        const giftObj = value[idx];
        list[idx] = {...giftObj, ...params};
        onChange(list);
    }
    onAdd = () => {
        const { value, onChange } = this.props;
        if(value[9]) { return; }
        const list = [...value];
        const id = Date.now().toString(36); // 随机不重复ID号
        list.push({ id, effectType: '1' });
        onChange(list);
    }
    onDel = ({ target }) => {
        const { idx } = target.closest('a').dataset;
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(+idx, 1);
        onChange(list);
    }
    render() {
        const { treeData } = this.state;
        const { value } = this.props;
        return (
            <div className={css.multiGiftBox}>
                {
                    value.map((x, i)=>{
                        return (
                            <div key={x.id} className={css.giftBox}>
                                <em>礼品{i+1}</em>
                                { i>0 &&
                                   <a data-idx={i} href={href} onClick={this.onDel}>
                                        <Icon type="close-circle" />
                                    </a>
                                }
                                <Gift
                                    idx={i}
                                    treeData={treeData}
                                    formData={x}
                                    onChange={this.onChange}
                                />
                            </div>)
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

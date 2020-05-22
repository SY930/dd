import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon } from 'antd'
import css from './style.less';
import { } from './Common';
import Point from './Point';
import Ticket from './Ticket';

const TabPane = Tabs.TabPane;
class Lottery extends Component {
    state = {
        activeKey: '',
    }
    componentDidMount() {
        this.add();
    }
    onChange = (activeKey) => {
        this.setState({ activeKey });
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    add = () => {
        const { value, onChange } = this.props;
        const list = [...value];
        const id = Date.now().toString(36); // 随机不重复ID号
        const poiObj = { isPoint: [], point: '', vipCard: '' };
        const ticObj = { isTicket: [1], type: '1' };
        list.push({ id, ...poiObj, ...ticObj });
        this.setState({ activeKey: id });
        onChange(list)
    }
    remove = (idx) => {
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(+idx, 1);
        onChange(list);
    }
    onChildChange = (params) => {
        const { activeKey } = this.state;
        const { value, onChange } = this.props;
        const list = [...value];
        const idx = value.findIndex(x=>(x.id === activeKey));
        list[idx] = { ...value[idx], ...params };
        onChange(list);
    }
    render() {
        const { activeKey } = this.state;
        const { value, decorator } = this.props;
        if(!value[0]){ return null}
        console.log('lotteryvalue', value);
        const len = value.length;
        const idx = value.findIndex(x=>(x.id === activeKey));
        const { isPoint, point, vipCard } = value[idx];
        const { isTicket, type } = value[idx];
        const formData1 = { isPoint, point, vipCard };
        const formData2 = { isTicket, type };
        return (
                <div className={css.mainBox}>
                    <div className={css.addBox}>
                        <Button type="primary" onClick={this.add}>
                            <Icon type="plus" />添加奖项
                        </Button>
                        <p>最多可添加7项</p>
                    </div>
                    <div>
                        <Tabs
                            hideAdd={1}
                            onChange={this.onChange}
                            activeKey={activeKey}
                            type="editable-card"
                            onEdit={this.onEdit}
                        >
                            {
                                value.map((x, i)=>{
                                    const close = (len === i + 1) && (i > 0);
                                    const name = `奖项${i + 1}`;
                                    return (<TabPane tab={name} key={x.id} closable={close}/>)
                                })
                            }
                        </Tabs>
                        <div>
                            <Point formData={formData1} onChange={this.onChildChange} />
                            <Ticket formData={formData2} onChange={this.onChildChange} />
                        </div>
                    </div>
                </div>

        )
    }
}

export default Lottery

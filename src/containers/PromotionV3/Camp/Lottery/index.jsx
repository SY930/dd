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
        tabList: [],
    }
    componentDidMount() {
        this.add();
    }
    onChange = (activeKey) => {
        this.setState({ activeKey });
    }
    onEdit = (targetKey, action) => {
        console.log('dd', action, targetKey);
        this[action](targetKey);
    }
    add = () => {
        const { tabList } = this.state;
        const list = [...tabList];
        const id = Date.now().toString(36); // 随机不重复ID号
        list.push({ id });
        this.setState({ tabList: list, activeKey: id });
    }
    remove = (idx) => {
        const { tabList } = this.state;
        const list = [...tabList];
        list.splice(+idx, 1);
        this.setState({ tabList: list });
    }
    render() {
        const { activeKey, tabList } = this.state;
        const { value } = this.props;
        const len = tabList.length;
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
                                tabList.map((x, i)=>{
                                    const close = (len === i + 1) && (i > 0);
                                    const name = `奖项${i + 1}`
                                    return (<TabPane tab={name} key={x.id} closable={close}/>)
                                })
                            }
                        </Tabs>
                        <div>
                            <Point />
                            <Ticket />
                        </div>
                    </div>
                </div>

        )
    }
}

export default Lottery

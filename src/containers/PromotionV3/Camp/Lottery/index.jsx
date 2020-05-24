import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon } from 'antd';
import BaseForm from 'components/common/BaseForm';
import css from './style.less';
import { formItemLayout, formKeys, formItems, } from './Common';
import { getCardTypeList } from './AxiosFactory';
import Point from './Point';

const TabPane = Tabs.TabPane;
class Lottery extends Component {
    state = {
        tabKey: '',
        cardList: [],
    }
    componentDidMount() {
        this.add();
        this.getCardType();
    }
    onChange = (tabKey) => {
        this.setState({ tabKey });
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    add = () => {
        const { value, onChange } = this.props;
        if(value[6]) { return; }
        const list = [...value];
        const id = Date.now().toString(36); // 随机不重复ID号
        list.push({ id, giftOdds: '', point: {isPoint: []}, ticket:{isTicket: [1], type: '1'}, });
        this.setState({ tabKey: id });
        onChange(list);
    }

    remove = (tabKey) => {
        console.log('idx', idx);
        const { value, onChange } = this.props;
        const list = [...value];
        const idx = value.findIndex(x=>(x.id === tabKey));
        list.splice(+idx, 1);
        onChange(list);
    }
    /** 得到form */
    getForm = (node) => {
        this.form = node;
    }
    getCardType() {
        getCardTypeList().then(list => {
            this.setState({ cardList: list });
        });
    }
    /** 表单内容变化时的监听 */
    onFormChange = (key, val) => {
        const { tabKey } = this.state;
        const { value, onChange } = this.props;
        const list = [...value];
        const idx = value.findIndex(x=>(x.id === tabKey));
        if(key === 'giftOdds') {
            let count = 0;
            value.forEach(x=>{
                count += +x.giftOdds;
            });
            if(this.form) {
                if(count>100){
                    this.form.setFields({
                        giftOdds: {
                            value: val,
                            errors: ['奖品中奖概率之和应为0.01~100%'],
                        }
                    });
                }
            }
        }
        // 表单重新合并更新
        // point 和ticket 组件数据单独处理
        let newVal = val;
        if(['point','ticket'].includes(key)) {
            const subForm = value[idx][key];
            newVal = { ...subForm, ...val };
        }
        list[idx] = { ...value[idx], [key]: newVal };
        onChange(list);
    }
    resetFormItems() {
        const { cardList } = this.state;
        const { point, ...others } = formItems;
        const render = d => d()(<Point cardList={cardList} />);
        return {
            ...others,
            point: { ...point, render },
        }
    }
    render() {
        const { tabKey } = this.state;
        const { value } = this.props;
        if(!tabKey){ return null}
        const newFormItems = this.resetFormItems();
        const len = value.length;
        const idx = value.findIndex(x=>(x.id === tabKey));
        const formData = value[idx];
        console.log('formData', formData);
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
                            activeKey={tabKey}
                            type="editable-card"
                            onEdit={this.onEdit}
                        >
                            {value.map((x, i)=>{
                                const close = (len === i + 1) && (i > 0);
                                const name = `奖项${i + 1}`;
                                return (<TabPane tab={name} key={x.id} closable={close}>
                                    <BaseForm
                                        getForm={this.getForm}
                                        formItems={newFormItems}
                                        formKeys={formKeys}
                                        onChange={this.onFormChange}
                                        formData={formData || {}}
                                        formItemLayout={formItemLayout}
                                    />
                                </TabPane>)
                            })}
                        </Tabs>
                        <div>

                        </div>
                    </div>
                </div>

        )
    }
}

export default Lottery

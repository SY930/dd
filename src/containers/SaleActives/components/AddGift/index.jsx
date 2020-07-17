/**
 * 设置单个礼品，多个礼品参考下单抽抽乐的
 */
import React, { PureComponent as Component } from 'react';
import { Button, Icon } from 'antd'
import css from './style.less';
import Gift from './Gift';
// import { getCardList } from './AxiosFactory';
const href = 'javascript:;';
class MutliGift extends Component {

    state = {
        treeData: [],
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'createActiveCom/couponService_getSortedCouponBoardList'
        }).then(res => {
            if(res) {
                this.setState({treeData: res})
            }
        })


    }

    onChange = (params, form) => {
        console.log('idx',params,form)
        if(params.giftID) {
            this.props.dispatch({
                type: 'createActiveCom/couponService_getBoards',
                payload: {
                    giftItemID: params.giftID
                }
            })
        }
        // 保存form,验证的时候使用
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                giftForm: form
            }
        })
        this.props.onChange(params)
    }
    render() {
        const { treeData } = this.state;
        const { value,form } = this.props;
        return (
            <div className={css.multiGiftBox}>
                {/* {
                    Array.isArray(value) && value.map((x, i)=>{
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
                } */}

                {
                    <div   className={css.giftBox}>
                    <em>礼品</em>
                        <Gift
                            treeData={treeData}
                            formData={value}
                            onChange={this.onChange}
                        />
                    </div>
                }
                {/* <Button onClick={this.onAdd}>
                    <Icon type="plus" />点击添加礼品
                </Button> */}
            </div>
        )
    }
}

export default MutliGift

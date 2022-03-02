/*
 * @Author: dangxiaorun
 * @Date: 2022-02-22 11:56:09
 * @LastEditors: dangxiaorun
 * @LastEditTime: 2022-02-25 15:38:28
 * @Description: file content
 */
import React, {Component} from 'react';
import Sortable from 'sortablejs';
import styles from './sortableTable.less'
import drag from './assets/drag.png'

let sortable = null;
export default class SortableTable extends Component {
    state = {
        sortableDom: true, //为了解决sortable插件的排序错误
    }
    componentDidMount() {
        this.draftSort()
    }
    //拖拽初始化及逻辑
    draftSort = () => {
        const {
            handleReSort
        } = this.props
        const _this = this;
        let el = document.getElementById('drag-items');
        sortable = Sortable.create(el, {
            animation: 500,
            handle: ".move",
            draggable: ".draggable",
            onEnd: function (evt) {
                var arr = sortable.toArray();
                handleReSort && handleReSort(arr)
                // 以下是对sortablejs出现的错误进行的纠正，因为插件出现了bug，重新排序后的顺序出现了问题，之后用别的插件进行替代。
                _this.setState({
                    sortableDom: false
                }, () => {
                    _this.setState({
                        sortableDom: true
                    }, () => {
                        _this.draftSort()
                    })
                });
                return false
            }
        });
    }
    render() {
        const {
            columns = [],
            dataSource = []
        } = this.props
        const {
            sortableDom
        } = this.state
        return (
                sortableDom &&  <table className={styles.tableWarp}>
                <thead data-id='thead'>
                    <tr>
                        <td style={{ width: 100 }}>
                            序号
                        </td>
                        {
                            columns.map((item, index) => {
                                return <td style={{ width: item.width }}>{item.title}</td>
                            })
                        }
                    </tr>
                </thead>
                <tbody id='drag-items'>
                    {dataSource.length > 0 ?
                        dataSource.map((item, index) => {
                            return <tr className={'draggable'} data-id={index} data-index={index}>
                                {
                                    <td style={{ width: 100 }}>
                                        {index + 1}
                                        <span style={{ cursor: 'move', color: '#38b99e' }} className='move'>
                                            <img className={styles.backgoundImg} style={{width: 18, marginLeft: 3}} src={drag}></img>按住拖动
                                        </span>
                                    </td>
                                }
                                {
                                    columns.map((every, i) => {
                                        return <td style={{ width: item.width }}>
                                            {item && every.render && every.render(item[every.key], item, index)}
                                        </td>
                                    })
                                }
                            </tr>
                        })
                        :
                        <tr><td colSpan='10' style={{ textAlign: 'center' }}>暂无数据</td></tr>
                    }
                </tbody>
            </table>     
        )
    }
}
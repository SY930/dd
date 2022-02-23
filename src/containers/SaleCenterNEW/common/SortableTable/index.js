/*
 * @Author: dangxiaorun
 * @Date: 2022-02-22 11:56:09
 * @LastEditors: dangxiaorun
 * @LastEditTime: 2022-02-23 11:20:08
 * @Description: file content
 */
import React, {Component} from 'react';
import Sortable from 'sortablejs';
import styles from './sortableTable.less'
import drag from './assets/drag.png'

let sortable = null;
export default class SortableTable extends Component {

    componentDidMount() {
        this.draftSort()
    }
    //拖拽初始化及逻辑
    draftSort = () => {
        const {
            handleReSort
        } = this.props
        let el = document.getElementById('drag-items');
        sortable = Sortable.create(el, {
            animation: 500,
            handle: ".move",
            draggable: ".draggable",
            onEnd: function (evt) {
                var arr = sortable.toArray();
                handleReSort && handleReSort(arr)
                return false
            }
        });
    }
    render() {
        const {
            columns = [],
            dataSource = []
        } = this.props
        return (
            <table>
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
                <tbody data-key={Math.random()} id='drag-items'>
                    {dataSource.length > 0 ?
                        dataSource.map((item, index) => {
                            return <tr className={'draggable'} data-id={index} data-index={index} key={Math.random()}>
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
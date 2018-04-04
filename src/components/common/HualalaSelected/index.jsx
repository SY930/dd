/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-05T17:09:14+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: index.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T11:06:59+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 *
 * defaults  onChange fn , onClear fn , value , selectdTitle, itemName
 *
 */
import React from 'react';
import styles from './treeSelect.less';

export default class HualalaSelected extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        }

        this.onChange = this.onChange.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    onChange(index) {
        const value = this.state.data[index];
        this.props.onChange && this.props.onChange(value);
    }
    onClear() {
        this.props.onClear && this.props.onClear();
    }

    componentDidMount() {
        this.setState({
            data: Array.from(this.props.value) || [],
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                data: Array.from(nextProps.value),
            })
        }
    }

    render() {
        const { itemName, itemID } = this.state;
        return (
            <div className={styles.treeSelectFooter}>
                <div className={styles.SelectedLi}>
                    <div className={styles.SelectedLiT}>
                        <span>{this.props.selectdTitle}</span>（单击移除）</div>
                    <ul className={styles.SelectedLiB} style={{ height: 200 }}>
                        {this.state.data.map((shopEntity, index) => {
                            return (
                                <li
                                    key={index}
                                    onClick={() => {
                                        this.onChange(index);
                                    }}
                                >
                                    {this.props.itemNameJoinCatName ?
                                        `${shopEntity[this.props.itemNameJoinCatName] ? shopEntity[this.props.itemNameJoinCatName] + '---' : ''}${shopEntity[this.props.itemName]}` :
                                        shopEntity[this.props.itemName]}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div onClick={this.onClear} className={styles.Tclear}>清空</div>
            </div>
        );
    }
}

/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-01T17:41:04+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: index.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T15:03:44+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import styles from './treeSelect.less';
import { Row, Col } from 'antd';

/**
 * HualalaTreeSelect definition
 * @Property {String|[String]} value : To set the current selected treeNode(s) or items, default it's set null
 */


class HualalaTreeSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [], //   [{entity}]
            selections: new Set(), // [{entity}], most time, it's the id of entity
            currentSelections: [], // [value], currentSelections is the entity id array of options which is selected and stored in the selections
        }
    }

    constructTreeData() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps() {

    }

    render() {
        const childComponents = React.Children.toArray(this.props.children);

        const searchComponent = childComponents[0];
        const treeComponent = childComponents[1];
        const listComponent = childComponents[2];
        const displayComponent = childComponents[3];


        return (
            <div className={styles.treeSelectMain}>
                {
                    React.cloneElement(searchComponent)
                }
                <div className={styles.treeSelectBody}>
                    <Row>
                        <Col span={8}>
                            <div className={styles.SelectLevel1}>
                                <div className={styles.SelectTit}>
                                    {this.props.level1Title}
                                </div>
                                {
                                    React.cloneElement(treeComponent)
                                }
                            </div>
                        </Col>
                        {
                            React.cloneElement(listComponent)
                        }

                    </Row>
                </div>

                <div className={styles.treeSelectFooter}>
                    {
                        React.cloneElement(displayComponent, {

                        })
                    }
                </div>
            </div>
        )
    }
}

export default HualalaTreeSelect;

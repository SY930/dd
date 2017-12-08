/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-10T11:09:12+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: index.jsx
* @Last modified by:   Terrence
* @Last modified time: 2017-03-10T11:21:20+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Table} from 'antd';

class PromotionMutex extends React.Component {
    render() {

        const dataSource = [
            {
                key: '1',
                name: 'Mike',
                age: 32,
                address: '10 Downing Street'
            }, {
                key: '2',
                name: 'John',
                age: 42,
                address: '10 Downing Street'
            }
        ];

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: 'Age',
                dataIndex: 'age',
                key: 'age'
            }, {
                title: 'Address',
                dataIndex: 'address',
                key: 'address'
            }
        ];
        return (<Table dataSource={dataSource} columns={columns}/>);
    }
}

let mapStateToProps = (state) => {
    return {};
};

let mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PromotionMutex);

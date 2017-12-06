/**
 * Created by yangke on 2016/12/21.
* @Author: xf
* @Date:   2017-01-23T13:49:32+08:00
* @Filename: index.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-05T10:58:20+08:00
* @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
*/

import React from 'react';
import NewActivity from './NewActivity';

class SaleCenter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div >
                <NewActivity />
            </div>
        );
    }
}

export default SaleCenter;

/**
 */
import React from 'react';
import { Form, Input, Select, Button } from 'antd';

class EmptyPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
     
        return (
            <div style={{textAlign: 'center', paddingTop: '150px'}}>
                <img src={'http://res.hualala.com/basicdoc/699f8bc5-d9b1-4aea-a6ef-8b286028333a.png'} alt="" />
                <p style={{margin: '15px auto', color: 'rgb(153, 153, 153)'}}>集团未授权该功能，请联系商务开通</p>
            </div>
        );
    }
}

export default EmptyPage;

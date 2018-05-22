import React from 'react';
import registerPage from '../../index';
import { OLD_NEW_SALE_CENTER } from '../../constants/entryCodes';
import ThreeStepsValidator from "./ThreeStepsValidator";
import { Row, Col, Button } from 'antd';

@registerPage([OLD_NEW_SALE_CENTER], {
})
class CrmDataValidator extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div >
                <Row className="layoutsContainer">
                    <Col span={24} className="layoutsHeader">
                        <div className="layoutsTool">
                            <div className="layoutsToolLeft">
                                <h1>会员数据变动校验</h1>
                            </div>
                            <div className="layoutsToolRight">
                                <Button type="ghost" style={{width: '120px'}}>
                                    校验记录
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24} className="layoutsLineBlock"></Col>
                    <Col span={24} className="layoutsContent">
                        <ThreeStepsValidator/>
                    </Col>
                </Row>

            </div>
        );
    }
}

export default CrmDataValidator;

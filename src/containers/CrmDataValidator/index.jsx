import React from 'react';
import registerPage from '../../index';
import { OLD_NEW_SALE_CENTER } from '../../constants/entryCodes';
import ThreeStepsValidator from "./ThreeStepsValidator";
import { Row, Col } from 'antd';
import { saleCenter } from '../../redux/reducer/saleCenter/saleCenter.reducer';

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

import React from 'react';
import registerPage from '../../index';
import { CRM_DATA_VALIDATOR } from '../../constants/entryCodes';
import ThreeStepsValidator from "./ThreeStepsValidator";
import { Row, Col, Button } from 'antd';

@registerPage([CRM_DATA_VALIDATOR], {
})
class CrmDataValidator extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div >
                <ThreeStepsValidator/>
            </div>
        );
    }
}

export default CrmDataValidator;

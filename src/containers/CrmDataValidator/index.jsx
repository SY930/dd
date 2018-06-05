import React from 'react';
import registerPage from '../../index';
import { NEW_SPECIAL } from '../../constants/entryCodes';
import ThreeStepsValidator from "./ThreeStepsValidator";
import { Row, Col, Button } from 'antd';

@registerPage([NEW_SPECIAL], {
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

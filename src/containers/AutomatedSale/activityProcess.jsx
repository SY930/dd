import React from 'react';
import registerPage from '../../../index';
import {  SALE_AUTOMATED_ACTIVITY_PROCESS } from '../../constants/entryCodes';

@registerPage(SALE_AUTOMATED_ACTIVITY_PROCESS, {})
export default class AutomatedActivityProcess extends React.Component {
  render() {
    const { MicroAppLoader } = this.props;
    
    return (
        <div style={{width: '100%', height: '100%'}}>
            <MicroAppLoader 
                name='bc/approval-flow-manager'
                props={{
                    appFullName: 'ui-free?uicode=activity-process',
                }}
            />
        </div>
    );
  }
}

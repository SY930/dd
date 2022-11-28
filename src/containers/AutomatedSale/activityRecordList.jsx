import React from 'react';
import registerPage from '../../../index';
import { SALE_AUTOMATED_ACTIVITY_RECORD_LIST } from '../../constants/entryCodes';

@registerPage(SALE_AUTOMATED_ACTIVITY_RECORD_LIST, {})
export default class AutomatedActivityRecordList extends React.Component {
  render() {
    const { MicroAppLoader } = this.props;
    
    return (
        <div style={{width: '100%', height: '100%'}}>
            <MicroAppLoader 
                name='bc/approval-flow-manager'
                props={{
                    appFullName: 'ui-list?uicode=activity-record-list',
                }}
            />
        </div>
    );
  }
}

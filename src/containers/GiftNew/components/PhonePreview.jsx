import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';

class PhonePreview extends Component {

    render() {
        return (
            <div className={styles.phonePreviewContainer} >
                <div className={styles.arrow}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PhonePreview)

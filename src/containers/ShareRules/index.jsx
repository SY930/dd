import React, {Component} from 'react';
import {connect} from 'react-redux';
import registerPage from '../../../index';
import {SHARE_RULES} from "../../constants/entryCodes";

@registerPage([SHARE_RULES], {
})
@connect(mapStateToProps, mapDispatchToProps)
class ShareRules extends Component {

    render() {
        return (
            <div>

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

export default ShareRules

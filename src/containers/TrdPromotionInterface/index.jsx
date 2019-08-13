import React from 'react';
import registerPage from '../../index';
import { TRD_PROMOTION_INTERFACE } from '../../constants/entryCodes';
import TrdMember from './TrdMember';

@registerPage(TRD_PROMOTION_INTERFACE)
export default class TrdPromotionInterface extends React.Component {
    render() {
        return (
            <div>
                <TrdMember />
            </div>
        );
    }
}
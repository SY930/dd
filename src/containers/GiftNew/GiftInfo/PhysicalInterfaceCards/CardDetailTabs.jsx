import React from 'react';
import { Tabs } from 'antd';
import styles from '../GiftInfo.less';
import { CARD_DETAIL_TABS } from './DetailCommon';
import CardDetailTable from './CardDetailTable';

const TabPane = Tabs.TabPane;

export default class CardDetailTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'openCard',
            cardType: 'pCard'
        }
    }

    componentDidMount() {
        const { templateType } = this.props.item;
        this.setState({
            cardType: templateType === 'A' ? 'eCard' : 'pCard',
            activeKey: templateType === 'A' ? 'cardSend' : 'openCard'
        })
    }

    onChange(activeKey) {
        this.setState({ activeKey });
    }


    render() {
        const { item, groupID, upDateParentState } = this.props;
        const { activeKey, cardType } = this.state;
        return (
            <div className={styles.giftDetailModalTabs}>
                <Tabs
                    className="tabsStyles"
                    onChange={activeKey => this.onChange(activeKey)}
                    activeKey={activeKey}
                >
                    {
                        CARD_DETAIL_TABS[cardType].map(({ tab, key }, index) => {
                            return (
                                <TabPane tab={tab} key={key}>
                                    <CardDetailTable tabKey={key} groupID={groupID} item={item} upDateParentState={upDateParentState} />
                                </TabPane>
                            )
                        })
                    }
                </Tabs>
            </div>
        )
    }
}


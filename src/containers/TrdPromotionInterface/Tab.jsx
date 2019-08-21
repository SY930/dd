import React from 'react';
import { Tabs } from 'antd';
import classnames from 'classnames';
import styles from './trdCrm.less';
import MicroneMemberSet from './MicroneMemberSet';

const TabPane = Tabs.TabPane;

const MicroneMemberTabs = ({ tableHeight, contentHeight, isProfessionalTheme }) => {
    const TabsConfig = [
        { title: '微盟', key: 'microneMemberSet', component: MicroneMemberSet },
    ];
    const buttonIconWrapper = classnames({
        [`${styles.recommendTabs}`]: true,
        [`${styles.recommendTabsPro}`]: isProfessionalTheme,
    })
    return (
        <Tabs className={`${buttonIconWrapper} tabsStyles`}>
            {
                TabsConfig.map((tab) => {
                    const ChildTab = tab.component;
                    return (<TabPane tab={tab.title} key={tab.key}>
                        <ChildTab
                            tabType={tab.key}
                            tableHeight={tableHeight}
                            contentHeight={contentHeight}
                        />
                    </TabPane>)
                })
            }
        </Tabs>)
}

export default MicroneMemberTabs;

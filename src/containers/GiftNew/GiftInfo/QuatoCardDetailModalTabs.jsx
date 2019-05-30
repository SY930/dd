import { connect } from 'react-redux';
import React from 'react';
import { Tabs } from 'antd';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont';
import styles from './GiftInfo.less';
import SendCard from './SendCard';
import QuotaCardBatchSold from './QuatoCardBatchSold';
import GenerateBatchQRCodes from '../../GiftNew/components/GenerateBatchQRCodes';
import {
    UpdateTabKey,
    FetchQuotaCardBatchNo,
} from '../_action';

const TabPane = Tabs.TabPane;

class QuatoCardDetailModalTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'send',
            formData: {},
        }
    }

    onChange(activeKey, batchNO) {
        const formData = {};
        if (batchNO !== void (0)) {
            formData.batchNO = batchNO;
        }
        const { UpdateTabKey } = this.props;
        if (activeKey === 'batchQRCode') {
            this.props.fetchQuotaCardBatchNo({giftItemID: this.props.data.giftItemID})
        }
        UpdateTabKey({
            key: activeKey,
        });
        this.setState({ activeKey, formData });
    }

    componentWillReceiveProps(nextProps) {
        // this.setState({activeKey:'send'});
        const { tabKey } = nextProps;
        this.setState({
            activeKey: tabKey,
        })
    }

    render() {
        const tabs = [
            { label: '发卡', key: 'send' },
            { label: '已制卡明细', key: 'made' },
            { label: '卡汇总', key: 'sum' },
            { label: '批量售卖', key: 'batchSold' },
            { label: '批量生成二维码', key: 'batchQRCode' },
        ];
        const { data } = this.props;
        const { activeKey: activeK, formData } = this.state;
        return (
            <div className={styles.giftDetailModalTabs} key={+new Date() + Math.random()}>
                <Tabs
                    className="tabsStyles"
                    onChange={activeKey => this.onChange(activeKey)}
                    activeKey={activeK}
                >
                    {
                        tabs.map((tab, index) => {
                            if (tab.key === 'batchSold') {
                                return (<TabPane tab={tab.label} key={tab.key}>
                                    <QuotaCardBatchSold data={data} />
                                </TabPane>)
                            }
                            if (tab.key === 'batchQRCode') {
                                return (
                                    <TabPane tab={tab.label} key={tab.key}>
                                        <GenerateBatchQRCodes
                                            data={data}
                                            giftItemID={data.giftItemID}
                                        />
                                    </TabPane>
                                )
                            }
                            return (<TabPane tab={tab.label} key={tab.key}>
                                <SendCard
                                    formData={formData}
                                    _key={tab.key}
                                    // onChange={(activeKey,batchNO)=>this.onChange(activeKey,batchNO)}
                                    data={data}
                                />
                            </TabPane>)
                        })
                    }
                </Tabs>
            </div>
        )
    }
}

export class PWDSafe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            safe: false,
        }
    }

    handleSafe() {
        const { safe } = this.state;
        const newSafe = !safe;
        this.setState({ safe: newSafe });
    }

    render() {
        const { value } = this.props;
        const { safe } = this.state;
        return (
            <div onClick={() => this.handleSafe()}>
                {
                    safe
                        ? <a href="javaScript:;">{value && value}<Iconlist className="eye-blue" iconName={'可视'} /></a>
                        : <a href="javaScript:;">{value && value.replace(/\d/g, '*')}<Iconlist
                            className="eye-blue"
                            iconName={'不可视'}
                        /></a>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        tabKey: state.sale_giftInfoNew.get('tabKey'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateTabKey: opts => dispatch(UpdateTabKey(opts)),
        fetchQuotaCardBatchNo: opts => dispatch(FetchQuotaCardBatchNo(opts)),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuatoCardDetailModalTabs);

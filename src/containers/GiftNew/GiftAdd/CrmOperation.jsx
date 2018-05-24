import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Row, Col} from 'antd';
import styles from './Crm.less';
import Cfg from '../../../constants/CrmOperationCfg_dkl';
import SearchModal from './SearchModal';
import CrmOperationDetailModal from './CrmOperationDetailModal';
import {
    UpdateSearchModalVisible,
    UpdateDetailModalVisible,
} from '../../../redux/actions/saleCenterNEW/crmOperation.action';

class CrmOperation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchModalVisible: false,
            detailModalVisible: false,
            // baseInfoData: {},
            shopsData: [],
            tableHeight: '100%',
            contentHeight: '100%',
        }
    }

    handleOnClick = (e, type) => {
        const { UpdateSearchModalVisible, UpdateDetailModalVisible} = this.props;
        //   量充，量制，批量延期
        if (type == 'batchRecharge' || type == 'batchMake' || type == 'batchPostpone') {
            this.setState({
                type,
                // detailModalVisible: true,
            });
            UpdateDetailModalVisible({ visible: true});
        } else {
            this.setState({
                type,
                // searchModalVisible: true,
            });
            UpdateSearchModalVisible({ visible: true });
        }
    }

    render() {

        const searchModalProps = {
            // visible: this.state.searchModalVisible,
            type: this.state.type,
        };
        const detailModalProps = {
            // visible: this.state.detailModalVisible,
            type: this.state.type,
            // baseInfoData: this.state.baseInfoData,
            // shopsData: this.state.shopsData,
            // uuid: this.state.uuid || '',
            transWay: 'false',

            // callbackVisible: {(visible) => {this.setState({ visible })}}
        };
        //console.log('Cfg',Cfg)
        return (
            <Row className="layoutsContainer">
                <Col span={24} className="layoutsHeader">
                    <div className="layoutsTool">
                        <div className="layoutsToolLeft">
                            <h1>会员卡操作</h1>
                        </div>
                    </div>
                </Col>
                <Col span={24} className="layoutsLineBlock"></Col>
                <Col span={24} className={[styles.crmOperationContentContainer, 'layoutsContent'].join(' ')}>
                    <ul className={styles.CrmBodyList}>
                        {Cfg.operationTypeCfg.map((item, index) => {
                            return (
                                <li key={'title' + index} onClick={e => this.handleOnClick(e, item.type)}>
                                    <CrmLogo key={'title' + index} describe={item.describe}
                                             index={index}>{item.name}</CrmLogo>
                                </li>
                            )
                        })}
                    </ul>
                </Col>
                <Col span={24}>
                    <SearchModal { ...searchModalProps }
                    />
                </Col>
                <Col span={24}>
                    <CrmOperationDetailModal { ...detailModalProps }

                    />
                </Col>
            </Row>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateSearchModalVisible: (opts) => dispatch(UpdateSearchModalVisible(opts)),
        UpdateDetailModalVisible: (opts) => dispatch(UpdateDetailModalVisible(opts)),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(CrmOperation);

export const CrmLogo = ({children, describe, index, ...props}) => (
    <div className={styles[`cardWrap_${index}`]}>
        {props.tags ? (<div className={styles.tagContainer}>
                            {props.tags.slice().reverse().map(tag => {
                                return <div className={styles.cardTag} key={tag}>{tag}</div>
                            })}
                       </div>) : null
        }
        <p className={styles.title}>{children}</p>
        <p className={styles.describe}>{describe}</p>
    </div>
)

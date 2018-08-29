import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    saleCenterCheckExist,
    saleCenterResetDetailInfoAC as saleCenterResetSpecialDetailInfoAC,
    saleCenterSetSpecialBasicInfoAC
} from "../../redux/actions/saleCenterNEW/specialPromotion.action";
import {
    Modal,
} from 'antd';
import {resetOccupiedWeChatInfo} from "../../redux/actions/saleCenterNEW/queryWeixinAccounts.action";
import {toggleIsUpdateAC} from "../../redux/actions/saleCenterNEW/myActivities.action";
import SpecialActivityMain from '../SpecialPromotionNEW/activityMain';
import BasicActivityMain from '../SaleCenterNEW/activityMain';
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
    saleCenterResetDetailInfoAC as saleCenterResetBasicDetailInfoAC
} from "../../redux/actions/saleCenterNEW/promotionDetailInfo.action";
import {
    saleCenterResetBasicInfoAC,
    saleCenterSetBasicInfoAC
} from "../../redux/actions/saleCenterNEW/promotionBasicInfo.action";
import {saleCenterResetScopeInfoAC} from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import styles from '../GiftNew/GiftAdd/Crm.less';
import NewPromotionCard from "./NewPromotionCard";

class BasePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            basicModalVisible: false,
            basicIndex: 0,
            specialModalVisible: false,
            specialIndex: 0,
            contentHeight: '782',
        };
        this.onWindowResize = this.onWindowResize.bind(this);
        this.handleNewPromotionCardClick = this.handleNewPromotionCardClick.bind(this);
    }

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }
    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').offsetHeight - 95;
        this.setState({ contentHeight });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    setBasicModalVisible(isVisible) {
        this.setState({ isVisible });
        if (!isVisible) {
            this.props.saleCenterResetBasicBasicInfo();
            this.props.saleCenterResetBasicScopeInfo();
            this.props.saleCenterResetBasicDetailInfo();
        }
    }

    setSpecialModalVisible(isVisible) {
        this.setState({ isVisible });
        if (!isVisible) {
            this.props.saleCenterResetSpecailDetailInfo();
        }
    }

    handleNewPromotionCardClick() {
        console.log('hahahoho');
    }

    renderSpecialPromotionModal() {
        const promotionType = this.props.saleCenter.get('characteristicCategories').toJS()[this.state.specialIndex].title;
        return (
            <Modal
                wrapClassName={'progressBarModal'}
                title={`创建${promotionType}活动`}
                maskClosable={false}
                footer={false}
                style={{
                    top: 20,
                }}
                width="924px"
                visible={this.state.specialModalVisible}
                onOk={() => this.setSpecialModalVisible(false)}
                onCancel={() => this.setSpecialModalVisible(false)}
            >
                {this.state.specialModalVisible ? <SpecialActivityMain
                    index={this.state.specialIndex}
                    isNew={true}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.setSpecialModalVisible(false);
                        }
                    }}
                /> : null}
            </Modal>
        );
    }

    renderBasicPromotionModal() {
        const promotionType = this.props.saleCenter.get('activityCategories').toJS()[this.state.basicIndex].title;
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={(promotionType || '').endsWith('活动') ? `创建${promotionType}` : `创建${promotionType}活动`}
                maskClosable={false}
                footer={false}
                style={{
                    top: 20,
                }}
                width="924px"
                visible={this.state.basicModalVisible}
                onOk={() => this.setBasicModalVisible(false)}
                onCancel={() => this.setBasicModalVisible(false)}
            >
                { this.state.basicModalVisible && <BasicActivityMain
                    index={this.state.basicIndex}
                    isNew={true}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.setBasicModalVisible(false)
                        }
                    }}
                />}
            </Modal>
        );
    }

    render() {
        return (
            <div style={{
                backgroundColor: '#F3F3F3',
                height: '100%'
            }}>
                <div className={styles.pageHeader} >
                    <div className={styles.pageHeaderTitle}>
                        {this.props.categoryTitle}
                    </div>
                    <div className={styles.placeholder}/>
                </div>
                <div
                    className={styles.pageContent}
                    style={{
                        height: this.state.contentHeight,
                        padding: '20px',
                    }}
                >
                    {this.props.promotions.map((item, index) => (
                        <NewPromotionCard
                            key={item.key}
                            promotionEntity={item}
                            onClick={this.handleNewPromotionCardClick}
                            index={index}
                        />
                    ))}
                </div>
                {this.renderBasicPromotionModal()}
                {this.renderSpecialPromotionModal()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        saleCenter: state.sale_saleCenter_NEW,
        user: state.user.toJS(),
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // 特色营销actions
        setSpecialPromotionType: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        saleCenterResetSpecailDetailInfo: (opts) => {
            dispatch(saleCenterResetSpecialDetailInfoAC(opts));
            dispatch(resetOccupiedWeChatInfo());
        },
        saleCenterCheckSpecialExist: (opts) => {
            dispatch(saleCenterCheckExist(opts));
        },
        toggleIsSpecialUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        // 基础营销actions
        setBasicPromotionType: (opts) => {
            dispatch(saleCenterSetBasicInfoAC(opts));
        },
        saleCenterResetBasicBasicInfo: (opts) => {
            dispatch(saleCenterResetBasicInfoAC(opts));
        },
        saleCenterResetBasicScopeInfo: (opts) => {
            dispatch(saleCenterResetScopeInfoAC(opts));
        },
        saleCenterResetBasicDetailInfo: (opts) => {
            dispatch(saleCenterResetBasicDetailInfoAC(opts));
        },
        toggleIsBasicUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },
        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BasePage)

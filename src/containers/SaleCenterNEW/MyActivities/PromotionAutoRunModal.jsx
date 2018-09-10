import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Modal,
    Button,
    Tooltip,
    Spin,

} from 'antd';

class PromotionAutoRunModal extends Component {

    constructor(props) {
        super(props);
    }

    renderInnerSelectorModal() {
        return (
            <div>
                placeholder
            </div>
        );
    }

    render() {
        const {
            isVisible,
            isLoading,
            hasError
        } = this.props;
        return (
            <Modal
                visible={isVisible}
                footer={false}
                title={'活动执行设置'}
                width="924px"
                height="569px"
                maskClosable={false}
            >
                <Spin spinning={isLoading}>
                    {
                        hasError ? (
                            <div>

                            </div>
                        ) : (
                            <div>

                            </div>
                        )
                    }
                </Spin>
                {/*this.renderInnerSelectorModal()*/}
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        isVisible: state.sale_promotionAutoRunState.get('isModalVisible'),
        isLoading: state.sale_promotionAutoRunState.get('isLoading'),
        hasError: state.sale_promotionAutoRunState.get('hasError'),
        promotionList: state.sale_promotionAutoRunState.get('promotionList'),
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionAutoRunModal)

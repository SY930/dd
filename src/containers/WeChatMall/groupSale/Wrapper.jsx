import React from 'react';
import { connect } from 'react-redux';
import BasicInfo from './BasicInfo';
import SettingInfo from './SettingInfo';
import {message} from 'antd';
import { addSpecialPromotion, updateSpecialPromotion } from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
import {axiosData} from "../../../helpers/util";
class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.handles = []; // store the callback
        const {
            startTime,
            endTime,
            name,
            description,
            tag,
            bannerUrl,
            reservationTime,
            advancedAnnouncingTime,
            userType,
            goodsList
        } = props.previousData || {};
        this.state = {
            loading: false,
            itemID: props.previousData ? props.previousData.itemID : undefined,
            data: {
                startTime,
                endTime,
                name,
                description,
                tag,
                bannerUrl,
                reservationTime,
                advancedAnnouncingTime,
                userType,
                goodsList
            }
        };
        this.steps = [
            {
                title: '基本信息',
                content: (
                    <BasicInfo
                        getSubmitFn={(handles) => {
                            this.handles[0] = handles;
                        }}
                        itemID={this.state.itemID}
                        data={this.state.data}
                        onChange={this.handleDataChange}
                    />),
            },
            {
                title: '活动内容',
                content: (
                    <SettingInfo
                        getSubmitFn={(handles) => {
                            this.handles[1] = handles;
                        }}
                        data={this.state.data}
                        onChange={this.handleDataChange}
                    />
                ),
            },
        ];
    }

    onFinish = (cb) => {
        // 为了便于查找接口信息 不用字符串模板来做url
        const url = this.props.previousData ? '/promotion/extra/extraEventService_updateExtraEvent.ajax' : '/promotion/extra/extraEventService_addExtraEvent.ajax';
        const params = {...this.state.data, extraEventType: 7010, shopID: this.props.user.shopID};
        if (this.props.previousData && this.props.previousData.itemID) {
            params.itemID = this.props.previousData.itemID;
        }
        axiosData(url, params, null, {})
            .then(() => {
                this.setState({
                    loading: false,
                });
                message.success(`活动${this.props.previousData ? '更新' : '创建'}完成`);
                cb && cb();
            }, err => {
                this.setState({
                    loading: false,
                });
            })
    }

    /**
     * @param data: 传递给后端的字段map
     */
    handleDataChange = (data) => {
        this.setState({data: {...this.state.data, ...data}});
    }

    handleNext = (cb, index) => {
        let flag = true;
        if (undefined !== this.handles[index].next && typeof this.handles[index].next === 'function') {
            flag = this.handles[index].next();
        }
        if (flag) {
            cb();
        }
    }

    handlePrev = (cb, index) => {
        let flag = true;
        if (undefined !== this.handles[index].prev && typeof this.handles[index].prev === 'function') {
            flag = this.handles[index].prev();
        }
        if (flag) {
            cb();
        }
    }

    handleCancel = () => {
        this.props.callbacktwo(3);
    }

    handleFinish = (cb, index) => {
        let flag = true;
        if (undefined !== this.handles[index].finish && typeof this.handles[index].finish === 'function') {
            flag = this.handles[index].finish();
        }
        if (flag) {
            this.setState({
                loading: true,
            });
            setTimeout(() => {
                this.onFinish(() => {
                    cb();
                    this.props.callbacktwo(3);
                });
            }, 0);
        }
    }

    render() {
        return (
            <CustomProgressBar
                loading={this.state.loading}
                steps={this.steps}
                callback={(arg) => {
                    this.props.callbacktwo(arg);
                }}
                onNext={this.handleNext}
                onFinish={this.handleFinish}
                onPrev={this.handlePrev}
                onCancel={this.handleCancel}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addSpecialPromotion: (opts) => {
            dispatch(addSpecialPromotion(opts));
        },
        updateSpecialPromotion: (opts) => {
            dispatch(updateSpecialPromotion(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);

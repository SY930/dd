/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-28T10:51:51+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: NewBuyGiveActivity.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-03-28T19:24:47+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import BasicInfo from './BasicInfo';
import RangeInfo from './RangeInfo';
import DetailInfo from './DetailInfo';
// import NewPromotion from '../common/NewPromotion';
import { addSpecialPromotion, updateSpecialPromotion } from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
// import PromotionBasicInfo from '../common/BirthBasicInfo';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
// import SpecialDetailInfo from '../common/SpecialPromotionDetailInfo';

// import StepTwo from './stepTwo';

class NewBirthdayGift extends React.Component {
    constructor(props) {
        super(props);
        this.handles = []; // store the callback
        this.state = {
            loading: false,
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
        this.steps = [

            {
                title: '基本信息',
                content: (<BasicInfo
                    getSubmitFn={(handles) => {
                        this.handles[0] = handles;
                    }}
                />),
            },
            {
                title: '活动范围',
                content: (
                    <RangeInfo
                        getSubmitFn={(handles) => {
                            this.handles[1] = handles;
                        }}
                    />
                ),
            },
            {
                title: '活动内容',
                content: (
                    <DetailInfo
                        getSubmitFn={(handles) => {
                            this.handles[2] = handles;
                        }}
                    />
                ),
            },
        ];
    }

    onFinish(cb) {

    }


    handleNext(cb, index) {
        let flag = true;
        if (undefined !== this.handles[index].next && typeof this.handles[index].next === 'function') {
            flag = this.handles[index].next();
        }
        if (flag) {
            cb();
        }
    }

    handlePrev(cb, index) {
        let flag = true;
        if (undefined !== this.handles[index].prev && typeof this.handles[index].prev === 'function') {
            flag = this.handles[index].prev();
        }
        if (flag) {
            cb();
        }
    }

    handleCancel(cb, index) {
        this.props.callbacktwo(3);
    }

    handleFinish(cb, index) {
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

export default connect(mapStateToProps, mapDispatchToProps)(NewBirthdayGift);

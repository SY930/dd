import React from 'react';
import BasicInfo from './BasicInfo';
import ScopeInfo from './ScopeInfo';
import SettingInfo from './SettingInfo';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.handles = []; // store the callback
        this.state = {
            itemID: props.previousData ? props.previousData.itemID : undefined,
            data: props.previousData ? {...props.previousData, endTime: `${props.previousData.endTime}`.substring(0, 8)+'000000'} : {},
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
                title: '活动范围',
                content: (
                    <ScopeInfo
                        getSubmitFn={(handles) => {
                            this.handles[1] = handles;
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
                            this.handles[2] = handles;
                        }}
                        data={this.state.data}
                        onChange={this.handleDataChange}
                    />
                ),
            },
        ];
    }

    onFinish = (cb) => {
        this.props.onFinish(cb)({
            ...this.state.data,
            endTime: `${this.state.data.endTime}`.substring(0, 8)+'235959'
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
                loading={this.props.confirmLoading}
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

export default Wrapper;

import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
    Form,
    Select,
    Checkbox,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';

const FormItem = Form.Item;

const SCENES = [
    {
        value: '1',
        label: '个人中心',
    },
    {
        value: '2',
        label: '活动中心',
    },
];

class StepFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.initState(),
        }
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }
    initState() {
        const launchSceneList = this.props.specialPromotionInfo.getIn(['$eventInfo', 'launchSceneList'], Immutable.fromJS([])).toJS();
        if (!launchSceneList.length) {
            return {
                appIDList: [],
                sceneList: [],
            }
        }
        const appIDList = launchSceneList.map(item => item.appID);
        const sceneList = launchSceneList[0].split(',');
        return {
            appIDList,
            sceneList,
        }
    }

    handleSubmit = () => {
        let flag = true;
        let launchSceneList = [];
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            } else {
                const { appIDList, sceneList } = basicValues;
                launchSceneList = appIDList.map(appID => ({
                    appID,
                    sceneType: 1,
                    scenePosition: sceneList.join(','),
                }))
            }
        });

        if (flag) {
            this.props.setSpecialBasicInfo({
                launchSceneList
            });
        }
        return flag;
    }

    render() {
        const { appIDList, sceneList } = this.state;
        const { allWeChatAccountList, form: { getFieldDecorator } } = this.props;
        return (
            <Form>
                <FormItem
                    label="投放场景"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <p>微信公众号</p>
                </FormItem>
                <FormItem
                    label="选择公众号"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('appIDList', {
                        rules: [
                            { required: true, message: '请选择活动展现公众号' },
                        ],
                        initialValue: appIDList,
                    })(
                        <Select
                            placeholder="请选择活动展现公众号"
                            multiple
                            showSearch={true}
                            optionFilterProp="children"
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                allWeChatAccountList.map(({appID, mpName}) => (
                                    <Select.Option
                                        key={appID}
                                        value={appID}
                                    >
                                        {mpName}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    label="选择场景"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('sceneList', {
                        rules: [
                            { required: true, message: '请选择活动展现场景' },
                        ],
                        initialValue: sceneList,
                    })(<Checkbox.Group options={SCENES} />)}
                </FormItem>
            </Form>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    };
};
const mapStateToProps = (state) => {
    return {
        specialPromotionInfo: state.sale_specialPromotion_NEW,
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList').toJS().filter(item => String(item.mpTypeStr) === '21'),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepFour));

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Icon,
    Button,
    Input,
    Select,
    Alert,
} from 'antd';
import registerPage from '../../../index';
import {SHARE_RULES} from "../../constants/entryCodes";
import style from './style.less'
import { share_rules } from '../../redux/reducer/shareRules'
import {
    createOrUpdateCertainShareGroup,
    deleteCertainShareGroup,
    queryShareGroups,
    removeItemFromCertainShareGroup,
    startCreateShareGroup,
    startEditCertainShareGroup,
} from "../../redux/actions/shareRules/index";

@registerPage([SHARE_RULES], {
    share_rules
})
@connect(mapStateToProps, mapDispatchToProps)
export default class ShareRules extends Component {

    componentDidMount() {

    }

    renderHeader() {
        return (
            <div className={style.header}>
                <div className={style.titleArea}>
                    <span className={style.title}>
                        规则设置
                    </span>
                    <Alert style={{color: '#E4843B'}} message="默认所有的活动优惠不共享，如需共享请选择相应的活动创建共享活动组" type="warning" showIcon />
                </div>
                <Button
                    onClick={() => console.log(123)}
                    type="ghost"
                >
                    <Icon
                        type="plus"
                    />
                    新建规则
                </Button>
            </div>
        )
    }

    renderHeaderActions() {
        return (
            <div className={style.headerActions}>
                <span className={style.headerLabel}>
                    活动类型
                </span>

                <Select
                    style={{ width: 160, marginRight: 20 }}
                >
                    <Select.Option
                        value="-"
                    >
                        全部
                    </Select.Option>
                </Select>
                <span className={style.headerLabel}>
                    活动名称
                </span>

                <Input
                    style={{ width: 240, marginRight: 20 }}
                    placeholder="请输入活动名称搜索"
                />
                <Button
                    onClick={() => console.log(123)}
                    type="primary"
                >
                    <Icon
                        type="search"
                    />
                    查询
                </Button>

            </div>
        )
    }

    render() {
        const displayHeaderActions = true;
        const {
            shareGroups
        } = this.props;
        const vanillaShareGroups = [1, 2, 3, 4, 6]// shareGroups.toJS();
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                {
                    displayHeaderActions && this.renderHeaderActions()
                }
                <div
                    style={{
                        height: 15,
                        background: '#F3F3F3'
                    }}
                />
                <div className={style.bodyContainer} style={{ height: `calc(100% - ${ displayHeaderActions ? 123 : 75 }px)` }}>
                    {
                        vanillaShareGroups.map((shareGroup, index) => {
                            return (
                                <div
                                    key={`${index}`}
                                    className={style.shareGroupWrapper}
                                    style={{
                                        width: 'calc(50% - 5px)'
                                    }}
                                >
                                    <div
                                        className={style.shareGroupHeader}
                                    >
                                        <div
                                            className={style.shareGroupTitle}
                                        >
                                            {`营销活动共享组${index + 1}`}
                                        </div>
                                        <div className={style.flexSpacer} />
                                        <Button
                                            type="ghost"
                                            style={{
                                                marginRight: 10
                                            }}
                                        >
                                            <Icon type="edit"/>
                                            编辑
                                        </Button>
                                        <Button
                                            type="ghost"
                                        >
                                            <Icon type="delete"/>
                                            删除
                                        </Button>
                                    </div>
                                    <div className={style.shareGroupBody}>
                                        {
                                            (shareGroup.shareDetails || [1, 2]).map(item => {
                                                return (
                                                    <div className={style.shareGroupItem}>
                                                        <div className={style.typeTag}>
                                                            <span>
                                                                折扣
                                                            </span>
                                                        </div>
                                                        <div className={style.itemTitle}>
                                                            所有菜品8.0折
                                                        </div>
                                                        <div className={style.itemAction}>
                                                            <a>
                                                                删除
                                                            </a>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isQuerying: state.share_rules.get('isQuerying'),
        shareGroups: state.share_rules.get('shareGroups'),
        isCreate: state.share_rules.get('isCreate'),
        isRemoving: state.share_rules.get('isRemoving'),
        isDeleting: state.share_rules.get('isDeleting'),
        searchPromotionType: state.share_rules.get('searchPromotionType'),
        searchPromotionName: state.share_rules.get('searchPromotionName'),
        isEdit: state.share_rules.get('isEdit'),
        share_rules: state.messageTemplateState.get('messageTemplateList'),
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        startCreateShareGroup: opts => dispatch(startCreateShareGroup(opts)),
        startEditCertainShareGroup: opts => dispatch(startEditCertainShareGroup(opts)),
        queryShareGroups: opts => dispatch(queryShareGroups(opts)),
        createOrUpdateCertainShareGroup: opts => dispatch(createOrUpdateCertainShareGroup(opts)),
        deleteCertainShareGroup: opts => dispatch(deleteCertainShareGroup(opts)),
        removeItemFromCertainShareGroup: opts => dispatch(removeItemFromCertainShareGroup(opts)),
    };
}

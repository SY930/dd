/**
 * Created by yangke on 2017/3/21.
 *
 * 富文本编辑器测试
 */
/**/
/**
 * Created by yangke on 2016/12/21.
 * 首页
 */
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Row,
    Modal,
    Button,
    Input,
    Checkbox,
    // Tree,
} from 'antd';
// import {Editor, EditorState} from 'draft-js';

import editorStyles from './editor.less'

if (process.env.__CLIENT__ === true) {
    // var RichTextEditor = require('react-rte');
}
import RichTextEditor from 'react-rte';


/* const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
        {label: 'Normal', style: 'unstyled'},
        {label: 'Heading Large', style: 'header-one'},
        {label: 'Heading Medium', style: 'header-two'},
        {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
    ]
}; */

class MyStatefulEditor extends Component {
    static propTypes = {
        onChange: PropTypes.func,
    };

    constructor(props) {
        super(props);
        if (this.props.value) {
            console.log(this.props.value, '<----------------this.props.value')
            this.state = {
                value: this.state.value.setContentFromString(this.props.value, this.state.format),
            }
        }
    }

    state = {
        format: 'html',
        value: RichTextEditor.createEmptyValue(),
    }

    onChange = (value) => {
        this.setState({ value });
        if (this.props.onChange) {
            // Send the changes up to the parent component as an HTML string.
            // This is here to demonstrate using `.toString()` but in a real app it
            // would be better to avoid generating a string on each change.
            this.props.onChange(
                value.toString('html')
            );
        }
    };

    /**/
    render() {
        const editor = null;


        return (
            <div>
                <RichTextEditor
                    value={this.state.value}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}
module.exports = MyStatefulEditor;

/* class EditorTest extends Component {
    constructor(props) {
        super(props);
        this.count = 0;
        this.homeColorList = ["home-blue","home-brown","home-green","home-yellow"];
        this.state = {
            editerVisible: false,
            indeterminate: true,
            checkAll: false,
        }

        this.state = {editorState: EditorState.createEmpty()};
        this.focus = () => this.editor.focus();
        this.onChange = (editorState) => this.setState({editorState});

        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }
    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }
    clickHandler = ()=>{
        let { testOkActions } = this.props;
        testOkActions.testOk(`click ok ${this.count++}`);
        //console.log("click ok")
    }
    /!*componentWillUpdate = ()=>{
     console.log("Portal rerender");
     }*!/


    render(){

        const {editorState} = this.state;

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }
        return(
            <div className={editorStyles['RichEditorRoot']}>
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
                <div className={className} onClick={this.focus}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        onTab={this.onTab}
                        placeholder="Tell a story..."
                        ref={(editor) => { this.editor = editor; }}
                        spellCheck={true}
                    />
                </div>
            </div>
        )
    }
} */

/* function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}
function mergeProps(stateProps, dispatchProps, ownProps) {
    return {}//Object.assign({}, ownProps, stateProps, dispatchProps);
}
module.exports = connect(
    mapStateToProps,
    mapDispatchToProps,
    //mergeProps,
    //{withRef : true}//使用ref时候 必须设置为true
)(MyStatefulEditor); */


/* // Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={editorStyles[className]} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className={editorStyles["RichEditor-controls"]}>
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className={editorStyles["RichEditor-controls"]}>
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
}; */

/**/

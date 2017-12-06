/**
 * Created by benlong on 2017/7/13.
 * 表单富文本编辑器
 *  input   value
 *  triggerOnchange  editor, html
 */
import React, { Component } from 'react';
import E from 'wangeditor';
import styles from './styles.less';

class MyEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };
    }
    render() {
        return (
            <div className={styles.App}>
                <div ref="editorElem" style={{ textAlign: 'left' }}>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const elem = this.refs.editorElem
        this.editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = (html) => {
            this.triggerChange(html);
        }

        this.editor.customConfig.menus = [
            'head', // 标题
            'bold', // 粗体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            'quote', // 引用
            'emoticon', // 表情
            'image', // 插入图片
            'table', // 表格
            'video', // 插入视频
            'code', // 插入代码
            'undo', // 撤销
            'redo', // 重复
        ]
        this.editor.customConfig.zIndex = 999
        // this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        this.editor.customConfig.uploadImgServer = '/api/supplychain/message/uploadMessageAttachments' // 上传图片到服务器
        this.editor.customConfig.uploadFileName = 'messageAttachments'

        // 限制一次最多上传1 张图片
        this.editor.customConfig.uploadImgMaxLength = 1
        this.editor.customConfig.uploadImgHeaders = {
            'Accept': 'text/x-json',
        }

        this.editor.customConfig.uploadImgHooks = {
            // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
            // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
            customInsert(insertImg, result) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                const url = `http://res.hualala.com/${result.data.messageAttachments[0].attachmentPath}`
                insertImg(url)
                // result 必须是一个 JSON 格式字符串！！！否则报错
            },
        }
        this.editor.create()
        this.init = false;
    }

    triggerChange(value) {
        this.props.onChange && this.props.onChange(value);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== undefined && this.init === false) {
            this.init = true;
            this.editor.txt.html(nextProps.value || '')
        }
    }
}

export default MyEditor;

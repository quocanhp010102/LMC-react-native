import React from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
        <path className="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9" />
    </svg>
)

// Redo button icon component for Quill editor
const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
        <path className="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5" />
    </svg>
)

function undoChange() {
    //@ts-ignore
    this.quill.history.undo()
}
function redoChange() {
    //@ts-ignore
    this.quill.history.redo()
}

const CustomToolbar: React.FC = () => {
    return (
        <div id="toolbar">
            <span className="ql-formats">
                <select className="ql-font">
                    <option value="" selected />
                    <option value="arial">Arial</option>
                    <option value="comic-sans">Comic Sans</option>
                    <option value="courier-new">Courier New</option>
                    <option value="georgia">Georgia</option>
                    <option value="helvetica">Helvetica</option>
                    <option value="lucida">Lucida</option>
                    <option value="times-new-roman">Times New Roman</option>
                </select>
                <select className="ql-size">
                    <option value="">Extra Small</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </select>
            </span>
            <span className="ql-formats">
                <button className="ql-bold" />
                <button className="ql-italic" />
                <button className="ql-underline" />
                <button className="ql-strike" />
            </span>
            <span className="ql-formats">
                <button className="ql-list" value="ordered" />
                <button className="ql-list" value="bullet" />
                <button className="ql-indent" value="-1" />
                <button className="ql-indent" value="+1" />
            </span>
            <span className="ql-formats">
                <button className="ql-script" value="super" />
                <button className="ql-script" value="sub" />
            </span>
            <span className="ql-formats">
                <select className="ql-align" />
                <select className="ql-color" />
                <select className="ql-background" />
            </span>
            <span className="ql-formats">
                <button className="ql-link" />
                {/* <button className="ql-image" />
                <button className="ql-video" /> */}
            </span>
            <span className="ql-formats">
                <button className="ql-clean" />
            </span>
            <span className="ql-formats">
                <button className="ql-undo">
                    <CustomUndo />
                </button>
                <button className="ql-redo">
                    <CustomRedo />
                </button>
            </span>
        </div>
    )
}

const Size = Quill.import('formats/size')
Size.whitelist = ['extra-small', 'small', 'medium', 'large']
Quill.register(Size, true)

const Font = Quill.import('formats/font')
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida', 'times-new-roman']
Quill.register(Font, true)

const modules = {
    toolbar: {
        container: '#toolbar',
        handlers: {
            undo: undoChange,
            redo: redoChange,
        },
    },
}

const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'align',
    'strike',
    'script',
    'blockquote',
    'background',
    'list',
    'bullet',
    'indent',
    'link',
    // 'image',
    'color',
    'code-block',
]

interface TextEditorProps {
    value: string
    onChange: (value: string) => void,
    readOnly?: boolean

}

const TextEditor: React.FC<TextEditorProps> = (props) => {
    return (
        <div className="text-editor">
            <CustomToolbar />
            <ReactQuill
                className="h-full overflow-y-auto text-sm pb-[50px] break-all"
                theme="snow"
                modules={modules}
                formats={formats}
                value={props.value}
                onChange={props.onChange}
                readOnly={props?.readOnly ? props?.readOnly : false}
            />
        </div>
    )
}

export default TextEditor

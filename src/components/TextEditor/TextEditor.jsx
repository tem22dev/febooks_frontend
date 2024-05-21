import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';

const TextEditor = ({ desc, setDesc }) => {
    const handleModelChange = (newContent) => {
        setDesc(newContent);
    };

    return (
        <div style={{ minHeight: 100 }}>
            <FroalaEditor
                model={desc}
                onModelChange={handleModelChange}
                config={{
                    toolbarButtons: [
                        'bold',
                        'italic',
                        'underline',
                        'strikeThrough',
                        // 'subscript',
                        // 'superscript',
                        'fontFamily',
                        'fontSize',
                        'color',
                        'inlineStyle',
                        'paragraphStyle',
                        'paragraphFormat',
                        'align',
                        'formatOL',
                        'formatUL',
                        'outdent',
                        'indent',
                        // 'quote',
                        'insertLink',
                        'insertImage',
                        // 'insertVideo',
                        // 'insertFile',
                        'insertTable',
                        // 'emoticons',
                        'specialCharacters',
                        // 'insertHR',
                        // 'clearFormatting',
                        // 'print',
                        // 'spellChecker',
                        // 'fullscreen',
                        // 'html',
                        'undo',
                        'redo',
                    ],
                    pluginsEnabled: [
                        'align',
                        'charCounter',
                        'codeBeautifier',
                        'codeView',
                        'colors',
                        'draggable',
                        'emoticons',
                        'entities',
                        'file',
                        'fontFamily',
                        'fontSize',
                        'fullscreen',
                        'image',
                        'imageManager',
                        'inlineStyle',
                        'lineBreaker',
                        'link',
                        'lists',
                        'paragraphFormat',
                        'paragraphStyle',
                        'quote',
                        'save',
                        'table',
                        'url',
                        'video',
                        'wordPaste',
                    ],
                }}
            />
            {/* <div>
                <h3>Editor Content:</h3>
                <div dangerouslySetInnerHTML={{ __html: desc }} />
            </div> */}
        </div>
    );
};

export default TextEditor;

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './TextEditor.scss';

const TextEditor = ({ desc, setDesc }) => {
    const editorConfiguration = {
        ckfinder: {
            uploadUrl: '/public/upload',
        },
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'imageUpload',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo',
                // 'fontSize',
                // 'fontColor',
            ],
        },
        language: 'vi',
        image: {
            toolbar: [
                'imageTextAlternative',
                'toggleImageCaption',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
            ],
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
        },
    };

    return (
        <CKEditor
            editor={ClassicEditor}
            config={editorConfiguration}
            data={desc}
            onChange={(event, editor) => {
                const data = editor.getData();
                setDesc(data);
            }}
        />
    );
};

export default TextEditor;

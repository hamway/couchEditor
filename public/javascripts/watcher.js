/**
 * Created by hamway on 02.07.14.
 */

var editor;

function getdoc(value) {
    $.get('/docs', {view: value}, function(code, status, resp){
        editor.setValue(jsl.format.formatJson(resp.responseText));
        editor.setSize($('.CodeMirror').width(), 600);
    });
}

function backup() {
    /*$.post('/docs/backup', function(code,status,resp) {
        //alert('Docs Backuped!!!');
    });*/
}

function initeditor(block){
    editor = CodeMirror.fromTextArea(document.getElementById(block), {
        mode: { name: "application/json", json: true},
        theme: 'ambiance',
        lineNumbers: true
    });
}

$(function(){
    initeditor('editor');
});
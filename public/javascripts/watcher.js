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
    if ($('input[name=backup]').is(':checked')) {
        $.post('/docs/backup', function(code,status,resp) {
            alert('Docs Backuped!!!');
         });
    } else {
        alert('Not supported. Need checked all');
    }

}

function restore() {
    if ($('input[name=restore]').is(':checked')) {
        $.post('/docs/restore', {database: $('input[name=database]').val()}, function (code, status, resp) {
            //alert('Docs Backuped!!!');
        });
    } else {
        alert('Not supported. Need checked all');
    }
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
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

function load() {
    $.get('/docs/load', function(code,status,resp) {
        if(resp.responseJSON) {
            data = resp.responseJSON;
            $('#view-list option').each(function(i,c) {
                if($(c).val() != 0) {
                    $(c).remove();
                }
            })

            $.each(data, function(i,c){
                $('#view-list').append($('<option></option>').attr('value', c).text(c));
            })
        }
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
        if(confirm('Are you sure?')){
            $.post('/docs/restore', {database: $('input[name=database]').val()}, function (code, status, resp) {
                alert('Docs Backuped!!!');
            });
        }
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
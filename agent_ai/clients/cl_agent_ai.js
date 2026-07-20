/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

define([], () => {
    
    function exportExcel() {
    setActionAndSubmit('excel');
    }
    
    function exportPdf() {
    setActionAndSubmit('pdf');
    }

    function sendEmail() {
    setActionAndSubmit('email');
    }

    function setActionAndSubmit(action) {

        let field =
        document.getElementById(
        'custpage_action'
        );

        if (!field) {
        field = document.createElement('input');
        field.type = 'hidden';
        field.name = 'custpage_action';
        field.id = 'custpage_action';
        document.forms[0].appendChild(field);
        }

        field.value = action;

        document.forms[0].submit();
    }

    function pageInit() {
    }

    window.nextPage = function() {

        var pageField =
            document.getElementById('custpage_page');

        pageField.value =
            Number(pageField.value) + 1;

        document.forms[0].submit();
    };

    window.previousPage = function() {

        var pageField =
            document.getElementById('custpage_page');

        var current =
            Number(pageField.value);

        if (current > 1) {

            pageField.value =
                current - 1;

            document.forms[0].submit();

        }
    };

    return {
        pageInit,
        exportExcel,
        exportPdf,
        sendEmail
    };

});
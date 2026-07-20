/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget', '../lib/ai_service', 'N/file', 'N/render', 'N/email','N/runtime'], (serverWidget, aiService, file, render, email, runtime) => {

    const onRequest = (context) => {

    const form = serverWidget.createForm({
        title: 'AI Query Assistant'
    });

    form.clientScriptModulePath ='../clients/cl_agent_ai.js';
    // Question
    form.addFieldGroup({
        id: 'custpage_grp_query',
        label: 'Natural Language Query'
    });

    const question = form.addField({
        id: 'custpage_question',
        type: serverWidget.FieldType.LONGTEXT,
        label: 'Ask a question',
        container: 'custpage_grp_query'
    });

    question.updateDisplaySize({
        height: 6,
        width: 100
    });

    question.defaultValue =
context.request.parameters.custpage_question || '';

    const pageField = form.addField({
    id: 'custpage_page',
    type: serverWidget.FieldType.INTEGER,
    label: 'Page'
    });

    pageField.defaultValue =
        String(
            context.request.parameters.custpage_page || 1
        );

    pageField.updateDisplayType({
        displayType:
            serverWidget.FieldDisplayType.HIDDEN
    });

    const intentField = form.addField({
    id: 'custpage_ai_intent',
    type: serverWidget.FieldType.LONGTEXT,
    label: 'AI Intent'
    });

    intentField.updateDisplayType({
        displayType:
            serverWidget.FieldDisplayType.HIDDEN
    });

    const lastQuestionField = form.addField({
    id: 'custpage_last_question',
    type: serverWidget.FieldType.LONGTEXT,
    label: 'Last Question'
});

lastQuestionField.updateDisplayType({
    displayType: serverWidget.FieldDisplayType.HIDDEN
});

const actionField = form.addField({
    id: 'custpage_action',
    type: serverWidget.FieldType.TEXT,
    label: 'Action'
});

actionField.updateDisplayType({
    displayType:
        serverWidget.FieldDisplayType.HIDDEN
});

intentField.defaultValue =
    context.request.parameters.custpage_ai_intent || '';

lastQuestionField.defaultValue =
    context.request.parameters.custpage_last_question || '';

    form.addSubmitButton({
        label: 'Search'
    });
    form.addButton({
    id: 'custpage_btn_excel',
    label: 'Export Excel',
    functionName: 'exportExcel'
});

form.addButton({
    id: 'custpage_btn_pdf',
    label: 'Export PDF',
    functionName: 'exportPdf'
});

form.addButton({
    id: 'custpage_btn_email',
    label: 'Send Email',
    functionName: 'sendEmail'
});

    // POST
    if (context.request.method === 'POST') {

        const questionText =
            context.request.parameters.custpage_question || '';

        const page =
        Number(
            context.request.parameters.custpage_page || 1
        );

       const lastQuestion =
    context.request.parameters.custpage_last_question || '';

        let existingIntent = '';
        let currentPage = page;

        if (questionText === lastQuestion) {

            existingIntent =
                context.request.parameters.custpage_ai_intent || '';

        } else {

            currentPage = 1;

        }

     
const action =
    context.request.parameters.custpage_action || '';

      let aiResult;

        if (
            action === 'excel' ||
            action === 'pdf' ||
            action === 'email'
        ) {

            aiResult =
                aiService.getAllResults(
                    questionText,
                    existingIntent
                );

        } else {

            aiResult =
                aiService.parseQuestion(
                    questionText,
                    currentPage,
                    existingIntent
                );
        }

        // ===== EXPORTACIONES =====
        
        if (action === 'excel') {
        
        let csv =
        'Document,Date,Customer,Amount,Currency,Status\n';
        
        (aiResult.results || []).forEach(row => {
        
        csv +=
        `"${escapeXml(row.tranid) || ''}",` +
        `"${escapeXml(row.date) || ''}",` +       
        `"${escapeXml(row.entity) || ''}",` +
        `"${escapeXml(row.amount) || ''}",` +
        `"${escapeXml(row.currency) || ''}",` +
        `"${escapeXml(row.status) || ''}"\n`;
        
        });
        
        const csvFile = file.create({
        name: 'AI_Search_Results.csv',
        fileType: file.Type.CSV,
        contents: csv
        });
        
        context.response.writeFile({
        file: csvFile,
        isInline: false
        });
        
        return;
        }
        
        if (action === 'pdf') {
    
        let html = `
        <pdf>
        <body>
        <h2>AI Search Results</h2>
        
        <table border="1" width="100%">
        <tr>
        <th>Document</th>
        <th>Date</th>
        <th>Customer</th>
        <th>Amount</th>
        <th>Currency</th>
        <th>Status</th>
        </tr>
        `;
        
        (aiResult.results || []).forEach(row => {
        
        html += `
        <tr>
        <td>${escapeXml(row.tranid) || ''}</td>
        <td>${escapeXml(row.date) || ''}</td>
        <td>${escapeXml(row.entity) || ''}</td>
        <td>${escapeXml(row.amount) || ''}</td>
        <td>${escapeXml(row.currency) || ''}</td>
        <td>${escapeXml(row.status) || ''}</td>
        </tr>
        `;
        });
        
        html += `
        </table>
        </body>
        </pdf>
        `;
        
        const pdfFile = render.xmlToPdf({
        xmlString: html
        });
        
        context.response.writeFile({
        file: pdfFile,
        isInline: false
        });
        
        return;
        }
        
        if (action === 'email') {
        
        const body =
        (aiResult.results || [])
        .map(r =>
            `${escapeXml(r.tranid) || ''} | ` +
            `${escapeXml(r.date) || ''} | ` +
            `${escapeXml(r.entity) || ''} | ` +
            `${escapeXml(r.amount) || ''} | ` +
            `${escapeXml(r.currency) || ''} | ` +
            `${escapeXml(r.status) || ''}`
        )
        .join('\n');
        
        email.send({
        author: runtime.getCurrentUser().id,
        recipients: runtime.getCurrentUser().email,
        subject: 'AI Search Results',
        body: body
        });
        
        }
        pageField.defaultValue =
    String(aiResult.page);

        intentField.defaultValue =
    aiResult.serializedIntent;

    lastQuestionField.defaultValue =
    questionText;

        // Summary
      form.addFieldGroup({
        id: 'custpage_grp_summary',
        label: 'AI Interpretation'
        });
        
        const summary = form.addField({
        id: 'custpage_summary',
        type: serverWidget.FieldType.INLINEHTML,
        label: ' ',
        container: 'custpage_grp_summary'
        });
        
        summary.defaultValue = `
        <div style="padding:10px;text-align:left;">
        <p><b>Intent:</b> ${aiResult.parsedResponse.intent}</p>
        <p><b>Record Type:</b> ${aiResult.parsedResponse.recordType}</p>
        <p><b>Transaction Type:</b> ${aiResult.parsedResponse.transactionType}</p>
        <p><b>Results Found:</b> ${aiResult.totalRecords}</p>
        <p><b>Page:</b> ${aiResult.page} of ${aiResult.totalPages}</p>
        </div>
        `;

        // ===== NAVEGACION =====
        const navigation = form.addField({
        id: 'custpage_navigation',
        type: serverWidget.FieldType.INLINEHTML,
        label: ' '
        });
       
        navigation.defaultValue = `
        <div style="
            padding:15px;
            text-align:center;
        ">

            <button
                type="button"
                onclick="previousPage()"
                ${aiResult.page === 1 ? 'disabled' : ''}
            >
                ◀ Previous
            </button>

            <span style="
                padding-left:20px;
                padding-right:20px;
                font-weight:bold;
            ">
                Page ${aiResult.page} of ${aiResult.totalPages}
            </span>

            <button
                type="button"
                onclick="nextPage()"
                ${
                    aiResult.page === aiResult.totalPages
                        ? 'disabled'
                        : ''
                }
            >
                Next ▶
            </button>

        </div>
        `;
        
        // Results Grid
        const sublist = form.addSublist({
            id: 'custpage_results',
            type: serverWidget.SublistType.LIST,
            label: 'Search Results'
        });

        sublist.addField({
            id: 'custpage_tranid',
            type: serverWidget.FieldType.TEXT,
            label: 'Document'
        });
        sublist.addField({
        id: 'custpage_date',
        type: serverWidget.FieldType.TEXT,
        label: 'Date'
        });

        sublist.addField({
            id: 'custpage_entity',
            type: serverWidget.FieldType.TEXT,
            label: 'Customer'
        });

        sublist.addField({
        id: 'custpage_amount',
        type: serverWidget.FieldType.CURRENCY,
        label: 'Amount'
        });

        sublist.addField({
        id: 'custpage_currency',
        type: serverWidget.FieldType.TEXT,
        label: 'Currency'
        });
        
        sublist.addField({
            id: 'custpage_status',
            type: serverWidget.FieldType.TEXT,
            label: 'Status'
        });

        (aiResult.results || []).forEach((row, index) => {

            if (row.tranid) {
                sublist.setSublistValue({
                    id: 'custpage_tranid',
                    line: index,
                    value: String(row.tranid)
                });
            }
            if (row.date) {
                sublist.setSublistValue({
                    id: 'custpage_date',
                    line: index,
                    value: String(row.date)
                });
            }
           if (row.amount !== null && row.amount !== undefined) {
                sublist.setSublistValue({
                    id: 'custpage_amount',  
                    line: index,
                    value: String(row.amount)
                });
            }
            if (row.currency) {
                sublist.setSublistValue({
                    id: 'custpage_currency',
                    line: index,
                    value: String(row.currency)
                });
            }
            if (row.entity) {
                sublist.setSublistValue({
                    id: 'custpage_entity',
                    line: index,
                    value: String(row.entity)
                });
            }

            if (row.status) {
                sublist.setSublistValue({
                    id: 'custpage_status',
                    line: index,
                    value: String(row.status)
                });
            }

        });
    }

    context.response.writePage(form);

};

function escapeXml(value) {

    if (!value) {
        return '';
    }

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

    return {
        onRequest
    };

});
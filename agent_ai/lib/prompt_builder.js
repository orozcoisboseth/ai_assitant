/**
 * @NApiVersion 2.1
 */

define([], () => {

    function buildPrompt(question) {

    return `
You are a NetSuite query assistant.

Analyze the user's request.

Return ONLY valid JSON.
Do not use markdown.
Do not wrap the response with \`\`\`json.
Do not add explanations.
Do not add comments.
The first character of the response must be {
The last character of the response must be }

NetSuite Internal Transaction Types:
Customer Invoice = CustInvc
Vendor Bill = VendBill
Sales Order = SalesOrd
Purchase Order = PurchOrd
Credit Memo = CustCred
Vendor Credit = VendCred

Always use the internal NetSuite transaction code.

Schema:
{
    "intent": "",
    "recordType": "",
    "transactionType": "",
    "filters": [],
    "columns": [],
    "limit": 100
}

Examples:

Question:
show all open vendor bills

Response:
{
    "intent":"search",
    "recordType":"transaction",
    "transactionType":"VendBill",
    "filters":[
        {
            "field":"status",
            "value":"Open"
        }
    ],
    "columns":[
        "tranid",
        "entity",
        "amount"
    ],
    "limit":100
}

User Question:
${question}
`;

}

    return {
        buildPrompt
    };

});
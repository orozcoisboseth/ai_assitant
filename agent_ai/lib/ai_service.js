/**
 * @NApiVersion 2.1
 */

define([
    'N/llm',
    './prompt_builder',
    './suiteql_builder',
    './query_service'
], (

    llm,
    promptBuilder,
    suiteqlBuilder,
    queryService

) => {

  function parseQuestion(
    question,
    page,
    existingIntent
) {

    const prompt =
        promptBuilder.buildPrompt(question);

    page = Number(page || 1);

    const pageSize = 100;

    let parsed;
    let rawResponse = '';

    if (existingIntent) {

        parsed =
            JSON.parse(existingIntent);

    } else {

        const response =
            llm.generateText({
                prompt,
                modelFamily:
                    llm.ModelFamily.GPT_4_1_MINI
            });

        rawResponse = response.text;

        rawResponse = rawResponse
            .replace(/```json\s*/i, '')
            .replace(/```/g, '')
            .trim();

        try {

            parsed =
                JSON.parse(rawResponse);

        } catch (e) {

            parsed = {
                error: true,
                rawResponse
            };

        }

    }

    let suiteql = '';
    let results = [];
    let totalRecords = 0;
    let totalPages = 0;

    if (!parsed.error) {

        try {

            const baseSql =
                suiteqlBuilder.build(parsed);

            totalRecords =
                queryService.count(baseSql);

            totalPages =
                Math.ceil(
                    totalRecords / pageSize
                );

            suiteql = baseSql;

           

           

        results =
            queryService.runPaged(
                baseSql,
                page,
                pageSize
            );

           

        } catch (e) {

            suiteql =
                'ERROR: ' + e.message;

        }

    }

    return {
        version: 'V3',
        prompt,
        rawResponse,
        parsedResponse: parsed,
        suiteql,
        results,
        totalRecords,
        page,
        totalPages,
        serializedIntent:
            JSON.stringify(parsed)
    };

}
function getAllResults(
    questionText,
    existingIntent
) {

    let parsedResponse;

    if (existingIntent) {

        parsedResponse =
            JSON.parse(existingIntent);

    } else {

        parsedResponse =
            parseQuestionWithAI(
                questionText
            );
    }

    const sql =
        suiteqlBuilder.build(
            parsedResponse
        );

   const results =
    queryService.run(sql);

    return {
        results: results,
        totalRecords: results.length,
        parsedResponse: parsedResponse
    };
}

    return {
        parseQuestion,
        getAllResults
    };

});
/**
 * @NApiVersion 2.1
 */

define(['N/query'], (query) => {

    function runPaged(sql, page, pageSize) {

        const pagedData = query.runSuiteQLPaged({
            query: sql,
            pageSize: pageSize
        });

        return pagedData
            .fetch({
                index: page - 1
            })
            .data
            .asMappedResults();

    }

    function count(sql) {

        const countSql = `
            SELECT COUNT(*) total
            FROM (
                ${sql}
            )
        `;

        return Number(
            query
                .runSuiteQL({
                    query: countSql
                })
                .asMappedResults()[0]
                .total || 0
        );

    }

    function run(sql) {

    return query
        .runSuiteQL({
            query: sql
        })
        .asMappedResults();

}

    return {
        runPaged,
        count,
        run
    };

});
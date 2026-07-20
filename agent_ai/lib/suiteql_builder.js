/**
 * @NApiVersion 2.1
 */

define([], () => {

    function build(intent) {

        if (intent.recordType !== 'transaction') {
            throw Error('Unsupported record type');
        }

        let sql = `
            SELECT
                id,
                tranid,
                trandate AS date,
                abs(foreigntotal) AS amount,
                BUILTIN.DF(currency) AS currency,
                BUILTIN.DF(entity) AS entity,
                BUILTIN.DF(status) AS status
            FROM
                transaction
            WHERE
                1 = 1
        `;

        if (intent.transactionType) {

            sql += `
                AND type = '${intent.transactionType}'
            `;

        }
      (intent.filters || []).forEach(filter => {

            if (filter.field === 'status') {

                sql += `
                    AND BUILTIN.DF(status) LIKE '%${filter.value}%'
                `;
            }

        });
     
        sql += `
    ORDER BY id DESC
    `;
        return sql;

    }

    return {
        build
    };

});
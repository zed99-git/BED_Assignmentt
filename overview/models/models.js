const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DRS{
    constructor(weekly, dengue,acute_upper_respiratory_tract_infections, acute_diarrhoea){
        this.weekly = weekly;
        this.dengue = dengue;
        this.acute_upper_respiratory_tract_infections = acute_upper_respiratory_tract_infections;
        this.acute_diarrhoea = acute_diarrhoea;
    }
    
    static async getAllDRS(){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = 'SELECT * FROM DRS';

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new DRS(row.weekly,row.dengue,row.acute_upper_respiratory_tract_infections,row.acute_diarrhoea)
        );
    }

    static async getDRSByWeekly(weekly){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = 'SELECT * FROM DRS WHERE weekly = @weekly';

        const request = connection.request();
        request.input("weekly", weekly);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
        ? new DRS(
            result.recordset[0].weekly,
            result.recordset[0].dengue,
            result.recordset[0].acute_upper_respiratory_tract_infections,
            result.recordset[0].acute_diarrhoea,
        )
        :null;
    }
}

module.exports = DRS;
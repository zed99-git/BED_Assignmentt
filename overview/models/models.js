const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DRS{
    constructor(weekly, dengue,acute_upper_respiratory_tract_infections, acute_diarrhoea){
        this.weekly = weekly;
        this.dengue = dengue;
        this.acute_upper_respiratory_tract_infections = acute_upper_respiratory_tract_infections;
        this.acute_diarrhoea = acute_diarrhoea;
    }
    static async createDRS(record){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO DRS (dengue,acute_upper_respiratory_tract_infections,acute_diarrhoea) VALUES (@dengue,@acute_upper_respiratory_tract_infections,@acute_diarrhoea); 
        SELECT SCOPE_IDENTITY() AS weekly;`;//1st line creates, 2nd line retrieves the ID of inserted record

        const request = connection.request();
        request.input("dengue",record.dengue);
        request.input("acute_upper_respiratory_tract_infections",record.acute_upper_respiratory_tract_infections);
        request.input("acute_diarrhoea",record.acute_diarrhoea)

        const result = await request.query(sqlQuery);
        connection.close();

        return this.getDRSByWeekly(result.recordset[0].weekly);
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
    static async updateDRS(weekly,updatedDRS){
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = `UPDATE DRS SET dengue = @dengue, acute_upper_respiratory_tract_infections = @acute_upper_respiratory_tract_infections, acute_diarrhoea = @acute_diarrhoea WHERE weekly = @weekly`
        
        const request = connection.request();
        request.input("weekly",weekly)
        request.input("dengue",updatedDRS.dengue || null)
        request.input("acute_upper_respiratory_tract_infections",updatedDRS.acute_upper_respiratory_tract_infections || null)
        request.input("acute_diarrhoea",updatedDRS.acute_diarrhoea || null)

        await request.query(sqlQuery);
        connection.close();

        return this.getDRSByWeekly(weekly);
    }

    static async deleteDRS(weekly){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM DRS WHERE weekly = @weekly`

        const request = connection.request();
        request.input("weekly",weekly)
        const result = await request.query(sqlQuery);

        connection.close();
        return result.rowsAffected > 0;
    }
    static async searchData(searchTerm){
        const connection = await sql.connect(dbConfig);

        try{
            const sqlQuery = `SELECT * FROM DRS WHERE weekly = @weekly`;

            const request = connection.request();
            request.input("weekly", parseInt(searchTerm, 10)); 

            const result = await request.query(sqlQuery);

            return result.recordset;
        } catch(error){
            throw new Error("Error searching data");
        }finally{
            await connection.close();
        }
    }
}

module.exports = DRS;
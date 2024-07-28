const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Event {
  constructor(id, event_name, organizer, event_date) {
    this.id = id;
    this.event_name = event_name;
    this.organizer = organizer;
    this.event_date = event_date;
  }

  static async getAllEvents() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Events`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Event(row.id, row.event_name, row.organizer, row.event_date)
    ); // Convert rows to Book objects
  }

  static async getEventById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Events WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Event(
          result.recordset[0].id,
          result.recordset[0].event_name,
          result.recordset[0].organizer,
          result.recordset[0].event_date,
        )
      : null; // Handle event not found
  }

  static async createEvent(newEventData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
  INSERT INTO Events (event_name, organizer, event_date)
  VALUES (@event_name, @organizer, @event_date);
  SELECT SCOPE_IDENTITY() AS id;
`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("event_name", newEventData.event_name);
    request.input("organizer", newEventData.organizer);
    request.input("event_date", newEventData.event_date);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created book using its ID
    return this.getEventById(result.recordset[0].id);
  }

  static async updateEvent(id, newEventData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Events SET event_name = @event_name, organizer = @organizer, event_date =@event_date WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("event_name", newEventData.event_name || null); // Handle optional fields
    request.input("organizer", newEventData.organizer || null);
    request.input("event_date", newEventData.event_date || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getEventById(id); // returning the updated book data
  }

  static async deleteEvent(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Events WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = Event;
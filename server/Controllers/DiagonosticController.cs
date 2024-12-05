using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

[Route("api/diagnostic")] // Defines the base route for this controller
[ApiController] // Marks this as an API controller, enabling features like model validation
public class DiagnosticController : ControllerBase
{
    private readonly IConfiguration _configuration;

    // Constructor to inject configuration settings
    public DiagnosticController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // GET: api/diagnostic/tables
    // Retrieves a list of all tables in the database (excluding system schemas)
    [HttpGet("tables")]
    public async Task<IActionResult> GetTables()
    {
        try
        {
            // Establish a connection to the PostgreSQL database
            using var conn = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            // Query to fetch schema and table names
            const string sql = @"
                SELECT table_schema, table_name 
                FROM information_schema.tables 
                WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
                ORDER BY table_schema, table_name;";

            using var cmd = new NpgsqlCommand(sql, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            var tables = new List<object>();
            while (await reader.ReadAsync())
            {
                tables.Add(new
                {
                    Schema = reader.GetString(0), // Table schema (e.g., public)
                    TableName = reader.GetString(1) // Table name
                });
            }

            return Ok(tables); // Return the list of tables with HTTP 200
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message }); // Return HTTP 500 on error
        }
    }

    // GET: api/diagnostic/table-details/{tableName}
    // Retrieves details of the specified table (columns, types, nullability)
    [HttpGet("table-details/{tableName}")]
    public async Task<IActionResult> GetTableDetails(string tableName)
    {
        try
        {
            // Establish a connection to the PostgreSQL database
            using var conn = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            // Query to fetch column details for the specified table
            const string sql = @"
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = @tableName
                ORDER BY ordinal_position;";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("tableName", tableName); // Parameterized query to prevent SQL injection
            using var reader = await cmd.ExecuteReaderAsync();

            var columns = new List<object>();
            while (await reader.ReadAsync())
            {
                columns.Add(new
                {
                    ColumnName = reader.GetString(0), // Name of the column
                    DataType = reader.GetString(1), // Data type of the column
                    IsNullable = reader.GetString(2) // Whether the column allows NULL values
                });
            }

            return Ok(columns); // Return column details with HTTP 200
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message }); // Return HTTP 500 on error
        }
    }

    // GET: api/diagnostic/table-content/{tableName}
    // Retrieves the contents of the specified table
    [HttpGet("table-content/{tableName}")]
public async Task<IActionResult> GetTableContent(string tableName)
{
    try
    {
        // Basic validation to ensure the table name is safe
        if (string.IsNullOrEmpty(tableName) || !tableName.All(char.IsLetterOrDigit))
        {
                return BadRequest(new { error = "Invalid table name." }); // Return 400 for invalid table names
            }

            using var conn = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            // Check if the table exists in the database
            var checkTableSql = $@"
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_name = '{tableName}'";

            using var checkTableCmd = new NpgsqlCommand(checkTableSql, conn);
            var tableExists = (long)await checkTableCmd.ExecuteScalarAsync() > 0;

            if (!tableExists)
            {
                return NotFound(new { error = "Table does not exist." }); // Return 404 if table doesn't exist
            }

            // Query to fetch all rows from the specified table
            var sql = $@"SELECT * FROM {tableName};";
            using var cmd = new NpgsqlCommand(sql, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            var rows = new List<Dictionary<string, object>>();
            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    row[reader.GetName(i)] = reader.GetValue(i); // Add each column value to the row dictionary
                }
                rows.Add(row); // Add the row to the list
            }

            return Ok(rows); // Return table content with HTTP 200
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message }); // Return HTTP 500 on error
        }
    }
}

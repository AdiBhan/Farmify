using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

[Route("api/diagnostic")]
[ApiController]
public class DiagnosticController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public DiagnosticController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("tables")]
    public async Task<IActionResult> GetTables()
    {
        try
        {
            using var conn = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            // Query to get all tables
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
                    Schema = reader.GetString(0),
                    TableName = reader.GetString(1)
                });
            }

            return Ok(tables);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("table-details/{tableName}")]
    public async Task<IActionResult> GetTableDetails(string tableName)
    {
        try
        {
            using var conn = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            // Query to get column information
            const string sql = @"
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = @tableName
                ORDER BY ordinal_position;";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("tableName", tableName);
            using var reader = await cmd.ExecuteReaderAsync();

            var columns = new List<object>();
            while (await reader.ReadAsync())
            {
                columns.Add(new
                {
                    ColumnName = reader.GetString(0),
                    DataType = reader.GetString(1),
                    IsNullable = reader.GetString(2)
                });
            }

            return Ok(columns);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("table-content/{tableName}")]
public async Task<IActionResult> GetTableContent(string tableName)
{
    try
    {
        // Basic validation to ensure the table name is safe
        if (string.IsNullOrEmpty(tableName) || !tableName.All(char.IsLetterOrDigit))
        {
            return BadRequest(new { error = "Invalid table name." });
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
            return NotFound(new { error = "Table does not exist." });
        }

        // Query to get all rows from the specified table
        var sql = $@"SELECT * FROM {tableName};";
        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = await cmd.ExecuteReaderAsync();

        var rows = new List<Dictionary<string, object>>();
        while (await reader.ReadAsync())
        {
            var row = new Dictionary<string, object>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                row[reader.GetName(i)] = reader.GetValue(i);
            }
            rows.Add(row);
        }

        return Ok(rows);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.Message });
    }
}

}
using log_nine_backend;
using System.Data.SQLite;

public class WorkerRepository
{

    private readonly string connectionString;

    public WorkerRepository(string connectionString)
    {
        this.connectionString = connectionString;
    }

    public Worker? GetWorkerById(int workerId)
    {
        using var connection = new SQLiteConnection(connectionString);
        connection.Open();

        using var command = new SQLiteCommand("SELECT * FROM worker WHERE id = @id", connection);
        command.Parameters.Add(new SQLiteParameter("@id", workerId));
        using var reader = command.ExecuteReader();
        reader.Read();
        var worker = new Worker(
        Convert.ToInt32(reader["id"]),
        reader["name"].ToString()!,
        reader["logi_team_id"] == DBNull.Value ? null : Convert.ToInt32(reader["logi_team_id"])
        );
        return worker;
    }

    public int Add(string name, int? logiTeamId)
    {
        using var connection = new SQLiteConnection(connectionString);
        connection.Open();
        using var command = new SQLiteCommand("INSERT INTO worker (name, logi_team_id) VALUES (@name, @logi_team_id)", connection);
        command.Parameters.AddRange(new SQLiteParameter[]
        {
                    new SQLiteParameter("@name", name),
                    new SQLiteParameter("@logi_team_id", logiTeamId)
        });
        command.ExecuteNonQuery();

        return (int)connection.LastInsertRowId;
    }

    public void AssignLogiTeam(int id, int? logiTeamId)
    {
        using var connection = new SQLiteConnection(connectionString);
        connection.Open();
        using var command = new SQLiteCommand("UPDATE worker SET logi_team_id = @logi_team_id WHERE id = @id", connection);
        command.Parameters.AddRange(new SQLiteParameter[]
        {
                    new SQLiteParameter("@id", id),
                    new SQLiteParameter("@logi_team_id", logiTeamId)
        });
        command.ExecuteNonQuery();
    }
}

using System.Data.SQLite;
using System.Drawing;
using System.Xml.Linq;

namespace log_nine_backend.Repositories
{
    public class Repository
    {
        private readonly string connectionString;

        public Repository(string connectionString)
        {
            this.connectionString = connectionString;
        }

        public void CreateTables()
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            new SQLiteCommand("CREATE TABLE IF NOT EXISTS board (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "name TEXT)", connection)
                .ExecuteNonQuery();

            new SQLiteCommand("CREATE TABLE IF NOT EXISTS team (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "board_id REFERENCES board(id)," +
                "name TEXT," +
                "freq_sr INTEGER," +
                "freq_lr INTEGER)", connection)
                .ExecuteNonQuery();

            new SQLiteCommand("CREATE TABLE IF NOT EXISTS logi_team (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "name TEXT," +
                "color TEXT," +
                "freq_sr INTEGER," +
                "freq_lr INTEGER)", connection)
                .ExecuteNonQuery();

            new SQLiteCommand("CREATE TABLE IF NOT EXISTS task_logi_team (" +
                "task_id INTEGER," +
                "logi_team_id TEXT," +
                "freq_lr INTEGER," +
                "PRIMARY KEY (task_id, logi_team_id))", connection)
                .ExecuteNonQuery();

            new SQLiteCommand("CREATE TABLE IF NOT EXISTS task (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "visual_id INTEGER," +
                "board_id REFERENCES board(id), " +
                "target_id REFERENCES team(id)," +
                "title TEXT," +
                "description TEXT," +
                "status INTEGER," +
                "priority INTEGER," +
                "task_type INTEGER)", connection)
                .ExecuteNonQuery();

            new SQLiteCommand("CREATE TABLE IF NOT EXISTS worker (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "name string," +
                "logi_team_id REFERENCES logi_team(id))", connection)
                .ExecuteNonQuery();
        }

        public int AddJobTask(string title, int visual_id, string desc, JobTask.JobTaskStatus status, JobTask.JobTaskPriority prio, JobTask.JobTaskType taskType)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            using var command = new SQLiteCommand("INSERT INTO task (visual_id, title, description, status, priority, task_type, board_id, target_id) VALUES (@visual_id, @title, @desc, @status, @prio, @taskType, @board_id, @target_id)", connection);
            command.Parameters.AddRange(new SQLiteParameter[]
            {
                    new SQLiteParameter("@visual_id", visual_id),
                    new SQLiteParameter("@title", title),
                    new SQLiteParameter("@desc", desc),
                    new SQLiteParameter("@status", (int)status),
                    new SQLiteParameter("@prio", (int)prio),
                    new SQLiteParameter("@taskType", (int)taskType),
                    new SQLiteParameter("@board_id", null),
                    new SQLiteParameter("@target_id", null)
            });
            command.ExecuteNonQuery();
            return (int)connection.LastInsertRowId;
        }

        public int AddTeam(string name, int freqSr, int freqLr)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();
            using var command = new SQLiteCommand("INSERT INTO team (name, freq_sr, freq_lr) VALUES (@name, @freqSr, @freqLr)", connection);
            command.Parameters.AddRange(new SQLiteParameter[]
            {
                    new SQLiteParameter("@name", name),
                    new SQLiteParameter("@freqSr", freqSr),
                    new SQLiteParameter("@freqLr", freqLr)
            });
            command.ExecuteNonQuery();

            return (int)connection.LastInsertRowId;
        }

        public int AddLogiTeam(string name, string color, int freqSr, int freqLr)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();
            using var command = new SQLiteCommand("INSERT INTO logi_team (name, color, freq_sr, freq_lr) VALUES (@name, @color, @freqSr, @freqLr)", connection);
            command.Parameters.AddRange(new SQLiteParameter[]
            {
                    new SQLiteParameter("@name", name),
                    new SQLiteParameter("@color", color),
                    new SQLiteParameter("@freqSr", freqSr),
                    new SQLiteParameter("@freqLr", freqLr)
            });
            command.ExecuteNonQuery();

            return (int)connection.LastInsertRowId;
        }

        public JobTask? GetJobTaskById(int id)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            using var command = new SQLiteCommand("SELECT * FROM task WHERE id = @id", connection);
            command.Parameters.Add(new SQLiteParameter("@id", id));
            using var reader = command.ExecuteReader();
            reader.Read();
            if (!reader.HasRows)
            {
                connection.Close();
                return null;
            };
            var jobTask = new JobTask(
                Convert.ToInt32(reader["id"]),
                Convert.ToInt32(reader["visual_id"]),
                reader["board_id"] == DBNull.Value ? null : Convert.ToInt32(reader["board_id"]),
                reader["target_id"] == DBNull.Value ? null : Convert.ToInt32(reader["target_id"]),
                reader["title"].ToString()!,
                reader["description"].ToString()!,
                (JobTask.JobTaskStatus)Convert.ToInt32(reader["status"]),
                (JobTask.JobTaskPriority)Convert.ToInt32(reader["priority"]),
                (JobTask.JobTaskType)Convert.ToInt32(reader["task_type"])
            );
            return jobTask;
        }

        public LogiTeam? GetLogiTeamById(int logiTeamId)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            using var command = new SQLiteCommand("SELECT * FROM logi_team WHERE id = @id", connection);
            command.Parameters.Add(new SQLiteParameter("@id", logiTeamId));
            using var reader = command.ExecuteReader();
            reader.Read();
            if (!reader.HasRows)
            {
                connection.Close();
                return null;
            };
            var logiTeam = new LogiTeam(
                Convert.ToInt32(reader["id"]),
                reader["name"].ToString()!,
                reader["color"].ToString()!,
                Convert.ToInt32(reader["freq_sr"]),
                Convert.ToInt32(reader["freq_lr"])
            );
            return logiTeam;
        }

        public void AssignTeamToJobTask(int jobTaskId, int teamId)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();
            using var command = new SQLiteCommand("INSERT or IGNORE INTO task_logi_team (task_id, logi_team_id) VALUES (@task_id, @logi_team_id)", connection);
            command.Parameters.AddRange(new SQLiteParameter[]
            {
                    new SQLiteParameter("@task_id", jobTaskId),
                    new SQLiteParameter("@logi_team_id", teamId)
            });
            command.ExecuteNonQuery();
        }



        public void AssignWorkerToLogiTeam(int workerId, int logiTeamId)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();
            using var command = new SQLiteCommand("UPDATE worker SET logi_team_id = @logi_team_id WHERE id = @id", connection);
            command.Parameters.AddRange(new SQLiteParameter[]
            {
                    new SQLiteParameter("@id", workerId),
                    new SQLiteParameter("@logi_team_id", logiTeamId)
            });
            command.ExecuteNonQuery();
        }

        public void UnassignWorker(int workerId)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();
            using var command = new SQLiteCommand("UPDATE worker SET logi_team_id = null WHERE id = @id", connection);
            command.Parameters.AddRange(new SQLiteParameter[]
            {
                    new SQLiteParameter("@id", workerId)
            });
            command.ExecuteNonQuery();
        }

        public int CreateBoard(string name)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();
            using var command = new SQLiteCommand("INSERT INTO board (name) VALUES (@name)", connection);
            command.Parameters.AddRange(new SQLiteParameter[]
            {
                    new SQLiteParameter("@name", name)
            });
            command.ExecuteNonQuery();

            return (int)connection.LastInsertRowId;
        }

        public Board? GetBoardById(int boardId)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            using var command = new SQLiteCommand("SELECT * FROM board WHERE id = @id", connection);
            command.Parameters.Add(new SQLiteParameter("@id", boardId));
            using var reader = command.ExecuteReader();
            reader.Read();
            if (!reader.HasRows)
            {
                connection.Close();
                return null;
            };
            var board = new Board(
                               Convert.ToInt32(reader["id"]),
                                              reader["name"].ToString()!
                                                         );
            return board;

        }

        public Team GetTeamById(int id)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            using var command = new SQLiteCommand("SELECT * FROM team WHERE id = @id", connection);
            command.Parameters.Add(new SQLiteParameter("@id", id));
            using var reader = command.ExecuteReader();
            reader.Read();
            var team = new Team(
                Convert.ToInt32(reader["id"]),
                Convert.ToInt32(reader["board_id"]),
                reader["name"].ToString()!,
                Convert.ToInt32(reader["freq_sr"]),
                Convert.ToInt32(reader["freq_lr"])
            );
            return team;
        }

        public IEnumerable<JobTask> GetJobTasksByBoardId(int boardId)
        {

            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            using var command = new SQLiteCommand("SELECT * FROM task WHERE board_id = @board_id", connection);
            command.Parameters.Add(new SQLiteParameter("@board_id", boardId));

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                yield return new JobTask(
                Convert.ToInt32(reader["id"]),
                Convert.ToInt32(reader["visual_id"]),
                reader["board_id"] == DBNull.Value ? null : Convert.ToInt32(reader["board_id"]),
                reader["target_id"] == DBNull.Value ? null : Convert.ToInt32(reader["target_id"]),
                reader["title"].ToString()!,
                reader["description"].ToString()!,
                (JobTask.JobTaskStatus)Convert.ToInt32(reader["status"]),
                (JobTask.JobTaskPriority)Convert.ToInt32(reader["priority"]),
                (JobTask.JobTaskType)Convert.ToInt32(reader["task_type"]));
            }
        }

        internal IEnumerable<Team> GetTeamsByBoardId(int board_id)
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            using var command = new SQLiteCommand("SELECT * FROM team WHERE board_id = @board_id", connection);
            command.Parameters.Add(new SQLiteParameter("@board_id", board_id));

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                yield return new Team(
                Convert.ToInt32(reader["id"]),
                Convert.ToInt32(reader["board_id"]),
                reader["name"].ToString()!,
                Convert.ToInt32(reader["freq_sr"]),
                Convert.ToInt32(reader["freq_lr"]));
            }
        }
    }
}

public class Team
{
    public int Id { get; }
    public int BoardId { get; }
    public string Name { get; }
    public int FreqSr { get; }
    public int FreqLr { get; }

    public Team(int id, int boardId ,string name, int freqSr, int freqLr)
    {
        Id = id;
        BoardId = boardId;
        Name = name;
        FreqSr = freqSr;
        FreqLr = freqLr;
    }
}
namespace log_nine_backend
{
    public class Worker
    {
        public int Id { get; }
        public string Name { get; }
        public int? LogiTeamId { get; }

        public Worker(int id, string name, int? logiTeamId)
        {
            Id = id;
            Name = name;
            LogiTeamId = logiTeamId;
        }
    }
}
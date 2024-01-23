namespace log_nine_backend
{
    public class Board
    {
        public int Id { get; }
        public string Name { get; }

        public Board(int id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
namespace LogNineBackend;

public interface ILogNineHub {
    Task SendCreatedTaskMessage(int boardId);
    Task SendUpdatedTaskMessage(int boardId);
    Task SendCreatedTeamMessage(int boardId);
    Task SendUpdatedTeamMessage(int boardId);
}
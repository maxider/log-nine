public class JobTask
{
    public enum JobTaskStatus
    {
        Todo = 0,
        EnRoute = 1,
        OnSite = 2,
        Returning = 3,
        Completed = 4,
        Cancelled = 5
    }

    public enum JobTaskPriority
    {
        Low = 0,
        Medium = 1,
        High = 2
    }

    public enum JobTaskType
    {
        Repair = 0,
        Helicoper = 1,
        Towing = 2
    }

    public int Id { get; }
    public int VisualId { get; }
    public int? BoardId { get; }
    public int? TargetId { get; }
    public string Title { get; }
    public string Description { get; }
    public JobTaskStatus Status { get; }
    public JobTaskPriority Priority { get; }
    public JobTaskType TaskType { get; }


    public JobTask(int id, int visual_id, int? boardId, int? targetId, string title, string description, JobTaskStatus status, JobTaskPriority priority, JobTaskType taskType)
    {
        Id = id;
        VisualId = visual_id;
        BoardId = boardId;
        TargetId = targetId;
        Title = title;
        Description = description;
        Status = (JobTaskStatus)status;
        Priority = priority;
        TaskType = taskType;
    }
}

using System.ComponentModel.DataAnnotations;

namespace LogNineBackend.Models;

public class JobTask {
    public enum JobTaskStatus {
        Todo = 0,
        EnRoute = 1,
        OnSite = 2,
        Returning = 3,
        Completed = 4,
        Cancelled = 5
    }

    public enum JobTaskPriority {
        Low = 0,
        Medium = 1,
        High = 2
    }

    public enum JobTaskType {
        Repair = 0,
        Helicopter = 1,
        Towing = 2
    }

    public int Id { get; set; }
    public int VisualId { get; set; }
    public int BoardId { get; set; }
    public Board Board { get; set; } = null!;
    public int? TargetId { get; set; }
    public Team? Target { get; set; }
    
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(2000)]
    public string Description { get; set; } = string.Empty;
    
    public JobTaskStatus Status { get; set; }
    public JobTaskPriority Priority { get; set; }
    public JobTaskType TaskType { get; set; }
    public Person? AssignedTo { get; set; }
}

public record struct JobTaskDTO(int Id, int VisualId, int BoardId, int? TargetId, string Title, string Description,
    JobTask.JobTaskStatus Status, JobTask.JobTaskPriority Priority, JobTask.JobTaskType TaskType, int? AssignedToId) {
    public JobTaskDTO(JobTask task) : this(task.Id, task.VisualId, task.BoardId, task.TargetId, task.Title,
        task.Description,
        task.Status, task.Priority, task.TaskType, task.AssignedTo?.Id) {
    }
}
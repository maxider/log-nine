using LogNineBackend.Models;

namespace LogNineBackend;

public static class DbSeeder {
    public static bool Seed(AppContext context) {
        context.Database.EnsureCreated();
        if (context.Boards.Any())
        {
            return false;
        }
        var boards = new Board[]{
            new Board{ Title = "Board 1" },
            new Board{ Title = "Board 2" },
            new Board{ Title = "Board 3" }
        };
        context.Boards.AddRange(boards);
        context.SaveChanges();

        var teams = new Team[]{
            new Team{ Name = "Team 1", BoardId = 1, SrFrequency = 1.0f, LrFrequency = 2.0f },
            new Team{ Name = "Team 2", BoardId = 1, SrFrequency = 1.5f, LrFrequency = 2.5f },
            new Team{ Name = "Team 3", BoardId = 1, SrFrequency = 2.0f, LrFrequency = 3.0f },
        };
        context.Teams.AddRange(teams);
        context.SaveChanges();

        var jobTasks = new JobTask[]{
            new JobTask{
                VisualId = 1, BoardId = 1, TargetId = 1, Title = "Task 1", Description = "Task 1 Description",
                Status = JobTask.JobTaskStatus.Todo, Priority = JobTask.JobTaskPriority.Low,
                TaskType = JobTask.JobTaskType.Repair
            },
            new JobTask{
                VisualId = 2, BoardId = 1, TargetId = 2, Title = "Task 2", Description = "Task 2 Description",
                Status = JobTask.JobTaskStatus.Todo, Priority = JobTask.JobTaskPriority.Medium,
                TaskType = JobTask.JobTaskType.Helicoper
            },
            new JobTask{
                VisualId = 3, BoardId = 1, TargetId = 3, Title = "Task 3", Description = "Task 3 Description",
                Status = JobTask.JobTaskStatus.EnRoute, Priority = JobTask.JobTaskPriority.High,
                TaskType = JobTask.JobTaskType.Towing
            },
            new JobTask{
                VisualId = 4, BoardId = 1, TargetId = 1, Title = "Task 4", Description = "Task 4 Description",
                Status = JobTask.JobTaskStatus.EnRoute, Priority = JobTask.JobTaskPriority.Low,
                TaskType = JobTask.JobTaskType.Repair
            },
            new JobTask{
                VisualId = 5, BoardId = 1, TargetId = 2, Title = "Task 5", Description = "Task 5 Description",
                Status = JobTask.JobTaskStatus.OnSite, Priority = JobTask.JobTaskPriority.Medium,
                TaskType = JobTask.JobTaskType.Helicoper
            },
            new JobTask{
                VisualId = 6, BoardId = 1, TargetId = 3, Title = "Task 6", Description = "Task 6 Description",
                Status = JobTask.JobTaskStatus.OnSite, Priority = JobTask.JobTaskPriority.High,
                TaskType = JobTask.JobTaskType.Towing
            },
            new JobTask{
                VisualId = 7, BoardId = 1, TargetId = 1, Title = "Task 7", Description = "Task 7 Description",
                Status = JobTask.JobTaskStatus.Returning, Priority = JobTask.JobTaskPriority.Low,
                TaskType = JobTask.JobTaskType.Repair
            },
            new JobTask{
                VisualId = 8, BoardId = 1, TargetId = 2, Title = "Task 8", Description = "Task 8 Description",
                Status = JobTask.JobTaskStatus.Returning, Priority = JobTask.JobTaskPriority.Medium,
                TaskType = JobTask.JobTaskType.Helicoper
            },
            new JobTask{
                VisualId = 9, BoardId = 1, TargetId = 3, Title = "Task 9", Description = "Task 9 Description",
                Status = JobTask.JobTaskStatus.Completed, Priority = JobTask.JobTaskPriority.High,
                TaskType = JobTask.JobTaskType.Towing
            },
            new JobTask{
                VisualId = 10, BoardId = 1, TargetId = 1, Title = "Task 10", Description = "Task 10 Description",
                Status = JobTask.JobTaskStatus.Completed, Priority = JobTask.JobTaskPriority.Low,
                TaskType = JobTask.JobTaskType.Repair
            },
            new JobTask{
                VisualId = 11, BoardId = 1, TargetId = 2, Title = "Task 11", Description = "Task 11 Description",
                Status = JobTask.JobTaskStatus.Cancelled, Priority = JobTask.JobTaskPriority.High,
                TaskType = JobTask.JobTaskType.Towing
            },
            new JobTask{
                VisualId = 12, BoardId = 1, TargetId = 1, Title = "Task 12", Description = "Task 12 Description",
                Status = JobTask.JobTaskStatus.Cancelled, Priority = JobTask.JobTaskPriority.Low,
                TaskType = JobTask.JobTaskType.Repair
            }
        };
        context.JobTasks.AddRange(jobTasks);
        context.SaveChanges();

        return true;
    }
}
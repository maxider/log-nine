using LogNineBackend.Controllers;
using LogNineBackend.Models;

namespace LogNineBackend.Repositories;

public interface IJobTaskRepository {
    ValueTask<JobTask?> GetJobTaskByIdAsync(int id);
    IEnumerable<JobTask> GetJobTasksByIds(IEnumerable<int> ids);
    Task<List<JobTask>> GetAllJobTasksAsync();
    Task<JobTask> CreateJobTaskAsync(JobTaskCreationParams jobTask);
    Task<JobTask> UpdateJobTaskAsync(int id, JobTaskCreationParams jobTask);
    Task<JobTask?> DeleteJobTaskAsync(int id);
}
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace log_nine_backend.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class TaskController : ControllerBase
    {
        private readonly ILogger<TaskController> _logger;
        private readonly Repository _repository;

        public TaskController(ILogger<TaskController> logger, Repository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        [HttpGet(Name = "GetTask")]
        public IActionResult Get(int id)
        {
            var task = _repository.GetJobTaskById(id);
            if (task == null)
                return NotFound();
            return Ok(task);
        }

        [HttpGet(Name = "GetLogiTeam")]
        public IActionResult GetLogiTeam(int id)
        {
            var logiTeam = _repository.GetLogiTeamById(id);
            if (logiTeam == null)
                return NotFound();
            return Ok(logiTeam);
        }

        [HttpPost(Name = "CreateTask")]
        public IActionResult CreateTask([FromBody] JobTaskCreationRequestParams requestParams)
        {
            var taskId = _repository.AddJobTask(requestParams.Title, requestParams.VisualId, requestParams.Description, requestParams.Status, requestParams.Priority, requestParams.TaskType);
            return Ok(taskId);
        }

        [HttpPost(Name = "CreateTeam")]
        public IActionResult CreateTeam([FromBody] TeamCreationRequestParams requestParams)
        {
            var teamId = _repository.AddTeam(requestParams.Name, requestParams.FreqSr, requestParams.FreqLr);
            return Ok(teamId);
        }

        [HttpPost(Name = "CreateLogiTeam")]
        public IActionResult CreateLogiTeam([FromBody] LogiTeamCreationRequestParams requestParams)
        {
            var teamId = _repository.AddLogiTeam(requestParams.Name, requestParams.Color, requestParams.FreqSr, requestParams.FreqLr);
            return Ok(teamId);
        }

        [HttpPost(Name = "AddLogiTeamToTask")]
        public IActionResult AddLogiTeamToTask([FromBody] AddLogiTeamToTaskRequestParams requestParams)
        {
            if (_repository.GetJobTaskById(requestParams.TaskId) == null)
                return NotFound($"Task with id {requestParams.TaskId} not found");
            if (_repository.GetLogiTeamById(requestParams.LogiTeamId) == null)
                return NotFound($"Logi Team with id {requestParams.TaskId} not found");
            _repository.AssignTeamToJobTask(requestParams.TaskId, requestParams.LogiTeamId);
            return Ok();
        }

        [HttpPost(Name = "CreateWorker")]
        public IActionResult CreateWorker([FromBody] WorkerCreationRequestParams requestParams)
        {
            var workerId = _repository.AddWorker(requestParams.Name, null);
            return Ok(workerId);
        }

        [HttpPatch(Name = "AssignWorkerToLogiTeam")]
        public IActionResult AssignWorkerToLogiTeam(int workerId, int logiTeamId)
        {
            if (_repository.GetWorkerById(workerId) == null)
                return NotFound($"Worker with id {workerId} not found");
            if (_repository.GetLogiTeamById(logiTeamId) == null)
                return NotFound($"Logi Team with id {logiTeamId} not found");
            _repository.AssignWorkerToLogiTeam(workerId, logiTeamId);
            return Ok();
        }

        [HttpPatch(Name = "UnassignWorker")]
        public IActionResult UnassignWorker(int workerId)
        {
            _repository.UnassignWorker(workerId);
            return Ok();
        }


        public struct JobTaskCreationRequestParams
        {
            public string Title { get; set; }
            public int VisualId { get; set; }
            public string Description { get; set; }
            public JobTask.JobTaskStatus Status { get; set; }
            public JobTask.JobTaskPriority Priority { get; set; }
            public JobTask.JobTaskType TaskType { get; set; }
        }

        public class LogiTeamCreationRequestParams
        {
            public string Name { get; set; }
            public string Color { get; set; }
            public int FreqSr { get; set; }
            public int FreqLr { get; set; }
        }

        public class AddLogiTeamToTaskRequestParams
        {
            public int TaskId { get; set; }
            public int LogiTeamId { get; set; }
        }

        public class WorkerCreationRequestParams
        {
            public string Name { get; set; }
        }
    }
}
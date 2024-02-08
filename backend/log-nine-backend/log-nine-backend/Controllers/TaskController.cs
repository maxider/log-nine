using log_nine_backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace log_nine_backend.Controllers {
    [ApiController]
    [Route("[controller]/[action]")]
    public class TaskController : ControllerBase {
        private readonly ILogger<TaskController> _logger;
        private readonly Repository _repository;

        public TaskController(ILogger<TaskController> logger, Repository repository) {
            _logger = logger;
            _repository = repository;
        }

        [HttpGet(Name = "GetTask")]
        public IActionResult Get(int id) {
            var task = _repository.GetJobTaskById(id);
            if (task == null)
                return NotFound();
            return Ok(task);
        }

        [HttpPost(Name = "CreateTask")]
        public IActionResult CreateTask([FromBody] JobTaskCreationRequestParams requestParams) {
            var taskId = _repository.AddJobTask(requestParams.Title, requestParams.BoardId, requestParams.VisualId,
                requestParams.Description, requestParams.Status, requestParams.Priority, requestParams.TaskType);
            return Ok(taskId);
        }

        [HttpPut]
        public IActionResult UpdateTask([FromBody] JobTask taskToUpdate) {
            if (_repository.GetJobTaskById(taskToUpdate.Id) == null)
                return NotFound(taskToUpdate.Id);
            return Ok(_repository.UpdateJobTask(taskToUpdate));
        }

        [HttpDelete]
        public IActionResult DeleteTask(int id) {
            if (_repository.GetJobTaskById(id) == null)
                return NotFound(id);
            _repository.DeleteJobTask(id);
            return Ok();
        }


        [HttpPost]
        public IActionResult AssignLogiTeam([FromBody] AddLogiTeamToTaskRequestParams requestParams) {
            if (_repository.GetJobTaskById(requestParams.TaskId) == null)
                return NotFound($"Task with id {requestParams.TaskId} not found");
            if (_repository.GetLogiTeamById(requestParams.LogiTeamId) == null)
                return NotFound($"Logi Team with id {requestParams.TaskId} not found");
            _repository.AssignTeamToJobTask(requestParams.TaskId, requestParams.LogiTeamId);
            return Ok();
        }
    }
}
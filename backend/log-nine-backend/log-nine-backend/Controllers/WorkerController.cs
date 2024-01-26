using log_nine_backend.Repositories;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace log_nine_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkerController : ControllerBase
    {
        private readonly ILogger<WorkerController> _logger;
        private readonly WorkerRepository _workerRepository;
        private readonly Repository _repository;

        public WorkerController(ILogger<WorkerController> logger, WorkerRepository workerRepository, Repository repository)
        {
            _logger = logger;
            _workerRepository = workerRepository;
            _repository = repository;
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var worker = _workerRepository.GetWorkerById(id);
            if (worker == null)
                return NotFound();
            return Ok(worker);
        }

        [HttpPost]
        public IActionResult Create([FromBody] WorkerCreationRequestParams requestParams)
        {
            var workerId = _workerRepository.Add(requestParams.Name, null);
            return Ok(workerId);
        }

        [HttpPatch("{id}/Assign")]
        public IActionResult Assign(int id, [FromBody] int logiTeamId)
        {
            if (_workerRepository.GetWorkerById(id) == null)
                return NotFound($"Worker with id {id} not found");
            
            if (_repository.GetLogiTeamById(logiTeamId) == null)
                return NotFound($"Logi Team with id {logiTeamId} not found");

            _workerRepository.AssignLogiTeam(id, logiTeamId);
            return Ok();
        }

        [HttpPatch("{id}/Unassign")]
        public IActionResult Unassign(int id)
        {
            _workerRepository.AssignLogiTeam(id, null);

            return Ok();
        }
    }
}
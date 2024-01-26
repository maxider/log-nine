using log_nine_backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace log_nine_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BoardController : ControllerBase
    {
        private readonly Repository _repository;
        private readonly WorkerRepository _workerRepository;

        public BoardController(Repository repository, WorkerRepository workerRepository)
        {
            _repository = repository;
            _workerRepository = workerRepository;
        }

        [HttpGet("{id}/tasks")]
        public IEnumerable<JobTask> GetTasks(int id)
        {
            return _repository.GetJobTasksByBoardId(id);
        }

        [HttpGet("{id}/teams")]
        public IEnumerable<Team> GetTeams(int id)
        {
               return _repository.GetTeamsByBoardId(id);
        }
    }
}

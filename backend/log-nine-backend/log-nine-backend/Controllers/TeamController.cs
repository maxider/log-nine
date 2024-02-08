using log_nine_backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace log_nine_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TeamController : ControllerBase
    {
        private Repository _repository;

        public TeamController(Repository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult Get(int id)
        {
            var team = _repository.GetTeamById(id);
            if (team == null)
                return NotFound();
            return Ok(team);
        }

        [HttpPost]
        public IActionResult Create([FromBody] TeamCreationRequestParams requestParams)
        {
            var teamId = _repository.AddTeam(requestParams.Name, requestParams.FreqSr, requestParams.FreqLr);
            return Ok(teamId);
        }
        
        [HttpPut]
        public IActionResult Update([FromBody] Team teamToUpdate)
        {
            if (_repository.GetTeamById(teamToUpdate.Id) == null)
                return NotFound(teamToUpdate.Id);
            return Ok(_repository.UpdateTeam(teamToUpdate));
        }
    }
}
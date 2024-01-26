using log_nine_backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace log_nine_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LogiTeamController : ControllerBase
    {
        private readonly Repository _repository;

        public LogiTeamController(Repository repository)
        {
            _repository = repository;
        }


        [HttpGet]
        public IActionResult Get(int id)
        {
            var logiTeam = _repository.GetLogiTeamById(id);
            if (logiTeam == null)
                return NotFound();
            return Ok(logiTeam);
        }


        [HttpPost]
        public IActionResult Create([FromBody] LogiTeamCreationRequestParams requestParams)
        {
            var teamId = _repository.AddLogiTeam(requestParams.Name, requestParams.Color, requestParams.FreqSr, requestParams.FreqLr);
            return Ok(teamId);
        }
    }
}
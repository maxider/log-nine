
using log_nine_backend;

public class DBSeeder : IHostedService
{
    private readonly Repository _repository;

    public DBSeeder(Repository repository)
    {
        _repository = repository;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {

        _repository.CreateTables();
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
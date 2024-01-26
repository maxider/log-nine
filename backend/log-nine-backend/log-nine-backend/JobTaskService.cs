using log_nine_backend.Repositories;

public class JobTaskService
{
    private readonly Repository repository;

    public JobTaskService(Repository repository)
    {
        this.repository = repository;
    }
}
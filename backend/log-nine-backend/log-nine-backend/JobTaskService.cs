using log_nine_backend;

public class JobTaskService
{
    private readonly Repository repository;

    public JobTaskService(Repository repository)
    {
        this.repository = repository;
    }
}
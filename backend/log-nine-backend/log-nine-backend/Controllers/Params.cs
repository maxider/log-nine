namespace log_nine_backend.Controllers
{
    public struct TeamCreationRequestParams
    {
        public string Name { get; set; }
        public int FreqSr { get; set; }
        public int FreqLr { get; set; }
    }

    public struct JobTaskCreationRequestParams
    {
        public string Title { get; set; }
        public int BoardId { get; set; }
        public int VisualId { get; set; }
        public string Description { get; set; }
        public JobTask.JobTaskStatus Status { get; set; }
        public JobTask.JobTaskPriority Priority { get; set; }
        public JobTask.JobTaskType TaskType { get; set; }
    }

    public struct LogiTeamCreationRequestParams
    {
        public string Name { get; set; }
        public string Color { get; set; }
        public int FreqSr { get; set; }
        public int FreqLr { get; set; }
    }

    public struct AddLogiTeamToTaskRequestParams
    {
        public int TaskId { get; set; }
        public int LogiTeamId { get; set; }
    }

    public struct WorkerCreationRequestParams
    {
        public string Name { get; set; }
    }
}

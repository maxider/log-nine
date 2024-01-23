using System.Drawing;

public class LogiTeam
{
    public int Id { get; }
    public string Name { get; }
    public string Color { get; }
    private int FreqSr { get; }
    private int FreqLr { get; }

    public LogiTeam(int id, string name, string color, int freqSr, int freqLr)
    {
        Id = id;
        Name = name;
        Color = color;
        FreqSr = freqSr;
        FreqLr = freqLr;
    }
}
namespace Cron_App.Abstractions;

public interface IDateService
{
    Dictionary<int, string> GetDaysOfWeek();
    Dictionary<int, string> GetMonths();
}
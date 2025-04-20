using System.Globalization;
using Cron_App.Abstractions;

namespace Cron_App.Services;

public class DateService : IDateService
{
    public Dictionary<int, string> GetDaysOfWeek()
    {
        // Что бы в ручную не заполнять дни недели, можно использовать уже существующие + можно локализовать
        var culture = new CultureInfo("ru-RU");

        var daysLocalized = Enumerable.Range(1, 6)
            .Concat([0])
            .ToDictionary(key => key, value => culture.DateTimeFormat.GetDayName((DayOfWeek)value));
        
        return daysLocalized;
    }

    public Dictionary<int, string> GetMonths()
    {
        var culture = new CultureInfo("ru-RU");

        var monthsLocalized = Enumerable.Range(1, 12)
            .ToDictionary(key => key, value => culture.DateTimeFormat.GetMonthName(value));
        
        return monthsLocalized;
    }
}
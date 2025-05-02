using Cron_App.Abstractions;
using Cron_App.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Diagnostics;
using System.Globalization;

namespace Cron_App.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IDateService _dateService;

    public HomeController(ILogger<HomeController> logger, IDateService dateService)
    {
        _logger = logger;
        _dateService = dateService;
    }

    public IActionResult Index()
    {
        var culture = new CultureInfo("en-EN");
        var model = new ScheduleModel
        {
            DayOfWeek = _dateService.GetDaysOfWeek().Select(x => new SelectListItem()
            {
                Value = culture.DateTimeFormat.GetAbbreviatedDayName((DayOfWeek)x.Key),
                Text = x.Value
            }).ToList(),
            Months = _dateService.GetMonths().Select(x => new SelectListItem()
            {
                Value = culture.DateTimeFormat.GetAbbreviatedMonthName(x.Key),
                Text = x.Value
            }).ToList(),
            SelectedDay = string.Empty,
            Date = new DateOnly(),
            Minutes = new TimeOnly()
        };

        return View(model);
    }

    [HttpPost]
    public ActionResult Schedule(ScheduleModel model)
    {
        return View(model);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
using Cron_App.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Diagnostics;

namespace Cron_App.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        var model = new ScheduleModel
        {
            DayOfWeek = GetDaysOfWeek(),
            SelectedDay = string.Empty,
            Date = new DateOnly(),
            Minutes = new TimeOnly()
        };
        return View(model);
    }
    
    [HttpPost]
    public ActionResult Schedule(ScheduleModel model)
    {
        var result = new ScheduleModel
        {
            DayOfWeek = model.DayOfWeek,
            SelectedDay = model.SelectedDay,
            Date = model.Date,
            Minutes = model.Minutes
            };
        return View(model);
    }

    private List<SelectListItem> GetDaysOfWeek()
    {
        return new List<SelectListItem>
        {
            new SelectListItem { Value = "1", Text = "Понедельник" },
            new SelectListItem { Value = "2", Text = "Вторник" },
            new SelectListItem { Value = "3", Text = "Среда" },
            new SelectListItem { Value = "4", Text = "Четверг" },
            new SelectListItem { Value = "5", Text = "Пятница" },
            new SelectListItem { Value = "6", Text = "Суббота" },
            new SelectListItem { Value = "0", Text = "Воскресенье" }
        };
    }    

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
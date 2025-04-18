﻿using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace Cron_App.Models
{
    public class ScheduleModel
    {
        public byte ReminderType { get; set; }
    
        public string SelectedDay { get; set; }
       
        [Display(Name = "Day of week")]
        public List<SelectListItem> DayOfWeek { get; set; }

        public DateOnly Date { get; set; }
        public TimeOnly Minutes { get; set; }
    }
}

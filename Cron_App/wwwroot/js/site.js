
// Это надо брать списком из системы как в DateService
// Примерно так

/*
const formatter = new Intl.DateTimeFormat('ru-RU', { month: 'long' });
const monthAbbreviations = Array.from({ length: 12 }, (_, i) =>
    formatter.format(new Date(2020, i))
);
*/


const monthAbbreviations = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];


document.querySelectorAll('input[name="scheduleType"]').forEach(radio => {
    radio.addEventListener('change', function () {
        document.querySelectorAll('.schedule-option').forEach(div => {
            div.style.display = 'none';
        });

        document.getElementById(this.value + 'Options').style.display = 'block';

        document.querySelector('.cron-input input').value = '';
    });
});

function generateCron() {
    const type = document.querySelector('input[name="scheduleType"]:checked').value;
    let cron = '';

    if (type === 'custom') {
        const days = document.querySelector('.day-input').value;
        const months = document.querySelector('.day-input').value;
        const time = document.querySelector('#customOptions input[type="time"]').value;
        const [hours, minutes] = time.split(':');

        cron = `0 ${minutes} ${hours} ${days} * *`;
    }
    return cron;
}

document.querySelector('button').addEventListener('click', () => {
    const cron = generateCron();
    document.querySelector('.cron-input input').value = cron;
});

document.querySelector('button:last-child').addEventListener('click', () => {
    const cron = generateCron();
    if (cron) {
        document.querySelector('.cron-input input').value = cron;
    }
});

// Надо переименовать или удалить, не понятно какая функция используется, выше точно такая же
function generateCron() {
    try {
        const type = document.querySelector('input[name="scheduleType"]:checked').value;
        let cron = '';

        switch (type) {
            case 'weekly':
                cron = generateWeeklyCron();
                break;

            case 'daily':
                cron = generateDailyCron();
                break;

            case 'monthly':
                cron = generateMonthlyCron();
                break;

            case 'custom':
                cron = generateCustomCron();
                break;
        }

        return cron;
    } catch (error) {
        alert(`Error: ${error.message}`);
        return null;
    }
}

function generateWeeklyCron() {
    const select = document.querySelector('#weeklyOptions select');
    const selectedDays = Array.from(select.selectedOptions);

    if (selectedDays.length === 0) {
        throw new Error('Please select at least one day of the week');
    }
    const days = Array.from(selectedDays)
        .map(day => day.value)
        .sort()
        .join(',');

    const time = document.querySelector('#weeklyOptions input[type="time"]').value;
    const [hours, minutes] = time.split(':');
    // 0 15 12 ? 1/1 MON,TUE *
    return `0 ${minutes} ${hours} ? 1/1 ${days} *`;
}

function generateDailyCron() {
    const interval = document.querySelector('#dailyOptions .number-input').value;
    if (!interval || interval < 1 || interval > 59) {
        throw new Error('Interval must be between 1 and 59 minutes');
    }
    //0 0/15 * ? * * *
    return `0 0/${interval} * ? * * *`;
}

function generateMonthlyCron() {
    const daysInput = document.querySelector('#monthlyOptions input[type="text"]').value;
    if (!daysInput) throw new Error('Enter days of the month (1-31)');

    const days = daysInput.split(',')
        .map(d => parseInt(d))
        .filter(d => d >= 1 && d <= 31)
        .join(',');

    if (!days) throw new Error('Invalid days of the month');

    const time = document.querySelector('#monthlyOptions input[type="time"]').value;
    const [hours, minutes] = time.split(':');
    //0 15 12 3,4 * ? *
    return `0 ${minutes} ${hours} ${days} * ? *`;
}

function generateCustomCron() {
    const daysInput = document.querySelector('#customOptions .day-input').value;
    const time = document.querySelector('#customOptions input[type="time"]').value;

    const monthsInput = document.querySelector('#customOptions select');
    const selectedMonths = Array.from(monthsInput.selectedOptions);

    if (!daysInput || !time || selectedMonths.length === 0) throw new Error('Please complete all fields');

    const days = daysInput.split(',')
        .map(d => parseInt(d))
        .filter(d => d >= 1 && d <= 31)
        .join(',');

    if (!days) throw new Error('Invalid days of month (1-31)');

    const months = getSortedMonths(monthsInput);

    const [hours, minutes] = time.split(':');
    //0 15 12 3,4 JAN,FEB,MAR ? *
    return `0 ${minutes} ${hours} ${days} ${months} ? *`;
}

function getSortedMonths(selectElement) {
    if (selectElement.length === 0) {
        return '*';
    }

    const selectedValues = Array.from(selectElement.selectedOptions)
        .map(option => option.value.toUpperCase());

    const validMonths = selectedValues.filter(month =>
        monthAbbreviations.includes(month)
    );

    if (validMonths.length !== selectedValues.length) {
        const invalidMonths = selectedValues.filter(m => !monthAbbreviations.includes(m));
        alert(`Invalid months detected: ${invalidMonths.join(', ')}`);
    }

    return validMonths.sort((a, b) =>
        monthAbbreviations.indexOf(a) - monthAbbreviations.indexOf(b)
    );
}

//Load
document.getElementById('loadBtn').addEventListener('click', () => {
    try {
        const cron = document.querySelector('.cron-input input').value.trim();
        if (!cron) return;

        const schedule = parseCron(cron);
        updateUI(schedule);
    } catch (error) {
        alert(error.message);
    }
});

function parseCron(cron) {
    const parts = cron.split(/\s+/);
    if (parts.length < 5 || parts.length > 7) throw new Error('Invalid CRON format');

    const [seconds, minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    const pattern = /^((MON|TUE|WED|THU|FRI|SAT|SUN)(,\s*(MON|TUE|WED|THU|FRI|SAT|SUN))*)$/;
    let type = 'custom';
    let params = {};
    // Weekly
    if (pattern.test(dayOfWeek)) {
        type = 'weekly';
        params = {
            days: dayOfWeek.split(','),
            time: `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
        };
    }
    // Daily
    else if (minute.startsWith('0/')) {
        type = 'daily';
        params = {
            interval: parseInt(minute.substring(2))
        };
    }
    //Custom
    else if (month !== '*') {
        type = 'custom';
        params = {
            month: parseCronMonth(month),
            days: dayOfMonth.split(',').map(Number),
            time: `${hour}:${minute}`
        };
    }
    // Monthly
    else if (dayOfMonth !== '*') {
        type = 'monthly';
        params = {
            days: dayOfMonth.split(',').map(Number),
            time: `${hour}:${minute}`
        };
    }

    return { type, params };
}

function parseCronMonth(month) {
    if (month.includes(',')) {
        return month.split(',').map(m => m.trim());
    }
    return [month];
}

function updateUI(schedule) {
    const type = schedule.type;
    document.querySelector(`input[value="${type}"]`).checked = true;
    document.querySelectorAll('.schedule-option').forEach(div => div.style.display = 'none');
    document.getElementById(`${type}Options`).style.display = 'block';

    switch (type) {
        case 'weekly':
            const select = document.querySelector('#weeklyOptions select');
            Array.from(select.options).forEach(option => {
                option.selected = schedule.params.days.includes(option.value);
            });
            document.querySelector('#weeklyOptions input[type="time"]').value = schedule.params.time;
            break;

        case 'daily':
            document.querySelector('#dailyOptions .number-input').value = schedule.params.interval;
            break;

        case 'monthly':
            document.querySelector('#monthlyOptions input[type="text"]').value = schedule.params.days.join(',');
            document.querySelector('#monthlyOptions input[type="time"]').value = schedule.params.time;
            break;

        case 'custom':
            document.querySelector('#customOptions .day-input').value = schedule.params.days?.join(',') || '';

            const monthSelect = document.querySelector('#customOptions select');
            Array.from(monthSelect.options).forEach(option => {
                option.selected = schedule.params.month?.includes(option.value.toUpperCase()) || false;
            });

            document.querySelector('#customOptions input[type="time"]').value = schedule.params.time;
            break;
    }
}
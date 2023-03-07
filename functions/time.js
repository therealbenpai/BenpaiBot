class TimeManager {
    static intlDateTimeSettings = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "long",
        timeZone: "GMT",
        timeZoneName: "shortGeneric",
    }
    static uptime() {
        const { uptime } = process
        const time = {
            year: Math.floor(Math.floor(uptime()) / 60 / 60 / 24 / 30 / 12),
            month: Math.floor(Math.floor(uptime()) / 60 / 60 / 24 / 30) % 12,
            day: Math.floor(Math.floor(uptime()) / 60 / 60 / 24) % 30,
            hour: Math.floor(Math.floor(uptime()) / 60 / 60) % 24,
            minute: Math.floor(Math.floor(uptime()) / 60) % 60,
            second: Math.floor(uptime()) % 60
        }
        return [time.year, time.month, time.day, time.hour, time.minute, time.second]
            .map((value, index) => {
                if (value === 0) return ''
                if (value === 1) {
                    switch (index) {
                        case 0: return `${value} year`
                        case 1: return `${value} month`
                        case 2: return `${value} day`
                        case 3: return `${value} hour`
                        case 4: return `${value} minute`
                        case 5: return `${value} second`
                    }
                } else {
                    switch (index) {
                        case 0: return `${value} years`
                        case 1: return `${value} months`
                        case 2: return `${value} days`
                        case 3: return `${value} hours`
                        case 4: return `${value} minutes`
                        case 5: return `${value} seconds`
                    }
                }
            })
            .filter(value => value !== '')
            .join(', ');
    }
    static time(type = 'US') {
        switch (type) {
            case 'GB':
                return Intl.DateTimeFormat('en-GB', this.intlDateTimeSettings).format()
            default:
                return Intl.DateTimeFormat('en-US', this.intlDateTimeSettings).format()
        }
    }
    static timeStringtoMs(timeString) {
        const time = timeString.split(' ');
        let milliseconds = 0;
        for (let timestamp of time) {
            const unit = timestamp.slice(-1);
            const amount = timestamp.slice(0, -1);
            switch (unit) {
                case 'w':
                    milliseconds += amount * 604800000;
                    break;
                case 'd':
                    milliseconds += amount * 86400000;
                    break;
                case 'h':
                    milliseconds += amount * 3600000;
                    break;
                case 'm':
                    milliseconds += amount * 60000;
                    break;
                case 's':
                    milliseconds += amount * 1000;
                    break;
                default:
                    milliseconds = 0;
            }
        }
        return milliseconds;
    }
}
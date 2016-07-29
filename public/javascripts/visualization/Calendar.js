/**
 * Created by ultra on 7/28/16.
 */
var Calendar, DAYS, MONTHS;

DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Calendar 提供将一个指定日期在日历上显示的功能,$calendar为将日历画出的DOM节点,data表示当前日期
Calendar = (function(){

    // The constructor
    function Calendar($calendar,date,$window){
        ///////////////////////////////////////////////////
        // Public Variables

        this.$calendar = $calendar;
        this.$window = $window;
        this.date = date;
        this.date.setHours(0,0,0,0);
        this._visibleMonth = this.month();
        this._visibleYear = this.year();
        // Template中对应的DOM节点
        this.$title = this.$calendar.find('.drp-month-title');
        this.$dayHeaders = this.$calendar.find('.drp-day-headers');
        this.$days = this.$calendar.find('.drp-days');
        this.$dateDisplay = this.$calendar.find('.drp-calendar-date');

        ///////////////////////////////////////////////////
        // Private Variables
        var self = this;

        $calendar.find('.drp-arrow').click(function(evt) {
            if ($(this).hasClass('drp-arrow-right')) {
                self.showNextMonth();
            } else {
                self.showPreviousMonth();
            }
        });
    }

    ///////////////////////////////////////////////////
    // Public Functions

    // 将日历在Template内画出
    Calendar.prototype.draw = function(){
        var day, _i, _len;
        this.$dayHeaders.empty();
        this.$title.text("" + (this.nameOfMonth(this.visibleMonth())) + " " + (this.visibleYear()));
        for (_i = 0, _len = DAYS.length; _i < _len; _i++) {
            day = DAYS[_i];
            this.$dayHeaders.append($("<li>" + (day.substr(0, 3)) + "</li>"));
        }
        this.$dateDisplay.text([this.month(), this.day(), this.year()].join('/'));
        return this.drawDays();
    }

    Calendar.prototype.drawDays = function() {
        var firstDayOfMonth, i, lastDayOfMonth, self, _i, _j, _ref;
        self = this;
        firstDayOfMonth = this.firstDayOfMonth(this.visibleMonth(), this.visibleYear());
        lastDayOfMonth = this.daysInMonth(this.visibleMonth(), this.visibleYear());

        this.$days.empty();
        // 填充空白部分
        for (i = 1; i <= firstDayOfMonth - 1; i++) {
            this.$days.append($("<li class='drp-day drp-day-empty'></li>"));
        }
        // 画日期
        for (i = 1; i <= lastDayOfMonth; i++) {
            this.$days.append($("<li class='drp-day " + (this.dayClass(i, firstDayOfMonth, lastDayOfMonth)) + "'>" + i + "</li>"));
        }
        // 单个日期的点击事件
        return this.$calendar.find('.drp-day').click(function(evt) {
            var day;
            if ($(this).hasClass('drp-day-disabled')) {
                return false;
            }
            day = parseInt($(this).text(), 10);
            if (isNaN(day)) {
                return false;
            }
            var date = new Date(self.visibleYear(), self.visibleMonth()-1, day);
            self.$window.open('/#/hexagon/'+(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear());
        });
    };

    Calendar.prototype.dayClass = function(day, firstDayOfMonth, lastDayOfMonth) {
        var classes, date;
        date = new Date(this.visibleYear(), this.visibleMonth() - 1, day);
        classes = '';
        if (this.dateIsSelected(date)) {
            classes = 'drp-day-selected';
        }

        if ((day + firstDayOfMonth - 1) % 7 === 0 || day === lastDayOfMonth) {
            classes += ' drp-day-last-in-row';
        }
        return classes;
    }

    // 在日历上画出当前的日期
    Calendar.prototype.setDate = function(year, month, day) {
        this.date = new Date(year, month - 1, day);
        this.draw();
    };

    Calendar.prototype.showPreviousMonth = function() {
        if (this._visibleMonth === 1) {
            this._visibleMonth = 12;
            this._visibleYear -= 1;
        } else {
            this._visibleMonth -= 1;
        }
        return this.draw();
    };

    Calendar.prototype.showNextMonth = function() {
        if (this._visibleMonth === 12) {
            this._visibleMonth = 1;
            this._visibleYear += 1;
        } else {
            this._visibleMonth += 1;
        }
        return this.draw();
    };

    Calendar.prototype.setDay = function(day) {
        this.setDate(this.visibleYear(), this.visibleMonth(), day);
    };

    Calendar.prototype.dateIsSelected = function(date) {
        return date.getTime() === this.date.getTime();
    };

    Calendar.prototype.day = function() {
        return this.date.getDate();
    };

    Calendar.prototype.month = function() {
        return this.date.getMonth() + 1;
    };

    Calendar.prototype.year = function() {
        return this.date.getFullYear();
    };

    Calendar.prototype.visibleMonth = function() {
        return this._visibleMonth;
    };

    Calendar.prototype.visibleYear = function() {
        return this._visibleYear;
    };

    Calendar.prototype.nameOfMonth = function(month) {
        return MONTHS[month - 1];
    };

    Calendar.prototype.firstDayOfMonth = function(month, year) {
        return new Date(year, month - 1, 1).getDay() + 1;
    };

    Calendar.prototype.daysInMonth = function(month, year) {
        month || (month = this.visibleMonth());
        year || (year = this.visibleYear());
        return new Date(year, month, 0).getDate();
    };

    return Calendar;
})();
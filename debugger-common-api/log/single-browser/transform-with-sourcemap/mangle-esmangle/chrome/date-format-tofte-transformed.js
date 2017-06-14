function arrayExists(b, c) {
    for (var a = 0; a < b.length; a++) {
        if (b[a] == c)
            return true;
    }
    return false;
}
Date.prototype.formatDate = function (input, time) {
    var switches = [
        'a',
        'A',
        'B',
        'd',
        'D',
        'F',
        'g',
        'G',
        'h',
        'H',
        'i',
        'j',
        'l',
        'L',
        'm',
        'M',
        'n',
        'O',
        'r',
        's',
        'S',
        't',
        'U',
        'w',
        'W',
        'y',
        'Y',
        'z'
    ];
    var daysLong = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    var daysShort = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];
    var monthsShort = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    var monthsLong = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    var daysSuffix = [
        'st',
        'nd',
        'rd',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'st',
        'nd',
        'rd',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'th',
        'st'
    ];
    function a() {
        return self.getHours() > 11 ? 'pm' : 'am';
    }
    function A() {
        return self.getHours() > 11 ? 'PM' : 'AM';
    }
    function B() {
        var b = (self.getTimezoneOffset() + 60) * 60;
        var c = self.getHours() * 3600 + self.getMinutes() * 60 + self.getSeconds() + b;
        var a = Math.floor(c / 86.4);
        if (a > 1000)
            a -= 1000;
        if (a < 0)
            a += 1000;
        if (('' + a).length == 1)
            a = '00' + a;
        if (('' + a).length == 2)
            a = '0' + a;
        return a;
    }
    function d() {
        return new String(self.getDate()).length == 1 ? '0' + self.getDate() : self.getDate();
    }
    function D() {
        return daysShort[self.getDay()];
    }
    function F() {
        return monthsLong[self.getMonth()];
    }
    function g() {
        return self.getHours() > 12 ? self.getHours() - 12 : self.getHours();
    }
    function G() {
        return self.getHours();
    }
    function h() {
        if (self.getHours() > 12) {
            var a = new String(self.getHours() - 12);
            return a.length == 1 ? '0' + (self.getHours() - 12) : self.getHours() - 12;
        } else {
            var a = new String(self.getHours());
            return a.length == 1 ? '0' + self.getHours() : self.getHours();
        }
    }
    function H() {
        return new String(self.getHours()).length == 1 ? '0' + self.getHours() : self.getHours();
    }
    function i() {
        return new String(self.getMinutes()).length == 1 ? '0' + self.getMinutes() : self.getMinutes();
    }
    function j() {
        return self.getDate();
    }
    function l() {
        return daysLong[self.getDay()];
    }
    function L() {
        var a = Y();
        if (a % 4 == 0 && a % 100 != 0 || a % 4 == 0 && a % 100 == 0 && a % 400 == 0) {
            return 1;
        } else {
            return 0;
        }
    }
    function m() {
        return self.getMonth() < 9 ? '0' + (self.getMonth() + 1) : self.getMonth() + 1;
    }
    function M() {
        return monthsShort[self.getMonth()];
    }
    function n() {
        return self.getMonth() + 1;
    }
    function O() {
        var c = Math.abs(self.getTimezoneOffset());
        var a = '' + Math.floor(c / 60);
        var b = '' + c % 60;
        a.length == 1 ? a = '0' + a : 1;
        b.length == 1 ? b = '0' + b : 1;
        return self.getTimezoneOffset() < 0 ? '+' + a + b : '-' + a + b;
    }
    function r() {
        var a;
        a = D() + ', ' + j() + ' ' + M() + ' ' + Y() + ' ' + H() + ':' + i() + ':' + s() + ' ' + O();
        return a;
    }
    function S() {
        return daysSuffix[self.getDate() - 1];
    }
    function s() {
        return new String(self.getSeconds()).length == 1 ? '0' + self.getSeconds() : self.getSeconds();
    }
    function t() {
        var a = [
            null,
            31,
            28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];
        if (L() == 1 && n() == 2)
            return 29;
        return a[n()];
    }
    function U() {
        return Math.round(self.getTime() / 1000);
    }
    function W() {
        var b = 364 + L() - z();
        var c = z();
        var e = w() != 0 ? w() - 1 : 6;
        if (b <= 2 && e <= 2 - b) {
            return 1;
        }
        var d = new Date('January 1 ' + Y() + ' 00:00:00');
        var a = d.getDay() != 0 ? d.getDay() - 1 : 6;
        if (c <= 2 && a >= 4 && c >= 6 - a) {
            var f = new Date('December 31 ' + (Y() - 1) + ' 00:00:00');
            return f.formatDate('W');
        }
        if (a <= 3) {
            return 1 + Math.floor((z() + a) / 7);
        } else {
            return 1 + Math.floor((z() - (7 - a)) / 7);
        }
    }
    function w() {
        return self.getDay();
    }
    function Y() {
        if (self.getFullYear) {
            var c = new Date('January 1 2001 00:00:00 +0000');
            var a = c.getFullYear();
            if (a == 2001) {
                return self.getFullYear();
            }
        }
        var a = self.getYear();
        var b = a % 100;
        b += b < 38 ? 2000 : 1900;
        return b;
    }
    function y() {
        var a = Y() + '';
        return a.substring(a.length - 2, a.length);
    }
    function z() {
        var a = new Date('January 1 ' + Y() + ' 00:00:00');
        var b = self.getTime() - a.getTime();
        return Math.floor(b / 1000 / 60 / 60 / 24);
    }
    var self = this;
    if (time) {
        var prevTime = self.getTime();
        self.setTime(time);
    }
    var ia = input.split('');
    var ij = 0;
    while (ia[ij]) {
        if (ia[ij] == '\\') {
            ia.splice(ij, 1);
        } else {
            if (arrayExists(switches, ia[ij])) {
                ia[ij] = eval(ia[ij] + '()');
            }
        }
        ij++;
    }
    if (prevTime) {
        self.setTime(prevTime);
    }
    return ia.join('');
};
var date = new Date('1/1/2007 1:11:11');
for (i = 0; i < 500; ++i) {
    var shortFormat = date.formatDate('Y-m-d');
    var longFormat = date.formatDate('l, F d, Y g:i:s A');
    date.setTime(date.getTime() + 84266956);
}
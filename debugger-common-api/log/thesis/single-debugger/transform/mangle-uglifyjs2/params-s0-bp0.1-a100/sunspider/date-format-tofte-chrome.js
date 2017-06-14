function arrayExists(e, t) {
    for (var r = 0; r < e.length; r++) {
        if (e[r] == t) return true;
    }
    return false;
}

Date.prototype.formatDate = function(input, time) {
    var switches = [ "a", "A", "B", "d", "D", "F", "g", "G", "h", "H", "i", "j", "l", "L", "m", "M", "n", "O", "r", "s", "S", "t", "U", "w", "W", "y", "Y", "z" ];
    var daysLong = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    var daysShort = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
    var monthsShort = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var monthsLong = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var daysSuffix = [ "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st" ];
    function a() {
        return self.getHours() > 11 ? "pm" : "am";
    }
    function A() {
        return self.getHours() > 11 ? "PM" : "AM";
    }
    function B() {
        var e = (self.getTimezoneOffset() + 60) * 60;
        var t = self.getHours() * 3600 + self.getMinutes() * 60 + self.getSeconds() + e;
        var r = Math.floor(t / 86.4);
        if (r > 1e3) r -= 1e3;
        if (r < 0) r += 1e3;
        if (("" + r).length == 1) r = "00" + r;
        if (("" + r).length == 2) r = "0" + r;
        return r;
    }
    function d() {
        return new String(self.getDate()).length == 1 ? "0" + self.getDate() : self.getDate();
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
            var e = new String(self.getHours() - 12);
            return e.length == 1 ? "0" + (self.getHours() - 12) : self.getHours() - 12;
        } else {
            var e = new String(self.getHours());
            return e.length == 1 ? "0" + self.getHours() : self.getHours();
        }
    }
    function H() {
        return new String(self.getHours()).length == 1 ? "0" + self.getHours() : self.getHours();
    }
    function i() {
        return new String(self.getMinutes()).length == 1 ? "0" + self.getMinutes() : self.getMinutes();
    }
    function j() {
        return self.getDate();
    }
    function l() {
        return daysLong[self.getDay()];
    }
    function L() {
        var e = Y();
        if (e % 4 == 0 && e % 100 != 0 || e % 4 == 0 && e % 100 == 0 && e % 400 == 0) {
            return 1;
        } else {
            return 0;
        }
    }
    function m() {
        return self.getMonth() < 9 ? "0" + (self.getMonth() + 1) : self.getMonth() + 1;
    }
    function M() {
        return monthsShort[self.getMonth()];
    }
    function n() {
        return self.getMonth() + 1;
    }
    function O() {
        var e = Math.abs(self.getTimezoneOffset());
        var t = "" + Math.floor(e / 60);
        var r = "" + e % 60;
        t.length == 1 ? t = "0" + t : 1;
        r.length == 1 ? r = "0" + r : 1;
        return self.getTimezoneOffset() < 0 ? "+" + t + r : "-" + t + r;
    }
    function r() {
        var e;
        e = D() + ", " + j() + " " + M() + " " + Y() + " " + H() + ":" + i() + ":" + s() + " " + O();
        return e;
    }
    function S() {
        return daysSuffix[self.getDate() - 1];
    }
    function s() {
        return new String(self.getSeconds()).length == 1 ? "0" + self.getSeconds() : self.getSeconds();
    }
    function t() {
        var e = [ null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        if (L() == 1 && n() == 2) return 29;
        return e[n()];
    }
    function U() {
        return Math.round(self.getTime() / 1e3);
    }
    function W() {
        var e = 364 + L() - z();
        var t = z();
        var r = w() != 0 ? w() - 1 : 6;
        if (e <= 2 && r <= 2 - e) {
            return 1;
        }
        var n = new Date("January 1 " + Y() + " 00:00:00");
        var a = n.getDay() != 0 ? n.getDay() - 1 : 6;
        if (t <= 2 && a >= 4 && t >= 6 - a) {
            var s = new Date("December 31 " + (Y() - 1) + " 00:00:00");
            return s.formatDate("W");
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
            var e = new Date("January 1 2001 00:00:00 +0000");
            var t = e.getFullYear();
            if (t == 2001) {
                return self.getFullYear();
            }
        }
        var t = self.getYear();
        var r = t % 100;
        r += r < 38 ? 2e3 : 1900;
        return r;
    }
    function y() {
        var e = Y() + "";
        return e.substring(e.length - 2, e.length);
    }
    function z() {
        var e = new Date("January 1 " + Y() + " 00:00:00");
        var t = self.getTime() - e.getTime();
        return Math.floor(t / 1e3 / 60 / 60 / 24);
    }
    var self = this;
    if (time) {
        var prevTime = self.getTime();
        self.setTime(time);
    }
    var ia = input.split("");
    var ij = 0;
    while (ia[ij]) {
        if (ia[ij] == "\\") {
            ia.splice(ij, 1);
        } else {
            if (arrayExists(switches, ia[ij])) {
                ia[ij] = eval(ia[ij] + "()");
            }
        }
        ij++;
    }
    if (prevTime) {
        self.setTime(prevTime);
    }
    return ia.join("");
};

var date = new Date("1/1/2007 1:11:11");

for (i = 0; i < 500; ++i) {
    var shortFormat = date.formatDate("Y-m-d");
    var longFormat = date.formatDate("l, F d, Y g:i:s A");
    date.setTime(date.getTime() + 84266956);
}
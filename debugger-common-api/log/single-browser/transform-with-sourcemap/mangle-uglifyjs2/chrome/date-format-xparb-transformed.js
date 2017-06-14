Date.parseFunctions = {
    count: 0
};

Date.parseRegexes = [];

Date.formatFunctions = {
    count: 0
};

Date.prototype.dateFormat = function(e) {
    if (Date.formatFunctions[e] == null) {
        Date.createNewFormat(e);
    }
    var t = Date.formatFunctions[e];
    return this[t]();
};

Date.createNewFormat = function(format) {
    var funcName = "format" + Date.formatFunctions.count++;
    Date.formatFunctions[format] = funcName;
    var code = "Date.prototype." + funcName + " = function(){return ";
    var special = false;
    var ch = "";
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        } else if (special) {
            special = false;
            code += "'" + String.escape(ch) + "' + ";
        } else {
            code += Date.getFormatCode(ch);
        }
    }
    eval(code.substring(0, code.length - 3) + ";}");
};

Date.getFormatCode = function(e) {
    switch (e) {
      case "d":
        return "String.leftPad(this.getDate(), 2, '0') + ";

      case "D":
        return "Date.dayNames[this.getDay()].substring(0, 3) + ";

      case "j":
        return "this.getDate() + ";

      case "l":
        return "Date.dayNames[this.getDay()] + ";

      case "S":
        return "this.getSuffix() + ";

      case "w":
        return "this.getDay() + ";

      case "z":
        return "this.getDayOfYear() + ";

      case "W":
        return "this.getWeekOfYear() + ";

      case "F":
        return "Date.monthNames[this.getMonth()] + ";

      case "m":
        return "String.leftPad(this.getMonth() + 1, 2, '0') + ";

      case "M":
        return "Date.monthNames[this.getMonth()].substring(0, 3) + ";

      case "n":
        return "(this.getMonth() + 1) + ";

      case "t":
        return "this.getDaysInMonth() + ";

      case "L":
        return "(this.isLeapYear() ? 1 : 0) + ";

      case "Y":
        return "this.getFullYear() + ";

      case "y":
        return "('' + this.getFullYear()).substring(2, 4) + ";

      case "a":
        return "(this.getHours() < 12 ? 'am' : 'pm') + ";

      case "A":
        return "(this.getHours() < 12 ? 'AM' : 'PM') + ";

      case "g":
        return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";

      case "G":
        return "this.getHours() + ";

      case "h":
        return "String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";

      case "H":
        return "String.leftPad(this.getHours(), 2, '0') + ";

      case "i":
        return "String.leftPad(this.getMinutes(), 2, '0') + ";

      case "s":
        return "String.leftPad(this.getSeconds(), 2, '0') + ";

      case "O":
        return "this.getGMTOffset() + ";

      case "T":
        return "this.getTimezone() + ";

      case "Z":
        return "(this.getTimezoneOffset() * -60) + ";

      default:
        return "'" + String.escape(e) + "' + ";
    }
};

Date.parseDate = function(e, t) {
    if (Date.parseFunctions[t] == null) {
        Date.createParser(t);
    }
    var r = Date.parseFunctions[t];
    return Date[r](e);
};

Date.createParser = function(format) {
    var funcName = "parse" + Date.parseFunctions.count++;
    var regexNum = Date.parseRegexes.length;
    var currentGroup = 1;
    Date.parseFunctions[format] = funcName;
    var code = "Date." + funcName + " = function(input){\n" + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1;\n" + "var d = new Date();\n" + "y = d.getFullYear();\n" + "m = d.getMonth();\n" + "d = d.getDate();\n" + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n" + "if (results && results.length > 0) {";
    var regex = "";
    var special = false;
    var ch = "";
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        } else if (special) {
            special = false;
            regex += String.escape(ch);
        } else {
            obj = Date.formatCodeToRegex(ch, currentGroup);
            currentGroup += obj.g;
            regex += obj.s;
            if (obj.g && obj.c) {
                code += obj.c;
            }
        }
    }
    code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n" + "{return new Date(y, m, d, h, i, s);}\n" + "else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n" + "{return new Date(y, m, d, h, i);}\n" + "else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n" + "{return new Date(y, m, d, h);}\n" + "else if (y > 0 && m >= 0 && d > 0)\n" + "{return new Date(y, m, d);}\n" + "else if (y > 0 && m >= 0)\n" + "{return new Date(y, m);}\n" + "else if (y > 0)\n" + "{return new Date(y);}\n" + "}return null;}";
    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
    eval(code);
};

Date.formatCodeToRegex = function(e, t) {
    switch (e) {
      case "D":
        return {
            g: 0,
            c: null,
            s: "(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"
        };

      case "j":
      case "d":
        return {
            g: 1,
            c: "d = parseInt(results[" + t + "], 10);\n",
            s: "(\\d{1,2})"
        };

      case "l":
        return {
            g: 0,
            c: null,
            s: "(?:" + Date.dayNames.join("|") + ")"
        };

      case "S":
        return {
            g: 0,
            c: null,
            s: "(?:st|nd|rd|th)"
        };

      case "w":
        return {
            g: 0,
            c: null,
            s: "\\d"
        };

      case "z":
        return {
            g: 0,
            c: null,
            s: "(?:\\d{1,3})"
        };

      case "W":
        return {
            g: 0,
            c: null,
            s: "(?:\\d{2})"
        };

      case "F":
        return {
            g: 1,
            c: "m = parseInt(Date.monthNumbers[results[" + t + "].substring(0, 3)], 10);\n",
            s: "(" + Date.monthNames.join("|") + ")"
        };

      case "M":
        return {
            g: 1,
            c: "m = parseInt(Date.monthNumbers[results[" + t + "]], 10);\n",
            s: "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
        };

      case "n":
      case "m":
        return {
            g: 1,
            c: "m = parseInt(results[" + t + "], 10) - 1;\n",
            s: "(\\d{1,2})"
        };

      case "t":
        return {
            g: 0,
            c: null,
            s: "\\d{1,2}"
        };

      case "L":
        return {
            g: 0,
            c: null,
            s: "(?:1|0)"
        };

      case "Y":
        return {
            g: 1,
            c: "y = parseInt(results[" + t + "], 10);\n",
            s: "(\\d{4})"
        };

      case "y":
        return {
            g: 1,
            c: "var ty = parseInt(results[" + t + "], 10);\n" + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
            s: "(\\d{1,2})"
        };

      case "a":
        return {
            g: 1,
            c: "if (results[" + t + "] == 'am') {\n" + "if (h == 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}",
            s: "(am|pm)"
        };

      case "A":
        return {
            g: 1,
            c: "if (results[" + t + "] == 'AM') {\n" + "if (h == 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}",
            s: "(AM|PM)"
        };

      case "g":
      case "G":
      case "h":
      case "H":
        return {
            g: 1,
            c: "h = parseInt(results[" + t + "], 10);\n",
            s: "(\\d{1,2})"
        };

      case "i":
        return {
            g: 1,
            c: "i = parseInt(results[" + t + "], 10);\n",
            s: "(\\d{2})"
        };

      case "s":
        return {
            g: 1,
            c: "s = parseInt(results[" + t + "], 10);\n",
            s: "(\\d{2})"
        };

      case "O":
        return {
            g: 0,
            c: null,
            s: "[+-]\\d{4}"
        };

      case "T":
        return {
            g: 0,
            c: null,
            s: "[A-Z]{3}"
        };

      case "Z":
        return {
            g: 0,
            c: null,
            s: "[+-]\\d{1,5}"
        };

      default:
        return {
            g: 0,
            c: null,
            s: String.escape(e)
        };
    }
};

Date.prototype.getTimezone = function() {
    return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
};

Date.prototype.getGMTOffset = function() {
    return (this.getTimezoneOffset() > 0 ? "-" : "+") + String.leftPad(Math.floor(this.getTimezoneOffset() / 60), 2, "0") + String.leftPad(this.getTimezoneOffset() % 60, 2, "0");
};

Date.prototype.getDayOfYear = function() {
    var e = 0;
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    for (var t = 0; t < this.getMonth(); ++t) {
        e += Date.daysInMonth[t];
    }
    return e + this.getDate() - 1;
};

Date.prototype.getWeekOfYear = function() {
    var e = this.getDayOfYear() + (4 - this.getDay());
    var t = new Date(this.getFullYear(), 0, 1);
    var r = 7 - t.getDay() + 4;
    document.write(r);
    return String.leftPad((e - r) / 7 + 1, 2, "0");
};

Date.prototype.isLeapYear = function() {
    var e = this.getFullYear();
    return (e & 3) == 0 && (e % 100 || e % 400 == 0 && e);
};

Date.prototype.getFirstDayOfMonth = function() {
    var e = (this.getDay() - (this.getDate() - 1)) % 7;
    return e < 0 ? e + 7 : e;
};

Date.prototype.getLastDayOfMonth = function() {
    var e = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
    return e < 0 ? e + 7 : e;
};

Date.prototype.getDaysInMonth = function() {
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    return Date.daysInMonth[this.getMonth()];
};

Date.prototype.getSuffix = function() {
    switch (this.getDate()) {
      case 1:
      case 21:
      case 31:
        return "st";

      case 2:
      case 22:
        return "nd";

      case 3:
      case 23:
        return "rd";

      default:
        return "th";
    }
};

String.escape = function(e) {
    return e.replace(/('|\\)/g, "\\$1");
};

String.leftPad = function(e, t, r) {
    var a = new String(e);
    if (r == null) {
        r = " ";
    }
    while (a.length < t) {
        a = r + a;
    }
    return a;
};

Date.daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

Date.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

Date.dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

Date.y2kYear = 50;

Date.monthNumbers = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
};

Date.patterns = {
    ISO8601LongPattern: "Y-m-d H:i:s",
    ISO8601ShortPattern: "Y-m-d",
    ShortDatePattern: "n/j/Y",
    LongDatePattern: "l, F d, Y",
    FullDateTimePattern: "l, F d, Y g:i:s A",
    MonthDayPattern: "F d",
    ShortTimePattern: "g:i A",
    LongTimePattern: "g:i:s A",
    SortableDateTimePattern: "Y-m-d\\TH:i:s",
    UniversalSortableDateTimePattern: "Y-m-d H:i:sO",
    YearMonthPattern: "F, Y"
};

var date = new Date("1/1/2007 1:11:11");

for (i = 0; i < 4e3; ++i) {
    var shortFormat = date.dateFormat("Y-m-d");
    var longFormat = date.dateFormat("l, F d, Y g:i:s A");
    date.setTime(date.getTime() + 84266956);
}
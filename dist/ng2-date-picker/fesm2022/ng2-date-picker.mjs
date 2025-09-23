import * as i0 from '@angular/core';
import { ElementRef, Injectable, EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, Input, HostBinding, Output, forwardRef, ViewChild, HostListener, Directive, Optional, NgModule } from '@angular/core';
import * as i4$1 from '@angular/forms';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule } from '@angular/forms';
import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i5 from '@angular/cdk/overlay';
import { OverlayModule } from '@angular/cdk/overlay';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as i4 from '@angular/cdk/bidi';

var ECalendarMode;
(function (ECalendarMode) {
    ECalendarMode[ECalendarMode["Day"] = 0] = "Day";
    ECalendarMode[ECalendarMode["DayTime"] = 1] = "DayTime";
    ECalendarMode[ECalendarMode["Month"] = 2] = "Month";
    ECalendarMode[ECalendarMode["Time"] = 3] = "Time";
})(ECalendarMode || (ECalendarMode = {}));

var ECalendarValue;
(function (ECalendarValue) {
    ECalendarValue[ECalendarValue["Dayjs"] = 1] = "Dayjs";
    ECalendarValue[ECalendarValue["DayjsArr"] = 2] = "DayjsArr";
    ECalendarValue[ECalendarValue["String"] = 3] = "String";
    ECalendarValue[ECalendarValue["StringArr"] = 4] = "StringArr";
})(ECalendarValue || (ECalendarValue = {}));

var SelectEvent;
(function (SelectEvent) {
    SelectEvent["INPUT"] = "input";
    SelectEvent["SELECTION"] = "selection";
})(SelectEvent || (SelectEvent = {}));

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
const dayjsRef = dayjs;

class UtilsService {
    static debounce(func, wait) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            timeout = clearTimeout(timeout);
            setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    ;
    createArray(size) {
        return new Array(size).fill(1);
    }
    convertToDayjs(date, format) {
        if (!date) {
            return null;
        }
        else if (typeof date === 'string') {
            return dayjsRef(date, format);
        }
        else {
            return dayjsRef(date.toDate());
        }
    }
    isDateValid(date, format) {
        if (date === '') {
            return true;
        }
        return dayjsRef(date, format, true).isValid();
    }
    // todo:: add unit test
    getDefaultDisplayDate(current, selected, allowMultiSelect, minDate) {
        if (current) {
            return dayjsRef(current.toDate());
        }
        else if (minDate && minDate.isAfter(dayjsRef())) {
            return dayjsRef(minDate.toDate());
        }
        else if (allowMultiSelect) {
            if (selected && selected[selected.length]) {
                return dayjsRef(selected[selected.length].toDate());
            }
        }
        else if (selected && selected[0]) {
            return dayjsRef(selected[0].toDate());
        }
        return dayjsRef();
    }
    // todo:: add unit test
    getInputType(value, allowMultiSelect) {
        if (Array.isArray(value)) {
            if (!value.length) {
                return ECalendarValue.DayjsArr;
            }
            else if (typeof value[0] === 'string') {
                return ECalendarValue.StringArr;
            }
            else if (dayjsRef.isDayjs(value[0])) {
                return ECalendarValue.DayjsArr;
            }
        }
        else {
            if (typeof value === 'string') {
                return ECalendarValue.String;
            }
            else if (dayjsRef.isDayjs(value)) {
                return ECalendarValue.Dayjs;
            }
        }
        return allowMultiSelect ? ECalendarValue.DayjsArr : ECalendarValue.Dayjs;
    }
    // todo:: add unit test
    convertToDayjsArray(value, config) {
        let retVal;
        switch (this.getInputType(value, config.allowMultiSelect)) {
            case (ECalendarValue.String):
                retVal = value ? [dayjsRef(value, config.format, true)] : [];
                break;
            case (ECalendarValue.StringArr):
                retVal = value.map(v => v ? dayjsRef(v, config.format, true) : null).filter(Boolean);
                break;
            case (ECalendarValue.Dayjs):
                retVal = value ? [dayjsRef(value.toDate())] : [];
                break;
            case (ECalendarValue.DayjsArr):
                retVal = (value || []).map(v => dayjsRef(v.toDate()));
                break;
            default:
                retVal = [];
        }
        return retVal;
    }
    // todo:: add unit test
    convertFromDayjsArray(format, value, convertTo) {
        switch (convertTo) {
            case (ECalendarValue.String):
                return value[0] && value[0].format(format);
            case (ECalendarValue.StringArr):
                return value.filter(Boolean).map(v => v.format(format));
            case (ECalendarValue.Dayjs):
                return value[0] ? dayjsRef(value[0].toDate()) : value[0];
            case (ECalendarValue.DayjsArr):
                return value ? value.map(v => dayjsRef(v.toDate())) : value;
            default:
                return value;
        }
    }
    convertToString(value, format) {
        let tmpVal;
        if (typeof value === 'string') {
            tmpVal = [value];
        }
        else if (Array.isArray(value)) {
            if (value.length) {
                tmpVal = value.map((v) => {
                    return this.convertToDayjs(v, format).format(format);
                });
            }
            else {
                tmpVal = value;
            }
        }
        else if (dayjsRef.isDayjs(value)) {
            tmpVal = [value.format(format)];
        }
        else {
            return '';
        }
        return tmpVal.filter(Boolean).join(' | ');
    }
    // todo:: add unit test
    clearUndefined(obj) {
        if (!obj) {
            return obj;
        }
        Object.keys(obj).forEach((key) => (obj[key] === undefined) && delete obj[key]);
        return obj;
    }
    updateSelected(isMultiple, currentlySelected, date, granularity = 'day') {
        if (isMultiple) {
            return !date.selected
                ? currentlySelected.concat([date.date])
                : currentlySelected.filter(d => !d.isSame(date.date, granularity));
        }
        else {
            return !date.selected ? [date.date] : [];
        }
    }
    closestParent(element, selector) {
        if (!element) {
            return undefined;
        }
        const match = element.querySelector(selector);
        return match || this.closestParent(element.parentElement, selector);
    }
    onlyTime(m) {
        return m && dayjsRef.isDayjs(m) && dayjsRef(m.format('HH:mm:ss'), 'HH:mm:ss');
    }
    granularityFromType(calendarType) {
        switch (calendarType) {
            case 'time':
                return 'second';
            case 'daytime':
                return 'second';
            default:
                return calendarType;
        }
    }
    createValidator({ minDate, maxDate, minTime, maxTime }, format, calendarType) {
        let isValid;
        let value;
        const validators = [];
        const granularity = this.granularityFromType(calendarType);
        if (minDate) {
            const md = this.convertToDayjs(minDate, format);
            validators.push({
                key: 'minDate',
                isValid: () => {
                    const _isValid = value.every(val => val.isSameOrAfter(md, granularity));
                    isValid = isValid ? _isValid : false;
                    return _isValid;
                }
            });
        }
        if (maxDate) {
            const md = this.convertToDayjs(maxDate, format);
            validators.push({
                key: 'maxDate',
                isValid: () => {
                    const _isValid = value.every(val => val.isSameOrBefore(md, granularity));
                    isValid = isValid ? _isValid : false;
                    return _isValid;
                }
            });
        }
        if (minTime) {
            const md = this.onlyTime(this.convertToDayjs(minTime, format));
            validators.push({
                key: 'minTime',
                isValid: () => {
                    const _isValid = value.every(val => this.onlyTime(val).isSameOrAfter(md));
                    isValid = isValid ? _isValid : false;
                    return _isValid;
                }
            });
        }
        if (maxTime) {
            const md = this.onlyTime(this.convertToDayjs(maxTime, format));
            validators.push({
                key: 'maxTime',
                isValid: () => {
                    const _isValid = value.every(val => this.onlyTime(val).isSameOrBefore(md));
                    isValid = isValid ? _isValid : false;
                    return _isValid;
                }
            });
        }
        return (inputVal) => {
            isValid = true;
            value = this.convertToDayjsArray(inputVal, {
                format,
                allowMultiSelect: true
            }).filter(Boolean);
            if (!value.every(val => val.isValid())) {
                return {
                    format: {
                        given: inputVal
                    }
                };
            }
            const errors = validators.reduce((map, err) => {
                if (!err.isValid()) {
                    map[err.key] = {
                        given: value
                    };
                }
                return map;
            }, {});
            return !isValid ? errors : null;
        };
    }
    datesStringToStringArray(value) {
        return (value || '').split('|').map(m => m.trim()).filter(Boolean);
    }
    getValidDayjsArray(value, format) {
        return this.datesStringToStringArray(value)
            .filter(d => this.isDateValid(d, format))
            .map(d => dayjsRef(d, format));
    }
    shouldShowCurrent(showGoToCurrent, mode, min, max) {
        return showGoToCurrent &&
            mode !== 'time' &&
            this.isDateInRange(dayjsRef(), min, max);
    }
    isDateInRange(date, from, to) {
        if (!date) {
            return false;
        }
        if (!from && !to) {
            return true;
        }
        if (!from && to) {
            return date.isSameOrBefore(to);
        }
        if (from && !to) {
            return date.isSameOrAfter(from);
        }
        return date.isBetween(from, to, 'day', '[]');
    }
    convertPropsToDayjs(obj, format, props) {
        props.forEach((prop) => {
            if (obj.hasOwnProperty(prop)) {
                obj[prop] = this.convertToDayjs(obj[prop], format);
            }
        });
    }
    shouldResetCurrentView(prevConf, currentConf) {
        if (prevConf && currentConf) {
            if (!prevConf.min && currentConf.min) {
                return true;
            }
            else if (prevConf.min && currentConf.min && !prevConf.min.isSame(currentConf.min, 'd')) {
                return true;
            }
            else if (!prevConf.max && currentConf.max) {
                return true;
            }
            else if (prevConf.max && currentConf.max && !prevConf.max.isSame(currentConf.max, 'd')) {
                return true;
            }
            return false;
        }
        return false;
    }
    getNativeElement(elem) {
        if (!elem) {
            return null;
        }
        else if (typeof elem === 'string') {
            return document.querySelector(elem);
        }
        else if (elem instanceof ElementRef) {
            return elem.nativeElement;
        }
        else {
            return elem;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: UtilsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: UtilsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: UtilsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class DayCalendarService {
    constructor(utilsService) {
        this.utilsService = utilsService;
        this.DEFAULT_CONFIG = {
            showNearMonthDays: true,
            showWeekNumbers: false,
            firstDayOfWeek: 'su',
            weekDayFormat: 'ddd',
            format: 'DD-MM-YYYY',
            allowMultiSelect: false,
            monthFormat: 'MMM, YYYY',
            enableMonthSelector: true,
            dayBtnFormat: 'DD',
            unSelectOnClick: true
        };
        this.DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    }
    getConfig(config) {
        const _config = {
            ...this.DEFAULT_CONFIG,
            ...this.utilsService.clearUndefined(config)
        };
        this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);
        return _config;
    }
    generateDaysMap(firstDayOfWeek) {
        const firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
        const daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
        return daysArr.reduce((map, day, index) => {
            map[day] = index;
            return map;
        }, {});
    }
    generateMonthArray(config, month, selected) {
        const parsedMonth = month.isValid() ? dayjsRef(month.toDate()) : dayjsRef();
        let monthArray = [];
        const firstDayOfWeekIndex = this.DAYS.indexOf(config.firstDayOfWeek);
        let firstDayOfBoard = parsedMonth.startOf('month');
        while (firstDayOfBoard.day() !== firstDayOfWeekIndex) {
            firstDayOfBoard = firstDayOfBoard.subtract(1, 'day');
        }
        let current = dayjsRef(firstDayOfBoard.toDate());
        const prevMonth = parsedMonth.subtract(1, 'month');
        const nextMonth = parsedMonth.add(1, 'month');
        const today = dayjsRef();
        const daysOfCalendar = this.utilsService.createArray(42)
            .reduce((array) => {
            array.push({
                date: dayjsRef(current.toDate()),
                selected: !!selected.find(selectedDay => current.isSame(selectedDay, 'day')),
                currentMonth: current.isSame(parsedMonth, 'month'),
                prevMonth: current.isSame(prevMonth, 'month'),
                nextMonth: current.isSame(nextMonth, 'month'),
                currentDay: current.isSame(today, 'day'),
                disabled: this.isDateDisabled(current, config)
            });
            current = current.add(1, 'day');
            return array;
        }, []);
        daysOfCalendar.forEach((day, index) => {
            const weekIndex = Math.floor(index / 7);
            if (!monthArray[weekIndex]) {
                monthArray.push([]);
            }
            monthArray[weekIndex].push(day);
        });
        if (!config.showNearMonthDays) {
            monthArray = this.removeNearMonthWeeks(parsedMonth, monthArray);
        }
        return monthArray;
    }
    generateWeekdays(firstDayOfWeek) {
        const weekdayNames = {
            su: dayjsRef().day(0),
            mo: dayjsRef().day(1),
            tu: dayjsRef().day(2),
            we: dayjsRef().day(3),
            th: dayjsRef().day(4),
            fr: dayjsRef().day(5),
            sa: dayjsRef().day(6)
        };
        const weekdays = [];
        const daysMap = this.generateDaysMap(firstDayOfWeek);
        for (const dayKey in daysMap) {
            if (daysMap.hasOwnProperty(dayKey)) {
                weekdays[daysMap[dayKey]] = weekdayNames[dayKey];
            }
        }
        return weekdays;
    }
    isDateDisabled(date, config) {
        if (config.isDayDisabledCallback) {
            return config.isDayDisabledCallback(date);
        }
        if (config.min && date.isBefore(config.min, 'day')) {
            return true;
        }
        return !!(config.max && date.isAfter(config.max, 'day'));
    }
    // todo:: add unit tests
    getHeaderLabel(config, month) {
        if (config.monthFormatter) {
            return config.monthFormatter(month);
        }
        return month.format(config.monthFormat);
    }
    // todo:: add unit tests
    shouldShowLeft(min, currentMonthView) {
        return min ? min.isBefore(currentMonthView, 'month') : true;
    }
    // todo:: add unit tests
    shouldShowRight(max, currentMonthView) {
        return max ? max.isAfter(currentMonthView, 'month') : true;
    }
    generateDaysIndexMap(firstDayOfWeek) {
        const firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
        const daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
        return daysArr.reduce((map, day, index) => {
            map[index] = day;
            return map;
        }, {});
    }
    getMonthCalendarConfig(componentConfig) {
        return this.utilsService.clearUndefined({
            min: componentConfig.min,
            max: componentConfig.max,
            format: componentConfig.format,
            isNavHeaderBtnClickable: true,
            allowMultiSelect: false,
            yearFormat: componentConfig.yearFormat,
            yearFormatter: componentConfig.yearFormatter,
            monthBtnFormat: componentConfig.monthBtnFormat,
            monthBtnFormatter: componentConfig.monthBtnFormatter,
            monthBtnCssClassCallback: componentConfig.monthBtnCssClassCallback,
            isMonthDisabledCallback: componentConfig.isMonthDisabledCallback,
            multipleYearsNavigateBy: componentConfig.multipleYearsNavigateBy,
            showMultipleYearsNavigation: componentConfig.showMultipleYearsNavigation,
            showGoToCurrent: componentConfig.showGoToCurrent,
            numOfMonthRows: componentConfig.numOfMonthRows
        });
    }
    getDayBtnText(config, day) {
        if (config.dayBtnFormatter) {
            return config.dayBtnFormatter(day);
        }
        return day.format(config.dayBtnFormat);
    }
    getDayBtnCssClass(config, day) {
        if (config.dayBtnCssClassCallback) {
            return config.dayBtnCssClassCallback(day);
        }
        return '';
    }
    removeNearMonthWeeks(currentMonth, monthArray) {
        if (monthArray[monthArray.length - 1].find((day) => day.date.isSame(currentMonth, 'month'))) {
            return monthArray;
        }
        else {
            return monthArray.slice(0, -1);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayCalendarService, deps: [{ token: UtilsService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayCalendarService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayCalendarService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: UtilsService }] });

const FIRST_PM_HOUR = 12;
class TimeSelectService {
    constructor(utilsService) {
        this.utilsService = utilsService;
        this.DEFAULT_CONFIG = {
            hours12Format: 'hh',
            hours24Format: 'HH',
            meridiemFormat: 'A',
            minutesFormat: 'mm',
            minutesInterval: 1,
            secondsFormat: 'ss',
            secondsInterval: 1,
            showSeconds: false,
            showTwentyFourHours: false,
            timeSeparator: ':',
        };
    }
    getConfig(config) {
        const timeConfigs = {
            maxTime: this.utilsService.onlyTime(config && config.maxTime),
            minTime: this.utilsService.onlyTime(config && config.minTime)
        };
        return {
            ...this.DEFAULT_CONFIG,
            ...this.utilsService.clearUndefined(config),
            ...timeConfigs
        };
    }
    getTimeFormat(config) {
        return (config.showTwentyFourHours ? config.hours24Format : config.hours12Format)
            + config.timeSeparator + config.minutesFormat
            + (config.showSeconds ? (config.timeSeparator + config.secondsFormat) : '')
            + (config.showTwentyFourHours ? '' : ' ' + config.meridiemFormat);
    }
    getHours(config, t) {
        const time = t || dayjsRef();
        return time && time.format(config.showTwentyFourHours ? config.hours24Format : config.hours12Format);
    }
    getMinutes(config, t) {
        const time = t || dayjsRef();
        return time && time.format(config.minutesFormat);
    }
    getSeconds(config, t) {
        const time = t || dayjsRef();
        return time && time.format(config.secondsFormat);
    }
    getMeridiem(config, time) {
        return time && time.format(config.meridiemFormat);
    }
    decrease(config, time, unit) {
        let amount = 1;
        switch (unit) {
            case 'minute':
                amount = config.minutesInterval;
                break;
            case 'second':
                amount = config.secondsInterval;
                break;
        }
        return time.subtract(amount, unit);
    }
    increase(config, time, unit) {
        let amount = 1;
        switch (unit) {
            case 'minute':
                amount = config.minutesInterval;
                break;
            case 'second':
                amount = config.secondsInterval;
                break;
        }
        return time.add(amount, unit);
    }
    toggleMeridiem(time) {
        if (time.hour() < FIRST_PM_HOUR) {
            return time.add(12, 'hour');
        }
        else {
            return time.subtract(12, 'hour');
        }
    }
    shouldShowDecrease(config, time, unit) {
        if (!config.min && !config.minTime) {
            return true;
        }
        const newTime = this.decrease(config, time, unit);
        return (!config.min || config.min.isSameOrBefore(newTime))
            && (!config.minTime || config.minTime.isSameOrBefore(this.utilsService.onlyTime(newTime)));
    }
    shouldShowIncrease(config, time, unit) {
        if (!config.max && !config.maxTime) {
            return true;
        }
        const newTime = this.increase(config, time, unit);
        return (!config.max || config.max.isSameOrAfter(newTime))
            && (!config.maxTime || config.maxTime.isSameOrAfter(this.utilsService.onlyTime(newTime)));
    }
    shouldShowToggleMeridiem(config, time) {
        if (!config.min && !config.max && !config.minTime && !config.maxTime) {
            return true;
        }
        const newTime = this.toggleMeridiem(time);
        return (!config.max || config.max.isSameOrAfter(newTime))
            && (!config.min || config.min.isSameOrBefore(newTime))
            && (!config.maxTime || config.maxTime.isSameOrAfter(this.utilsService.onlyTime(newTime)))
            && (!config.minTime || config.minTime.isSameOrBefore(this.utilsService.onlyTime(newTime)));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: TimeSelectService, deps: [{ token: UtilsService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: TimeSelectService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: TimeSelectService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: UtilsService }] });

const DAY_FORMAT = 'YYYYMMDD';
const TIME_FORMAT = 'HH:mm:ss';
const COMBINED_FORMAT = DAY_FORMAT + TIME_FORMAT;
class DayTimeCalendarService {
    constructor(utilsService, dayCalendarService, timeSelectService) {
        this.utilsService = utilsService;
        this.dayCalendarService = dayCalendarService;
        this.timeSelectService = timeSelectService;
        this.DEFAULT_CONFIG = {};
    }
    getConfig(config) {
        const _config = {
            ...this.DEFAULT_CONFIG,
            ...this.timeSelectService.getConfig(config),
            ...this.dayCalendarService.getConfig(config)
        };
        this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);
        return _config;
    }
    updateDay(current, day, config) {
        const time = current ? current : dayjsRef();
        let updated = dayjsRef(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), COMBINED_FORMAT);
        if (config.min) {
            const min = config.min;
            updated = min.isAfter(updated) ? min : updated;
        }
        if (config.max) {
            const max = config.max;
            updated = max.isBefore(updated) ? max : updated;
        }
        return updated;
    }
    updateTime(current, time) {
        const day = current ? current : dayjsRef();
        return dayjsRef(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), COMBINED_FORMAT);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayTimeCalendarService, deps: [{ token: UtilsService }, { token: DayCalendarService }, { token: TimeSelectService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayTimeCalendarService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayTimeCalendarService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: UtilsService }, { type: DayCalendarService }, { type: TimeSelectService }] });

class DatePickerService {
    constructor(utilsService, timeSelectService, daytimeCalendarService) {
        this.utilsService = utilsService;
        this.timeSelectService = timeSelectService;
        this.daytimeCalendarService = daytimeCalendarService;
        this.onPickerClosed = new EventEmitter();
        this.defaultConfig = {
            closeOnSelect: true,
            closeOnSelectDelay: 100,
            closeOnEnter: true,
            format: 'DD-MM-YYYY',
            openOnFocus: true,
            openOnClick: true,
            onOpenDelay: 0,
            disableKeypress: false,
            showNearMonthDays: true,
            showWeekNumbers: false,
            enableMonthSelector: true,
            showGoToCurrent: true,
            hideOnOutsideClick: true,
        };
    }
    // todo:: add unit tests
    getConfig(config, mode = 'daytime') {
        const _config = {
            ...this.defaultConfig,
            format: DatePickerService.getDefaultFormatByMode(mode),
            ...this.utilsService.clearUndefined(config)
        };
        this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);
        if (config && config.allowMultiSelect && config.closeOnSelect === undefined) {
            _config.closeOnSelect = false;
        }
        return _config;
    }
    getDayConfigService(pickerConfig) {
        return {
            min: pickerConfig.min,
            max: pickerConfig.max,
            isDayDisabledCallback: pickerConfig.isDayDisabledCallback,
            weekDayFormat: pickerConfig.weekDayFormat,
            weekDayFormatter: pickerConfig.weekDayFormatter,
            showNearMonthDays: pickerConfig.showNearMonthDays,
            showWeekNumbers: pickerConfig.showWeekNumbers,
            firstDayOfWeek: pickerConfig.firstDayOfWeek,
            format: pickerConfig.format,
            allowMultiSelect: pickerConfig.allowMultiSelect,
            monthFormat: pickerConfig.monthFormat,
            monthFormatter: pickerConfig.monthFormatter,
            enableMonthSelector: pickerConfig.enableMonthSelector,
            yearFormat: pickerConfig.yearFormat,
            yearFormatter: pickerConfig.yearFormatter,
            dayBtnFormat: pickerConfig.dayBtnFormat,
            dayBtnFormatter: pickerConfig.dayBtnFormatter,
            dayBtnCssClassCallback: pickerConfig.dayBtnCssClassCallback,
            monthBtnFormat: pickerConfig.monthBtnFormat,
            monthBtnFormatter: pickerConfig.monthBtnFormatter,
            monthBtnCssClassCallback: pickerConfig.monthBtnCssClassCallback,
            isMonthDisabledCallback: pickerConfig.isMonthDisabledCallback,
            multipleYearsNavigateBy: pickerConfig.multipleYearsNavigateBy,
            showMultipleYearsNavigation: pickerConfig.showMultipleYearsNavigation,
            returnedValueType: pickerConfig.returnedValueType,
            showGoToCurrent: pickerConfig.showGoToCurrent,
            unSelectOnClick: pickerConfig.unSelectOnClick,
            numOfMonthRows: pickerConfig.numOfMonthRows
        };
    }
    getDayTimeConfig(pickerConfig) {
        return this.daytimeCalendarService.getConfig(pickerConfig);
    }
    getTimeConfig(pickerConfig) {
        return this.timeSelectService.getConfig(pickerConfig);
    }
    pickerClosed() {
        this.onPickerClosed.emit();
    }
    // todo:: add unit tests
    isValidInputDateValue(value, config) {
        value = value ? value : '';
        const datesStrArr = this.utilsService.datesStringToStringArray(value);
        return datesStrArr.every(date => this.utilsService.isDateValid(date, config.format));
    }
    // todo:: add unit tests
    convertInputValueToDayjsArray(value, config) {
        value = value ? value : '';
        const datesStrArr = this.utilsService.datesStringToStringArray(value);
        return this.utilsService.convertToDayjsArray(datesStrArr, config);
    }
    getOverlayPosition({ drops, opens }) {
        if (!drops && !opens) {
            return undefined;
        }
        return [{
                originX: opens ? opens === 'left' ? 'start' : 'end' : 'start',
                originY: drops ? drops === 'up' ? 'top' : 'bottom' : 'bottom',
                overlayX: opens ? opens === 'left' ? 'start' : 'end' : 'start',
                overlayY: drops ? drops === 'up' ? 'bottom' : 'top' : 'top',
            }];
    }
    static getDefaultFormatByMode(mode) {
        switch (mode) {
            case 'day':
                return 'DD-MM-YYYY';
            case 'daytime':
                return 'DD-MM-YYYY HH:mm:ss';
            case 'time':
                return 'HH:mm:ss';
            case 'month':
                return 'MMM, YYYY';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DatePickerService, deps: [{ token: UtilsService }, { token: TimeSelectService }, { token: DayTimeCalendarService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DatePickerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DatePickerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: UtilsService }, { type: TimeSelectService }, { type: DayTimeCalendarService }] });

class MonthCalendarService {
    constructor(utilsService) {
        this.utilsService = utilsService;
        this.DEFAULT_CONFIG = {
            allowMultiSelect: false,
            yearFormat: 'YYYY',
            format: 'MM-YYYY',
            isNavHeaderBtnClickable: false,
            monthBtnFormat: 'MMM',
            multipleYearsNavigateBy: 10,
            showMultipleYearsNavigation: false,
            unSelectOnClick: true,
            numOfMonthRows: 3
        };
    }
    getConfig(config) {
        const _config = {
            ...this.DEFAULT_CONFIG,
            ...this.utilsService.clearUndefined(config)
        };
        MonthCalendarService.validateConfig(_config);
        this.utilsService.convertPropsToDayjs(_config, _config.format, ['min', 'max']);
        return _config;
    }
    generateYear(config, year, selected = null) {
        let index = year.startOf('year');
        return this.utilsService.createArray(config.numOfMonthRows).map(() => {
            return this.utilsService.createArray(12 / config.numOfMonthRows).map(() => {
                const date = dayjsRef(index);
                const month = {
                    date,
                    selected: !!selected.find(s => index.isSame(s, 'month')),
                    currentMonth: index.isSame(dayjsRef(), 'month'),
                    disabled: this.isMonthDisabled(date, config),
                    text: this.getMonthBtnText(config, date)
                };
                index = index.add(1, 'month');
                return month;
            });
        });
    }
    isMonthDisabled(date, config) {
        if (config.isMonthDisabledCallback) {
            return config.isMonthDisabledCallback(date);
        }
        if (config.min && date.isBefore(config.min, 'month')) {
            return true;
        }
        return !!(config.max && date.isAfter(config.max, 'month'));
    }
    shouldShowLeft(min, currentMonthView) {
        return min ? min.isBefore(currentMonthView, 'year') : true;
    }
    shouldShowRight(max, currentMonthView) {
        return max ? max.isAfter(currentMonthView, 'year') : true;
    }
    getHeaderLabel(config, year) {
        if (config.yearFormatter) {
            return config.yearFormatter(year);
        }
        return year.format(config.yearFormat);
    }
    getMonthBtnText(config, month) {
        if (config.monthBtnFormatter) {
            return config.monthBtnFormatter(month);
        }
        return month.format(config.monthBtnFormat);
    }
    getMonthBtnCssClass(config, month) {
        if (config.monthBtnCssClassCallback) {
            return config.monthBtnCssClassCallback(month);
        }
        return '';
    }
    static validateConfig(config) {
        if (config.numOfMonthRows < 1 || config.numOfMonthRows > 12 || !Number.isInteger(12 / config.numOfMonthRows)) {
            throw new Error('numOfMonthRows has to be between 1 - 12 and divide 12 to integer');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: MonthCalendarService, deps: [{ token: UtilsService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: MonthCalendarService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: MonthCalendarService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: UtilsService }] });

class CalendarNavComponent {
    constructor() {
        this.isLabelClickable = false;
        this.showLeftNav = true;
        this.showLeftSecondaryNav = false;
        this.showRightNav = true;
        this.showRightSecondaryNav = false;
        this.leftNavDisabled = false;
        this.leftSecondaryNavDisabled = false;
        this.rightNavDisabled = false;
        this.rightSecondaryNavDisabled = false;
        this.showGoToCurrent = true;
        this.onLeftNav = new EventEmitter();
        this.onLeftSecondaryNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onRightSecondaryNav = new EventEmitter();
        this.onLabelClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
    }
    leftNavClicked() {
        this.onLeftNav.emit();
    }
    leftSecondaryNavClicked() {
        this.onLeftSecondaryNav.emit();
    }
    rightNavClicked() {
        this.onRightNav.emit();
    }
    rightSecondaryNavClicked() {
        this.onRightSecondaryNav.emit();
    }
    labelClicked() {
        this.onLabelClick.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: CalendarNavComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.4", type: CalendarNavComponent, isStandalone: false, selector: "dp-calendar-nav", inputs: { label: "label", isLabelClickable: "isLabelClickable", showLeftNav: "showLeftNav", showLeftSecondaryNav: "showLeftSecondaryNav", showRightNav: "showRightNav", showRightSecondaryNav: "showRightSecondaryNav", leftNavDisabled: "leftNavDisabled", leftSecondaryNavDisabled: "leftSecondaryNavDisabled", rightNavDisabled: "rightNavDisabled", rightSecondaryNavDisabled: "rightSecondaryNavDisabled", showGoToCurrent: "showGoToCurrent", theme: "theme" }, outputs: { onLeftNav: "onLeftNav", onLeftSecondaryNav: "onLeftSecondaryNav", onRightNav: "onRightNav", onRightSecondaryNav: "onRightSecondaryNav", onLabelClick: "onLabelClick", onGoToCurrent: "onGoToCurrent" }, host: { properties: { "class": "this.theme" } }, ngImport: i0, template: "<div class=\"dp-calendar-nav-container\" dir=\"ltr\">\n  <div class=\"dp-nav-header\">\n    <span [attr.data-hidden]=\"isLabelClickable\"\n          [hidden]=\"isLabelClickable\"\n          [innerText]=\"label\">\n    </span>\n    <button (click)=\"labelClicked()\"\n            [attr.data-hidden]=\"!isLabelClickable\"\n            [hidden]=\"!isLabelClickable\"\n            [innerText]=\"label\"\n            class=\"dp-nav-header-btn\"\n            type=\"button\">\n    </button>\n  </div>\n\n  <div class=\"dp-nav-btns-container\">\n    <div class=\"dp-calendar-nav-container-left\">\n      <button (click)=\"leftSecondaryNavClicked()\"\n              *ngIf=\"showLeftSecondaryNav\"\n              [disabled]=\"leftSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-left\"\n              type=\"button\">\n      </button>\n      <button (click)=\"leftNavClicked()\"\n              [attr.data-hidden]=\"!showLeftNav\"\n              [disabled]=\"leftNavDisabled\"\n              [hidden]=\"!showLeftNav\"\n              class=\"dp-calendar-nav-left\"\n              type=\"button\">\n      </button>\n    </div>\n    <button (click)=\"onGoToCurrent.emit()\"\n            *ngIf=\"showGoToCurrent\"\n            class=\"dp-current-location-btn\"\n            type=\"button\">\n    </button>\n    <div class=\"dp-calendar-nav-container-right\">\n      <button (click)=\"rightNavClicked()\"\n              [attr.data-hidden]=\"!showRightNav\"\n              [disabled]=\"rightNavDisabled\"\n              [hidden]=\"!showRightNav\"\n              class=\"dp-calendar-nav-right\"\n              type=\"button\">\n      </button>\n      <button (click)=\"rightSecondaryNavClicked()\"\n              *ngIf=\"showRightSecondaryNav\"\n              [disabled]=\"rightSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-right\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n", styles: ["dp-calendar-nav .dp-calendar-nav-container{position:relative;box-sizing:border-box;height:25px;border:1px solid #000000;border-bottom:none}dp-calendar-nav .dp-nav-date-btn{box-sizing:border-box;height:25px;border:1px solid #000000;border-bottom:none}dp-calendar-nav .dp-nav-btns-container{position:absolute;top:50%;transform:translateY(-50%);right:5px;display:inline-block}dp-calendar-nav .dp-calendar-nav-container-left,dp-calendar-nav .dp-calendar-nav-container-right{display:inline-block}dp-calendar-nav .dp-calendar-nav-left,dp-calendar-nav .dp-calendar-nav-right,dp-calendar-nav .dp-calendar-secondary-nav-left,dp-calendar-nav .dp-calendar-secondary-nav-right{position:relative;width:16px;cursor:pointer}dp-calendar-nav .dp-calendar-nav-left,dp-calendar-nav .dp-calendar-nav-right{line-height:0}dp-calendar-nav .dp-calendar-nav-left:before,dp-calendar-nav .dp-calendar-nav-right:before{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(45deg)}dp-calendar-nav .dp-calendar-secondary-nav-left,dp-calendar-nav .dp-calendar-secondary-nav-right{padding:0}dp-calendar-nav .dp-calendar-secondary-nav-left:before,dp-calendar-nav .dp-calendar-secondary-nav-right:before,dp-calendar-nav .dp-calendar-secondary-nav-left:after,dp-calendar-nav .dp-calendar-secondary-nav-right:after{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(45deg)}dp-calendar-nav .dp-calendar-secondary-nav-left:before,dp-calendar-nav .dp-calendar-secondary-nav-right:before{right:-10px}dp-calendar-nav .dp-calendar-secondary-nav-right{left:initial;right:5px}dp-calendar-nav .dp-calendar-nav-left:before{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(-135deg)}dp-calendar-nav .dp-calendar-secondary-nav-left:before,dp-calendar-nav .dp-calendar-secondary-nav-left:after{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(-135deg)}dp-calendar-nav .dp-calendar-secondary-nav-left:before{right:-10px}dp-calendar-nav .dp-nav-header{position:absolute;top:50%;transform:translateY(-50%);left:5px;display:inline-block;font-size:13px}dp-calendar-nav .dp-nav-header-btn{cursor:pointer}dp-calendar-nav .dp-current-location-btn{position:relative;top:-1px;height:16px;width:16px;vertical-align:middle;background:#0009;border:1px solid rgba(0,0,0,.6);outline:none;border-radius:50%;box-shadow:inset 0 0 0 3px #fff;cursor:pointer}dp-calendar-nav .dp-current-location-btn:hover{background:#000}dp-calendar-nav.dp-material .dp-calendar-nav-container{height:30px;border:1px solid #E0E0E0}dp-calendar-nav.dp-material .dp-calendar-nav-left,dp-calendar-nav.dp-material .dp-calendar-nav-right,dp-calendar-nav.dp-material .dp-calendar-secondary-nav-left,dp-calendar-nav.dp-material .dp-calendar-secondary-nav-right{border:none;background:#fff;outline:none;font-size:16px;padding:0}dp-calendar-nav.dp-material .dp-calendar-secondary-nav-left,dp-calendar-nav.dp-material .dp-calendar-secondary-nav-right{width:20px}dp-calendar-nav.dp-material .dp-nav-header-btn{height:20px;width:80px;border:none;background:#fff;outline:none}dp-calendar-nav.dp-material .dp-nav-header-btn:hover{background:#0000000d}dp-calendar-nav.dp-material .dp-nav-header-btn:active{background:#0000001a}\n"], dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.Dir, selector: "[dir]", inputs: ["dir"], outputs: ["dirChange"], exportAs: ["dir"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: CalendarNavComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dp-calendar-nav', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<div class=\"dp-calendar-nav-container\" dir=\"ltr\">\n  <div class=\"dp-nav-header\">\n    <span [attr.data-hidden]=\"isLabelClickable\"\n          [hidden]=\"isLabelClickable\"\n          [innerText]=\"label\">\n    </span>\n    <button (click)=\"labelClicked()\"\n            [attr.data-hidden]=\"!isLabelClickable\"\n            [hidden]=\"!isLabelClickable\"\n            [innerText]=\"label\"\n            class=\"dp-nav-header-btn\"\n            type=\"button\">\n    </button>\n  </div>\n\n  <div class=\"dp-nav-btns-container\">\n    <div class=\"dp-calendar-nav-container-left\">\n      <button (click)=\"leftSecondaryNavClicked()\"\n              *ngIf=\"showLeftSecondaryNav\"\n              [disabled]=\"leftSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-left\"\n              type=\"button\">\n      </button>\n      <button (click)=\"leftNavClicked()\"\n              [attr.data-hidden]=\"!showLeftNav\"\n              [disabled]=\"leftNavDisabled\"\n              [hidden]=\"!showLeftNav\"\n              class=\"dp-calendar-nav-left\"\n              type=\"button\">\n      </button>\n    </div>\n    <button (click)=\"onGoToCurrent.emit()\"\n            *ngIf=\"showGoToCurrent\"\n            class=\"dp-current-location-btn\"\n            type=\"button\">\n    </button>\n    <div class=\"dp-calendar-nav-container-right\">\n      <button (click)=\"rightNavClicked()\"\n              [attr.data-hidden]=\"!showRightNav\"\n              [disabled]=\"rightNavDisabled\"\n              [hidden]=\"!showRightNav\"\n              class=\"dp-calendar-nav-right\"\n              type=\"button\">\n      </button>\n      <button (click)=\"rightSecondaryNavClicked()\"\n              *ngIf=\"showRightSecondaryNav\"\n              [disabled]=\"rightSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-right\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n", styles: ["dp-calendar-nav .dp-calendar-nav-container{position:relative;box-sizing:border-box;height:25px;border:1px solid #000000;border-bottom:none}dp-calendar-nav .dp-nav-date-btn{box-sizing:border-box;height:25px;border:1px solid #000000;border-bottom:none}dp-calendar-nav .dp-nav-btns-container{position:absolute;top:50%;transform:translateY(-50%);right:5px;display:inline-block}dp-calendar-nav .dp-calendar-nav-container-left,dp-calendar-nav .dp-calendar-nav-container-right{display:inline-block}dp-calendar-nav .dp-calendar-nav-left,dp-calendar-nav .dp-calendar-nav-right,dp-calendar-nav .dp-calendar-secondary-nav-left,dp-calendar-nav .dp-calendar-secondary-nav-right{position:relative;width:16px;cursor:pointer}dp-calendar-nav .dp-calendar-nav-left,dp-calendar-nav .dp-calendar-nav-right{line-height:0}dp-calendar-nav .dp-calendar-nav-left:before,dp-calendar-nav .dp-calendar-nav-right:before{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(45deg)}dp-calendar-nav .dp-calendar-secondary-nav-left,dp-calendar-nav .dp-calendar-secondary-nav-right{padding:0}dp-calendar-nav .dp-calendar-secondary-nav-left:before,dp-calendar-nav .dp-calendar-secondary-nav-right:before,dp-calendar-nav .dp-calendar-secondary-nav-left:after,dp-calendar-nav .dp-calendar-secondary-nav-right:after{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(45deg)}dp-calendar-nav .dp-calendar-secondary-nav-left:before,dp-calendar-nav .dp-calendar-secondary-nav-right:before{right:-10px}dp-calendar-nav .dp-calendar-secondary-nav-right{left:initial;right:5px}dp-calendar-nav .dp-calendar-nav-left:before{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(-135deg)}dp-calendar-nav .dp-calendar-secondary-nav-left:before,dp-calendar-nav .dp-calendar-secondary-nav-left:after{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(-135deg)}dp-calendar-nav .dp-calendar-secondary-nav-left:before{right:-10px}dp-calendar-nav .dp-nav-header{position:absolute;top:50%;transform:translateY(-50%);left:5px;display:inline-block;font-size:13px}dp-calendar-nav .dp-nav-header-btn{cursor:pointer}dp-calendar-nav .dp-current-location-btn{position:relative;top:-1px;height:16px;width:16px;vertical-align:middle;background:#0009;border:1px solid rgba(0,0,0,.6);outline:none;border-radius:50%;box-shadow:inset 0 0 0 3px #fff;cursor:pointer}dp-calendar-nav .dp-current-location-btn:hover{background:#000}dp-calendar-nav.dp-material .dp-calendar-nav-container{height:30px;border:1px solid #E0E0E0}dp-calendar-nav.dp-material .dp-calendar-nav-left,dp-calendar-nav.dp-material .dp-calendar-nav-right,dp-calendar-nav.dp-material .dp-calendar-secondary-nav-left,dp-calendar-nav.dp-material .dp-calendar-secondary-nav-right{border:none;background:#fff;outline:none;font-size:16px;padding:0}dp-calendar-nav.dp-material .dp-calendar-secondary-nav-left,dp-calendar-nav.dp-material .dp-calendar-secondary-nav-right{width:20px}dp-calendar-nav.dp-material .dp-nav-header-btn{height:20px;width:80px;border:none;background:#fff;outline:none}dp-calendar-nav.dp-material .dp-nav-header-btn:hover{background:#0000000d}dp-calendar-nav.dp-material .dp-nav-header-btn:active{background:#0000001a}\n"] }]
        }], propDecorators: { label: [{
                type: Input
            }], isLabelClickable: [{
                type: Input
            }], showLeftNav: [{
                type: Input
            }], showLeftSecondaryNav: [{
                type: Input
            }], showRightNav: [{
                type: Input
            }], showRightSecondaryNav: [{
                type: Input
            }], leftNavDisabled: [{
                type: Input
            }], leftSecondaryNavDisabled: [{
                type: Input
            }], rightNavDisabled: [{
                type: Input
            }], rightSecondaryNavDisabled: [{
                type: Input
            }], showGoToCurrent: [{
                type: Input
            }], theme: [{
                type: HostBinding,
                args: ['class']
            }, {
                type: Input
            }], onLeftNav: [{
                type: Output
            }], onLeftSecondaryNav: [{
                type: Output
            }], onRightNav: [{
                type: Output
            }], onRightSecondaryNav: [{
                type: Output
            }], onLabelClick: [{
                type: Output
            }], onGoToCurrent: [{
                type: Output
            }] } });

class MonthCalendarComponent {
    constructor(monthCalendarService, utilsService, cd) {
        this.monthCalendarService = monthCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onSelect = new EventEmitter();
        this.onNavHeaderBtnClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onLeftSecondaryNav = new EventEmitter();
        this.onRightSecondaryNav = new EventEmitter();
        this.isInited = false;
        this._shouldShowCurrent = true;
        this.api = {
            toggleCalendar: this.toggleCalendarMode.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    get currentDateView() {
        return this._currentDateView;
    }
    set currentDateView(current) {
        this._currentDateView = dayjsRef(current.toDate());
        this.yearMonths = this.monthCalendarService
            .generateYear(this.componentConfig, this._currentDateView, this.selected);
        this.navLabel = this.monthCalendarService.getHeaderLabel(this.componentConfig, this.currentDateView);
        this.showLeftNav = this.monthCalendarService.shouldShowLeft(this.componentConfig.min, this._currentDateView);
        this.showRightNav = this.monthCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
        this.showSecondaryLeftNav = this.componentConfig.showMultipleYearsNavigation && this.showLeftNav;
        this.showSecondaryRightNav = this.componentConfig.showMultipleYearsNavigation && this.showRightNav;
    }
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, config } = changes;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
            this.cd.markForCheck();
        }
    }
    init() {
        this.componentConfig = this.monthCalendarService.getConfig(this.config);
        this.selected = this.selected || [];
        this.currentDateView = this.displayDate ?? this.utilsService
            .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this._shouldShowCurrent = this.shouldShowCurrent();
    }
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToDayjsArray(value, this.componentConfig);
            this.yearMonths = this.monthCalendarService
                .generateYear(this.componentConfig, this.currentDateView, this.selected);
            this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        }
        else {
            this.selected = [];
            this.yearMonths = this.monthCalendarService
                .generateYear(this.componentConfig, this.currentDateView, this.selected);
        }
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_) {
    }
    registerOnTouched(fn) {
    }
    validate(formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    processOnChangeCallback(value) {
        return this.utilsService.convertFromDayjsArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'month');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    monthClicked(month) {
        if (month.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, month, 'month');
        this.yearMonths = this.monthCalendarService
            .generateYear(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(month);
    }
    onLeftNavClick() {
        const from = dayjsRef(this.currentDateView.toDate());
        this.currentDateView = this.currentDateView.subtract(1, 'year');
        const to = dayjsRef(this.currentDateView.toDate());
        this.yearMonths = this.monthCalendarService.generateYear(this.componentConfig, this.currentDateView, this.selected);
        this.onLeftNav.emit({ from, to });
    }
    onLeftSecondaryNavClick() {
        let navigateBy = this.componentConfig.multipleYearsNavigateBy;
        const isOutsideRange = this.componentConfig.min &&
            this.currentDateView.year() - this.componentConfig.min.year() < navigateBy;
        if (isOutsideRange) {
            navigateBy = this.currentDateView.year() - this.componentConfig.min.year();
        }
        const from = dayjsRef(this.currentDateView.toDate());
        this.currentDateView = this.currentDateView.subtract(navigateBy, 'year');
        const to = dayjsRef(this.currentDateView.toDate());
        this.onLeftSecondaryNav.emit({ from, to });
    }
    onRightNavClick() {
        const from = dayjsRef(this.currentDateView.toDate());
        this.currentDateView = this.currentDateView.add(1, 'year');
        const to = dayjsRef(this.currentDateView.toDate());
        this.onRightNav.emit({ from, to });
    }
    onRightSecondaryNavClick() {
        let navigateBy = this.componentConfig.multipleYearsNavigateBy;
        const isOutsideRange = this.componentConfig.max &&
            this.componentConfig.max.year() - this.currentDateView.year() < navigateBy;
        if (isOutsideRange) {
            navigateBy = this.componentConfig.max.year() - this.currentDateView.year();
        }
        const from = dayjsRef(this.currentDateView.toDate());
        this.currentDateView = this.currentDateView.add(navigateBy, 'year');
        const to = dayjsRef(this.currentDateView.toDate());
        this.onRightSecondaryNav.emit({ from, to });
    }
    toggleCalendarMode() {
        this.onNavHeaderBtnClick.emit();
    }
    getMonthBtnCssClass(month) {
        const cssClass = {
            'dp-selected': month.selected,
            'dp-current-month': month.currentMonth
        };
        const customCssClass = this.monthCalendarService.getMonthBtnCssClass(this.componentConfig, month.date);
        if (customCssClass) {
            cssClass[customCssClass] = true;
        }
        return cssClass;
    }
    shouldShowCurrent() {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'month', this.componentConfig.min, this.componentConfig.max);
    }
    goToCurrent() {
        this.currentDateView = dayjsRef();
        this.onGoToCurrent.emit();
    }
    moveCalendarTo(to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToDayjs(to, this.componentConfig.format);
            this.cd.markForCheck();
        }
    }
    handleConfigChange(config) {
        if (config) {
            const prevConf = this.monthCalendarService.getConfig(config.previousValue);
            const currentConf = this.monthCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
                this._currentDateView = null;
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: MonthCalendarComponent, deps: [{ token: MonthCalendarService }, { token: UtilsService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.4", type: MonthCalendarComponent, isStandalone: false, selector: "dp-month-calendar", inputs: { config: "config", displayDate: "displayDate", minDate: "minDate", maxDate: "maxDate", theme: "theme" }, outputs: { onSelect: "onSelect", onNavHeaderBtnClick: "onNavHeaderBtnClick", onGoToCurrent: "onGoToCurrent", onLeftNav: "onLeftNav", onRightNav: "onRightNav", onLeftSecondaryNav: "onLeftSecondaryNav", onRightSecondaryNav: "onRightSecondaryNav" }, host: { properties: { "class": "this.theme" } }, providers: [
            MonthCalendarService,
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => MonthCalendarComponent),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => MonthCalendarComponent),
                multi: true
            }
        ], usesOnChanges: true, ngImport: i0, template: "<div class=\"dp-month-calendar-container\" dir=\"ltr\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode()\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onLeftSecondaryNav)=\"onLeftSecondaryNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      (onRightSecondaryNav)=\"onRightSecondaryNavClick()\"\n      [isLabelClickable]=\"componentConfig.isNavHeaderBtnClickable\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"shouldShowCurrent()\"\n      [showLeftNav]=\"showLeftNav\"\n      [showLeftSecondaryNav]=\"showSecondaryLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [showRightSecondaryNav]=\"showSecondaryRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div class=\"dp-calendar-wrapper\">\n    <div *ngFor=\"let monthRow of yearMonths\" class=\"dp-months-row\">\n      <button (click)=\"monthClicked(month)\"\n              *ngFor=\"let month of monthRow\"\n              [attr.data-date]=\"month.date.format(componentConfig.format)\"\n              [disabled]=\"month.disabled\"\n              [innerText]=\"month.text\"\n              [ngClass]=\"getMonthBtnCssClass(month)\"\n              class=\"dp-calendar-month\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n", styles: ["dp-month-calendar{display:inline-block}dp-month-calendar .dp-month-calendar-container{background:#fff}dp-month-calendar .dp-calendar-wrapper{border:1px solid #000000}dp-month-calendar .dp-calendar-month{box-sizing:border-box;width:52.5px;height:52.5px;cursor:pointer}dp-month-calendar .dp-calendar-month.dp-selected{background:#106cc8;color:#fff}dp-month-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;background:#e0e0e0;border:1px solid #E0E0E0}dp-month-calendar.dp-material .dp-calendar-wrapper{border:1px solid #E0E0E0}dp-month-calendar.dp-material .dp-calendar-month{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:none}dp-month-calendar.dp-material .dp-calendar-month:hover{background:#e0e0e0}dp-month-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-month-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-month-calendar.dp-material .dp-current-month{border:1px solid #106CC8}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i4.Dir, selector: "[dir]", inputs: ["dir"], outputs: ["dirChange"], exportAs: ["dir"] }, { kind: "component", type: CalendarNavComponent, selector: "dp-calendar-nav", inputs: ["label", "isLabelClickable", "showLeftNav", "showLeftSecondaryNav", "showRightNav", "showRightSecondaryNav", "leftNavDisabled", "leftSecondaryNavDisabled", "rightNavDisabled", "rightSecondaryNavDisabled", "showGoToCurrent", "theme"], outputs: ["onLeftNav", "onLeftSecondaryNav", "onRightNav", "onRightSecondaryNav", "onLabelClick", "onGoToCurrent"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: MonthCalendarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dp-month-calendar', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        MonthCalendarService,
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => MonthCalendarComponent),
                            multi: true
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: forwardRef(() => MonthCalendarComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div class=\"dp-month-calendar-container\" dir=\"ltr\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode()\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onLeftSecondaryNav)=\"onLeftSecondaryNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      (onRightSecondaryNav)=\"onRightSecondaryNavClick()\"\n      [isLabelClickable]=\"componentConfig.isNavHeaderBtnClickable\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"shouldShowCurrent()\"\n      [showLeftNav]=\"showLeftNav\"\n      [showLeftSecondaryNav]=\"showSecondaryLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [showRightSecondaryNav]=\"showSecondaryRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div class=\"dp-calendar-wrapper\">\n    <div *ngFor=\"let monthRow of yearMonths\" class=\"dp-months-row\">\n      <button (click)=\"monthClicked(month)\"\n              *ngFor=\"let month of monthRow\"\n              [attr.data-date]=\"month.date.format(componentConfig.format)\"\n              [disabled]=\"month.disabled\"\n              [innerText]=\"month.text\"\n              [ngClass]=\"getMonthBtnCssClass(month)\"\n              class=\"dp-calendar-month\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n", styles: ["dp-month-calendar{display:inline-block}dp-month-calendar .dp-month-calendar-container{background:#fff}dp-month-calendar .dp-calendar-wrapper{border:1px solid #000000}dp-month-calendar .dp-calendar-month{box-sizing:border-box;width:52.5px;height:52.5px;cursor:pointer}dp-month-calendar .dp-calendar-month.dp-selected{background:#106cc8;color:#fff}dp-month-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;background:#e0e0e0;border:1px solid #E0E0E0}dp-month-calendar.dp-material .dp-calendar-wrapper{border:1px solid #E0E0E0}dp-month-calendar.dp-material .dp-calendar-month{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:none}dp-month-calendar.dp-material .dp-calendar-month:hover{background:#e0e0e0}dp-month-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-month-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-month-calendar.dp-material .dp-current-month{border:1px solid #106CC8}\n"] }]
        }], ctorParameters: () => [{ type: MonthCalendarService }, { type: UtilsService }, { type: i0.ChangeDetectorRef }], propDecorators: { config: [{
                type: Input
            }], displayDate: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], theme: [{
                type: HostBinding,
                args: ['class']
            }, {
                type: Input
            }], onSelect: [{
                type: Output
            }], onNavHeaderBtnClick: [{
                type: Output
            }], onGoToCurrent: [{
                type: Output
            }], onLeftNav: [{
                type: Output
            }], onRightNav: [{
                type: Output
            }], onLeftSecondaryNav: [{
                type: Output
            }], onRightSecondaryNav: [{
                type: Output
            }] } });

class DayCalendarComponent {
    constructor(dayCalendarService, utilsService, cd) {
        this.dayCalendarService = dayCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onSelect = new EventEmitter();
        this.onMonthSelect = new EventEmitter();
        this.onNavHeaderBtnClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.CalendarMode = ECalendarMode;
        this.isInited = false;
        this.currentCalendarMode = ECalendarMode.Day;
        this._shouldShowCurrent = true;
        this.api = {
            moveCalendarsBy: this.moveCalendarsBy.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this),
            toggleCalendarMode: this.toggleCalendarMode.bind(this)
        };
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    get currentDateView() {
        return this._currentDateView;
    }
    set currentDateView(current) {
        this._currentDateView = dayjsRef(current.toDate());
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
        this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
        this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
        this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
    }
    ;
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    init() {
        this.componentConfig = this.dayCalendarService.getConfig(this.config);
        this.selected = this.selected || [];
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToDayjs(this.displayDate, this.componentConfig.format)
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.weekdays = this.dayCalendarService
            .generateWeekdays(this.componentConfig.firstDayOfWeek);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this.monthCalendarConfig = this.dayCalendarService.getMonthCalendarConfig(this.componentConfig);
        this._shouldShowCurrent = this.shouldShowCurrent();
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, config } = changes;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    }
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToDayjsArray(value, this.componentConfig);
            this.inputValueType = this.utilsService
                .getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        }
        else {
            this.selected = [];
        }
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_) {
    }
    registerOnTouched(fn) {
    }
    validate(formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    processOnChangeCallback(value) {
        return this.utilsService.convertFromDayjsArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    dayClicked(day) {
        if (day.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, day);
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(day);
    }
    getDayBtnText(day) {
        return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
    }
    getDayBtnCssClass(day) {
        const cssClasses = {
            'dp-selected': day.selected,
            'dp-current-month': day.currentMonth,
            'dp-prev-month': day.prevMonth,
            'dp-next-month': day.nextMonth,
            'dp-current-day': day.currentDay
        };
        const customCssClass = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);
        if (customCssClass) {
            cssClasses[customCssClass] = true;
        }
        return cssClasses;
    }
    onLeftNavClick() {
        const from = dayjsRef(this.currentDateView.toDate());
        this.moveCalendarsBy(this.currentDateView, -1, 'month');
        const to = dayjsRef(this.currentDateView.toDate());
        this.onLeftNav.emit({ from, to });
    }
    onRightNavClick() {
        const from = dayjsRef(this.currentDateView.toDate());
        this.moveCalendarsBy(this.currentDateView, 1, 'month');
        const to = dayjsRef(this.currentDateView.toDate());
        this.onRightNav.emit({ from, to });
    }
    onMonthCalendarLeftClick(change) {
        this.onLeftNav.emit(change);
    }
    onMonthCalendarRightClick(change) {
        this.onRightNav.emit(change);
    }
    onMonthCalendarSecondaryLeftClick(change) {
        this.onRightNav.emit(change);
    }
    onMonthCalendarSecondaryRightClick(change) {
        this.onLeftNav.emit(change);
    }
    getWeekdayName(weekday) {
        if (this.componentConfig.weekDayFormatter) {
            return this.componentConfig.weekDayFormatter(weekday.day());
        }
        return weekday.format(this.componentConfig.weekDayFormat);
    }
    toggleCalendarMode(mode) {
        if (this.currentCalendarMode !== mode) {
            this.currentCalendarMode = mode;
            this.onNavHeaderBtnClick.emit(mode);
        }
        this.cd.markForCheck();
    }
    monthSelected(month) {
        this.currentDateView = dayjsRef(month.date.toDate());
        this.currentCalendarMode = ECalendarMode.Day;
        this.onMonthSelect.emit(month);
    }
    moveCalendarsBy(current, amount, granularity = 'month') {
        this.currentDateView = dayjsRef(current.toDate()).add(amount, granularity);
        this.cd.markForCheck();
    }
    moveCalendarTo(to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToDayjs(to, this.componentConfig.format);
        }
        this.cd.markForCheck();
    }
    shouldShowCurrent() {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'day', this.componentConfig.min, this.componentConfig.max);
    }
    goToCurrent() {
        this.currentDateView = dayjsRef();
        this.onGoToCurrent.emit();
    }
    handleConfigChange(config) {
        if (config) {
            const prevConf = this.dayCalendarService.getConfig(config.previousValue);
            const currentConf = this.dayCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
                this._currentDateView = null;
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayCalendarComponent, deps: [{ token: DayCalendarService }, { token: UtilsService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.4", type: DayCalendarComponent, isStandalone: false, selector: "dp-day-calendar", inputs: { config: "config", displayDate: "displayDate", minDate: "minDate", maxDate: "maxDate", theme: "theme" }, outputs: { onSelect: "onSelect", onMonthSelect: "onMonthSelect", onNavHeaderBtnClick: "onNavHeaderBtnClick", onGoToCurrent: "onGoToCurrent", onLeftNav: "onLeftNav", onRightNav: "onRightNav" }, host: { properties: { "class": "this.theme" } }, providers: [
            DayCalendarService,
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DayCalendarComponent),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => DayCalendarComponent),
                multi: true
            }
        ], usesOnChanges: true, ngImport: i0, template: "<div *ngIf=\"currentCalendarMode ===  CalendarMode.Day\" class=\"dp-day-calendar-container\" dir=\"ltr\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode(CalendarMode.Month)\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      [isLabelClickable]=\"componentConfig.enableMonthSelector\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"_shouldShowCurrent\"\n      [showLeftNav]=\"showLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div [ngClass]=\"{'dp-hide-near-month': !componentConfig.showNearMonthDays}\"\n       class=\"dp-calendar-wrapper\">\n    <div class=\"dp-weekdays\">\n      <span *ngFor=\"let weekday of weekdays\"\n            [innerText]=\"getWeekdayName(weekday)\"\n            class=\"dp-calendar-weekday\">\n      </span>\n    </div>\n    <div *ngFor=\"let week of weeks\" class=\"dp-calendar-week\">\n      <span *ngIf=\"componentConfig.showWeekNumbers\"\n            [innerText]=\"week[0].date.isoWeek()\"\n            class=\"dp-week-number\">\n      </span>\n      <button (click)=\"dayClicked(day)\"\n              *ngFor=\"let day of week\"\n              [attr.data-date]=\"day.date.format(componentConfig.format)\"\n              [disabled]=\"day.disabled\"\n              [innerText]=\"getDayBtnText(day)\"\n              [ngClass]=\"getDayBtnCssClass(day)\"\n              class=\"dp-calendar-day\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n\n<dp-month-calendar\n    (onLeftNav)=\"onMonthCalendarLeftClick($event)\"\n    (onLeftSecondaryNav)=\"onMonthCalendarSecondaryLeftClick($event)\"\n    (onNavHeaderBtnClick)=\"toggleCalendarMode(CalendarMode.Day)\"\n    (onRightNav)=\"onMonthCalendarRightClick($event)\"\n    (onRightSecondaryNav)=\"onMonthCalendarSecondaryRightClick($event)\"\n    (onSelect)=\"monthSelected($event)\"\n    *ngIf=\"currentCalendarMode ===  CalendarMode.Month\"\n    [config]=\"monthCalendarConfig\"\n    [displayDate]=\"_currentDateView\"\n    [ngModel]=\"_selected\"\n    [theme]=\"theme\">\n</dp-month-calendar>\n", styles: ["dp-day-calendar{display:inline-block}dp-day-calendar .dp-day-calendar-container{background:#fff}dp-day-calendar .dp-calendar-wrapper{box-sizing:border-box;border:1px solid #000000}dp-day-calendar .dp-calendar-wrapper .dp-calendar-weekday:first-child{border-left:none}dp-day-calendar .dp-weekdays{font-size:15px;margin-bottom:5px}dp-day-calendar .dp-calendar-weekday{box-sizing:border-box;display:inline-block;width:30px;text-align:center;border-left:1px solid #000000;border-bottom:1px solid #000000}dp-day-calendar .dp-calendar-day{box-sizing:border-box;width:30px;height:30px;cursor:pointer}dp-day-calendar .dp-selected{background:#106cc8;color:#fff}dp-day-calendar .dp-prev-month,dp-day-calendar .dp-next-month{opacity:.5}dp-day-calendar .dp-hide-near-month .dp-prev-month,dp-day-calendar .dp-hide-near-month .dp-next-month{visibility:hidden}dp-day-calendar .dp-week-number{position:absolute;font-size:9px}dp-day-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;color:#7a7a7a;border:none}dp-day-calendar.dp-material .dp-calendar-wrapper{border:1px solid #E0E0E0}dp-day-calendar.dp-material .dp-calendar-month,dp-day-calendar.dp-material .dp-calendar-day{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:none}dp-day-calendar.dp-material .dp-calendar-month:hover,dp-day-calendar.dp-material .dp-calendar-day:hover{background:#e0e0e0}dp-day-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-day-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-day-calendar.dp-material .dp-current-day{border:1px solid #106CC8}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i4.Dir, selector: "[dir]", inputs: ["dir"], outputs: ["dirChange"], exportAs: ["dir"] }, { kind: "component", type: MonthCalendarComponent, selector: "dp-month-calendar", inputs: ["config", "displayDate", "minDate", "maxDate", "theme"], outputs: ["onSelect", "onNavHeaderBtnClick", "onGoToCurrent", "onLeftNav", "onRightNav", "onLeftSecondaryNav", "onRightSecondaryNav"] }, { kind: "component", type: CalendarNavComponent, selector: "dp-calendar-nav", inputs: ["label", "isLabelClickable", "showLeftNav", "showLeftSecondaryNav", "showRightNav", "showRightSecondaryNav", "leftNavDisabled", "leftSecondaryNavDisabled", "rightNavDisabled", "rightSecondaryNavDisabled", "showGoToCurrent", "theme"], outputs: ["onLeftNav", "onLeftSecondaryNav", "onRightNav", "onRightSecondaryNav", "onLabelClick", "onGoToCurrent"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayCalendarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dp-day-calendar', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        DayCalendarService,
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DayCalendarComponent),
                            multi: true
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: forwardRef(() => DayCalendarComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div *ngIf=\"currentCalendarMode ===  CalendarMode.Day\" class=\"dp-day-calendar-container\" dir=\"ltr\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode(CalendarMode.Month)\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      [isLabelClickable]=\"componentConfig.enableMonthSelector\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"_shouldShowCurrent\"\n      [showLeftNav]=\"showLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div [ngClass]=\"{'dp-hide-near-month': !componentConfig.showNearMonthDays}\"\n       class=\"dp-calendar-wrapper\">\n    <div class=\"dp-weekdays\">\n      <span *ngFor=\"let weekday of weekdays\"\n            [innerText]=\"getWeekdayName(weekday)\"\n            class=\"dp-calendar-weekday\">\n      </span>\n    </div>\n    <div *ngFor=\"let week of weeks\" class=\"dp-calendar-week\">\n      <span *ngIf=\"componentConfig.showWeekNumbers\"\n            [innerText]=\"week[0].date.isoWeek()\"\n            class=\"dp-week-number\">\n      </span>\n      <button (click)=\"dayClicked(day)\"\n              *ngFor=\"let day of week\"\n              [attr.data-date]=\"day.date.format(componentConfig.format)\"\n              [disabled]=\"day.disabled\"\n              [innerText]=\"getDayBtnText(day)\"\n              [ngClass]=\"getDayBtnCssClass(day)\"\n              class=\"dp-calendar-day\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n\n<dp-month-calendar\n    (onLeftNav)=\"onMonthCalendarLeftClick($event)\"\n    (onLeftSecondaryNav)=\"onMonthCalendarSecondaryLeftClick($event)\"\n    (onNavHeaderBtnClick)=\"toggleCalendarMode(CalendarMode.Day)\"\n    (onRightNav)=\"onMonthCalendarRightClick($event)\"\n    (onRightSecondaryNav)=\"onMonthCalendarSecondaryRightClick($event)\"\n    (onSelect)=\"monthSelected($event)\"\n    *ngIf=\"currentCalendarMode ===  CalendarMode.Month\"\n    [config]=\"monthCalendarConfig\"\n    [displayDate]=\"_currentDateView\"\n    [ngModel]=\"_selected\"\n    [theme]=\"theme\">\n</dp-month-calendar>\n", styles: ["dp-day-calendar{display:inline-block}dp-day-calendar .dp-day-calendar-container{background:#fff}dp-day-calendar .dp-calendar-wrapper{box-sizing:border-box;border:1px solid #000000}dp-day-calendar .dp-calendar-wrapper .dp-calendar-weekday:first-child{border-left:none}dp-day-calendar .dp-weekdays{font-size:15px;margin-bottom:5px}dp-day-calendar .dp-calendar-weekday{box-sizing:border-box;display:inline-block;width:30px;text-align:center;border-left:1px solid #000000;border-bottom:1px solid #000000}dp-day-calendar .dp-calendar-day{box-sizing:border-box;width:30px;height:30px;cursor:pointer}dp-day-calendar .dp-selected{background:#106cc8;color:#fff}dp-day-calendar .dp-prev-month,dp-day-calendar .dp-next-month{opacity:.5}dp-day-calendar .dp-hide-near-month .dp-prev-month,dp-day-calendar .dp-hide-near-month .dp-next-month{visibility:hidden}dp-day-calendar .dp-week-number{position:absolute;font-size:9px}dp-day-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;color:#7a7a7a;border:none}dp-day-calendar.dp-material .dp-calendar-wrapper{border:1px solid #E0E0E0}dp-day-calendar.dp-material .dp-calendar-month,dp-day-calendar.dp-material .dp-calendar-day{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:none}dp-day-calendar.dp-material .dp-calendar-month:hover,dp-day-calendar.dp-material .dp-calendar-day:hover{background:#e0e0e0}dp-day-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-day-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-day-calendar.dp-material .dp-current-day{border:1px solid #106CC8}\n"] }]
        }], ctorParameters: () => [{ type: DayCalendarService }, { type: UtilsService }, { type: i0.ChangeDetectorRef }], propDecorators: { config: [{
                type: Input
            }], displayDate: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], theme: [{
                type: HostBinding,
                args: ['class']
            }, {
                type: Input
            }], onSelect: [{
                type: Output
            }], onMonthSelect: [{
                type: Output
            }], onNavHeaderBtnClick: [{
                type: Output
            }], onGoToCurrent: [{
                type: Output
            }], onLeftNav: [{
                type: Output
            }], onRightNav: [{
                type: Output
            }] } });

class TimeSelectComponent {
    constructor(timeSelectService, utilsService, cd) {
        this.timeSelectService = timeSelectService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.isInited = false;
        this.api = {
            triggerChange: this.emitChange.bind(this)
        };
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.calculateTimeParts(this.selected);
        this.showDecHour = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'hour');
        this.showDecMinute = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'minute');
        this.showDecSecond = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'second');
        this.showIncHour = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'hour');
        this.showIncMinute = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'minute');
        this.showIncSecond = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'second');
        this.showToggleMeridiem = this.timeSelectService.shouldShowToggleMeridiem(this.componentConfig, this._selected);
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    init() {
        this.componentConfig = this.timeSelectService.getConfig(this.config);
        this.selected = this.selected || dayjsRef();
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, minTime, maxTime } = changes;
            if (minDate || maxDate || minTime || maxTime) {
                this.initValidators();
            }
            this.init();
        }
    }
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            const dayjsValue = this.utilsService
                .convertToDayjsArray(value, {
                allowMultiSelect: false,
                format: this.timeSelectService.getTimeFormat(this.componentConfig)
            })[0];
            if (dayjsValue.isValid()) {
                this.selected = dayjsValue;
                this.inputValueType = this.utilsService
                    .getInputType(this.inputValue, false);
            }
        }
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_) {
    }
    registerOnTouched(fn) {
    }
    validate(formControl) {
        if (this.minDate || this.maxDate || this.minTime || this.maxTime) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    processOnChangeCallback(value) {
        return this.utilsService.convertFromDayjsArray(this.timeSelectService.getTimeFormat(this.componentConfig), [value], this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, undefined, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    decrease(unit) {
        this.selected = this.timeSelectService.decrease(this.componentConfig, this.selected, unit);
        this.emitChange();
    }
    increase(unit) {
        this.selected = this.timeSelectService.increase(this.componentConfig, this.selected, unit);
        this.emitChange();
    }
    toggleMeridiem() {
        this.selected = this.timeSelectService.toggleMeridiem(this.selected);
        this.emitChange();
    }
    emitChange() {
        this.onChange.emit({ date: this.selected, selected: false });
        this.cd.markForCheck();
    }
    calculateTimeParts(time) {
        this.hours = this.timeSelectService.getHours(this.componentConfig, time);
        this.minutes = this.timeSelectService.getMinutes(this.componentConfig, time);
        this.seconds = this.timeSelectService.getSeconds(this.componentConfig, time);
        this.meridiem = this.timeSelectService.getMeridiem(this.componentConfig, time);
    }
    handleConfigChange(config) {
        if (config) {
            const prevConf = this.timeSelectService.getConfig(config.previousValue);
            const currentConf = this.timeSelectService.getConfig(config.currentValue);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: TimeSelectComponent, deps: [{ token: TimeSelectService }, { token: UtilsService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.4", type: TimeSelectComponent, isStandalone: false, selector: "dp-time-select", inputs: { config: "config", displayDate: "displayDate", minDate: "minDate", maxDate: "maxDate", minTime: "minTime", maxTime: "maxTime", theme: "theme" }, outputs: { onChange: "onChange" }, host: { properties: { "class": "this.theme" } }, providers: [
            TimeSelectService,
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TimeSelectComponent),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => TimeSelectComponent),
                multi: true
            }
        ], usesOnChanges: true, ngImport: i0, template: "<ul class=\"dp-time-select-controls\" dir=\"ltr\">\n  <li class=\"dp-time-select-control dp-time-select-control-hours\">\n    <button (click)=\"increase('hour')\"\n            [disabled]=\"!showIncHour\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\">\n    </button>\n    <span [innerText]=\"hours\"\n          class=\"dp-time-select-display-hours\">\n    </span>\n    <button (click)=\"decrease('hour')\"\n            [disabled]=\"!showDecHour\"\n            class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n  <li [innerText]=\"componentConfig.timeSeparator\"\n      class=\"dp-time-select-control dp-time-select-separator\">\n  </li>\n  <li class=\"dp-time-select-control dp-time-select-control-minutes\">\n    <button (click)=\"increase('minute')\"\n            [disabled]=\"!showIncMinute\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\"></button>\n    <span [innerText]=\"minutes\"\n          class=\"dp-time-select-display-minutes\">\n    </span>\n    <button (click)=\"decrease('minute')\"\n            [disabled]=\"!showDecMinute\" class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n  <ng-container *ngIf=\"componentConfig.showSeconds\">\n    <li [innerText]=\"componentConfig.timeSeparator\"\n        class=\"dp-time-select-control dp-time-select-separator\">\n    </li>\n    <li class=\"dp-time-select-control dp-time-select-control-seconds\">\n      <button (click)=\"increase('second')\"\n              [disabled]=\"!showIncSecond\"\n              class=\"dp-time-select-control-up\"\n              type=\"button\"></button>\n      <span [innerText]=\"seconds\"\n            class=\"dp-time-select-display-seconds\">\n      </span>\n      <button (click)=\"decrease('second')\"\n              [disabled]=\"!showDecSecond\"\n              class=\"dp-time-select-control-down\"\n              type=\"button\">\n      </button>\n    </li>\n  </ng-container>\n  <li *ngIf=\"!componentConfig.showTwentyFourHours\" class=\"dp-time-select-control dp-time-select-control-meridiem\">\n    <button (click)=\"toggleMeridiem()\"\n            [disabled]=\"!showToggleMeridiem\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\">\n    </button>\n    <span [innerText]=\"meridiem\"\n          class=\"dp-time-select-display-meridiem\">\n    </span>\n    <button (click)=\"toggleMeridiem()\"\n            [disabled]=\"!showToggleMeridiem\"\n            class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n</ul>\n", styles: ["dp-time-select{display:inline-block}dp-time-select .dp-time-select-controls{margin:0;padding:0;text-align:center;line-height:normal;background:#fff}dp-time-select .dp-time-select-control{display:inline-block;width:35px;margin:0 auto;vertical-align:middle;font-size:inherit;letter-spacing:1px}dp-time-select .dp-time-select-control-up,dp-time-select .dp-time-select-control-down{position:relative;display:block;width:24px;height:24px;margin:3px auto;cursor:pointer}dp-time-select .dp-time-select-control-up:before,dp-time-select .dp-time-select-control-down:before{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(0)}dp-time-select .dp-time-select-control-up:before{transform:rotate(-45deg);top:4px}dp-time-select .dp-time-select-control-down:before{transform:rotate(135deg)}dp-time-select .dp-time-select-separator{width:5px}dp-time-select.dp-material .dp-time-select-control-up,dp-time-select.dp-material .dp-time-select-control-down{box-sizing:border-box;background:transparent;border:none;outline:none;border-radius:50%}dp-time-select.dp-material .dp-time-select-control-up:before,dp-time-select.dp-material .dp-time-select-control-down:before{left:0}dp-time-select.dp-material .dp-time-select-control-up:hover,dp-time-select.dp-material .dp-time-select-control-down:hover{background:#e0e0e0}\n"], dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.Dir, selector: "[dir]", inputs: ["dir"], outputs: ["dirChange"], exportAs: ["dir"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: TimeSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dp-time-select', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        TimeSelectService,
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TimeSelectComponent),
                            multi: true
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: forwardRef(() => TimeSelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<ul class=\"dp-time-select-controls\" dir=\"ltr\">\n  <li class=\"dp-time-select-control dp-time-select-control-hours\">\n    <button (click)=\"increase('hour')\"\n            [disabled]=\"!showIncHour\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\">\n    </button>\n    <span [innerText]=\"hours\"\n          class=\"dp-time-select-display-hours\">\n    </span>\n    <button (click)=\"decrease('hour')\"\n            [disabled]=\"!showDecHour\"\n            class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n  <li [innerText]=\"componentConfig.timeSeparator\"\n      class=\"dp-time-select-control dp-time-select-separator\">\n  </li>\n  <li class=\"dp-time-select-control dp-time-select-control-minutes\">\n    <button (click)=\"increase('minute')\"\n            [disabled]=\"!showIncMinute\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\"></button>\n    <span [innerText]=\"minutes\"\n          class=\"dp-time-select-display-minutes\">\n    </span>\n    <button (click)=\"decrease('minute')\"\n            [disabled]=\"!showDecMinute\" class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n  <ng-container *ngIf=\"componentConfig.showSeconds\">\n    <li [innerText]=\"componentConfig.timeSeparator\"\n        class=\"dp-time-select-control dp-time-select-separator\">\n    </li>\n    <li class=\"dp-time-select-control dp-time-select-control-seconds\">\n      <button (click)=\"increase('second')\"\n              [disabled]=\"!showIncSecond\"\n              class=\"dp-time-select-control-up\"\n              type=\"button\"></button>\n      <span [innerText]=\"seconds\"\n            class=\"dp-time-select-display-seconds\">\n      </span>\n      <button (click)=\"decrease('second')\"\n              [disabled]=\"!showDecSecond\"\n              class=\"dp-time-select-control-down\"\n              type=\"button\">\n      </button>\n    </li>\n  </ng-container>\n  <li *ngIf=\"!componentConfig.showTwentyFourHours\" class=\"dp-time-select-control dp-time-select-control-meridiem\">\n    <button (click)=\"toggleMeridiem()\"\n            [disabled]=\"!showToggleMeridiem\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\">\n    </button>\n    <span [innerText]=\"meridiem\"\n          class=\"dp-time-select-display-meridiem\">\n    </span>\n    <button (click)=\"toggleMeridiem()\"\n            [disabled]=\"!showToggleMeridiem\"\n            class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n</ul>\n", styles: ["dp-time-select{display:inline-block}dp-time-select .dp-time-select-controls{margin:0;padding:0;text-align:center;line-height:normal;background:#fff}dp-time-select .dp-time-select-control{display:inline-block;width:35px;margin:0 auto;vertical-align:middle;font-size:inherit;letter-spacing:1px}dp-time-select .dp-time-select-control-up,dp-time-select .dp-time-select-control-down{position:relative;display:block;width:24px;height:24px;margin:3px auto;cursor:pointer}dp-time-select .dp-time-select-control-up:before,dp-time-select .dp-time-select-control-down:before{position:relative;content:\"\";display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(0)}dp-time-select .dp-time-select-control-up:before{transform:rotate(-45deg);top:4px}dp-time-select .dp-time-select-control-down:before{transform:rotate(135deg)}dp-time-select .dp-time-select-separator{width:5px}dp-time-select.dp-material .dp-time-select-control-up,dp-time-select.dp-material .dp-time-select-control-down{box-sizing:border-box;background:transparent;border:none;outline:none;border-radius:50%}dp-time-select.dp-material .dp-time-select-control-up:before,dp-time-select.dp-material .dp-time-select-control-down:before{left:0}dp-time-select.dp-material .dp-time-select-control-up:hover,dp-time-select.dp-material .dp-time-select-control-down:hover{background:#e0e0e0}\n"] }]
        }], ctorParameters: () => [{ type: TimeSelectService }, { type: UtilsService }, { type: i0.ChangeDetectorRef }], propDecorators: { config: [{
                type: Input
            }], displayDate: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], minTime: [{
                type: Input
            }], maxTime: [{
                type: Input
            }], theme: [{
                type: HostBinding,
                args: ['class']
            }, {
                type: Input
            }], onChange: [{
                type: Output
            }] } });

class DayTimeCalendarComponent {
    constructor(dayTimeCalendarService, utilsService, cd) {
        this.dayTimeCalendarService = dayTimeCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.isInited = false;
        this.api = {
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    ;
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    init() {
        this.componentConfig = this.dayTimeCalendarService.getConfig(this.config);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate } = changes;
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    }
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToDayjsArray(value, {
                format: this.componentConfig.format,
                allowMultiSelect: false
            })[0];
            this.inputValueType = this.utilsService
                .getInputType(this.inputValue, false);
        }
        else {
            this.selected = null;
        }
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_) {
    }
    registerOnTouched(fn) {
    }
    validate(formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    processOnChangeCallback(value) {
        return this.utilsService.convertFromDayjsArray(this.componentConfig.format, [value], this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate
        }, undefined, 'daytime');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    dateSelected(day) {
        this.selected = this.dayTimeCalendarService.updateDay(this.selected, day.date, this.componentConfig);
        this.emitChange();
    }
    timeChange(time) {
        this.selected = this.dayTimeCalendarService.updateTime(this.selected, time.date);
        this.emitChange();
    }
    emitChange() {
        this.onChange.emit({ date: this.selected, selected: false });
    }
    moveCalendarTo(to) {
        if (to) {
            this.dayCalendarRef.moveCalendarTo(to);
        }
    }
    onLeftNavClick(change) {
        this.onLeftNav.emit(change);
    }
    onRightNavClick(change) {
        this.onRightNav.emit(change);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayTimeCalendarComponent, deps: [{ token: DayTimeCalendarService }, { token: UtilsService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.4", type: DayTimeCalendarComponent, isStandalone: false, selector: "dp-day-time-calendar", inputs: { config: "config", displayDate: "displayDate", minDate: "minDate", maxDate: "maxDate", theme: "theme" }, outputs: { onChange: "onChange", onGoToCurrent: "onGoToCurrent", onLeftNav: "onLeftNav", onRightNav: "onRightNav" }, host: { properties: { "class": "this.theme" } }, providers: [
            DayTimeCalendarService,
            DayCalendarService,
            TimeSelectService,
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DayTimeCalendarComponent),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => DayTimeCalendarComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "dayCalendarRef", first: true, predicate: ["dayCalendar"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<dp-day-calendar #dayCalendar\n                 (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                 (onLeftNav)=\"onLeftNavClick($event)\"\n                 (onRightNav)=\"onRightNavClick($event)\"\n                 (onSelect)=\"dateSelected($event)\"\n                 [config]=\"componentConfig\"\n                 [displayDate]=\"displayDate\"\n                 [ngModel]=\"_selected\"\n                 [theme]=\"theme\">\n</dp-day-calendar>\n<dp-time-select #timeSelect\n                (onChange)=\"timeChange($event)\"\n                [config]=\"componentConfig\"\n                [ngModel]=\"_selected\"\n                [theme]=\"theme\">\n</dp-time-select>\n", styles: ["dp-day-time-calendar{display:inline-block}dp-day-time-calendar dp-time-select{display:block;border:1px solid #000000;border-top:0}dp-day-time-calendar.dp-material dp-time-select{border:1px solid #E0E0E0;border-top:0}\n"], dependencies: [{ kind: "directive", type: i4$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: DayCalendarComponent, selector: "dp-day-calendar", inputs: ["config", "displayDate", "minDate", "maxDate", "theme"], outputs: ["onSelect", "onMonthSelect", "onNavHeaderBtnClick", "onGoToCurrent", "onLeftNav", "onRightNav"] }, { kind: "component", type: TimeSelectComponent, selector: "dp-time-select", inputs: ["config", "displayDate", "minDate", "maxDate", "minTime", "maxTime", "theme"], outputs: ["onChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DayTimeCalendarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dp-day-time-calendar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [
                        DayTimeCalendarService,
                        DayCalendarService,
                        TimeSelectService,
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DayTimeCalendarComponent),
                            multi: true
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: forwardRef(() => DayTimeCalendarComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<dp-day-calendar #dayCalendar\n                 (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                 (onLeftNav)=\"onLeftNavClick($event)\"\n                 (onRightNav)=\"onRightNavClick($event)\"\n                 (onSelect)=\"dateSelected($event)\"\n                 [config]=\"componentConfig\"\n                 [displayDate]=\"displayDate\"\n                 [ngModel]=\"_selected\"\n                 [theme]=\"theme\">\n</dp-day-calendar>\n<dp-time-select #timeSelect\n                (onChange)=\"timeChange($event)\"\n                [config]=\"componentConfig\"\n                [ngModel]=\"_selected\"\n                [theme]=\"theme\">\n</dp-time-select>\n", styles: ["dp-day-time-calendar{display:inline-block}dp-day-time-calendar dp-time-select{display:block;border:1px solid #000000;border-top:0}dp-day-time-calendar.dp-material dp-time-select{border:1px solid #E0E0E0;border-top:0}\n"] }]
        }], ctorParameters: () => [{ type: DayTimeCalendarService }, { type: UtilsService }, { type: i0.ChangeDetectorRef }], propDecorators: { config: [{
                type: Input
            }], displayDate: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], theme: [{
                type: HostBinding,
                args: ['class']
            }, {
                type: Input
            }], onChange: [{
                type: Output
            }], onGoToCurrent: [{
                type: Output
            }], onLeftNav: [{
                type: Output
            }], onRightNav: [{
                type: Output
            }], dayCalendarRef: [{
                type: ViewChild,
                args: ['dayCalendar']
            }] } });

class DatePickerComponent {
    constructor(dayPickerService, elemRef, renderer, utilsService, cd) {
        this.dayPickerService = dayPickerService;
        this.elemRef = elemRef;
        this.renderer = renderer;
        this.utilsService = utilsService;
        this.cd = cd;
        this.isInitialized = false;
        this.mode = 'day';
        this.placeholder = '';
        this.disabled = false;
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.isFocusedTrigger = false;
        this.handleInnerElementClickUnlisteners = [];
        this.globalListenersUnlisteners = [];
        this.api = {
            open: this.showCalendars.bind(this),
            close: this.hideCalendar.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
        this.selectEvent = SelectEvent;
        this.areCalendarsShown = false;
        this._selected = [];
    }
    get openOnFocus() {
        return this.componentConfig.openOnFocus;
    }
    get openOnClick() {
        return this.componentConfig.openOnClick;
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.inputElementValue = this.utilsService
            .convertFromDayjsArray(this.componentConfig.format, selected, ECalendarValue.StringArr)
            .join(' | ');
        const val = this.processOnChangeCallback(selected);
        this.onChangeCallback(val, false);
        this.onChange.emit(val);
    }
    get currentDateView() {
        return this._currentDateView;
    }
    set currentDateView(date) {
        this._currentDateView = date;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.moveCalendarTo(date);
        }
        if (this.monthCalendarRef) {
            this.monthCalendarRef.moveCalendarTo(date);
        }
        if (this.dayTimeCalendarRef) {
            this.dayTimeCalendarRef.moveCalendarTo(date);
        }
        this.displayDate = date;
    }
    onClick() {
        if (!this.openOnClick) {
            return;
        }
        if (!this.isFocusedTrigger && !this.disabled) {
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
        }
    }
    onBodyClick(event) {
        if (this.inputElement.nativeElement === event.target) {
            return;
        }
        if (this.componentConfig.hideOnOutsideClick) {
            this.hideCalendar();
        }
    }
    writeValue(value) {
        this.inputValue = value;
        if (value || value === '') {
            this.selected = this.utilsService
                .convertToDayjsArray(value, this.componentConfig);
            this.init();
        }
        else {
            this.selected = [];
        }
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_, __) {
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    onTouchedCallback() {
    }
    validate(formControl) {
        return this.validateFn(formControl.value);
    }
    processOnChangeCallback(selected) {
        if (typeof selected === 'string') {
            return selected;
        }
        else {
            return this.utilsService.convertFromDayjsArray(this.componentConfig.format, selected, this.componentConfig.returnedValueType || this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect));
        }
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, this.componentConfig.format, this.mode);
        this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
    }
    ngOnInit() {
        this.isInitialized = true;
        this.init();
    }
    ngOnChanges(changes) {
        if (this.isInitialized) {
            this.init();
        }
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this.cd.markForCheck();
    }
    init() {
        this.componentConfig = this.dayPickerService.getConfig(this.config, this.mode);
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToDayjs(this.displayDate, this.componentConfig.format)
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
        this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfig(this.componentConfig);
        this.timeSelectConfig = this.dayPickerService.getTimeConfig(this.componentConfig);
        this.initValidators();
        this.overlayPosition = this.dayPickerService.getOverlayPosition(this.componentConfig);
        this.origin = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer);
    }
    inputFocused() {
        if (!this.openOnFocus) {
            return;
        }
        clearTimeout(this.onOpenDelayTimeoutHandler);
        this.isFocusedTrigger = true;
        this.onOpenDelayTimeoutHandler = setTimeout(() => {
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
            this.isFocusedTrigger = false;
            this.cd.markForCheck();
        }, this.componentConfig.onOpenDelay);
    }
    inputBlurred() {
        clearTimeout(this.onOpenDelayTimeoutHandler);
        this.onTouchedCallback();
    }
    showCalendars() {
        this.areCalendarsShown = true;
        this.startGlobalListeners();
        if (this.timeSelectRef) {
            this.timeSelectRef.api.triggerChange();
        }
        this.open.emit();
        this.cd.markForCheck();
    }
    hideCalendar() {
        this.areCalendarsShown = false;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.api.toggleCalendarMode(ECalendarMode.Day);
        }
        this.stopGlobalListeners();
        this.close.emit();
        this.cd.markForCheck();
    }
    onViewDateChange(value) {
        const strVal = value ? this.utilsService.convertToString(value, this.componentConfig.format) : '';
        if (this.dayPickerService.isValidInputDateValue(strVal, this.componentConfig)) {
            this.selected = this.dayPickerService.convertInputValueToDayjsArray(strVal, this.componentConfig);
            this.currentDateView = this.selected.length
                ? this.utilsService.getDefaultDisplayDate(null, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min)
                : this.currentDateView;
            this.onSelect.emit({
                date: strVal,
                type: SelectEvent.INPUT,
                granularity: null
            });
        }
        else {
            this._selected = this.utilsService
                .getValidDayjsArray(strVal, this.componentConfig.format);
            this.onChangeCallback(this.processOnChangeCallback(strVal), true);
        }
    }
    dateSelected(date, granularity, type, ignoreClose) {
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, date, granularity);
        if (!ignoreClose) {
            this.onDateClick();
        }
        this.onSelect.emit({
            date: date.date,
            granularity,
            type
        });
    }
    onDateClick() {
        if (this.componentConfig.closeOnSelect) {
            setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
        }
    }
    onKeyPress(event) {
        switch (event.key) {
            case ('Escape'):
            case ('Esc'):
            case ('Tab'):
                this.hideCalendar();
                break;
        }
    }
    moveCalendarTo(date) {
        this.currentDateView = this.utilsService.convertToDayjs(date, this.componentConfig.format);
    }
    onLeftNavClick(change) {
        this.displayDate = change.to;
        this.onLeftNav.emit(change);
    }
    onRightNavClick(change) {
        this.displayDate = change.to;
        this.onRightNav.emit(change);
    }
    startGlobalListeners() {
        this.globalListenersUnlisteners.push(this.renderer.listen(document, 'keydown', (e) => {
            this.onKeyPress(e);
        }));
    }
    stopGlobalListeners() {
        this.globalListenersUnlisteners.forEach((ul) => ul());
        this.globalListenersUnlisteners = [];
    }
    ngOnDestroy() {
        this.handleInnerElementClickUnlisteners.forEach(ul => ul());
        if (this.appendToElement) {
            this.appendToElement.removeChild(this.calendarWrapper);
        }
    }
    goToCurrent() {
        this.currentDateView = dayjsRef();
        this.onGoToCurrent.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DatePickerComponent, deps: [{ token: DatePickerService }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: UtilsService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.4", type: DatePickerComponent, isStandalone: false, selector: "dp-date-picker", inputs: { config: "config", mode: "mode", placeholder: "placeholder", disabled: "disabled", displayDate: "displayDate", theme: "theme", minDate: "minDate", maxDate: "maxDate", minTime: "minTime", maxTime: "maxTime" }, outputs: { open: "open", close: "close", onChange: "onChange", onGoToCurrent: "onGoToCurrent", onLeftNav: "onLeftNav", onRightNav: "onRightNav", onSelect: "onSelect" }, host: { listeners: { "click": "onClick()" }, properties: { "class": "this.theme" } }, providers: [
            DatePickerService,
            DayTimeCalendarService,
            DayCalendarService,
            TimeSelectService,
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DatePickerComponent),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => DatePickerComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "calendarContainer", first: true, predicate: ["container"], descendants: true }, { propertyName: "dayCalendarRef", first: true, predicate: ["dayCalendar"], descendants: true }, { propertyName: "monthCalendarRef", first: true, predicate: ["monthCalendar"], descendants: true }, { propertyName: "dayTimeCalendarRef", first: true, predicate: ["daytimeCalendar"], descendants: true }, { propertyName: "timeSelectRef", first: true, predicate: ["timeSelect"], descendants: true }, { propertyName: "inputElement", first: true, predicate: ["inputElement"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div [ngClass]=\"{'dp-open': areCalendarsShown}\" dir=\"ltr\" #trigger>\n  <div [attr.data-hidden]=\"componentConfig.hideInputContainer\"\n       [hidden]=\"componentConfig.hideInputContainer\"\n       class=\"dp-input-container\">\n    <input #inputElement\n           (blur)=\"inputBlurred()\"\n           (focus)=\"inputFocused()\"\n           (keydown.enter)=\"componentConfig.closeOnEnter && hideCalendar()\"\n           (ngModelChange)=\"onViewDateChange($event)\"\n           [disabled]=\"disabled\"\n           [ngModel]=\"inputElementValue\"\n           [placeholder]=\"placeholder\"\n           [readonly]=\"componentConfig.disableKeypress\"\n           class=\"dp-picker-input\"\n           type=\"text\"/>\n  </div>\n  <ng-template cdkConnectedOverlay\n               [cdkConnectedOverlayPositions]=\"overlayPosition\"\n               [cdkConnectedOverlayOrigin]=\"origin || trigger\"\n               [cdkConnectedOverlayOpen]=\"areCalendarsShown\"\n               [cdkConnectedOverlayHasBackdrop]=\"false\"\n               (overlayOutsideClick)=\"onBodyClick($event)\">\n    <div #container>\n      <div [attr.data-hidden]=\"!areCalendarsShown\"\n           [ngSwitch]=\"mode\"\n           class=\"dp-popup {{theme}}\">\n        <dp-day-calendar #dayCalendar\n                         (onGoToCurrent)=\"goToCurrent()\"\n                         (onLeftNav)=\"onLeftNavClick($event)\"\n                         (onRightNav)=\"onRightNavClick($event)\"\n                         (onSelect)=\"dateSelected($event, 'day', selectEvent.SELECTION, false)\"\n                         *ngSwitchCase=\"'day'\"\n                         [config]=\"dayCalendarConfig\"\n                         [displayDate]=\"displayDate\"\n                         [ngModel]=\"_selected\"\n                         [theme]=\"theme\">\n        </dp-day-calendar>\n\n        <dp-month-calendar #monthCalendar\n                           (onGoToCurrent)=\"goToCurrent()\"\n                           (onLeftNav)=\"onLeftNavClick($event)\"\n                           (onRightNav)=\"onRightNavClick($event)\"\n                           (onSelect)=\"dateSelected($event, 'month', selectEvent.SELECTION, false)\"\n                           *ngSwitchCase=\"'month'\"\n                           [config]=\"dayCalendarConfig\"\n                           [displayDate]=\"displayDate\"\n                           [ngModel]=\"_selected\"\n                           [theme]=\"theme\">\n        </dp-month-calendar>\n\n        <dp-time-select #timeSelect\n                        (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                        *ngSwitchCase=\"'time'\"\n                        [config]=\"timeSelectConfig\"\n                        [ngModel]=\"_selected && _selected[0]\"\n                        [theme]=\"theme\">\n        </dp-time-select>\n\n        <dp-day-time-calendar #daytimeCalendar\n                              (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                              (onGoToCurrent)=\"goToCurrent()\"\n                              (onLeftNav)=\"onLeftNavClick($event)\"\n                              (onRightNav)=\"onRightNavClick($event)\"\n                              *ngSwitchCase=\"'daytime'\"\n                              [config]=\"dayTimeCalendarConfig\"\n                              [displayDate]=\"displayDate\"\n                              [ngModel]=\"_selected && _selected[0]\"\n                              [theme]=\"theme\">\n        </dp-day-time-calendar>\n      </div>\n    </div>\n  </ng-template>\n</div>\n", styles: ["dp-date-picker{display:inline-block}dp-date-picker.dp-material .dp-picker-input{box-sizing:border-box;height:30px;width:213px;font-size:13px;outline:none}dp-date-picker .dp-input-container{position:relative}dp-date-picker .dp-selected{background:#106cc8;color:#fff}.dp-popup{position:relative;display:inline-block;background:#fff;box-shadow:1px 1px 5px #0000001a;border-left:1px solid rgba(0,0,0,.1);border-right:1px solid rgba(0,0,0,.1);border-bottom:1px solid rgba(0,0,0,.1);white-space:nowrap}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i4$1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i4$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i5.CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }, { kind: "directive", type: i4.Dir, selector: "[dir]", inputs: ["dir"], outputs: ["dirChange"], exportAs: ["dir"] }, { kind: "component", type: DayCalendarComponent, selector: "dp-day-calendar", inputs: ["config", "displayDate", "minDate", "maxDate", "theme"], outputs: ["onSelect", "onMonthSelect", "onNavHeaderBtnClick", "onGoToCurrent", "onLeftNav", "onRightNav"] }, { kind: "component", type: MonthCalendarComponent, selector: "dp-month-calendar", inputs: ["config", "displayDate", "minDate", "maxDate", "theme"], outputs: ["onSelect", "onNavHeaderBtnClick", "onGoToCurrent", "onLeftNav", "onRightNav", "onLeftSecondaryNav", "onRightSecondaryNav"] }, { kind: "component", type: TimeSelectComponent, selector: "dp-time-select", inputs: ["config", "displayDate", "minDate", "maxDate", "minTime", "maxTime", "theme"], outputs: ["onChange"] }, { kind: "component", type: DayTimeCalendarComponent, selector: "dp-day-time-calendar", inputs: ["config", "displayDate", "minDate", "maxDate", "theme"], outputs: ["onChange", "onGoToCurrent", "onLeftNav", "onRightNav"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DatePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dp-date-picker', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        DatePickerService,
                        DayTimeCalendarService,
                        DayCalendarService,
                        TimeSelectService,
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DatePickerComponent),
                            multi: true
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: forwardRef(() => DatePickerComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div [ngClass]=\"{'dp-open': areCalendarsShown}\" dir=\"ltr\" #trigger>\n  <div [attr.data-hidden]=\"componentConfig.hideInputContainer\"\n       [hidden]=\"componentConfig.hideInputContainer\"\n       class=\"dp-input-container\">\n    <input #inputElement\n           (blur)=\"inputBlurred()\"\n           (focus)=\"inputFocused()\"\n           (keydown.enter)=\"componentConfig.closeOnEnter && hideCalendar()\"\n           (ngModelChange)=\"onViewDateChange($event)\"\n           [disabled]=\"disabled\"\n           [ngModel]=\"inputElementValue\"\n           [placeholder]=\"placeholder\"\n           [readonly]=\"componentConfig.disableKeypress\"\n           class=\"dp-picker-input\"\n           type=\"text\"/>\n  </div>\n  <ng-template cdkConnectedOverlay\n               [cdkConnectedOverlayPositions]=\"overlayPosition\"\n               [cdkConnectedOverlayOrigin]=\"origin || trigger\"\n               [cdkConnectedOverlayOpen]=\"areCalendarsShown\"\n               [cdkConnectedOverlayHasBackdrop]=\"false\"\n               (overlayOutsideClick)=\"onBodyClick($event)\">\n    <div #container>\n      <div [attr.data-hidden]=\"!areCalendarsShown\"\n           [ngSwitch]=\"mode\"\n           class=\"dp-popup {{theme}}\">\n        <dp-day-calendar #dayCalendar\n                         (onGoToCurrent)=\"goToCurrent()\"\n                         (onLeftNav)=\"onLeftNavClick($event)\"\n                         (onRightNav)=\"onRightNavClick($event)\"\n                         (onSelect)=\"dateSelected($event, 'day', selectEvent.SELECTION, false)\"\n                         *ngSwitchCase=\"'day'\"\n                         [config]=\"dayCalendarConfig\"\n                         [displayDate]=\"displayDate\"\n                         [ngModel]=\"_selected\"\n                         [theme]=\"theme\">\n        </dp-day-calendar>\n\n        <dp-month-calendar #monthCalendar\n                           (onGoToCurrent)=\"goToCurrent()\"\n                           (onLeftNav)=\"onLeftNavClick($event)\"\n                           (onRightNav)=\"onRightNavClick($event)\"\n                           (onSelect)=\"dateSelected($event, 'month', selectEvent.SELECTION, false)\"\n                           *ngSwitchCase=\"'month'\"\n                           [config]=\"dayCalendarConfig\"\n                           [displayDate]=\"displayDate\"\n                           [ngModel]=\"_selected\"\n                           [theme]=\"theme\">\n        </dp-month-calendar>\n\n        <dp-time-select #timeSelect\n                        (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                        *ngSwitchCase=\"'time'\"\n                        [config]=\"timeSelectConfig\"\n                        [ngModel]=\"_selected && _selected[0]\"\n                        [theme]=\"theme\">\n        </dp-time-select>\n\n        <dp-day-time-calendar #daytimeCalendar\n                              (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                              (onGoToCurrent)=\"goToCurrent()\"\n                              (onLeftNav)=\"onLeftNavClick($event)\"\n                              (onRightNav)=\"onRightNavClick($event)\"\n                              *ngSwitchCase=\"'daytime'\"\n                              [config]=\"dayTimeCalendarConfig\"\n                              [displayDate]=\"displayDate\"\n                              [ngModel]=\"_selected && _selected[0]\"\n                              [theme]=\"theme\">\n        </dp-day-time-calendar>\n      </div>\n    </div>\n  </ng-template>\n</div>\n", styles: ["dp-date-picker{display:inline-block}dp-date-picker.dp-material .dp-picker-input{box-sizing:border-box;height:30px;width:213px;font-size:13px;outline:none}dp-date-picker .dp-input-container{position:relative}dp-date-picker .dp-selected{background:#106cc8;color:#fff}.dp-popup{position:relative;display:inline-block;background:#fff;box-shadow:1px 1px 5px #0000001a;border-left:1px solid rgba(0,0,0,.1);border-right:1px solid rgba(0,0,0,.1);border-bottom:1px solid rgba(0,0,0,.1);white-space:nowrap}\n"] }]
        }], ctorParameters: () => [{ type: DatePickerService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: UtilsService }, { type: i0.ChangeDetectorRef }], propDecorators: { config: [{
                type: Input
            }], mode: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], disabled: [{
                type: Input
            }], displayDate: [{
                type: Input
            }], theme: [{
                type: HostBinding,
                args: ['class']
            }, {
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], minTime: [{
                type: Input
            }], maxTime: [{
                type: Input
            }], open: [{
                type: Output
            }], close: [{
                type: Output
            }], onChange: [{
                type: Output
            }], onGoToCurrent: [{
                type: Output
            }], onLeftNav: [{
                type: Output
            }], onRightNav: [{
                type: Output
            }], onSelect: [{
                type: Output
            }], calendarContainer: [{
                type: ViewChild,
                args: ['container']
            }], dayCalendarRef: [{
                type: ViewChild,
                args: ['dayCalendar']
            }], monthCalendarRef: [{
                type: ViewChild,
                args: ['monthCalendar']
            }], dayTimeCalendarRef: [{
                type: ViewChild,
                args: ['daytimeCalendar']
            }], timeSelectRef: [{
                type: ViewChild,
                args: ['timeSelect']
            }], inputElement: [{
                type: ViewChild,
                args: ['inputElement']
            }], onClick: [{
                type: HostListener,
                args: ['click']
            }] } });

class DatePickerDirective {
    constructor(viewContainerRef, elemRef, componentFactoryResolver, formControl, utilsService) {
        this.viewContainerRef = viewContainerRef;
        this.elemRef = elemRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.formControl = formControl;
        this.utilsService = utilsService;
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onSelect = new EventEmitter();
        this._mode = 'day';
    }
    get config() {
        return this._config;
    }
    set config(config) {
        this._config = {
            ...config,
            hideInputContainer: true,
            inputElementContainer: config.inputElementContainer ?? this.elemRef,
        };
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    get theme() {
        return this._theme;
    }
    set theme(theme) {
        this._theme = theme;
        if (this.datePicker) {
            this.datePicker.theme = theme;
        }
        this.markForCheck();
    }
    get mode() {
        return this._mode;
    }
    set mode(mode) {
        this._mode = mode;
        if (this.datePicker) {
            this.datePicker.mode = mode;
        }
        this.markForCheck();
    }
    get minDate() {
        return this._minDate;
    }
    set minDate(minDate) {
        this._minDate = minDate;
        if (this.datePicker) {
            this.datePicker.minDate = minDate;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(maxDate) {
        this._maxDate = maxDate;
        if (this.datePicker) {
            this.datePicker.maxDate = maxDate;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get minTime() {
        return this._minTime;
    }
    set minTime(minTime) {
        this._minTime = minTime;
        if (this.datePicker) {
            this.datePicker.minTime = minTime;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get maxTime() {
        return this._maxTime;
    }
    set maxTime(maxTime) {
        this._maxTime = maxTime;
        if (this.datePicker) {
            this.datePicker.maxTime = maxTime;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get displayDate() {
        return this._displayDate;
    }
    set displayDate(displayDate) {
        this._displayDate = displayDate;
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    ngOnInit() {
        this.datePicker = this.createDatePicker();
        this.api = this.datePicker.api;
        this.updateDatepickerConfig();
        this.attachModelToDatePicker();
        this.datePicker.theme = this.theme;
    }
    createDatePicker() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
        return this.viewContainerRef.createComponent(factory).instance;
    }
    attachModelToDatePicker() {
        if (!this.formControl) {
            return;
        }
        this.datePicker.onViewDateChange(this.formControl.value);
        this.formControl.valueChanges.subscribe((value) => {
            if (value !== this.datePicker.inputElementValue) {
                const strVal = this.utilsService.convertToString(value, this.datePicker.componentConfig.format);
                this.datePicker.onViewDateChange(strVal);
            }
        });
        let setup = true;
        this.datePicker.registerOnChange((value, changedByInput) => {
            if (value) {
                const isMultiselectEmpty = setup && Array.isArray(value) && !value.length;
                if (!isMultiselectEmpty && !changedByInput) {
                    this.formControl.control.setValue(this.datePicker.inputElementValue);
                }
            }
            const errors = this.datePicker.validateFn(value);
            if (!setup) {
                this.formControl.control.markAsDirty({
                    onlySelf: true
                });
            }
            else {
                setup = false;
            }
            if (errors) {
                if (errors.hasOwnProperty('format')) {
                    const { given } = errors['format'];
                    this.datePicker.inputElementValue = given;
                    if (!changedByInput) {
                        this.formControl.control.setValue(given);
                    }
                }
                this.formControl.control.setErrors(errors);
            }
        });
    }
    onClick() {
        this.datePicker.onClick();
    }
    onFocus() {
        this.datePicker.inputFocused();
    }
    onEnter() {
        if (this.datePicker.componentConfig.closeOnEnter) {
            this.datePicker.hideCalendar();
        }
    }
    markForCheck() {
        if (this.datePicker) {
            this.datePicker.cd.markForCheck();
        }
    }
    updateDatepickerConfig() {
        if (this.datePicker) {
            this.datePicker.minDate = this.minDate;
            this.datePicker.maxDate = this.maxDate;
            this.datePicker.minTime = this.minTime;
            this.datePicker.maxTime = this.maxTime;
            this.datePicker.mode = this.mode || 'day';
            this.datePicker.displayDate = this.displayDate;
            this.datePicker.config = this.config;
            this.datePicker.open = this.open;
            this.datePicker.close = this.close;
            this.datePicker.onChange = this.onChange;
            this.datePicker.onGoToCurrent = this.onGoToCurrent;
            this.datePicker.onLeftNav = this.onLeftNav;
            this.datePicker.onRightNav = this.onRightNav;
            this.datePicker.onSelect = this.onSelect;
            this.datePicker.init();
            if (this.datePicker.componentConfig.disableKeypress) {
                this.elemRef.nativeElement.setAttribute('readonly', true);
            }
            else {
                this.elemRef.nativeElement.removeAttribute('readonly');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DatePickerDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i0.ComponentFactoryResolver }, { token: i4$1.NgControl, optional: true }, { token: UtilsService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.1.4", type: DatePickerDirective, isStandalone: false, selector: "[dpDayPicker]", inputs: { config: ["dpDayPicker", "config"], theme: "theme", mode: "mode", minDate: "minDate", maxDate: "maxDate", minTime: "minTime", maxTime: "maxTime", displayDate: "displayDate" }, outputs: { open: "open", close: "close", onChange: "onChange", onGoToCurrent: "onGoToCurrent", onLeftNav: "onLeftNav", onRightNav: "onRightNav", onSelect: "onSelect" }, host: { listeners: { "click": "onClick()", "focus": "onFocus()", "keydown.enter": "onEnter()" } }, exportAs: ["dpDayPicker"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DatePickerDirective, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'dpDayPicker',
                    selector: '[dpDayPicker]',
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i0.ComponentFactoryResolver }, { type: i4$1.NgControl, decorators: [{
                    type: Optional
                }] }, { type: UtilsService }], propDecorators: { open: [{
                type: Output
            }], close: [{
                type: Output
            }], onChange: [{
                type: Output
            }], onGoToCurrent: [{
                type: Output
            }], onLeftNav: [{
                type: Output
            }], onRightNav: [{
                type: Output
            }], onSelect: [{
                type: Output
            }], config: [{
                type: Input,
                args: ['dpDayPicker']
            }], theme: [{
                type: Input
            }], mode: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], minTime: [{
                type: Input
            }], maxTime: [{
                type: Input
            }], displayDate: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click']
            }], onFocus: [{
                type: HostListener,
                args: ['focus']
            }], onEnter: [{
                type: HostListener,
                args: ['keydown.enter']
            }] } });

class DpDatePickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DpDatePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.1.4", ngImport: i0, type: DpDatePickerModule, declarations: [DatePickerComponent,
            DatePickerDirective,
            DayCalendarComponent,
            MonthCalendarComponent,
            CalendarNavComponent,
            TimeSelectComponent,
            DayTimeCalendarComponent], imports: [CommonModule,
            FormsModule,
            OverlayModule], exports: [DatePickerComponent,
            DatePickerDirective,
            MonthCalendarComponent,
            DayCalendarComponent,
            TimeSelectComponent,
            DayTimeCalendarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DpDatePickerModule, imports: [CommonModule,
            FormsModule,
            OverlayModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.4", ngImport: i0, type: DpDatePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        DatePickerComponent,
                        DatePickerDirective,
                        DayCalendarComponent,
                        MonthCalendarComponent,
                        CalendarNavComponent,
                        TimeSelectComponent,
                        DayTimeCalendarComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        OverlayModule
                    ],
                    exports: [
                        DatePickerComponent,
                        DatePickerDirective,
                        MonthCalendarComponent,
                        DayCalendarComponent,
                        TimeSelectComponent,
                        DayTimeCalendarComponent
                    ]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { DatePickerComponent, DatePickerDirective, DayCalendarComponent, DayTimeCalendarComponent, DpDatePickerModule, ECalendarMode, ECalendarValue, MonthCalendarComponent, SelectEvent, TimeSelectComponent };
//# sourceMappingURL=ng2-date-picker.mjs.map

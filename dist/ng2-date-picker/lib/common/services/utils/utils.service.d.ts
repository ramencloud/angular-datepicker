import { ECalendarValue } from '../../types/calendar-value-enum';
import { SingleCalendarValue } from '../../types/single-calendar-value';
import { ElementRef } from '@angular/core';
import { Dayjs, UnitType } from 'dayjs';
import { CalendarValue } from '../../types/calendar-value';
import { IDate } from '../../models/date.model';
import { CalendarMode } from '../../types/calendar-mode';
import { DateValidator } from '../../types/validator.type';
import { ICalendarInternal } from '../../models/calendar.model';
import * as i0 from "@angular/core";
export interface DateLimits {
    minDate?: SingleCalendarValue;
    maxDate?: SingleCalendarValue;
    minTime?: SingleCalendarValue;
    maxTime?: SingleCalendarValue;
}
export declare class UtilsService {
    static debounce(func: Function, wait: number): () => void;
    createArray(size: number): number[];
    convertToDayjs(date: SingleCalendarValue, format: string): Dayjs;
    isDateValid(date: string, format: string): boolean;
    getDefaultDisplayDate(current: Dayjs, selected: Dayjs[], allowMultiSelect: boolean, minDate: Dayjs): Dayjs;
    getInputType(value: CalendarValue, allowMultiSelect: boolean): ECalendarValue;
    convertToDayjsArray(value: CalendarValue, config: {
        allowMultiSelect?: boolean;
        format?: string;
    }): Dayjs[];
    convertFromDayjsArray(format: string, value: Dayjs[], convertTo: ECalendarValue): CalendarValue;
    convertToString(value: CalendarValue, format: string): string;
    clearUndefined<T>(obj: T): T;
    updateSelected(isMultiple: boolean, currentlySelected: Dayjs[], date: IDate, granularity?: UnitType): Dayjs[];
    closestParent(element: HTMLElement, selector: string): HTMLElement;
    onlyTime(m: Dayjs): Dayjs;
    granularityFromType(calendarType: CalendarMode): UnitType;
    createValidator({ minDate, maxDate, minTime, maxTime }: DateLimits, format: string, calendarType: CalendarMode): DateValidator;
    datesStringToStringArray(value: string): string[];
    getValidDayjsArray(value: string, format: string): Dayjs[];
    shouldShowCurrent(showGoToCurrent: boolean, mode: CalendarMode, min: Dayjs, max: Dayjs): boolean;
    isDateInRange(date: Dayjs, from: Dayjs, to: Dayjs): boolean;
    convertPropsToDayjs(obj: {
        [key: string]: any;
    }, format: string, props: string[]): void;
    shouldResetCurrentView<T extends ICalendarInternal>(prevConf: T, currentConf: T): boolean;
    getNativeElement(elem: HTMLElement | string | ElementRef): HTMLElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<UtilsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UtilsService>;
}

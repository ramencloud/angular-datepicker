import { WeekDays } from '../common/types/week-days.type';
import { UtilsService } from '../common/services/utils/utils.service';
import { IDay } from './day.model';
import { IDayCalendarConfig, IDayCalendarConfigInternal } from './day-calendar-config.model';
import { IMonthCalendarConfig } from '../month-calendar/month-calendar-config';
import { Dayjs } from 'dayjs';
import * as i0 from "@angular/core";
export declare class DayCalendarService {
    private utilsService;
    readonly DEFAULT_CONFIG: IDayCalendarConfig;
    private readonly DAYS;
    constructor(utilsService: UtilsService);
    getConfig(config: IDayCalendarConfig): IDayCalendarConfigInternal;
    generateDaysMap(firstDayOfWeek: WeekDays): {
        [key: string]: number;
    };
    generateMonthArray(config: IDayCalendarConfigInternal, month: Dayjs, selected: Dayjs[]): IDay[][];
    generateWeekdays(firstDayOfWeek: WeekDays): Dayjs[];
    isDateDisabled(date: Dayjs, config: IDayCalendarConfigInternal): boolean;
    getHeaderLabel(config: IDayCalendarConfigInternal, month: Dayjs): string;
    shouldShowLeft(min: Dayjs, currentMonthView: Dayjs): boolean;
    shouldShowRight(max: Dayjs, currentMonthView: Dayjs): boolean;
    generateDaysIndexMap(firstDayOfWeek: WeekDays): {
        [key: number]: string;
    };
    getMonthCalendarConfig(componentConfig: IDayCalendarConfigInternal): IMonthCalendarConfig;
    getDayBtnText(config: IDayCalendarConfigInternal, day: Dayjs): string;
    getDayBtnCssClass(config: IDayCalendarConfigInternal, day: Dayjs): string;
    private removeNearMonthWeeks;
    static ɵfac: i0.ɵɵFactoryDeclaration<DayCalendarService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DayCalendarService>;
}

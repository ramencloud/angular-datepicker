import { UtilsService } from '../common/services/utils/utils.service';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { IDayTimeCalendarConfig, IDayTimeCalendarConfigInternal } from './day-time-calendar-config.model';
import { Dayjs } from 'dayjs';
import { IDayCalendarConfigInternal } from '../day-calendar/day-calendar-config.model';
import * as i0 from "@angular/core";
export declare class DayTimeCalendarService {
    private utilsService;
    private dayCalendarService;
    private timeSelectService;
    readonly DEFAULT_CONFIG: IDayTimeCalendarConfig;
    constructor(utilsService: UtilsService, dayCalendarService: DayCalendarService, timeSelectService: TimeSelectService);
    getConfig(config: IDayTimeCalendarConfig): IDayTimeCalendarConfigInternal;
    updateDay(current: Dayjs, day: Dayjs, config: IDayCalendarConfigInternal): Dayjs;
    updateTime(current: Dayjs, time: Dayjs): Dayjs;
    static ɵfac: i0.ɵɵFactoryDeclaration<DayTimeCalendarService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DayTimeCalendarService>;
}

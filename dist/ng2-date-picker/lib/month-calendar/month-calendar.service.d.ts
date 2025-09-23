import { UtilsService } from '../common/services/utils/utils.service';
import { IMonth } from './month.model';
import { IMonthCalendarConfig, IMonthCalendarConfigInternal } from './month-calendar-config';
import { Dayjs } from 'dayjs';
import * as i0 from "@angular/core";
export declare class MonthCalendarService {
    private utilsService;
    readonly DEFAULT_CONFIG: IMonthCalendarConfigInternal;
    constructor(utilsService: UtilsService);
    getConfig(config: IMonthCalendarConfig): IMonthCalendarConfigInternal;
    generateYear(config: IMonthCalendarConfig, year: Dayjs, selected?: Dayjs[]): IMonth[][];
    isMonthDisabled(date: Dayjs, config: IMonthCalendarConfig): boolean;
    shouldShowLeft(min: Dayjs, currentMonthView: Dayjs): boolean;
    shouldShowRight(max: Dayjs, currentMonthView: Dayjs): boolean;
    getHeaderLabel(config: IMonthCalendarConfig, year: Dayjs): string;
    getMonthBtnText(config: IMonthCalendarConfig, month: Dayjs): string;
    getMonthBtnCssClass(config: IMonthCalendarConfig, month: Dayjs): string;
    private static validateConfig;
    static ɵfac: i0.ɵɵFactoryDeclaration<MonthCalendarService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MonthCalendarService>;
}

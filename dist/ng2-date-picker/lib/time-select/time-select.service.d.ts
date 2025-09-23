import { UtilsService } from '../common/services/utils/utils.service';
import { ITimeSelectConfig, ITimeSelectConfigInternal } from './time-select-config.model';
import { Dayjs } from 'dayjs';
import * as i0 from "@angular/core";
export type TimeUnit = 'hour' | 'minute' | 'second';
export declare const FIRST_PM_HOUR = 12;
export declare class TimeSelectService {
    private readonly utilsService;
    readonly DEFAULT_CONFIG: ITimeSelectConfigInternal;
    constructor(utilsService: UtilsService);
    getConfig(config: ITimeSelectConfig): ITimeSelectConfigInternal;
    getTimeFormat(config: ITimeSelectConfigInternal): string;
    getHours(config: ITimeSelectConfigInternal, t: Dayjs | null): string;
    getMinutes(config: ITimeSelectConfigInternal, t: Dayjs | null): string;
    getSeconds(config: ITimeSelectConfigInternal, t: Dayjs | null): string;
    getMeridiem(config: ITimeSelectConfigInternal, time: Dayjs): string;
    decrease(config: ITimeSelectConfigInternal, time: Dayjs, unit: TimeUnit): Dayjs;
    increase(config: ITimeSelectConfigInternal, time: Dayjs, unit: TimeUnit): Dayjs;
    toggleMeridiem(time: Dayjs): Dayjs;
    shouldShowDecrease(config: ITimeSelectConfigInternal, time: Dayjs, unit: TimeUnit): boolean;
    shouldShowIncrease(config: ITimeSelectConfigInternal, time: Dayjs, unit: TimeUnit): boolean;
    shouldShowToggleMeridiem(config: ITimeSelectConfigInternal, time: Dayjs): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeSelectService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimeSelectService>;
}

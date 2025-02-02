import { TDrops, TOpens } from '../common/types/poistions.type';
import { IDayCalendarConfig, IDayCalendarConfigInternal } from '../day-calendar/day-calendar-config.model';
import { IMonthCalendarConfig, IMonthCalendarConfigInternal } from '../month-calendar/month-calendar-config';
import { ITimeSelectConfig, ITimeSelectConfigInternal } from '../time-select/time-select-config.model';
import { ElementRef } from '@angular/core';
export interface IConfig {
    closeOnSelect?: boolean;
    closeOnSelectDelay?: number;
    openOnFocus?: boolean;
    openOnClick?: boolean;
    onOpenDelay?: number;
    closeOnEnter?: boolean;
    disableKeypress?: boolean;
    inputElementContainer?: HTMLElement | string | ElementRef;
    drops?: TDrops;
    opens?: TOpens;
    hideInputContainer?: boolean;
    hideOnOutsideClick?: boolean;
}
export interface IDatePickerConfig extends IConfig, IDayCalendarConfig, IMonthCalendarConfig, ITimeSelectConfig {
}
export interface IDatePickerConfigInternal extends IConfig, IDayCalendarConfigInternal, IMonthCalendarConfigInternal, ITimeSelectConfigInternal {
}

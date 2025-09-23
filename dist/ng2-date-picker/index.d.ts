import { Dayjs, UnitType, ManipulateType } from 'dayjs';
import * as i0 from '@angular/core';
import { ElementRef, OnInit, OnChanges, ChangeDetectorRef, EventEmitter, SimpleChanges, SimpleChange, OnDestroy, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import * as i9 from '@angular/forms';
import { ControlValueAccessor, Validator, UntypedFormControl, ValidationErrors, NgControl } from '@angular/forms';
import * as i10 from '@angular/cdk/overlay';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import * as i8 from '@angular/common';

type SingleCalendarValue = Dayjs | string;

interface IDate {
    date: Dayjs;
    selected: boolean;
}

declare enum ECalendarMode {
    Day = 0,
    DayTime = 1,
    Month = 2,
    Time = 3
}

interface IDay extends IDate {
    currentMonth?: boolean;
    prevMonth?: boolean;
    nextMonth?: boolean;
    currentDay?: boolean;
    disabled?: boolean;
}
interface IDayEvent {
    day: IDay;
    event: MouseEvent;
}

interface IMonth extends IDate {
    currentMonth: boolean;
    disabled: boolean;
    text: string;
}

declare enum ECalendarValue {
    Dayjs = 1,
    DayjsArr = 2,
    String = 3,
    StringArr = 4
}

type CalendarValue = Dayjs | Dayjs[] | string | string[];

interface ICalendar {
    min?: SingleCalendarValue;
    max?: Dayjs | string;
}
interface ICalendarInternal {
    min?: Dayjs;
    max?: Dayjs;
}

type WeekDays = 'su' | 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa';

interface IConfig$3 {
    isDayDisabledCallback?: (date: Dayjs) => boolean;
    isMonthDisabledCallback?: (date: Dayjs) => boolean;
    weekDayFormat?: string;
    weekDayFormatter?: (dayIndex: number) => string;
    showNearMonthDays?: boolean;
    showWeekNumbers?: boolean;
    firstDayOfWeek?: WeekDays;
    format?: string;
    allowMultiSelect?: boolean;
    monthFormat?: string;
    monthFormatter?: (month: Dayjs) => string;
    enableMonthSelector?: boolean;
    yearFormat?: string;
    yearFormatter?: (year: Dayjs) => string;
    dayBtnFormat?: string;
    dayBtnFormatter?: (day: Dayjs) => string;
    dayBtnCssClassCallback?: (day: Dayjs) => string;
    monthBtnFormat?: string;
    monthBtnFormatter?: (day: Dayjs) => string;
    monthBtnCssClassCallback?: (day: Dayjs) => string;
    multipleYearsNavigateBy?: number;
    showMultipleYearsNavigation?: boolean;
    returnedValueType?: ECalendarValue;
    showGoToCurrent?: boolean;
    unSelectOnClick?: boolean;
    numOfMonthRows?: number;
}
interface IDayCalendarConfig extends IConfig$3, ICalendar {
}
interface IDayCalendarConfigInternal extends IConfig$3, ICalendarInternal {
}

type TOpens = 'right' | 'left';
type TDrops = 'up' | 'down';

interface IConfig$2 {
    isMonthDisabledCallback?: (date: Dayjs) => boolean;
    allowMultiSelect?: boolean;
    yearFormat?: string;
    yearFormatter?: (month: Dayjs) => string;
    format?: string;
    isNavHeaderBtnClickable?: boolean;
    monthBtnFormat?: string;
    monthBtnFormatter?: (day: Dayjs) => string;
    numOfMonthRows?: number;
    monthBtnCssClassCallback?: (day: Dayjs) => string;
    multipleYearsNavigateBy?: number;
    showMultipleYearsNavigation?: boolean;
    returnedValueType?: ECalendarValue;
    showGoToCurrent?: boolean;
    unSelectOnClick?: boolean;
}
interface IMonthCalendarConfig extends IConfig$2, ICalendar {
}
interface IMonthCalendarConfigInternal extends IConfig$2, ICalendarInternal {
}

interface IConfig$1 {
    hours12Format?: string;
    hours24Format?: string;
    maxTime?: Dayjs;
    meridiemFormat?: string;
    minTime?: Dayjs;
    minutesFormat?: string;
    minutesInterval?: number;
    secondsFormat?: string;
    secondsInterval?: number;
    showSeconds?: boolean;
    showTwentyFourHours?: boolean;
    timeSeparator?: string;
    returnedValueType?: ECalendarValue;
}
interface ITimeSelectConfig extends IConfig$1, ICalendar {
}
interface ITimeSelectConfigInternal extends IConfig$1, ICalendarInternal {
}

interface IConfig {
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
interface IDatePickerConfig extends IConfig, IDayCalendarConfig, IMonthCalendarConfig, ITimeSelectConfig {
}
interface IDatePickerConfigInternal extends IConfig, IDayCalendarConfigInternal, IMonthCalendarConfigInternal, ITimeSelectConfigInternal {
}

interface IDatePickerDirectiveConfig extends IDayCalendarConfig, IMonthCalendarConfig, ITimeSelectConfig {
    closeOnSelect?: boolean;
    closeOnSelectDelay?: number;
    onOpenDelay?: number;
    disableKeypress?: boolean;
    inputElementContainer?: HTMLElement | ElementRef;
    drops?: TDrops;
    opens?: TOpens;
    hideInputContainer?: boolean;
}

interface IDayTimeCalendarConfig extends ITimeSelectConfig, IDayCalendarConfig {
}
interface IDayTimeCalendarConfigInternal extends ITimeSelectConfigInternal, IDayCalendarConfigInternal {
}

declare enum SelectEvent {
    INPUT = "input",
    SELECTION = "selection"
}

interface ISelectionEvent {
    date: SingleCalendarValue;
    granularity: UnitType;
    type: SelectEvent;
}

type CalendarMode = 'day' | 'month' | 'daytime' | 'time';

declare class DayCalendarService {
    private utilsService;
    readonly DEFAULT_CONFIG: IDayCalendarConfig;
    private readonly DAYS;
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

type DateValidator = (inputVal: CalendarValue) => {
    [key: string]: any;
};

interface DateLimits {
    minDate?: SingleCalendarValue;
    maxDate?: SingleCalendarValue;
    minTime?: SingleCalendarValue;
    maxTime?: SingleCalendarValue;
}
declare class UtilsService {
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

interface INavEvent {
    from: Dayjs;
    to: Dayjs;
}

declare class DayCalendarComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
    readonly dayCalendarService: DayCalendarService;
    readonly utilsService: UtilsService;
    readonly cd: ChangeDetectorRef;
    config: IDayCalendarConfig;
    displayDate: SingleCalendarValue;
    minDate: Dayjs;
    maxDate: Dayjs;
    theme: string;
    onSelect: EventEmitter<IDay>;
    onMonthSelect: EventEmitter<IMonth>;
    onNavHeaderBtnClick: EventEmitter<ECalendarMode>;
    onGoToCurrent: EventEmitter<void>;
    onLeftNav: EventEmitter<INavEvent>;
    onRightNav: EventEmitter<INavEvent>;
    CalendarMode: typeof ECalendarMode;
    isInited: boolean;
    componentConfig: IDayCalendarConfigInternal;
    weeks: IDay[][];
    weekdays: Dayjs[];
    inputValue: CalendarValue;
    inputValueType: ECalendarValue;
    validateFn: DateValidator;
    currentCalendarMode: ECalendarMode;
    monthCalendarConfig: IMonthCalendarConfig;
    _shouldShowCurrent: boolean;
    navLabel: string;
    showLeftNav: boolean;
    showRightNav: boolean;
    api: {
        moveCalendarsBy: any;
        moveCalendarTo: any;
        toggleCalendarMode: any;
    };
    _selected: Dayjs[];
    get selected(): Dayjs[];
    set selected(selected: Dayjs[]);
    _currentDateView: Dayjs;
    get currentDateView(): Dayjs;
    set currentDateView(current: Dayjs);
    ngOnInit(): void;
    init(): void;
    ngOnChanges(changes: SimpleChanges): void;
    writeValue(value: CalendarValue): void;
    registerOnChange(fn: any): void;
    onChangeCallback(_: any): void;
    registerOnTouched(fn: any): void;
    validate(formControl: UntypedFormControl): ValidationErrors | any;
    processOnChangeCallback(value: Dayjs[]): CalendarValue;
    initValidators(): void;
    dayClicked(day: IDay): void;
    getDayBtnText(day: IDay): string;
    getDayBtnCssClass(day: IDay): {
        [klass: string]: boolean;
    };
    onLeftNavClick(): void;
    onRightNavClick(): void;
    onMonthCalendarLeftClick(change: INavEvent): void;
    onMonthCalendarRightClick(change: INavEvent): void;
    onMonthCalendarSecondaryLeftClick(change: INavEvent): void;
    onMonthCalendarSecondaryRightClick(change: INavEvent): void;
    getWeekdayName(weekday: Dayjs): string;
    toggleCalendarMode(mode: ECalendarMode): void;
    monthSelected(month: IMonth): void;
    moveCalendarsBy(current: Dayjs, amount: number, granularity?: ManipulateType): void;
    moveCalendarTo(to: SingleCalendarValue): void;
    shouldShowCurrent(): boolean;
    goToCurrent(): void;
    handleConfigChange(config: SimpleChange): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DayCalendarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DayCalendarComponent, "dp-day-calendar", never, { "config": { "alias": "config"; "required": false; }; "displayDate": { "alias": "displayDate"; "required": false; }; "minDate": { "alias": "minDate"; "required": false; }; "maxDate": { "alias": "maxDate"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; }, { "onSelect": "onSelect"; "onMonthSelect": "onMonthSelect"; "onNavHeaderBtnClick": "onNavHeaderBtnClick"; "onGoToCurrent": "onGoToCurrent"; "onLeftNav": "onLeftNav"; "onRightNav": "onRightNav"; }, never, never, false, never>;
}

type TimeUnit = 'hour' | 'minute' | 'second';
declare class TimeSelectService {
    private readonly utilsService;
    readonly DEFAULT_CONFIG: ITimeSelectConfigInternal;
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

declare class TimeSelectComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
    readonly timeSelectService: TimeSelectService;
    readonly utilsService: UtilsService;
    readonly cd: ChangeDetectorRef;
    config: ITimeSelectConfig;
    displayDate: SingleCalendarValue;
    minDate: SingleCalendarValue;
    maxDate: SingleCalendarValue;
    minTime: SingleCalendarValue;
    maxTime: SingleCalendarValue;
    theme: string;
    onChange: EventEmitter<IDate>;
    isInited: boolean;
    componentConfig: ITimeSelectConfigInternal;
    inputValue: CalendarValue;
    inputValueType: ECalendarValue;
    validateFn: DateValidator;
    hours: string;
    minutes: string;
    seconds: string;
    meridiem: string;
    showDecHour: boolean;
    showDecMinute: boolean;
    showDecSecond: boolean;
    showIncHour: boolean;
    showIncMinute: boolean;
    showIncSecond: boolean;
    showToggleMeridiem: boolean;
    api: {
        triggerChange: any;
    };
    _selected: Dayjs;
    get selected(): Dayjs;
    set selected(selected: Dayjs);
    ngOnInit(): void;
    init(): void;
    ngOnChanges(changes: SimpleChanges): void;
    writeValue(value: CalendarValue): void;
    registerOnChange(fn: any): void;
    onChangeCallback(_: any): void;
    registerOnTouched(fn: any): void;
    validate(formControl: UntypedFormControl): ValidationErrors | any;
    processOnChangeCallback(value: Dayjs): CalendarValue;
    initValidators(): void;
    decrease(unit: TimeUnit): void;
    increase(unit: TimeUnit): void;
    toggleMeridiem(): void;
    emitChange(): void;
    calculateTimeParts(time: Dayjs): void;
    private handleConfigChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeSelectComponent, "dp-time-select", never, { "config": { "alias": "config"; "required": false; }; "displayDate": { "alias": "displayDate"; "required": false; }; "minDate": { "alias": "minDate"; "required": false; }; "maxDate": { "alias": "maxDate"; "required": false; }; "minTime": { "alias": "minTime"; "required": false; }; "maxTime": { "alias": "maxTime"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; }, { "onChange": "onChange"; }, never, never, false, never>;
}

interface IDpDayPickerApi {
    open: () => void;
    close: () => void;
    moveCalendarTo: (date: SingleCalendarValue) => void;
}

declare class MonthCalendarService {
    private utilsService;
    readonly DEFAULT_CONFIG: IMonthCalendarConfigInternal;
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

declare class MonthCalendarComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
    readonly monthCalendarService: MonthCalendarService;
    readonly utilsService: UtilsService;
    readonly cd: ChangeDetectorRef;
    config: IMonthCalendarConfig;
    displayDate: Dayjs | string;
    minDate: Dayjs;
    maxDate: Dayjs;
    theme: string;
    onSelect: EventEmitter<IMonth>;
    onNavHeaderBtnClick: EventEmitter<null>;
    onGoToCurrent: EventEmitter<void>;
    onLeftNav: EventEmitter<INavEvent>;
    onRightNav: EventEmitter<INavEvent>;
    onLeftSecondaryNav: EventEmitter<INavEvent>;
    onRightSecondaryNav: EventEmitter<INavEvent>;
    isInited: boolean;
    componentConfig: IMonthCalendarConfigInternal;
    yearMonths: IMonth[][];
    inputValue: CalendarValue;
    inputValueType: ECalendarValue;
    validateFn: DateValidator;
    _shouldShowCurrent: boolean;
    navLabel: string;
    showLeftNav: boolean;
    showRightNav: boolean;
    showSecondaryLeftNav: boolean;
    showSecondaryRightNav: boolean;
    api: {
        toggleCalendar: any;
        moveCalendarTo: any;
    };
    _selected: Dayjs[];
    get selected(): Dayjs[];
    set selected(selected: Dayjs[]);
    _currentDateView: Dayjs;
    get currentDateView(): Dayjs;
    set currentDateView(current: Dayjs);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    init(): void;
    writeValue(value: CalendarValue): void;
    registerOnChange(fn: any): void;
    onChangeCallback(_: any): void;
    registerOnTouched(fn: any): void;
    validate(formControl: UntypedFormControl): ValidationErrors | any;
    processOnChangeCallback(value: Dayjs[]): CalendarValue;
    initValidators(): void;
    monthClicked(month: IMonth): void;
    onLeftNavClick(): void;
    onLeftSecondaryNavClick(): void;
    onRightNavClick(): void;
    onRightSecondaryNavClick(): void;
    toggleCalendarMode(): void;
    getMonthBtnCssClass(month: IMonth): {
        [klass: string]: boolean;
    };
    shouldShowCurrent(): boolean;
    goToCurrent(): void;
    moveCalendarTo(to: SingleCalendarValue): void;
    handleConfigChange(config: SimpleChange): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MonthCalendarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MonthCalendarComponent, "dp-month-calendar", never, { "config": { "alias": "config"; "required": false; }; "displayDate": { "alias": "displayDate"; "required": false; }; "minDate": { "alias": "minDate"; "required": false; }; "maxDate": { "alias": "maxDate"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; }, { "onSelect": "onSelect"; "onNavHeaderBtnClick": "onNavHeaderBtnClick"; "onGoToCurrent": "onGoToCurrent"; "onLeftNav": "onLeftNav"; "onRightNav": "onRightNav"; "onLeftSecondaryNav": "onLeftSecondaryNav"; "onRightSecondaryNav": "onRightSecondaryNav"; }, never, never, false, never>;
}

declare class DayTimeCalendarService {
    private utilsService;
    private dayCalendarService;
    private timeSelectService;
    readonly DEFAULT_CONFIG: IDayTimeCalendarConfig;
    getConfig(config: IDayTimeCalendarConfig): IDayTimeCalendarConfigInternal;
    updateDay(current: Dayjs, day: Dayjs, config: IDayCalendarConfigInternal): Dayjs;
    updateTime(current: Dayjs, time: Dayjs): Dayjs;
    static ɵfac: i0.ɵɵFactoryDeclaration<DayTimeCalendarService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DayTimeCalendarService>;
}

declare class DayTimeCalendarComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
    dayTimeCalendarService: DayTimeCalendarService;
    utilsService: UtilsService;
    cd: ChangeDetectorRef;
    config: IDayTimeCalendarConfig;
    displayDate: SingleCalendarValue;
    minDate: SingleCalendarValue;
    maxDate: SingleCalendarValue;
    theme: string;
    onChange: EventEmitter<IDate>;
    onGoToCurrent: EventEmitter<void>;
    onLeftNav: EventEmitter<INavEvent>;
    onRightNav: EventEmitter<INavEvent>;
    dayCalendarRef: DayCalendarComponent;
    isInited: boolean;
    componentConfig: IDayTimeCalendarConfigInternal;
    inputValue: CalendarValue;
    inputValueType: ECalendarValue;
    validateFn: DateValidator;
    api: {
        moveCalendarTo: any;
    };
    _selected: Dayjs;
    get selected(): Dayjs;
    set selected(selected: Dayjs);
    ngOnInit(): void;
    init(): void;
    ngOnChanges(changes: SimpleChanges): void;
    writeValue(value: CalendarValue): void;
    registerOnChange(fn: any): void;
    onChangeCallback(_: any): void;
    registerOnTouched(fn: any): void;
    validate(formControl: UntypedFormControl): ValidationErrors | any;
    processOnChangeCallback(value: Dayjs): CalendarValue;
    initValidators(): void;
    dateSelected(day: IDate): void;
    timeChange(time: IDate): void;
    emitChange(): void;
    moveCalendarTo(to: SingleCalendarValue): void;
    onLeftNavClick(change: INavEvent): void;
    onRightNavClick(change: INavEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DayTimeCalendarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DayTimeCalendarComponent, "dp-day-time-calendar", never, { "config": { "alias": "config"; "required": false; }; "displayDate": { "alias": "displayDate"; "required": false; }; "minDate": { "alias": "minDate"; "required": false; }; "maxDate": { "alias": "maxDate"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; }, { "onChange": "onChange"; "onGoToCurrent": "onGoToCurrent"; "onLeftNav": "onLeftNav"; "onRightNav": "onRightNav"; }, never, never, false, never>;
}

declare class DatePickerComponent implements OnChanges, OnInit, ControlValueAccessor, Validator, OnDestroy {
    private readonly dayPickerService;
    private readonly renderer;
    private readonly utilsService;
    readonly cd: ChangeDetectorRef;
    isInitialized: boolean;
    config: IDatePickerConfig;
    mode: CalendarMode;
    placeholder: string;
    disabled: boolean;
    displayDate: Dayjs | string;
    theme: string;
    minDate: SingleCalendarValue;
    maxDate: SingleCalendarValue;
    minTime: SingleCalendarValue;
    maxTime: SingleCalendarValue;
    open: EventEmitter<void>;
    close: EventEmitter<void>;
    onChange: EventEmitter<CalendarValue>;
    onGoToCurrent: EventEmitter<void>;
    onLeftNav: EventEmitter<INavEvent>;
    onRightNav: EventEmitter<INavEvent>;
    onSelect: EventEmitter<ISelectionEvent>;
    calendarContainer: ElementRef;
    dayCalendarRef: DayCalendarComponent;
    monthCalendarRef: MonthCalendarComponent;
    dayTimeCalendarRef: DayTimeCalendarComponent;
    timeSelectRef: TimeSelectComponent;
    inputElement: ElementRef<HTMLInputElement>;
    componentConfig: IDatePickerConfigInternal;
    dayCalendarConfig: IDayCalendarConfig;
    dayTimeCalendarConfig: IDayTimeCalendarConfig;
    timeSelectConfig: ITimeSelectConfig;
    inputValue: CalendarValue;
    isFocusedTrigger: boolean;
    inputElementValue: string;
    calendarWrapper: HTMLElement;
    appendToElement: HTMLElement;
    handleInnerElementClickUnlisteners: Function[];
    globalListenersUnlisteners: Function[];
    validateFn: DateValidator;
    api: IDpDayPickerApi;
    selectEvent: typeof SelectEvent;
    origin: ElementRef | HTMLElement;
    private onOpenDelayTimeoutHandler;
    get openOnFocus(): boolean;
    get openOnClick(): boolean;
    areCalendarsShown: boolean;
    _selected: Dayjs[];
    get selected(): Dayjs[];
    set selected(selected: Dayjs[]);
    _currentDateView: Dayjs;
    overlayPosition: ConnectionPositionPair[] | undefined;
    get currentDateView(): Dayjs;
    set currentDateView(date: Dayjs);
    onClick(): void;
    onBodyClick(event: MouseEvent): void;
    writeValue(value: CalendarValue): void;
    registerOnChange(fn: any): void;
    onChangeCallback(_: any, __: boolean): void;
    registerOnTouched(fn: any): void;
    onTouchedCallback(): void;
    validate(formControl: UntypedFormControl): ValidationErrors;
    processOnChangeCallback(selected: Dayjs[] | string): CalendarValue;
    initValidators(): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    setDisabledState(isDisabled: boolean): void;
    init(): void;
    inputFocused(): void;
    inputBlurred(): void;
    showCalendars(): void;
    hideCalendar(): void;
    onViewDateChange(value: CalendarValue): void;
    dateSelected(date: IDate, granularity: UnitType, type: SelectEvent, ignoreClose?: boolean): void;
    onDateClick(): void;
    onKeyPress(event: KeyboardEvent): void;
    moveCalendarTo(date: SingleCalendarValue): void;
    onLeftNavClick(change: INavEvent): void;
    onRightNavClick(change: INavEvent): void;
    startGlobalListeners(): void;
    stopGlobalListeners(): void;
    ngOnDestroy(): void;
    goToCurrent(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatePickerComponent, "dp-date-picker", never, { "config": { "alias": "config"; "required": false; }; "mode": { "alias": "mode"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "displayDate": { "alias": "displayDate"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "minDate": { "alias": "minDate"; "required": false; }; "maxDate": { "alias": "maxDate"; "required": false; }; "minTime": { "alias": "minTime"; "required": false; }; "maxTime": { "alias": "maxTime"; "required": false; }; }, { "open": "open"; "close": "close"; "onChange": "onChange"; "onGoToCurrent": "onGoToCurrent"; "onLeftNav": "onLeftNav"; "onRightNav": "onRightNav"; "onSelect": "onSelect"; }, never, never, false, never>;
}

declare class DatePickerDirective implements OnInit {
    readonly viewContainerRef: ViewContainerRef;
    readonly elemRef: ElementRef<any>;
    readonly componentFactoryResolver: ComponentFactoryResolver;
    readonly formControl: NgControl;
    readonly utilsService: UtilsService;
    open: EventEmitter<void>;
    close: EventEmitter<void>;
    onChange: EventEmitter<CalendarValue>;
    onGoToCurrent: EventEmitter<void>;
    onLeftNav: EventEmitter<INavEvent>;
    onRightNav: EventEmitter<INavEvent>;
    onSelect: EventEmitter<ISelectionEvent>;
    datePicker: DatePickerComponent;
    api: IDpDayPickerApi;
    private _config;
    get config(): IDatePickerDirectiveConfig;
    set config(config: IDatePickerDirectiveConfig);
    private _theme;
    get theme(): string;
    set theme(theme: string);
    private _mode;
    get mode(): CalendarMode;
    set mode(mode: CalendarMode);
    private _minDate;
    get minDate(): SingleCalendarValue;
    set minDate(minDate: SingleCalendarValue);
    private _maxDate;
    get maxDate(): SingleCalendarValue;
    set maxDate(maxDate: SingleCalendarValue);
    private _minTime;
    get minTime(): SingleCalendarValue;
    set minTime(minTime: SingleCalendarValue);
    private _maxTime;
    get maxTime(): SingleCalendarValue;
    set maxTime(maxTime: SingleCalendarValue);
    private _displayDate;
    get displayDate(): Dayjs | string;
    set displayDate(displayDate: Dayjs | string);
    ngOnInit(): void;
    createDatePicker(): DatePickerComponent;
    attachModelToDatePicker(): void;
    onClick(): void;
    onFocus(): void;
    onEnter(): void;
    markForCheck(): void;
    private updateDatepickerConfig;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatePickerDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatePickerDirective, "[dpDayPicker]", ["dpDayPicker"], { "config": { "alias": "dpDayPicker"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "mode": { "alias": "mode"; "required": false; }; "minDate": { "alias": "minDate"; "required": false; }; "maxDate": { "alias": "maxDate"; "required": false; }; "minTime": { "alias": "minTime"; "required": false; }; "maxTime": { "alias": "maxTime"; "required": false; }; "displayDate": { "alias": "displayDate"; "required": false; }; }, { "open": "open"; "close": "close"; "onChange": "onChange"; "onGoToCurrent": "onGoToCurrent"; "onLeftNav": "onLeftNav"; "onRightNav": "onRightNav"; "onSelect": "onSelect"; }, never, never, false, never>;
}

declare class CalendarNavComponent {
    label: string;
    isLabelClickable: boolean;
    showLeftNav: boolean;
    showLeftSecondaryNav: boolean;
    showRightNav: boolean;
    showRightSecondaryNav: boolean;
    leftNavDisabled: boolean;
    leftSecondaryNavDisabled: boolean;
    rightNavDisabled: boolean;
    rightSecondaryNavDisabled: boolean;
    showGoToCurrent: boolean;
    theme: string;
    onLeftNav: EventEmitter<null>;
    onLeftSecondaryNav: EventEmitter<null>;
    onRightNav: EventEmitter<null>;
    onRightSecondaryNav: EventEmitter<null>;
    onLabelClick: EventEmitter<null>;
    onGoToCurrent: EventEmitter<null>;
    leftNavClicked(): void;
    leftSecondaryNavClicked(): void;
    rightNavClicked(): void;
    rightSecondaryNavClicked(): void;
    labelClicked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CalendarNavComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CalendarNavComponent, "dp-calendar-nav", never, { "label": { "alias": "label"; "required": false; }; "isLabelClickable": { "alias": "isLabelClickable"; "required": false; }; "showLeftNav": { "alias": "showLeftNav"; "required": false; }; "showLeftSecondaryNav": { "alias": "showLeftSecondaryNav"; "required": false; }; "showRightNav": { "alias": "showRightNav"; "required": false; }; "showRightSecondaryNav": { "alias": "showRightSecondaryNav"; "required": false; }; "leftNavDisabled": { "alias": "leftNavDisabled"; "required": false; }; "leftSecondaryNavDisabled": { "alias": "leftSecondaryNavDisabled"; "required": false; }; "rightNavDisabled": { "alias": "rightNavDisabled"; "required": false; }; "rightSecondaryNavDisabled": { "alias": "rightSecondaryNavDisabled"; "required": false; }; "showGoToCurrent": { "alias": "showGoToCurrent"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; }, { "onLeftNav": "onLeftNav"; "onLeftSecondaryNav": "onLeftSecondaryNav"; "onRightNav": "onRightNav"; "onRightSecondaryNav": "onRightSecondaryNav"; "onLabelClick": "onLabelClick"; "onGoToCurrent": "onGoToCurrent"; }, never, never, false, never>;
}

declare class DpDatePickerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<DpDatePickerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DpDatePickerModule, [typeof DatePickerComponent, typeof DatePickerDirective, typeof DayCalendarComponent, typeof MonthCalendarComponent, typeof CalendarNavComponent, typeof TimeSelectComponent, typeof DayTimeCalendarComponent], [typeof i8.CommonModule, typeof i9.FormsModule, typeof i10.OverlayModule], [typeof DatePickerComponent, typeof DatePickerDirective, typeof MonthCalendarComponent, typeof DayCalendarComponent, typeof TimeSelectComponent, typeof DayTimeCalendarComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DpDatePickerModule>;
}

export { DatePickerComponent, DatePickerDirective, DayCalendarComponent, DayTimeCalendarComponent, DpDatePickerModule, ECalendarMode, ECalendarValue, MonthCalendarComponent, SelectEvent, TimeSelectComponent };
export type { CalendarValue, IDate, IDatePickerConfig, IDatePickerDirectiveConfig, IDay, IDayCalendarConfig, IDayEvent, IDayTimeCalendarConfig, IMonth, IMonthCalendarConfig, ISelectionEvent, SingleCalendarValue };

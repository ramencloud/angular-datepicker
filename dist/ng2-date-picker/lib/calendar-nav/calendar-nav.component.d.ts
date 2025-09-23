import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CalendarNavComponent {
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

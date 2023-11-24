import { BaseMobile } from "../../schema/mobiles/baseMobile";
import { Player } from "../../schema/mobiles/player";

export abstract class BaseGameAction {
    mobile: BaseMobile;
    payload: any;
    constructor(mobile: BaseMobile, payload: any) {
        this.mobile = mobile;
        this.payload = payload;
    }
}
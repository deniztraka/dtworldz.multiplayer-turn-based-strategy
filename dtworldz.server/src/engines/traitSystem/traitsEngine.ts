import { BaseMobile } from "../../schema/mobiles/baseMobile";
import { Attributes } from "../attributeSystem/attributes";
import { Trait } from "./traits";

export class TraitsEngine {
    static requirements: Map<Trait, { attribute: Attributes, minimumVal: number }[]> = new Map([
        [Trait.Swimming, [{ attribute: Attributes.Dexterity, minimumVal: 20 }, { attribute: Attributes.Strength, minimumVal: 5 }]],
        [Trait.Climbing, [{ attribute: Attributes.Strength, minimumVal: 30 }, { attribute: Attributes.Dexterity, minimumVal: 30 }]],
        [Trait.Pathfinding, [{ attribute: Attributes.Intelligence, minimumVal: 15 }, { attribute: Attributes.Dexterity, minimumVal: 20 }]],
        // ... other requirements
    ]);

    static checkRequirements(trait: Trait, mobile: BaseMobile): boolean {
        const requirements = TraitsEngine.requirements.get(trait);
        return requirements ? requirements.every(req => mobile.attributes.get(req.attribute) >= req.minimumVal) : true;
    }
}
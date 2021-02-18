import { Deserializable } from "./Deserializable.model"
import { Eleve } from "./Eleve.model";

export class DevoirEleve implements Deserializable {

    public _id :        string;
    public note :       number;
    public id_eleve :   Eleve;
    // public id_devoir : Devoir;


    deserialize(input: any) : this {
        Object.assign(this, input);
        return this;
    }
}
import { Eleve } from "./Eleve.model";
import { Deserializable } from "./Deserializable.model"

export class ClasseDEcole implements Deserializable {

    public _id :             string;
    public numeroClasse :    number;
    public moyenneClasse :   number;
    public nbEleves :        number;
    // public eleves: Eleve;

    deserialize(input: any) : this {
        Object.assign(this, input);
        return this;
    }
}
import { ClasseDEcole } from "./ClasseDEcole.model"
import { Deserializable } from "./Deserializable.model"

export class Eleve implements Deserializable {

    public _id:             string;
    public firstName:       string;
    public lastName:        string;
    public moyenne:         number;
    public classe_d_ecole:  ClasseDEcole;
    // public devoir_eleves:   DevoirEleve[];

    /* deserialize(input: any) {
        Object.assign(this, input);
        return this;
    } */

    
    deserialize(input: any) : Eleve {
        Object.assign(this, input);
        this.classe_d_ecole = new ClasseDEcole().deserialize(input.classe_d_ecole)
        return this;
    }
   
}
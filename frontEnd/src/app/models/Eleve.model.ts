import { ClasseDEcole } from "./ClasseDEcole.model"
import { Deserializable } from "./Deserializable.model"
import { DevoirEleve } from "./DevoirEleve.model";


export class Eleve implements Deserializable {

    public _id :             string;
    public firstName :       string;
    public lastName :        string;
    public moyenne :         number;
    public classe_d_ecole :  ClasseDEcole;
    public devoir_eleves:    DevoirEleve[];


    
    deserialize(input: any) : Eleve 
    {
        Object.assign(this, input);

        this.devoir_eleves = this.deserialize_for_tab_devoir_eleve(input.devoir_eleves);
        this.classe_d_ecole = new ClasseDEcole().deserialize(input.classe_d_ecole);
        
        return this;
    }

   /**
    * (facultatif)
    * pour typé en DevoirEleve chaque objet de la table input_devoir_eleves
    * @param {DevoirEleve[]} input_devoir_eleves 
    * @return {DevoirEleve[]} tab
    */
    deserialize_for_tab_devoir_eleve(input_devoir_eleves : DevoirEleve[]) : DevoirEleve[]
    {
        let tab = [];

        for (let index = 0; index < input_devoir_eleves.length; index++) 
        {
            tab.push(new DevoirEleve().deserialize(input_devoir_eleves[index])); 
        }

        return tab;
    }
}
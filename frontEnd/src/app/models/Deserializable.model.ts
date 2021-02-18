import { Eleve } from "./Eleve.model"

// creer un dossier interface
export interface Deserializable {

    deserialize(input: any);
}
import { Eleve } from "./Eleve.model"

export interface Deserializable {

    deserialize(input: any);
}
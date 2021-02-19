import { Deserializable } from "./Deserializable.model"

export class Devoir implements Deserializable 
{
    public _id :        string;
    public title :      string;
    public content :    string;
    public createdAt :  Date;

    deserialize(input: any) : this {
        Object.assign(this, input);
        return this;
    }

}
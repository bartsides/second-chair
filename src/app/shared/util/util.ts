import { Exhibit } from '../models/exhibit';

export class Util {
  static search(obj: Exhibit, value: string): boolean {
    if (!value) return true;
    if (!obj) return false;
    let v = value.toLowerCase();
    let properties = this.getSearchableProperties(obj);
    for (let i = 0; i < properties.length; i++) {
      if (properties[i]?.toLowerCase().includes(v)) {
        return true;
      }
    }
    return false;
  }

  static getSearchableProperties(obj: any): string[] {
    if (!obj) return [];

    if (this.isExhibit(obj)) {
      let exhibit = obj as Exhibit;
      return [
        exhibit.marker,
        exhibit.description,
        exhibit.notes,
        exhibit.supportingWitness,
        exhibit.admittanceStoplight,
        `${exhibit.marker} - ${exhibit.description}`,
      ];
    }

    return [];
  }

  static isExhibit(value: Exhibit): value is Exhibit {
    return !!value?.marker;
  }
}

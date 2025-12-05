
export class EnumInfo {

  key: string;
  value: string;
  description: string;
  metadata: any;

  constructor(key: string, value: string, description: string, metadata: any) {
    this.key = key;
    this.value = value;
    this.description = description;
    this.metadata = metadata;
  }

}
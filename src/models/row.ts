export enum ProcessStatusEnum {
  NONE = "None",
  FAIL = "Fail",
  SUCCESS = "Success",
}

export class Row {
  public address: string;
  public points: string;

  public nature?: string;
  public fire?: string;
  public water?: string;
  public earth?: string;
  public dark?: string;
  public lightning?: string;
  public aether?: string;
  
  public transactionId: string;
  public status: ProcessStatusEnum;
  public errorMsg: string;
}

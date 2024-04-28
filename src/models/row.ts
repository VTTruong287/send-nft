export enum ProcessStatusEnum {
  NONE = "None",
  FAIL = "Fail",
  SUCCESS = "Success",
}

export class Row {
  public address: string;
  public points: string;

  public nature?: bigint;
  public fire?: bigint;
  public water?: bigint;
  public earth?: bigint;
  public dark?: bigint;
  public lightning?: bigint;
  public aether?: bigint;
  
  public transactionId: string;
  public status: ProcessStatusEnum;
  public errorMsg: string;
}

import { TokenID } from "@src/consts/config";
import { Row } from "@src/models/row";

export const extractTokenIdAndAmount = (row: Row) => {
  const tokenIds = [];
  const amounts = [];

  if (row?.nature && row.nature > 0n) {
    tokenIds.push(TokenID.NATURE);
    amounts.push(row.nature);
  }
  if (row?.fire && row.fire > 0n) {
    tokenIds.push(TokenID.FIRE);
    amounts.push(row.fire);
  }
  if (row?.water && row.water > 0n) {
    tokenIds.push(TokenID.WATER);
    amounts.push(row.water);
  }
  if (row?.earth && row.earth > 0n) {
    tokenIds.push(TokenID.EARTH);
    amounts.push(row.earth);
  }
  if (row?.dark && row.dark > 0n) {
    tokenIds.push(TokenID.DARK);
    amounts.push(row.dark);
  }
  if (row?.lightning && row.lightning > 0n) {
    tokenIds.push(TokenID.LIGHTNING);
    amounts.push(row.lightning);
  }
  if (row?.aether && row.aether > 0n) {
    tokenIds.push(TokenID.AETHER);
    amounts.push(row.aether);
  }

  return { tokenIds, amounts };
};

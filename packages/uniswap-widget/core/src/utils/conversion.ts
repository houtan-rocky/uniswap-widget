import { ethers } from 'ethers';

export function fromReadableAmount(amount: number, decimals: number) {
  return ethers.utils.parseUnits(amount.toString(), decimals);
}

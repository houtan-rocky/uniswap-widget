import { ethers } from "ethers";

/**
 * Safely converts an address to its checksum format
 * @param address The address to convert
 * @returns The checksummed address
 */
export function toChecksumAddress(address: string): string {
  try {
    return ethers.utils.getAddress(address);
  } catch {
    console.error(`Invalid address format: ${address}`);
    return address;
  }
} 
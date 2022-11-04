export function isValidAddress(address: string) {
  //hexadecimal and 160-bit address
  return address.startsWith("0x") && isHex(address) && address.length == 42;
}

function isHex(h: string) {
  const a = BigInt(h);
  // h begins with 0x while a.toString(16) does not
  return a.toString(16) === h.toLowerCase().substring(2);
}

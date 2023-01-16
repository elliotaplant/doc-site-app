const TEN_MINS_IN_MS = 1000 * 60 * 10;

export function expiresSoon(expiryDateMs: number) {
  return new Date().valueOf() > expiryDateMs - TEN_MINS_IN_MS;
}

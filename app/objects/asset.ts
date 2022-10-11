export default class Asset {
  constructor(
    readonly token: string,
    readonly amount: number,
    readonly usdValue: number
  ) {}
}

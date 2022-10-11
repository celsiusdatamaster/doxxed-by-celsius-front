import Asset from './asset';

export default class CustomerFull {
  constructor(
    readonly scheduleFLine: string,
    readonly name: string,
    readonly usdValue: number,
    readonly address: string,
    readonly contingentClaim: boolean,
    readonly offsetClaim: boolean,
    readonly assets: Asset[]
  ) {}
}

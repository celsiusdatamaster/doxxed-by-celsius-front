import { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Asset from 'doxxed-by-celsius/objects/asset';
import DataService from 'doxxed-by-celsius/services/data';
import { tracked } from 'tracked-built-ins';

export default class IndexController extends Controller {
  private static readonly regexTokenAmount = new RegExp(
    /total\.(.*)\.amount/,
    'i'
  );

  @service declare data: DataService;

  @tracked
  assetsCollapsed = true;

  @tracked
  leaderBoardCollapsed = true;

  get customersAmount(): string {
    return (
      this.data.statistics.find((stat) => stat.key === 'customers.amount')
        ?.value || '--'
    );
  }

  get assets() {
    return this.data.statistics
      .filter((stat) => stat.key.match(IndexController.regexTokenAmount))
      .map((stat) => {
        const token = stat.key.match(IndexController.regexTokenAmount)![1];
        return new Asset(
          token || '',
          Number(stat.value),
          Number(
            this.data.statistics.find(
              (usdStat) => usdStat.key === `total.${token}.usdvalue`
            )?.value || 0
          )
        );
      })
      .sort((a, b) => b.usdValue - a.usdValue);
  }

  get filteredAssets() {
    return this.assets.slice(0, this.assetsSize);
  }

  get assetsSize() {
    return this.assetsCollapsed ? 10 : 60;
  }

  @action
  toggleAssetsCollapsed() {
    this.assetsCollapsed = !this.assetsCollapsed;
  }

  get totalUsdValue() {
    return this.assets
      .map((a) => a.usdValue)
      .filter((n) => !isNaN(n))
      .reduce((a, b) => a + b, 0);
  }

  get topCustomers() {
    return this.data.topCustomers.slice(0, this.topCustomersSize);
  }

  get topCustomersSize() {
    return this.leaderBoardCollapsed ? 10 : 50;
  }

  @action
  toggleLeaderboardCollapsed() {
    this.leaderBoardCollapsed = !this.leaderBoardCollapsed;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'index-controller': IndexController;
  }
}

import Service from '@ember/service';
import Customer from 'doxxed-by-celsius/objects/customer';
import Statistic from 'doxxed-by-celsius/objects/statistic';
import fetch from 'fetch';
import { tracked, TrackedArray } from 'tracked-built-ins';

export default class DataService extends Service {
  // public static readonly API_URL = 'http://localhost:8080';
  public static readonly API_URL = 'https://doxxedbycelsius.com/leecher';

  statistics: Statistic[] = tracked([]);
  topCustomers: Customer[] = tracked([]);

  async fetchStats() {
    if (this.statistics.length === 0) {
      const resp = await fetch(`${DataService.API_URL}/statistics`);
      this.statistics.addObjects(await resp.json());
    }
  }

  async fetchLeaderboard() {
    if (this.topCustomers.length === 0) {
      const resp = await fetch(`${DataService.API_URL}/customers/leaderboard`);
      this.topCustomers.addObjects(await resp.json());
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    statistics: DataService;
  }
}

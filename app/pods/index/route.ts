import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataService from 'doxxed-by-celsius/services/data';
export default class IndexRoute extends Route {
  @service declare data: DataService;

  beforeModel() {
    this.data.fetchStats();
    this.data.fetchLeaderboard();
  }
}

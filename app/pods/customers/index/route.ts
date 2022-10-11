import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';
import CustomersIndexController from './controller';
export default class CustomersIndexRoute extends Route {
  setupController(
    controller: CustomersIndexController,
    model: string,
    transition: Transition
  ) {
    super.setupController(controller, model, transition);
    controller.loadFirstPageIfNotLoaded();
  }
}

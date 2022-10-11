import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';
import DataService from 'doxxed-by-celsius/services/data';
import CustomersCustomerController from './controller';
export default class CustomersCustomerRoute extends Route {
  @service declare data: DataService;

  async model(params: { customer_id: string }) {
    return params.customer_id;
  }

  setupController(
    controller: CustomersCustomerController,
    model: string,
    transition: Transition
  ) {
    super.setupController(controller, model, transition);
    controller.loadCustomerTask.perform(model);
  }
}

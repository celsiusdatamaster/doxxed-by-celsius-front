import Controller from '@ember/controller';
import Customer from 'doxxed-by-celsius/objects/customer';
import CustomerFull from 'doxxed-by-celsius/objects/customer-full';
import DataService from 'doxxed-by-celsius/services/data';
import { task } from 'ember-concurrency';
import { tracked } from 'tracked-built-ins';

export default class CustomersCustomerController extends Controller {
  @tracked
  customer?: CustomerFull;

  @tracked
  failedToLoadCustomer = false;

  loadCustomerTask = task(this, async (customerId: string) => {
    if (!customerId) {
      return;
    }
    this.customer = undefined;

    let controller = new AbortController();
    let signal = controller.signal;

    try {
      const resp = await fetch(
        `${DataService.API_URL}/customers/${customerId}`,
        { signal }
      );

      if (resp.status === 200) {
        this.customer = await resp.json();
      }
    } finally {
      controller.abort();
    }
  });

  get assets() {
    return this.customer?.assets.sort((a, b) => b.usdValue - a.usdValue) ?? [];
  }

  get totalLost() {
    return (
      this.customer?.usdValue ??
      this.assets
        .map((a) => a.usdValue)
        .filter((n) => !isNaN(n))
        .reduce((a, b) => a + b, 0)
    );
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'customers-customer-controller': CustomersCustomerController;
  }
}

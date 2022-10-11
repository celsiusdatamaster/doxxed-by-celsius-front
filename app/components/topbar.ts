import Component from '@glimmer/component';
import { action } from '@ember/object';
import { BsDropdown } from 'ember-bootstrap';
import DataService from 'doxxed-by-celsius/services/data';
import Customer from 'doxxed-by-celsius/objects/customer';
import { tracked } from 'tracked-built-ins';
import { task, timeout } from 'ember-concurrency';

export default class Topbar extends Component {
  @tracked
  searchCustomers: Customer[] = [];

  @tracked
  searchTerm: string = '';

  @action
  async onCustomerSelected(dropdownMenu: BsDropdown) {
    dropdownMenu.closeDropdown();
    this.searchTerm = '';
  }

  searchCustomersTask = task(
    this,
    { restartable: true },
    async (dropdownMenu: BsDropdown, term: string) => {
      if (term === '') {
        dropdownMenu.closeDropdown();
        return;
      } else {
        dropdownMenu.openDropdown();
      }
      await timeout(500);
      let controller = new AbortController();
      let signal = controller.signal;

      try {
        const resp = await fetch(
          `${DataService.API_URL}/customers/search?name=${term}`,
          { signal }
        );

        if (resp.status === 200) {
          this.searchCustomers = await resp.json();
        }
      } finally {
        controller.abort();
      }
    }
  );
}

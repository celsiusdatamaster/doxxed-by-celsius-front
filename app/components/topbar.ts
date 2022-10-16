import Component from '@glimmer/component';
import { action } from '@ember/object';
import { BsDropdown } from 'ember-bootstrap';
import DataService from 'doxxed-by-celsius/services/data';
import Customer from 'doxxed-by-celsius/objects/customer';
import { tracked } from 'tracked-built-ins';
import { task, timeout } from 'ember-concurrency';
import Page from 'doxxed-by-celsius/objects/page';
// @ts-ignore
import { ref } from 'ember-ref-bucket';

export default class Topbar extends Component {
  @tracked
  searchCustomers?: Page<Customer>;

  @tracked
  searchTerm: string = '';

  @ref('searchCustomerForm')
  searchCustomerForm?: HTMLElement;

  @action
  async onCustomerSelected(dropdownMenu: BsDropdown) {
    dropdownMenu.closeDropdown();
    this.searchTerm = '';
  }

  searchCustomersTask = task(
    this,
    { restartable: true },
    async (dropdownMenu: BsDropdown, term: string) => {
      if (term === this.searchTerm) {
        return;
      }
      this.searchTerm = term;
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
          `${DataService.API_URL}/customers/list?nameFilter=${term}&page=0`,
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

  get popperOptions() {
    return {
      placement: 'bottom-end',
      onFirstUpdate: () => {},
      modifiers: [
        {
          name: 'flip',
          enabled: true,
        },
      ],
    };
  }
}

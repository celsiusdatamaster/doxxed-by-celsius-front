import Controller from '@ember/controller';
import { action } from '@ember/object';
import Customer from 'doxxed-by-celsius/objects/customer';
import Page from 'doxxed-by-celsius/objects/page';
import DataService from 'doxxed-by-celsius/services/data';
import { task, timeout } from 'ember-concurrency';
import { tracked } from 'tracked-built-ins';

export default class CustomersIndexController extends Controller {
  @tracked
  pageCustomers?: Page<Customer>;

  @tracked
  nameFilter = '';

  constructor() {
    super();
  }

  loadFirstPageIfNotLoaded() {
    if (!this.pageCustomers) {
      this.listCustomersTask.perform(1);
    }
  }

  listCustomersTask = task(
    this,
    { drop: true },
    async (pageOneIndexed: number) => {
      let controller = new AbortController();
      let signal = controller.signal;

      try {
        let uri = `${DataService.API_URL}/customers/list?page=${
          pageOneIndexed - 1
        }`;
        if (this.nameFilter.trim()) {
          uri = uri + '&nameFilter=' + this.nameFilter.trim();
        }
        const resp = await fetch(uri, { signal });

        if (resp.status === 200) {
          this.pageCustomers = await resp.json();
        }
      } finally {
        controller.abort();
      }
    }
  );

  nameFilterTask = task(this, { restartable: true }, async (term: string) => {
    await timeout(500);

    this.nameFilter = term;
    this.listCustomersTask.perform(1);
  });

  get currentPage() {
    if (!this.pageCustomers) {
      return undefined;
    }
    return this.pageCustomers.number + 1;
  }

  get previous10Page() {
    if (this.currentPage === undefined) {
      return undefined;
    }
    const remainder = this.currentPage % 10;
    if (remainder === 0) {
      return Math.max(1, this.currentPage - 10);
    } else {
      return Math.max(1, this.currentPage - remainder);
    }
  }

  get previous100Page() {
    if (this.currentPage === undefined) {
      return undefined;
    }
    const remainder = this.currentPage % 100;
    let previous100Page: number;
    if (remainder === 0) {
      previous100Page = Math.max(1, this.currentPage - 100);
    } else {
      previous100Page = Math.max(1, this.currentPage - remainder);
    }

    if (this.previous10Page === previous100Page) {
      return Math.max(1, previous100Page - 100);
    } else {
      return previous100Page;
    }
  }

  get next10Page() {
    if (this.currentPage === undefined) {
      return undefined;
    }
    const remainder = this.currentPage % 10;
    if (remainder === 0) {
      return Math.min(this.pageCustomers!.totalPages, this.currentPage + 10);
    } else {
      return Math.min(
        this.pageCustomers!.totalPages,
        this.currentPage + 10 - remainder
      );
    }
  }

  get next100Page() {
    if (this.currentPage === undefined) {
      return undefined;
    }
    const remainder = this.currentPage % 100;
    let next100Page: number;
    if (remainder === 0) {
      next100Page = Math.min(
        this.pageCustomers!.totalPages,
        this.currentPage + 100
      );
    } else {
      next100Page = Math.min(
        this.pageCustomers!.totalPages,
        this.currentPage + 100 - remainder
      );
    }

    if (this.next10Page === next100Page) {
      return Math.min(this.pageCustomers!.totalPages, next100Page + 100);
    } else {
      return next100Page;
    }
  }

  @action
  async fetchPreviousPage() {
    if (!this.pageCustomers) {
      return undefined;
    }

    if (!this.pageCustomers.first) {
      await this.listCustomersTask.perform(this.currentPage! - 1);
    }
  }

  @action
  async fetchPrevious10Page() {
    if (!this.pageCustomers) {
      return undefined;
    }
    await this.listCustomersTask.perform(this.previous10Page!);
  }

  @action
  async fetchPrevious100Page() {
    if (!this.pageCustomers) {
      return undefined;
    }
    await this.listCustomersTask.perform(this.previous100Page!);
  }

  @action
  async fetchNextPage() {
    if (!this.pageCustomers) {
      return undefined;
    }

    if (!this.pageCustomers.last) {
      await this.listCustomersTask.perform(this.currentPage! + 1);
    }
  }

  @action
  async fetchNext10Page() {
    if (!this.pageCustomers) {
      return undefined;
    }
    await this.listCustomersTask.perform(this.next10Page!);
  }

  @action
  async fetchNext100Page() {
    if (!this.pageCustomers) {
      return undefined;
    }
    await this.listCustomersTask.perform(this.next100Page!);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'customers-index-controller': CustomersIndexController;
  }
}

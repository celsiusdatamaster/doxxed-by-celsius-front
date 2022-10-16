import Modifier from 'ember-modifier';
import type { Root } from '@amcharts/amcharts5';
interface Ac5ChartDataModifierArgs {
  positional: [data: unknown];
  named: {
    setup(element: HTMLElement): Root;
    update: () => void;
  };
}
export default class Ac5ChartDataModifier extends Modifier<Ac5ChartDataModifierArgs> {
  constructor(owner: unknown, args: Ac5ChartDataModifierArgs) {
    super(owner, args);
    if (!this.args.named.setup) {
      throw new Error('setup must be defined');
    }
    if (typeof this.args.named.setup !== 'function') {
      throw new Error('setup must be a function');
    }
    if (!this.args.named.update) {
      throw new Error('update must be defined');
    }
    if (typeof this.args.named.update !== 'function') {
      throw new Error('update must be a function');
    }
  }
  didInstall() {
    this.args.named.setup(this.element as HTMLElement);
  }
  didUpdateArguments() {
    this.args.named.update();
  }
}

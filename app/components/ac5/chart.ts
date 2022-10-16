import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';

import { Root } from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Material from '@amcharts/amcharts5/themes/Material';
import { task, timeout } from 'ember-concurrency';

import Ac5ChartDataModifier from './chart-data';

export abstract class Ac5chart<T> extends Component<T> {
  @tracked protected root?: Root;

  dataModifier = Ac5ChartDataModifier;

  setupChartTask = task(
    this,
    { restartable: true },
    async (createChart: () => void) => {
      await timeout(250);

      createChart();
      registerDestructor(this, () => this.destroyChart());
    }
  );

  protected abstract configure(): void;

  protected abstract setup(element: HTMLElement): void;

  protected abstract update(): void;

  protected setupChart(element: HTMLElement) {
    this.setupChartTask.perform(() => {
      this.root = Root.new(element);

      this.setupTheme(this.root);

      this.configure();
    });
  }

  protected setupTheme(root: Root): void {
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Material.new(root),
    ]);
  }

  private destroyChart() {
    this.root?.dispose();
  }

  @action
  regenerate(element: HTMLElement): void {
    if (this.root) {
      this.destroyChart();
      this.setup(element);
    }
  }
}

import { action } from '@ember/object';

import { percent } from '@amcharts/amcharts5';
import { PieChart } from '@amcharts/amcharts5/.internal/charts/pie/PieChart';
import { PieSeries } from '@amcharts/amcharts5/.internal/charts/pie/PieSeries';
import { SliceGrouper } from '@amcharts/amcharts5/plugins/sliceGrouper';

import { Ac5chart } from '../chart';

import type { DataItem, RadialLabel, Slice } from '@amcharts/amcharts5';
import type { IPercentSeriesDataItem } from '@amcharts/amcharts5/.internal/charts/percent/PercentSeries';

interface Ac5PiechartArgs {
  categoryField: string;
  data: { [x: string]: number | string }[];
  valueField: string;
}

export default class Ac5Piechart extends Ac5chart<Ac5PiechartArgs> {
  series?: PieSeries;

  @action
  setup(element: HTMLElement) {
    super.setupChart(element);
  }

  protected configure() {
    if (!this.root) {
      return;
    }

    let chart = this.root?.container.children.push(
      PieChart.new(this.root, {
        startAngle: 180,
        endAngle: 360,
        layout: this.root?.verticalLayout,
        innerRadius: percent(50),
        radius: percent(60),
      })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    // start and end angle must be set both for chart and series
    this.series = chart.series.push(
      PieSeries.new(this.root, {
        startAngle: 180,
        endAngle: 360,
        valueField: this.args.valueField,
        categoryField: this.args.categoryField,
        alignLabels: false,
      })
    );

    this.series.slices.template.setAll({
      cornerRadius: 5,
    });

    this.series.slices.template.states.create('active', {
      shiftRadius: 0,
      scale: 1,
    });

    this.series.ticks.template.setAll({
      forceHidden: true,
    });

    this.series.labels.template.setAll({
      fontSize: 12,
    });

    this.series.labels.template.adapters.add(
      'visible',
      this.valuePercentTotalFilter(5)
    );

    this.series.slices.template.adapters.add(
      'visible',
      this.valuePercentTotalFilter(0.0001)
    );

    SliceGrouper.new(this.root, {
      clickBehavior: 'zoom',
      groupName: 'Others',
      threshold: 10,
      series: this.series,
    });

    this.update();
  }

  valuePercentTotalFilter(percentValue: number) {
    return (_value: boolean | undefined, target: RadialLabel | Slice) => {
      if (target) {
        const dataItem = target.dataItem as DataItem<IPercentSeriesDataItem>;

        if (dataItem) {
          return dataItem.getRaw('valuePercentTotal') > percentValue;
        }
      }

      return false;
    };
  }

  @action
  update() {
    if (this.root && this.series) {
      // Set data
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
      this.series.data.setAll(
        this.args.data?.filter(
          (slice) => (slice[this.args.valueField] ?? 0) > 0
        )
      );
      this.series.appear(1000, 100);
    }
  }
}

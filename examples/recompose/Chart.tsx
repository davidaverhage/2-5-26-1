import React from 'react';
import { compose, onlyUpdateForKeys } from 'recompose';

type ChartProps = {
  title: string;
  data: number[];
  theme: 'light' | 'dark';
};

const ChartView: React.FC<ChartProps> = ({ title, data }) => (
  <figure>
    <figcaption>{title}</figcaption>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </figure>
);

const enhance = compose<ChartProps, ChartProps>(
  onlyUpdateForKeys<ChartProps>(['title', 'data']),
);

export const Chart = enhance(ChartView);

import React from 'react';
import { compose, withHandlers, withState } from 'recompose';

type CounterOuterProps = {
  initialCount?: number;
  step?: number;
};

type CounterStateProps = {
  count: number;
  setCount: (nextCount: number) => void;
};

type CounterHandlerProps = {
  increment: () => void;
  decrement: () => void;
};

type CounterProps = CounterOuterProps & CounterStateProps & CounterHandlerProps;

const CounterView: React.FC<CounterProps> = ({
  count,
  decrement,
  increment,
}) => (
  <div>
    <button type="button" onClick={decrement}>
      -
    </button>
    <span>{count}</span>
    <button type="button" onClick={increment}>
      +
    </button>
  </div>
);

const enhance = compose<CounterProps, CounterOuterProps>(
  withState<CounterOuterProps, CounterStateProps['count'], CounterStateProps['setCount']>(
    'count',
    'setCount',
    ({ initialCount = 0 }) => initialCount,
  ),
  withHandlers<CounterOuterProps & CounterStateProps, CounterHandlerProps>({
    increment: ({ count, setCount, step = 1 }) => () => setCount(count + step),
    decrement: ({ count, setCount, step = 1 }) => () => setCount(count - step),
  }),
);

export const Counter = enhance(CounterView);

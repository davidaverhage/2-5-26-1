# Recompose examples (TypeScript)

This guide collects practical **recompose** examples using TypeScript. Each
example includes a short explanation and a full code sample. The example source
files live in [`examples/recompose`](../examples/recompose).

> **Reminder**: `recompose` is in maintenance mode. These patterns are still
> useful when you need to keep HOC-based codebases healthy.

## 1) Counter with `withState` + `withHandlers`

The counter example demonstrates three classic HOC patterns:

- `withState` to inject state + updater props
- `withHandlers` to encapsulate event handlers
- `compose` to keep enhancers readable

```tsx
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
```

## 2) Loading states with `branch` + `renderComponent`

`branch` can short-circuit rendering in a declarative way. This pattern is often
used for loading or error states.

```tsx
import React from 'react';
import { branch, compose, renderComponent } from 'recompose';

type StatusProps = {
  isLoading: boolean;
  error?: string;
  title: string;
};

const LoadingState = () => <p>Loading…</p>;
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <p role="alert">{error}</p>
);

const TitleView: React.FC<StatusProps> = ({ title }) => <h3>{title}</h3>;

const enhance = compose<StatusProps, StatusProps>(
  branch<StatusProps>(
    ({ isLoading }) => isLoading,
    renderComponent(LoadingState),
  ),
  branch<StatusProps>(
    ({ error }) => Boolean(error),
    renderComponent(({ error }: { error: string }) => <ErrorState error={error} />),
  ),
);

export const StatusTitle = enhance(TitleView);
```

## 3) Derived props with `withProps`

`withProps` is useful when you want a clear separation between raw props and
presentation props.

```tsx
import React from 'react';
import { compose, withProps } from 'recompose';

type User = {
  id: string;
  name: string;
  email: string;
};

type OuterProps = {
  user: User;
};

type ViewProps = {
  displayName: string;
  contact: string;
};

const UserCardView: React.FC<ViewProps> = ({ displayName, contact }) => (
  <section>
    <h4>{displayName}</h4>
    <p>{contact}</p>
  </section>
);

const enhance = compose<ViewProps, OuterProps>(
  withProps<OuterProps, ViewProps>(({ user }) => ({
    displayName: user.name,
    contact: user.email,
  })),
);

export const UserCard = enhance(UserCardView);
```

## 4) Data fetching with `lifecycle`

The `lifecycle` HOC helps class-style lifecycle methods live alongside modern
function components.

```tsx
import React from 'react';
import { compose, lifecycle, withState } from 'recompose';

type OuterProps = {
  requestId: string;
};

type DataProps = {
  data?: string;
  setData: (nextData?: string) => void;
};

type ViewProps = OuterProps & DataProps;

const RequestView: React.FC<ViewProps> = ({ data }) => (
  <article>{data ?? 'Waiting for response…'}</article>
);

const enhance = compose<ViewProps, OuterProps>(
  withState<OuterProps, DataProps['data'], DataProps['setData']>('data', 'setData', undefined),
  lifecycle<OuterProps & DataProps, {}>({
    componentDidMount() {
      fetch(`/api/requests/${this.props.requestId}`)
        .then((response) => response.text())
        .then((data) => this.props.setData(data));
    },
  }),
);

export const RequestDetails = enhance(RequestView);
```

## 5) Render optimization with `onlyUpdateForKeys`

When you have heavy components, keep the re-render surface area small.

```tsx
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
```

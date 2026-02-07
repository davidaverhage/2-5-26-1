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

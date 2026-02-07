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

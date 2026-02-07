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

import React from 'react';
import Fab from "@mui/material/Fab";

export function canUserSubscribe(subscriptions: string[], userType: string) {
  if (subscriptions.length === 0) {
    return true;
  }

  const userRights = {
    'USER_WITHOUT_SUBSCRIPTION': [],
    'USER_WITH_ONE_SUBSCRIPTION': ['RIGHT_1'],
    'USER_WITH_MULTIPLE_SUBSCRIPTION': ['RIGHT_1', 'RIGHT_2']
  };

  const currentUserRights = userRights[userType] || [];

  return subscriptions.some((requiredRight: string) => currentUserRights.includes(requiredRight));
}

type UserType = 'USER_WITHOUT_SUBSCRIPTION' | 'USER_WITH_ONE_SUBSCRIPTION' | 'USER_WITH_MULTIPLE_SUBSCRIPTION';

export function getButtonLabel(subscriptions: string[], userType: UserType): React.ReactElement {
  return canUserSubscribe(subscriptions, userType) ? (
    <Fab variant="extended" size="small" style={{ backgroundColor: '#FAEC70', color: '#000000' }}>
      S&#39;abonner
    </Fab>
  ) : (
    <Fab variant="extended" size="small" color="error">
      S&#39;inscrire
    </Fab>
  );
}
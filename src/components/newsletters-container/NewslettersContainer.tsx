import React from 'react';
import { useSearchParams, Outlet } from 'react-router-dom';
import { createContext, useContext } from 'react';

type UserContextType = { userType: string };

export const UserContext = createContext<UserContextType>({ userType: 'USER_WITHOUT_SUBSCRIPTION' });
export const useUser = () => useContext(UserContext);

function NewsletterContainer() {
  const [searchParams] = useSearchParams();
  const selectedUser = searchParams.get('user') || 'USER_WITHOUT_SUBSCRIPTION';

  return (
    <UserContext.Provider value={{ userType: selectedUser }}>
      <main>
        <Outlet />
      </main>
    </UserContext.Provider>
  );
}

export default NewsletterContainer;

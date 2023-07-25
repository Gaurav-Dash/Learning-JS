import { createContext, useState } from "react";

type AuthUser = {
  name: string;
  email: string;
};

type ValuePropType = {
  usr: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
};

type userContextType = {
  children: React.ReactNode;
};

export const UserContext = createContext<ValuePropType>({} as ValuePropType);

export const UserContextProvider = ({ children }: userContextType) => {
  const [usr, setUser] = useState<AuthUser | null>(null);

  return (
    <UserContext.Provider value={{ usr, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

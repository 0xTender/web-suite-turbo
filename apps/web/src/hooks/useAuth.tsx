import { type FCC } from "@app/utils/types";
import React from "react";
type AuthContextType = {};

const AuthContext = React.createContext<AuthContextType>({});

const useAuth = () => React.useContext(AuthContext);

const AuthProvider: FCC = ({ children }) => {
  const memoizedValue = React.useMemo<AuthContextType>(() => ({}), []);
  return (
    <>
      <AuthContext.Provider
        value={{ ...memoizedValue, fetchJwt: () => setFetchJwt(true) }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export { AuthProvider, useAuth };

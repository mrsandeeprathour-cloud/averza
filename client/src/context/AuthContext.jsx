import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("averza_user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    localStorage.removeItem("averza_user");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = (userData, token) => {
    setUser(userData);

    localStorage.setItem(
      "averza_user",
      JSON.stringify(userData)
    );

    localStorage.setItem("averza_token", token);
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("averza_user");
    localStorage.removeItem("averza_token");
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
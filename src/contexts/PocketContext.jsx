import React from "react";
import PocketBase from "pocketbase";
import { useInterval } from "usehooks-ts";
import { jwtDecode } from "jwt-decode";
import ms from "ms";

const BASE_URL = import.meta.env.VITE_PB_URL;
const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

const PocketContext = React.createContext({});

export const PocketProvider = ({ children }) => {
  const pb = React.useMemo(() => new PocketBase(BASE_URL), []);
  pb.autoCancellation(false);

  const [token, setToken] = React.useState(pb.authStore.token);
  const [user, setUser] = React.useState(pb.authStore.record);

  React.useEffect(() => {
    return pb.authStore.onChange((token, record) => {
      setToken(token);
      setUser(record);
    });
  }, []);

  async function register(email, password) {
    try {
      // Create user with initial days array
      const data = {
        email,
        password,
        passwordConfirm: password,
      };

      const newUser = await pb.collection("users").create(data);

      // Log them in
      await pb.collection("users").authWithPassword(email, password);

      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      return await pb.collection("users").authWithPassword(email, password);
    } catch (error) {
      console.error("Login error:", error);
      // You might want to show this error to the user
      throw error; // Re-throw to handle in the UI
    }
  }

  function logout() {
    pb.authStore.clear();
    // No navigation here - we'll handle it in the component
  }

  async function refreshSession() {
    if (!pb.authStore.isValid) return;
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  return (
    <PocketContext.Provider
      value={{
        register,
        login,
        logout,
        user,
        token,
        pb,
      }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = () => React.useContext(PocketContext);

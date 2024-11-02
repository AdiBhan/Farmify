// userStore.ts
import { create } from 'zustand';

import axios from "axios";

interface UserState {
  email: string;
  username: string;
  password: string;
  sessionID: string;
  accountType: string;
  isLoggedIn: boolean;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setSessionID: (sessionID: string) => void;
  setAccountType: (accountType: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  login: () => void;
  logout: () => void;
  register: (params: {
    email?: string;
    username?: string;
    password?: string;
    sessionID?: string;
    accountType?: string;
    isLoggedIn?: boolean;
  }) => Promise<void>;
}

// Define a fallback URL if the environment variable isn't set
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const useUser = create<UserState>((set) => ({
  email: "",
  username: "",
  password: "",
  sessionID: "",
  accountType: "",
  isLoggedIn: false,

  setEmail: (email: string) => set({ email }),
  setUsername: (username: string) => set({ username }),
  setPassword: (password: string) => set({ password }),
  setSessionID: (sessionID: string) => set({ sessionID }),
  setAccountType: (accountType: string) => set({ accountType }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),

  login: () => {},

  register: async ({
    email = "",
    username = "",
    password = "",
    sessionID = "",
    accountType = "",
    isLoggedIn = false,
  }) => {
    try {
      console.log('Attempting to register with:', { email, username, password, accountType });
      
      const response = await axios.post(
        `${BACKEND_URL}/api/users/register`,
        {
          email,
          username,
          password,
          accountType
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Registration response:', response.data);

      if (response.data) {
        set({
          email: response.data.email,
          username: response.data.username,
          password: response.data.password,
          sessionID: response.data.sessionID,
          accountType: response.data.accountType,
          isLoggedIn: true,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      } else {
        console.error('Unexpected error during registration:', error);
      }
      throw error; // Re-throw the error so the component can handle it
    }
  },

  logout: () => set({
    email: "",
    username: "",
    password: "",
    sessionID: "",
    accountType: "",
    isLoggedIn: false,
  }),
}));

export default useUser;
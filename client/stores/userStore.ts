import { create } from 'zustand';
import axios from "axios";

interface UserState {
  email: string;
  username: string;
  password: string;
  sessionID: string;
  accountType: string;
  isLoggedIn: boolean;
  profile_image_url: string;
  error: string;
  setProfileImgURL: (url: string) => void;  
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setSessionID: (sessionID: string) => void;
  setAccountType: (accountType: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setError: (error: string) => void;
  login: (email?: string, password?: string) => Promise<void>;
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
  profile_image_url: "",
  error: "",
    setProfileImgURL: (url: string) => set({ profile_image_url: url }),
  setEmail: (email: string) => set({ email }),
  setUsername: (username: string) => set({ username }),
  setPassword: (password: string) => set({ password }),
  setSessionID: (sessionID: string) => set({ sessionID }),
  setAccountType: (accountType: string) => set({ accountType }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  setError: (error: string) => set({ error }),

  login: async (email = "", password = "") => {
    try {
        console.log('Attempting to login with:', { email, password });

        const response = await axios.post(
            `${BACKEND_URL}/api/users/login`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('Login response:', response.data);

        if (response.data && response.data.data) {
            const { email, username, sessionId, accountType } = response.data.data;
            set({
                email,
                username,
                sessionID: sessionId,
                accountType,
                isLoggedIn: true,
                password: "", 
                error: "", // Clear any previous errors on successful login
            });
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMsg = 
                error.response?.status === 401
                    ? 'Invalid email or password' 
                    : error.response?.data?.message || 'Login failed';
            console.error('Login error:', errorMsg);
            set({ error: errorMsg });
        } else {
            console.error('Unexpected error during login:', error);
            set({ error: 'An unexpected error occurred' });
        }
        throw error; 
    }
},


  register: async ({ email = "", username = "", password = "", accountType = "" }) => {
    try {
      console.log('Attempting to register with:', { email, username, password, accountType });
      
      const response = await axios.post(
        `${BACKEND_URL}/api/users/register`,
        { email, username, password, accountType },
        { headers: { 'Content-Type': 'application/json' } }
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
          error: "", // Clear any previous errors
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || 'Registration failed';
        console.error('Registration error:', errorMsg);
        set({ error: errorMsg });
      } else {
        console.error('Unexpected error during registration:', error);
        set({ error: 'An unexpected error occurred' });
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
    error: "", // Clear any errors on logout
  }),
}));

export default useUser;

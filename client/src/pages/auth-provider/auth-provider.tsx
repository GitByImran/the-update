import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  UserCredential,
  updateProfile,
} from "firebase/auth";
import app from "../../../firebase.config";
import axios from "axios";

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
interface AuthProviderProps {
  children: React.ReactNode;
}

const auth = getAuth(app);

export const AuthContext = createContext<{
  user: User | null;
  handleSignUp: (
    email: string,
    password: string,
    name: string,
    imageUrl: string
  ) => void;
  handleSignIn: (email: string, password: string) => void;
  handleSignOut: () => void;
  handleImageChange: (file: File) => Promise<string>;
  isUploading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  registerUserToDatabase: (userData: UserData) => Promise<any>;
}>({
  user: null,
  handleSignUp: () => {},
  handleSignIn: () => {},
  handleSignOut: () => {},
  handleImageChange: async (file: File) => {
    return "DEFAULT_IMAGE_URL";
  },
  isUploading: false,
  setUser: () => null,
  registerUserToDatabase: async (userData: UserData) => {},
});

interface UserData {
  displayName: string;
  email: string;
  image: string;
  role: string;
  totalReports: number;
}

type UserProfile = {
  displayName: string;
  photoURL: string;
};

export const UseAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Send new user data to database
  const registerUserToDatabase = async (userData: UserData) => {
    const apiUrl = "http://localhost:8080/api/users";

    try {
      const response = await axios.post(apiUrl, {
        name: userData.displayName,
        email: userData.email,
        image: userData.image,
        role: "user",
        totalReports: 0,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Upload the file to imgbb
  const handleImageChange = async (file: File | null): Promise<string> => {
    if (file) {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_API}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        const imageUrl = data.data.url;

        if (user) {
          const updatedUser = {
            ...user,
            image: imageUrl,
            photoURL: imageUrl,
          };

          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              displayName: user.displayName,
              photoURL: imageUrl,
            });
          }
          setUser(updatedUser);
        }

        setIsUploading(false);

        return imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        setIsUploading(false);
        throw error;
      }
    }

    return "";
  };

  const handleSignUp = (
    email: string,
    password: string,
    name: string,
    imageUrl: string
  ) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        const authUser = userCredential.user;

        const userProperties = {
          uid: authUser.uid,
          email: authUser.email || email,
          displayName: name,
          photoURL: imageUrl, // Set the photoURL property directly
        };

        setUser(userProperties);

        return updateProfile(authUser, userProperties);
      })
      .catch((error) => {
        console.error("Error signing up:", error);
      });
  };

  const handleSignIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        const authUser = userCredential.user;
        setUser({
          uid: authUser.uid,
          email: authUser.email || email,
          displayName: authUser.displayName || "",
          photoURL: authUser.photoURL || "",
        });
        console.log(authUser);
        if (authUser) {
          console.log("user in");
        }
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        console.log("Sign-out successful");
      })
      .catch((error) => {
        console.error("An error happened:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser: any) => {
      if (loggedUser) {
        setUser({
          uid: loggedUser.uid,
          email: loggedUser.email || "",
          displayName: loggedUser.displayName || "",
          photoURL: loggedUser.photoURL || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authShare = {
    user,
    handleSignUp,
    handleSignIn,
    handleSignOut,
    handleImageChange,
    isUploading,
    setUser,
    registerUserToDatabase,
  };

  return (
    <AuthContext.Provider value={authShare}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

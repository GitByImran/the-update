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
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useNewsContext } from "../news-provider/news-provider";

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
  userList: UserData[] | null;
  loggedUserdata: UserData | undefined;
  setUserList: React.Dispatch<React.SetStateAction<UserData[] | null>>;
  refetchUserData: () => Promise<any>;
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
  registerUserToDatabase: (setUserData: SetUserData) => Promise<any>;
}>({
  user: null,
  userList: null,
  loggedUserdata: undefined,
  setUserList: () => null,
  refetchUserData: () => Promise.resolve(),
  handleSignUp: () => {},
  handleSignIn: () => {},
  handleSignOut: () => {},
  handleImageChange: async (file: File) => {
    return "DEFAULT_IMAGE_URL";
  },
  isUploading: false,
  setUser: () => null,
  registerUserToDatabase: async (setUserData: SetUserData) => {},
});

interface UserData {
  name: string;
  email: string;
  image: string;
  role: string;
  totalReport: number;
  _id: string;
}

interface SetUserData {
  name: string;
  email: string;
  image: string;
  role: string;
  totalReport: number;
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
  const [userList, setUserList] = useState<UserData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [loggedUserdata, setLoggedUserdata] = useState<UserData | undefined>(
    undefined
  );

  // get logged in user data
  useEffect(() => {
    const getUserData = userList?.find(
      (userData) => userData.email === user?.email
    );
    setLoggedUserdata(getUserData);
  }, [user, userList]);

  const { data: userData, refetch: refetchUserData } = useQuery(
    ["user-list"],
    async () => {
      const response = await axios.get<UserData[]>(
        "http://localhost:8080/api/users"
      );
      return response.data;
    }
  );

  useEffect(() => {
    if (userData) {
      setUserList(userData);
    }
  }, [userData]);

  // Send new user data to database
  const registerUserToDatabase = async (userData: SetUserData) => {
    const apiUrl = "http://localhost:8080/api/users";

    try {
      const response = await axios.post(apiUrl, {
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: "user",
        totalReport: 0,
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
          photoURL: imageUrl,
        };

        setUser(userProperties);
        localStorage.setItem("prev-path", router.asPath);
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
        if (authUser) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login successfull!",
            showConfirmButton: false,
            timer: 1500,
          });
          const previousPath = localStorage.getItem("prev-path");
          if (previousPath === "/components/auth/register") {
            router.push("/");
            localStorage.removeItem("prev-path");
          } else {
            router.back();
          }
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid email/password, try again!",
        });
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
    userList,
    setUserList,
    refetchUserData,
    handleSignUp,
    handleSignIn,
    handleSignOut,
    handleImageChange,
    isUploading,
    setUser,
    registerUserToDatabase,
    loggedUserdata,
  };

  return (
    <AuthContext.Provider value={authShare}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

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

interface User {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const auth = getAuth(app);

export const AuthContext = createContext<{
  user: User | null;
  handleSignUp: (email: string, password: string, name: string) => void;
  handleSignIn: (email: string, password: string) => void;
  handleSignOut: () => void;
}>({
  user: null,
  handleSignUp: () => {},
  handleSignIn: () => {},
  handleSignOut: () => {},
});

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

  const handleSignUp = (email: string, password: string, name: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        const authUser = userCredential.user;
        setUser({
          uid: authUser.uid,
          email: authUser.email || email,
          displayName: name,
        });
        console.log(authUser);
        return updateProfile(authUser, { displayName: name });
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
  };

  return (
    <AuthContext.Provider value={authShare}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

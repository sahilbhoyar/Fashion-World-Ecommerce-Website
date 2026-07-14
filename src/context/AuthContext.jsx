import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuth,
  loginWithGoogle,
} from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {

  // Firebase User
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Login Modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");

  // Listen Firebase Authentication
  useEffect(() => {
 

    const unsubscribe = subscribeToAuth((currentUser) => {

      if (currentUser) {

        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName,
        });

      } else {

        setUser(null);

      }

      setLoading(false);

    });

    return unsubscribe;

  }, []);

  // Signup
  const signup = async (name, email, password) => {
  const firebaseUser = await registerUser(name, email, password);

  setUser({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
  });

  setShowLoginModal(false);

  return firebaseUser;
};

  // Login
  const login = async (email, password) => {
  const firebaseUser = await loginUser(email, password);

  setUser({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
  });

  setShowLoginModal(false);

  return firebaseUser;
};

  // Logout
  const logout = async () => {
  await logoutUser();

  setUser(null);

  setRedirectAfterLogin("/");

  setShowLoginModal(false);
};

  // Open Modal
  const openLoginModal = (redirect = "/") => {

    setRedirectAfterLogin(redirect);

    setShowLoginModal(true);

  };

  // Close Modal
  const closeLoginModal = () => {
  console.log("Closing Login Modal");
  setShowLoginModal(false);
  };

  // Login with Google
  const googleLogin = async () => {
  const firebaseUser = await loginWithGoogle();

  setUser({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
  });

  setShowLoginModal(false);

  return firebaseUser;
};

  const value = {
  user,
  loading,
  login,
  signup,
  logout,
  googleLogin,
  showLoginModal,
  openLoginModal,
  closeLoginModal,
  redirectAfterLogin,
  setRedirectAfterLogin,
  isAuthenticated: !!user,
};

  return (

    <AuthContext.Provider value={value}>

      {!loading && children}

    </AuthContext.Provider>

  );

}
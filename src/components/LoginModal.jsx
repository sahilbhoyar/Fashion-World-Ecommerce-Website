import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginModal() {
  const {
    showLoginModal,
    closeLoginModal,
    login,
    signup,
    resetPassword,
    googleLogin,
    redirectAfterLogin,
    setRedirectAfterLogin
} = useAuth();

  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  if (!showLoginModal) return null

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setShowPassword(false)
    setError('')
    setSuccessMessage('')
  }

  const handleClose = () => {
    resetForm()
    setMode('login')
    closeLoginModal()
  }

  const handleSuccess = () => {
  console.log("✅ handleSuccess called");

  resetForm();
  setMode("login");

  console.log("Closing modal...");
  closeLoginModal();

  console.log("Redirect:", redirectAfterLogin);

  if (redirectAfterLogin) {
    navigate(redirectAfterLogin);
    setRedirectAfterLogin("/");
  } else {
    navigate("/");
  }
};

  // Close the modal
  

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccessMessage("");

  try {
    console.log("Submitting...", mode);

    if (mode === "forgot") {
      await resetPassword(email);
      setSuccessMessage("Password reset link sent. Please check your inbox.");
      setEmail("");
      return;
    }

    if (mode === "login") {
      const user = await login(email, password);
      console.log("Login Success:", user);
    } else {
      const user = await signup(name, email, password);
      console.log("Signup Success:", user);
    }

    handleSuccess();
  } catch (err) {
  switch (err.code) {
    case "auth/email-already-in-use":
      setError("An account with this email already exists.");
      break;

    case "auth/invalid-email":
      setError("Please enter a valid email address.");
      break;

    case "auth/weak-password":
      setError("Password must be at least 6 characters.");
      break;

    case "auth/user-not-found":
      setError("No account found with this email.");
      break;

    case "auth/wrong-password":
    case "auth/invalid-credential":
      setError("Please enter the correct password.");
      break;

    case "auth/too-many-requests":
      setError(
        "Too many failed login attempts. Please try again later or reset your password."
      );
      break;

    case "auth/network-request-failed":
      setError("Network error. Please check your internet connection.");
      break;

    default:
      setError("Something went wrong. Please try again.");
      console.error(err);
  }
}
};

//Google Login Handler
const handleGoogleLogin = async () => {
  try {
    await googleLogin();
    handleSuccess();
  } catch (err) {
    console.error(err);
    setError("Google sign-in failed. Please try again.");
  }
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-brand-400 transition hover:text-brand-700"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-display text-2xl font-semibold text-brand-950">
          {mode === 'login' ? 'Welcome Back' : mode === 'forgot' ? 'Reset Password' : 'Create Account'}
        </h2>
        <p className="mt-2 text-sm text-brand-600">
          {mode === 'login'
            ? 'Login to start shopping at Fashion World'
            : mode === 'forgot'
              ? 'Enter your email and we will send you a password reset link.'
              : 'Sign up to access our full collection'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-brand-800">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-brand-300 px-4 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-300 px-4 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              placeholder="Enter your email"
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-brand-800">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-brand-300 px-4 py-2.5 pr-12 text-sm outline-none transition focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                  placeholder="Enter your password"
                  required={mode !== 'forgot'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-brand-600 hover:text-brand-900"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {successMessage && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">{successMessage}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-950 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-800"
          >
            {mode === 'login' ? 'Login' : mode === 'forgot' ? 'Send Reset Link' : 'Sign Up'}
          </button>

          {mode !== 'forgot' && (
            <>
              <div className="my-5 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="mx-3 text-sm text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="h-5 w-5"
                />

                Continue with Google
              </button>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-brand-600">
          {mode === 'forgot' ? (
            <button
              onClick={() => {
                setMode('login')
                setShowPassword(false)
                setError('')
                setSuccessMessage('')
              }}
              className="font-semibold text-brand-700 hover:text-brand-950"
            >
              Back to login
            </button>
          ) : (
            <>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setShowPassword(false)
                  setError('')
                  setSuccessMessage('')
                }}
                className="font-semibold text-brand-700 hover:text-brand-950"
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </>
          )}
        </p>

        {mode === 'login' && (
          <p className="mt-3 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setMode('forgot')
                setShowPassword(false)
                setError('')
                setSuccessMessage('')
              }}
              className="font-semibold text-brand-700 hover:text-brand-950"
            >
              Forgot password?
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

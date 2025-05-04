import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setRole, setToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = {
      email,
      password,
      remember_me: rememberMe,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", data);

      if (response.data.data.status === "success") {
        const { token, role } = response.data.data;
        if (rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }

        setToken(token);
        setRole(role);
        navigate(`/${role}/dashboard`);
      } else {
        setErrors({
          message: response.data.message || "Login failed. Try again.",
        });
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setErrors({ message: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="w-full h-screen bg-white relative px-20 py-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex justify-start"
      >
        <img src="/assets/img/Logo.png" alt="Logo" className="w-52" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute right-0 top-0 z-10"
      >
        <img src="/assets/Auth/ShapeRight.png" alt="ShapeRight" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute right-0 top-30 z-20"
      >
        <img
          src="/assets/Auth/ilustrationRight.png"
          alt="ilustrationRight"
          className="w-xl"
        />
      </motion.div>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="w-full max-w-sm absolute z-50 left-35 top-45"
      >
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to Back! 👋
          </h1>
          <p className="text-gray-500 text-sm mb-5">
            Please sign in to your account and start the adventure
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <FloatingLabelInput
            label="Email"
            type="email"
            className="mt-4"
            icon="bi-person"
            placeholder="Type Your Email"
            value={email}
            setValue={setEmail}
          />
          {errors.message && (
            <p className="text-red-500 text-xs my-1 mb-2">{errors.message}</p>
          )}

          <FloatingLabelInput
            label="Password"
            type="password"
            className="mt-4"
            icon="bi-lock"
            placeholder="Password"
            value={password}
            setValue={setPassword}
          />
          {errors.message && (
            <p className="text-red-500 text-xs my-1 mb-2">{errors.message}</p>
          )}

          <div className="flex items-center justify-between mt-2">
            <div>
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                Remember Me
              </label>
            </div>
            <Link className="text-sm font-medium text-sky-500">
              Forgot Password ?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full mt-4 p-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center py-5">
          <h1 className="font-medium text-slate-800 text-sm">
            Don’t have an account?{" "}
            <Link
              to={`/auth/register`}
              className="text-sky-500 font-semibold"
            >
              Create an account
            </Link>
          </h1>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <p className="mx-4 text-gray-500">Or login with</p>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="">
          <button className="w-full border border-blue-500 py-2.5 rounded-sm hover:bg-sky-50 hover:border-blue-500 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out flex gap-2 justify-center">
            <img
              src="/assets/Auth/Google.png"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

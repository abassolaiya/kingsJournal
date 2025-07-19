import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/auth.css";
import { API } from "../services/api";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignInPage = () => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!login) {
    console.error("Login function not available");
    return <div>Initializing...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const user = data.data.user;
      const token = data.token;

      if (user && token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        login(user, token);
        toast.success("Login successful!");
        navigate("/courses");
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="page-wrapper auth-page">
      <Header minimal={true} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="auth-hero">
          <div className="container">
            <div className="auth-container">
              <motion.div
                className="auth-content"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="auth-header">
                  <h1>Welcome Back</h1>
                  <p>Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <FiMail className="input-icon" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-group">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <FiLock className="input-icon" />
                    </div>
                    <div className="form-options">
                      <Link to="/forgot-password" className="forgot-password">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="auth-btn primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"} <FiArrowRight />
                  </motion.button>
                </form>

                <div className="auth-footer">
                  <p>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                  </p>
                  {/* <div className="divider">or</div>
                  <button className="auth-btn google" disabled={loading}>
                    Sign in with Google
                  </button> */}
                </div>
              </motion.div>

              <motion.div
                className="auth-graphic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="graphic-content">
                  <h2>Your Learning Awaits</h2>
                  <ul className="benefits-list">
                    <li>Continue where you left off</li>
                    <li>Track your progress</li>
                    <li>Access your certificates</li>
                    <li>Join community discussions</li>
                    <li>Get personalized recommendations</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.main>

      <Footer minimal={true} />
    </div>
  );
};

export default SignInPage;

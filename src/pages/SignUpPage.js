import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/auth.css";
import { API } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
      });

      // Store token in local storage
      localStorage.setItem("token", data.token);

      toast.success("Account created successfully!");
      navigate("/courses"); // Redirect to courses page after signup
    } catch (error) {
      console.error(
        "Signup error:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
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
                  <h1>Create Your Account</h1>
                  <p>Join King's Journal to start your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <FiUser className="input-icon" />
                    </div>
                  </div>

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
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <FiLock className="input-icon" />
                    </div>
                    <div className="password-hint">
                      Must be at least 8 characters
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <FiLock className="input-icon" />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="auth-btn primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}{" "}
                    <FiArrowRight />
                  </motion.button>
                </form>

                <div className="auth-footer">
                  <p>
                    Already have an account? <Link to="/login">Sign In</Link>
                  </p>
                  {/* <div className="divider">or</div>
                  <button className="auth-btn google">
                    Sign up with Google
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
                  <h2>Why Join King's Journal?</h2>
                  <ul className="benefits-list">
                    <li>Access to premium courses</li>
                    <li>Personalized learning paths</li>
                    <li>Expert instructors</li>
                    <li>Community support</li>
                    <li>Certification programs</li>
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

export default SignUpPage;

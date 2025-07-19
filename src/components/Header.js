import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import the useUser hook
import { FiUser } from "react-icons/fi"; // Import a user icon

const Header = ({ variant = "default" }) => {
  const { user } = useUser(); // Get the user from context

  return (
    <header className={`header ${variant}`}>
      <motion.header
        className="header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="container">
          <motion.div
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/">
              <span className="logo-main">King's</span>
              <span className="logo-accent">Journal</span>
            </Link>
          </motion.div>

          <nav className="nav">
            <ul>
              {["Home", "Courses", "About", "Contact"].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                  whileHover={{
                    scale: 1.05,
                    color: "var(--accent-color)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={item === "Home" ? "/" : `/${item.toLowerCase()}`}>
                    {item}
                  </Link>
                </motion.li>
              ))}

              <motion.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "var(--accent-color)",
                  color: "white",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {user ? (
                  <Link to="/profile" className="user-profile">
                    <FiUser className="user-icon" />
                    <span>{user.name || user.email.split("@")[0]}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="login-btn">
                    Login
                  </Link>
                )}
              </motion.li>
            </ul>
          </nav>
        </div>
      </motion.header>
    </header>
  );
};

export default Header;

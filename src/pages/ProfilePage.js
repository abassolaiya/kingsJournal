import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEdit,
  FiLogOut,
  FiBook,
} from "react-icons/fi";
import { useUser } from "../context/UserContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { user, logout } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "********", // Placeholder for password
      });
      setCourses(user.coursesEnrolled || []);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would update the user data via API here
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="loading-container">
          <p>Please login to view your profile</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />

      <motion.main
        className="profile-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="profile-hero">
          <motion.div
            className="profile-container"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="profile-header">
              <motion.div
                className="avatar-container"
                whileHover={{ scale: 1.05 }}
              >
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {editMode && (
                  <motion.button
                    className="edit-avatar-btn"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEdit />
                  </motion.button>
                )}
              </motion.div>

              <motion.div
                className="profile-info"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1>{user.name}</h1>
                <p className="role-badge">{user.role}</p>
                <p>
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            </div>

            <motion.div
              className="profile-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                className={`edit-btn ${editMode ? "active" : ""}`}
                onClick={() => setEditMode(!editMode)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiEdit /> {editMode ? "Cancel Editing" : "Edit Profile"}
              </motion.button>
              <motion.button
                className="logout-btn"
                onClick={logout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiLogOut /> Logout
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        <section className="profile-content">
          <motion.div
            className="profile-details"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Personal Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <FiUser /> Full Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{user.name}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FiMail /> Email Address
                </label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{user.email}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FiLock /> Password
                </label>
                {editMode ? (
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                ) : (
                  <p>••••••••</p>
                )}
              </div>

              {editMode && (
                <motion.button
                  type="submit"
                  className="save-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              )}
            </form>
          </motion.div>

          <motion.div
            className="enrolled-courses"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2>
              <FiBook /> Enrolled Courses
            </h2>
            {courses.length > 0 ? (
              <div className="courses-grid">
                {courses.map((course, index) => (
                  <motion.div
                    key={index}
                    className="course-card"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="progress-bar">
                      <motion.div
                        className="progress"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress || 0}%` }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    <span>{course.progress || 0}% completed</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't enrolled in any courses yet.</p>
                <Link to={`/courses`}>
                  <motion.button
                    className="browse-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Browse Courses
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
};

export default ProfilePage;

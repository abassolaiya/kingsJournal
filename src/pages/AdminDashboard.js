import { useState, useEffect } from "react";
import {
  FiBook,
  FiUsers,
  FiSettings,
  FiMessageSquare,
  FiPlus,
  FiEdit,
  FiEye,
} from "react-icons/fi";
import { API } from "../services/api";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [coursesRes, contactRes] = await Promise.all([
        API.get("/courses"),
        API.get("/contact"),
      ]);

      const allCourses = coursesRes.data.data.courses;
      setCourses(allCourses);
      console.log(contactRes.data);
      setContactMessages(contactRes.data.data.contacts || []);

      const enrollmentMap = {};
      await Promise.all(
        allCourses.map(async (course) => {
          const res = await API.get(`/courses/${course._id}/enrollments`);
          enrollmentMap[course._id] = res.data.data.enrollments || [];
        })
      );
      setEnrollments(enrollmentMap);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await API.delete(`/courses/${id}`);
        setCourses((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const markMessageAsRead = async (id) => {
    try {
      await API.patch(`/contact/${id}`, { read: true });
      setContactMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
      );
    } catch (err) {
      console.error("Failed to mark message as read:", err);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-auth-error">
        <h2>Admin Access Required</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-profile">
          <div className="avatar">{user.name.charAt(0)}</div>
          <h3>{user.name}</h3>
          <p>Admin</p>
        </div>

        <nav className="admin-nav">
          <button
            onClick={() => setActiveTab("courses")}
            className={`nav-btn ${activeTab === "courses" ? "active" : ""}`}
          >
            <FiBook /> Courses
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`nav-btn ${activeTab === "students" ? "active" : ""}`}
          >
            <FiUsers /> Students
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`nav-btn ${activeTab === "messages" ? "active" : ""}`}
          >
            <FiMessageSquare /> Messages
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`nav-btn ${activeTab === "settings" ? "active" : ""}`}
          >
            <FiSettings /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {/* Courses Tab */}
        {activeTab === "courses" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="section-header">
              <h2>Course Management</h2>
              <button
                className="create-btn"
                onClick={() => (window.location.href = "/createcourses")}
              >
                <FiPlus /> Create Course
              </button>
            </div>

            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course._id} className="course-card">
                  <div
                    className="course-image"
                    style={{
                      backgroundImage: `url(${
                        course.imageCover?.url || "/default-course.jpg"
                      })`,
                    }}
                  ></div>
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>
                      {course.category} • {course.level}
                    </p>
                    <p>{course.studentsEnrolled?.length || 0} students</p>
                    <div className="course-actions">
                      <button
                        className="action-btn view"
                        onClick={() =>
                          (window.location.href = `/courses/${course._id}`)
                        }
                      >
                        <FiEye /> View
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() =>
                          (window.location.href = `/admin/courses/edit/${course._id}`)
                        }
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => deleteCourse(course._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Student Enrollments</h2>
            <div className="enrollments-container">
              {courses.map((course) => (
                <div key={course._id} className="enrollment-card">
                  <h3>{course.title}</h3>
                  <div className="enrollment-list">
                    {enrollments[course._id]?.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrollments[course._id].map((enroll) => (
                            <tr key={enroll._id}>
                              <td>{enroll.user.name}</td>
                              <td>{enroll.user.email}</td>
                              <td>
                                {new Date(
                                  enroll.enrolledAt
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <div className="progress-bar">
                                  <div
                                    className="progress"
                                    style={{
                                      width: `${enroll.progress || 0}%`,
                                    }}
                                  ></div>
                                </div>
                                {enroll.progress || 0}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No students enrolled.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Contact Messages</h2>
            <div className="messages-container">
              {contactMessages.length > 0 ? (
                contactMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message-card ${msg.read ? "read" : "unread"}`}
                    onClick={() => markMessageAsRead(msg._id)}
                  >
                    <div className="message-header">
                      <h3>{msg.name}</h3>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="message-email">{msg.email}</p>
                    <p className="message-text">{msg.message}</p>
                    {!msg.read && <span className="unread-badge">New</span>}
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Admin Settings</h2>
            <div className="settings-container">
              <div className="setting-card">
                <h3>System Summary</h3>
                <p>Total Courses: {courses.length}</p>
                <p>
                  Total Enrollments: {Object.values(enrollments).flat().length}
                </p>
                <p>
                  Unread Messages:{" "}
                  {contactMessages.filter((msg) => !msg.read).length}
                </p>
              </div>

              <div className="setting-card">
                <h3>Admin Tools</h3>
                <button className="action-btn">Backup System</button>
                <button className="action-btn">Broadcast Announcement</button>
                <button className="action-btn">View Activity Logs</button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

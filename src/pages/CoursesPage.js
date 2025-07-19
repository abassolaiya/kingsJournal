import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiBookOpen,
  FiClock,
  FiAward,
  FiFilter,
  FiLoader,
  FiUsers,
} from "react-icons/fi";
import { API } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/CourssePage.css";

const CoursesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "All",
    "Business",
    "Technology",
    "Design",
    "Marketing",
    "Personal Development",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/courses");
        setCourses(data.data.courses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false);
    return matchesCategory && matchesSearch;
  });

  const formatDuration = (weeks) => {
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="loading-container">
          <FiLoader className="spinner" />
          <p>Loading courses...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />

      <motion.div
        className="courses-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="courses-hero">
          <div className="container">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1>Expand Your Knowledge</h1>
              <p>
                Browse our premium courses and start your learning journey today
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="courses-filter">
          <div className="container">
            <motion.div
              className="search-bar"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search courses or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="filter-btn">
                <FiFilter /> Filters
              </button>
            </motion.div>

            <motion.div
              className="category-tabs"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-tab ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="courses-grid-section">
          <div className="container">
            {filteredCourses.length > 0 ? (
              <motion.div
                className="courses-grid1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {filteredCourses.map((course, index) => (
                  <motion.div
                    className={`course-card ${
                      course.featured ? "featured" : ""
                    }`}
                    key={course._id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index + 0.5 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    }}
                  >
                    {course.featured && (
                      <div className="featured-badge">Featured</div>
                    )}
                    <Link to={`/courses/${course._id}`} className="course-link">
                      <div
                        className="course-image"
                        style={{
                          backgroundImage: `url(${
                            course.imageCover?.url || "/default-course.jpg"
                          })`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="course-details">
                        <span className="category">{course.category}</span>
                        <h3>{course.title}</h3>
                        <p className="instructor">
                          By {course.instructor?.name || "Unknown Instructor"}
                        </p>
                        <div className="course-meta">
                          <span>
                            <FiBookOpen /> {course.level}
                          </span>
                          <span>
                            <FiClock /> {formatDuration(course.duration)}
                          </span>
                          <span>
                            <FiAward />{" "}
                            {course.ratingsAverage?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="course-footer">
                      <div className="students-count">
                        <div className="students-icon">
                          <FiUsers />
                        </div>
                        <div>
                          <span className="students-number">
                            {course.studentsEnrolled?.length?.toLocaleString() ||
                              "0"}
                          </span>
                          {/* <span className="students-label">students</span> */}
                          <span className="students-float">👩‍🎓</span>
                          <span className="students-float">🧑‍🎓</span>
                          <span className="students-float">👨‍🎓</span>
                        </div>
                      </div>
                      <Link
                        to={`/courses/${course._id}`}
                        className="enroll-btn"
                      >
                        {course.featured ? "Enroll Now" : "View Course"}
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="no-results">
                <p>No courses found matching your criteria.</p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>
      </motion.div>

      <Footer />
    </div>
  );
};

export default CoursesPage;

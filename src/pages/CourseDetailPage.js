import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiClock,
  FiBook,
  FiUser,
  FiStar,
  FiChevronLeft,
  FiCheck,
  FiLoader,
  FiPlay,
  FiChevronRight,
} from "react-icons/fi";
import { API } from "../services/api";
import { useUser } from "../context/UserContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/CourseDetailPage.css";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [paystackReady, setPaystackReady] = useState(false);

  // Load course details
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/courses/${id}`);
        const fetchedCourse = data.data.course;

        setCourse(fetchedCourse);

        if (user && fetchedCourse.studentsEnrolled.includes(user._id)) {
          setIsEnrolled(true);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user]);

  // Load Paystack script
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackReady(true);
    script.onerror = () => {
      console.error("Failed to load Paystack script");
      setPaystackReady(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaymentSuccess = async (reference) => {
    try {
      setIsProcessing(true);
      const response = await API.post(`/courses/${id}/enroll`, {
        paymentReference: reference.reference,
        amount: course.price,
      });

      setIsEnrolled(true);
      const { data } = await API.get(`/courses/${id}`);
      setCourse(data.data.course);
      alert("Payment successful! You are now enrolled.");
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert(err.response?.data?.message || "Failed to complete enrollment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      alert("Please login to enroll in this course");
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    if (!course) {
      alert("Course information is still loading...");
      return;
    }

    // Free course enrollment
    if (course.price === 0) {
      try {
        setIsProcessing(true);
        await API.post(`/courses/${id}/enroll`);
        setIsEnrolled(true);
        const { data } = await API.get(`/courses/${id}`);
        setCourse(data.data.course);
        alert("Successfully enrolled in free course.");
      } catch (err) {
        console.error("Enrollment error:", err);
        alert(err.response?.data?.message || "Failed to enroll.");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Paid course - show Paystack payment
    if (!paystackReady) {
      alert("Payment service is loading. Please try again in a moment.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: course.price * 100,
      currency: "NGN",
      ref: `COURSE-${Date.now()}-${user._id}`,
      metadata: {
        course_id: id,
        user_id: user._id,
      },
      callback: (response) => handlePaymentSuccess(response),
      onClose: () => console.log("Payment window closed"),
    });

    handler.openIframe();
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="loading-container">
          <FiLoader className="spinner" />
          <p>Loading course details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        <Footer />
      </div>
    );
  }

  // No course found
  if (!course) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="not-found-container">
          <p>Course not found.</p>
          <button onClick={() => navigate("/courses")}>Browse Courses</button>
        </div>
        <Footer />
      </div>
    );
  }

  // Main render
  return (
    <div className="page-wrapper">
      <Header />

      <motion.main
        className="course-detail-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="course-hero">
          <div className="container">
            <motion.div
              className="breadcrumb"
              onClick={() => navigate("/courses")}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FiChevronLeft /> Back to Courses
            </motion.div>

            <div className="hero-content">
              <div className="hero-text">
                <span className="category">
                  {course.category || "Uncategorized"}
                </span>
                <h1>{course.title}</h1>
                <p className="description">{course.description}</p>

                <div className="meta-info">
                  <span>
                    <FiUser /> {course.instructor?.name || "Unknown"}
                  </span>
                  <span>
                    <FiClock /> {course.duration} weeks
                  </span>
                  <span>
                    <FiStar /> {course.ratingsAverage?.toFixed(1) || "N/A"} (
                    {course.ratingsQuantity || 0})
                  </span>
                  <span>
                    <FiBook /> {course.level || "N/A"}
                  </span>
                </div>

                <div className="enrollment-info">
                  <span>
                    {course.studentsEnrolled?.length || 0} students enrolled
                  </span>
                </div>
              </div>

              <div className="hero-card">
                <div
                  className="course-image"
                  style={{
                    backgroundImage: `url(${
                      course.imageCover?.url || "/default-course.jpg"
                    })`,
                  }}
                />
                <div className="card-content">
                  <div className="price">
                    {course.price > 0
                      ? `₦${course.price.toLocaleString()}`
                      : "Free"}
                  </div>

                  {isEnrolled ? (
                    <button className="enrolled-btn">
                      <FiCheck /> Enrolled
                    </button>
                  ) : (
                    <button
                      className="enroll-btn"
                      onClick={handleEnroll}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <FiLoader className="spinner" /> Processing...
                        </>
                      ) : course.price > 0 ? (
                        `Enroll Now - ₦${course.price.toLocaleString()}`
                      ) : (
                        "Enroll for Free"
                      )}
                    </button>
                  )}

                  <div className="includes">
                    <h4>This course includes:</h4>
                    <ul>
                      <li>{course.duration} weeks of content</li>
                      <li>Certificate of completion</li>
                      <li>Access to community</li>
                      <li>Downloadable resources</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content Section */}
        <section className="course-content">
          <div className="container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`tab ${activeTab === "curriculum" ? "active" : ""}`}
                onClick={() => setActiveTab("curriculum")}
              >
                Curriculum
              </button>
              <button
                className={`tab ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2>About This Course</h2>
                  <div className="course-overview">
                    <p>
                      {course.longDescription ||
                        "No detailed description available."}
                    </p>
                  </div>

                  <h2>What You'll Learn</h2>
                  <div className="learning-outcomes">
                    {course.learningOutcomes?.length > 0 ? (
                      <ul>
                        {course.learningOutcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No learning outcomes specified.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "curriculum" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2>Course Curriculum</h2>
                  <div className="modules-container">
                    {course.modules?.length > 0 ? (
                      <>
                        <div className="modules-list">
                          {course.modules.map((module, index) => (
                            <div
                              key={module._id || index}
                              className={`module ${
                                currentModule === index ? "active" : ""
                              }`}
                              onClick={() => setCurrentModule(index)}
                            >
                              <div className="module-header">
                                <h3>
                                  <span>Module {index + 1}:</span>{" "}
                                  {module.title}
                                </h3>
                                <FiChevronRight className="chevron" />
                              </div>
                              <p>{module.description}</p>
                            </div>
                          ))}
                        </div>

                        <div className="lessons-list">
                          <h3>{course.modules[currentModule].title}</h3>
                          {course.modules[currentModule].lessons?.length > 0 ? (
                            <ul>
                              {course.modules[currentModule].lessons.map(
                                (lesson, idx) => (
                                  <li key={lesson._id || idx}>
                                    <div className="lesson-item">
                                      <FiPlay className="play-icon" />
                                      <div className="lesson-info">
                                        <h4>{lesson.title}</h4>
                                        <span>{lesson.duration} min</span>
                                      </div>
                                      {isEnrolled ? (
                                        <button className="watch-btn">
                                          Watch
                                        </button>
                                      ) : (
                                        <button className="locked-btn">
                                          Locked
                                        </button>
                                      )}
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p>No lessons available for this module.</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <p>No curriculum available for this course.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2>Student Reviews</h2>
                  <div className="reviews-container">
                    {course.reviews?.length > 0 ? (
                      <div className="reviews-grid">
                        {course.reviews.map((review) => (
                          <div key={review._id} className="review-card">
                            <div className="review-header">
                              <div className="reviewer">
                                <div className="avatar">
                                  {review.user?.name?.charAt(0) || "A"}
                                </div>
                                <div className="reviewer-info">
                                  <h4>{review.user?.name || "Anonymous"}</h4>
                                  <div className="rating">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <FiStar
                                        key={i}
                                        className={
                                          i < review.rating ? "filled" : ""
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="date">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="review-content">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No reviews yet for this course.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Instructor Section */}
        {course.instructor && (
          <section className="instructor-section">
            <div className="container">
              <h2>About the Instructor</h2>
              <div className="instructor-card">
                <div className="instructor-image">
                  <div className="avatar">
                    {course.instructor.name?.charAt(0) || "I"}
                  </div>
                </div>
                <div className="instructor-info">
                  <h3>{course.instructor.name}</h3>
                  <p className="title">
                    {course.instructor.title || "Course Instructor"}
                  </p>
                  <p className="bio">
                    {course.instructor.bio || "No biography available."}
                  </p>
                  <div className="stats">
                    <div className="stat">
                      <span>{course.instructor.coursesCount || 0}</span>
                      <span>Courses</span>
                    </div>
                    <div className="stat">
                      <span>{course.instructor.studentsCount || 0}</span>
                      <span>Students</span>
                    </div>
                    <div className="stat">
                      <span>
                        {course.instructor.rating?.toFixed(1) || "N/A"}
                      </span>
                      <span>Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </motion.main>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;

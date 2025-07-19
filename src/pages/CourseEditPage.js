import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiDollarSign,
  FiClock,
  FiBook,
  FiUser,
  FiSave,
} from "react-icons/fi";
import { API } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/CourseEditPage.css";

const CourseEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Business",
    duration: 4,
    level: "Beginner",
    price: 0,
    imageCover: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  const categories = [
    "Business",
    "Technology",
    "Design",
    "Marketing",
    "Personal Development",
  ];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/courses/${id}`);
        setFormData(data.data.course);
        setOriginalData(data.data.course);
        if (data.data.course.imageCover) {
          setImagePreview(data.data.course.imageCover);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course data");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.patch(`/courses/${id}`, formData);
      toast.success("Course updated successfully!");
      navigate(`/courses/${data.data.course._id}`);
    } catch (error) {
      console.error("Course update error:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          imageCover: reader.result, // Base64 string for demo (in production, upload to cloud storage)
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );
  };

  if (loading && !originalData) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="loading-spinner">Loading course data...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />

      <motion.main
        className="course-edit-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="edit-hero">
          <div className="container">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hero-content"
            >
              <h1>Edit Course</h1>
              <p className="subtitle">
                Update your course information to keep it current and engaging
              </p>
            </motion.div>
          </div>
        </section>

        <section className="edit-form-section">
          <div className="container">
            <motion.div
              className="form-container"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="course-form">
                <div className="form-grid">
                  {/* Left Column */}
                  <div className="form-column">
                    <div className="form-group">
                      <label htmlFor="title">
                        <FiBook className="input-icon" /> Course Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Introduction to Web Development"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description">Course Description</label>
                      <textarea
                        id="description"
                        name="description"
                        rows="6"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe what students will learn in this course..."
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="form-column">
                    <div className="form-group">
                      <label htmlFor="imageCover">Course Image</label>
                      <div className="image-upload-container">
                        {imagePreview ? (
                          <div className="image-preview">
                            <img src={imagePreview} alt="Course preview" />
                            <button
                              type="button"
                              className="change-image-btn"
                              onClick={() =>
                                document.getElementById("imageUpload").click()
                              }
                            >
                              Change Image
                            </button>
                          </div>
                        ) : (
                          <label htmlFor="imageUpload" className="upload-area">
                            <FiUpload className="upload-icon" />
                            <span>Click to upload course image</span>
                            <input
                              id="imageUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="duration">
                        <FiClock className="input-icon" /> Duration (weeks)
                      </label>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        min="1"
                        max="52"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="level">Difficulty Level</label>
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                      >
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="price">
                        <FiDollarSign className="input-icon" /> Price (USD)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <motion.button
                    type="submit"
                    className="submit-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || !hasChanges()}
                  >
                    <FiSave /> {loading ? "Saving Changes..." : "Save Changes"}
                  </motion.button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => navigate(`/courses/${id}`)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
};

export default CourseEditPage;

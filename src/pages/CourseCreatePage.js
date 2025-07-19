import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiDollarSign,
  FiClock,
  FiBook,
  FiUser,
} from "react-icons/fi";
import { API } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/CourseCreatePage.css";

const CourseCreatePage = () => {
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

  const categories = [
    "Business",
    "Technology",
    "Design",
    "Marketing",
    "Personal Development",
  ];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("level", formData.level);
      formDataToSend.append("price", formData.price);

      // Make sure this matches the field name in multer (imageCover)
      if (formData.imageFile) {
        formDataToSend.append("imageCover", formData.imageFile);
      }

      const { data } = await API.post("/courses", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Course created successfully!");
      navigate(`/courses/${data.data.course._id}`);
    } catch (error) {
      console.error("Course creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create course");
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
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast.error("Image must be smaller than 10MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, or WebP images are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <motion.main
        className="course-create-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="create-hero">
          <div className="container">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hero-content"
            >
              <h1>Create a New Course</h1>
              <p className="subtitle">
                Share your knowledge with the world and build your teaching
                portfolio
              </p>
            </motion.div>
          </div>
        </section>

        <section className="create-form-section">
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
                        rows={16}
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
                              required={!imagePreview}
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
                        {/* <FiDollarSign />  */}Price (₦)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="100" // Assuming Naira increments by 100
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
                    disabled={loading}
                  >
                    {loading ? "Creating Course..." : "Create Course"}
                  </motion.button>
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

export default CourseCreatePage;

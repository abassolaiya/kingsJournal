import { motion } from "framer-motion";
import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API } from "../services/api"; // Import your API service
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ConatctPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send form data to backend
      const response = await API.post("/contact", formData);

      // Show success message
      toast.success("Message sent successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again later."
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
    <div className="page-wrapper">
      <Header />

      <motion.main
        className="contact-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hero-content"
            >
              <h1>Get In Touch</h1>
              <p className="subtitle">
                We'd love to hear from you. Reach out for inquiries, support, or
                partnerships.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="contact-content">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Form */}
              <motion.div
                className="contact-form"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2>Send Us a Message</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    className="submit-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <FiSend /> Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className="contact-info"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2>Contact Information</h2>
                <p className="info-description">
                  Have questions or need assistance? Here's how you can reach
                  us:
                </p>

                <div className="info-items">
                  <div className="info-item">
                    <div className="info-icon">
                      <FiMail />
                    </div>
                    <div className="info-text">
                      <h3>Email</h3>
                      <a href="mailto:info@kingsjournal.com">
                        info@kingsjournal.com
                      </a>
                      <a href="mailto:support@kingsjournal.com">
                        support@kingsjournal.com
                      </a>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FiPhone />
                    </div>
                    <div className="info-text">
                      <h3>Phone</h3>
                      <a href="tel:+11234567890">+1 (123) 456-7890</a>
                      <p>Mon-Fri: 9am - 6pm EST</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FiMapPin />
                    </div>
                    <div className="info-text">
                      <h3>Office</h3>
                      <address>
                        123 Education Avenue
                        <br />
                        Boston, MA 02108
                        <br />
                        United States
                      </address>
                    </div>
                  </div>
                </div>

                <div className="social-links">
                  <h3>Follow Us</h3>
                  <div className="social-icons">
                    // Replace placeholder # with actual links or use buttons
                    <div className="social-icons">
                      <a href="https://twitter.com" aria-label="Twitter">
                        𝕏
                      </a>
                      <a href="https://linkedin.com" aria-label="LinkedIn">
                        in
                      </a>
                      <a href="https://instagram.com" aria-label="Instagram">
                        📷
                      </a>
                      <a href="https://facebook.com" aria-label="Facebook">
                        f
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <div className="container">
            <motion.div
              className="map-container"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <iframe
                title="King's Journal Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.665966345864!2d-71.0594869240074!3d42.35162397118763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e3708e2a7e5a67%3A0x5cd8f6d5b5b8e5e5!2sBoston%20Public%20Library!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </motion.div>
          </div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
};

export default ContactPage;

import { motion } from "framer-motion";
import { FiAward, FiUsers, FiBook, FiGlobe } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/AboutPage.css";
import group from "../static/group.jpg";
import alex from "../static/alex.jpg";
import chen from "../static/chen.jpg";
import med from "../static/med.jpg";

const AboutPage = () => {
  const stats = [
    {
      value: "10,000+",
      label: "Students Enrolled",
      icon: <FiUsers size={40} />,
    },
    { value: "50+", label: "Expert Instructors", icon: <FiAward size={40} /> },
    { value: "200+", label: "Courses Available", icon: <FiBook size={40} /> },
    { value: "15+", label: "Countries Reached", icon: <FiGlobe size={40} /> },
  ];

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Education visionary with 15+ years in online learning",
      image: alex,
    },
    {
      name: "Sarah Chen",
      role: "Head of Instruction",
      bio: "Curriculum specialist and learning design expert",
      image: chen,
    },
    {
      name: "Michael Rodriguez",
      role: "Tech Director",
      bio: "Ensures our platform delivers seamless learning experiences",
      image: med,
    },
  ];

  return (
    <div className="page-wrapper">
      <Header />

      <motion.main
        className="about-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hero-content"
            >
              <h1>Our Story & Vision</h1>
              <p className="subtitle">
                Empowering learners worldwide through premium education
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <motion.div
              className="mission-content"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mission-text">
                <h2>Our Mission</h2>
                <p>
                  At King's Journal, we believe education should be
                  transformative, accessible, and tailored to modern learners.
                  We're committed to delivering premium online courses that
                  bridge the gap between ambition and achievement.
                </p>
                <p>
                  Founded in 2018, we've grown from a single course platform to
                  a global learning community serving thousands of students
                  across 15+ countries.
                </p>
              </div>
              <div className="mission-image">
                <img src={group} alt="Team collaborating" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <motion.div
              className="stats-grid"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-card"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Meet Our Leadership</h2>
              <p className="section-description">
                The passionate educators and innovators behind King's Journal
              </p>

              <div className="team-grid">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    className="team-card"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="team-image">
                      <img src={member.image} alt={member.name} />
                    </div>
                    <h3>{member.name}</h3>
                    <p className="role">{member.role}</p>
                    <p className="bio">{member.bio}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Our Core Values</h2>

              <div className="values-grid">
                <motion.div
                  className="value-card"
                  whileHover={{ backgroundColor: "rgba(106, 13, 173, 0.1)" }}
                >
                  <h3>Excellence</h3>
                  <p>
                    We maintain the highest standards in course content and
                    delivery
                  </p>
                </motion.div>

                <motion.div
                  className="value-card"
                  whileHover={{ backgroundColor: "rgba(255, 140, 0, 0.1)" }}
                >
                  <h3>Innovation</h3>
                  <p>
                    Constantly evolving our methods to enhance learning outcomes
                  </p>
                </motion.div>

                <motion.div
                  className="value-card"
                  whileHover={{ backgroundColor: "rgba(30, 144, 255, 0.1)" }}
                >
                  <h3>Community</h3>
                  <p>
                    Building networks that support lifelong learning and growth
                  </p>
                </motion.div>

                <motion.div
                  className="value-card"
                  whileHover={{ backgroundColor: "rgba(75, 0, 130, 0.1)" }}
                >
                  <h3>Integrity</h3>
                  <p>Honest, transparent practices in all we do</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
};

export default AboutPage;

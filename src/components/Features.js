import { motion } from "framer-motion";

const Features = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const features = [
    {
      icon: "📚",
      title: "Expert Courses",
      description:
        "Learn from industry professionals with years of experience.",
    },
    {
      icon: "⏱️",
      title: "Flexible Learning",
      description: "Study at your own pace, anytime, anywhere.",
    },
    {
      icon: "🏆",
      title: "Certification",
      description: "Earn recognized certificates upon completion.",
    },
  ];

  return (
    <motion.section
      className="features"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
    >
      <div className="container">
        <motion.h2 variants={item}>Why Choose King's Journal</motion.h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              className="feature-card"
              key={index}
              variants={item}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
            >
              <motion.div
                className="feature-icon"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {feature.icon}
              </motion.div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Features;

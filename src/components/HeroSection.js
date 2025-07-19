import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const featureMessages = [
  {
    title: "Master New Skills",
    description:
      "Interactive courses from industry experts to boost your career",
    color: "#6a0dad",
    emoji: "🧠",
    accent: "#ff8c00",
  },
  {
    title: "Learn At Your Pace",
    description: "24/7 access with lifetime course updates",
    color: "#1e90ff",
    emoji: "⏱️",
    accent: "#6a0dad",
  },
  {
    title: "Earn Certificates",
    description: "Verifiable credentials for your achievements",
    color: "#ff8c00",
    emoji: "🏆",
    accent: "#1e90ff",
  },
  {
    title: "Join Our Community",
    description: "Network with peers and mentors",
    color: "#4b0082",
    emoji: "👥",
    accent: "#ff8c00",
  },
];

const HeroSection = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [direction, setDirection] = useState(1);
  const timeoutRef = useRef();

  const variants = {
    enter: (direction) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0,
      rotateX: direction > 0 ? 20 : -20,
      scale: 0.95,
      filter: "blur(4px)",
    }),
    center: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 1,
      },
    },
    exit: (direction) => ({
      y: direction > 0 ? -100 : 100,
      opacity: 0,
      rotateX: direction > 0 ? -20 : 20,
      scale: 0.95,
      filter: "blur(4px)",
      transition: { duration: 0.6 },
    }),
  };

  const emojiVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  useEffect(() => {
    const cycleFeatures = () => {
      setDirection(1);
      setCurrentFeature((prev) => (prev + 1) % featureMessages.length);
      timeoutRef.current = setTimeout(cycleFeatures, 6000);
    };
    timeoutRef.current = setTimeout(cycleFeatures, 6000);

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleIndicatorClick = (index) => {
    clearTimeout(timeoutRef.current);
    setDirection(index > currentFeature ? 1 : -1);
    setCurrentFeature(index);

    // Restart timer
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setCurrentFeature((prev) => (prev + 1) % featureMessages.length);
    }, 6000);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 50) {
      // Swipe right - go previous
      handleIndicatorClick(
        (currentFeature - 1 + featureMessages.length) % featureMessages.length
      );
    } else if (info.offset.x < -50) {
      // Swipe left - go next
      handleIndicatorClick((currentFeature + 1) % featureMessages.length);
    }
  };

  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background */}
      <AnimatePresence custom={direction}>
        <motion.div
          key={`bg-${currentFeature}`}
          className="hero-bg"
          style={{
            backgroundColor: featureMessages[currentFeature].color,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      <div className="hero-overlay" />

      <div className="container">
        <motion.div
          className="hero-content4"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentFeature}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="feature-content"
            >
              <motion.div
                className="feature-emoji"
                variants={emojiVariants}
                initial="rest"
                whileHover="hover"
              >
                {featureMessages[currentFeature].emoji}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {featureMessages[currentFeature].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {featureMessages[currentFeature].description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="progress-indicators"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {featureMessages.map((_, index) => (
              <motion.div
                key={index}
                className={`indicator ${
                  index === currentFeature ? "active" : ""
                }`}
                onClick={() => handleIndicatorClick(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                animate={{
                  backgroundColor:
                    index === currentFeature
                      ? featureMessages[currentFeature].accent
                      : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </motion.div>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="btn-primary"
              style={{
                backgroundColor: featureMessages[currentFeature].accent,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 5px 20px ${featureMessages[currentFeature].accent}80`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Courses
            </motion.button>
            <motion.button
              className="btn-secondary"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="floating-orb"
        style={{ backgroundColor: featureMessages[currentFeature].accent }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="floating-orb small"
        style={{ backgroundColor: featureMessages[currentFeature].color }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </motion.section>
  );
};

export default HeroSection;

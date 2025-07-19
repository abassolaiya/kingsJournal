import React from "react";
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "King's Journal transformed my career. The courses are top-notch!",
      author: "Sarah Johnson",
      role: "Marketing Director",
    },
    {
      quote: "The best investment I've made in my professional development.",
      author: "Michael Chen",
      role: "Software Engineer",
    },
  ];

  return (
    <motion.section
      className="testimonials"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <motion.h2
          initial={{ x: -50 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring" }}
        >
          What Our Students Say
        </motion.h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              className="testimonial-card"
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring" }}
              whileHover={{ scale: 1.03 }}
            >
              <p className="quote">"{testimonial.quote}"</p>
              <p className="author">{testimonial.author}</p>
              <p className="role">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Help = () => {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const helpCategories = [
    { id: "general", name: "General Help", icon: "❓" },
    { id: "adoption", name: "Pet Adoption", icon: "🐾" },
    { id: "selling", name: "Selling Pets", icon: "💰" },
    { id: "account", name: "Account Issues", icon: "👤" },
    { id: "technical", name: "Technical Support", icon: "🔧" },
  ];

  const helpContent = {
    general: [
      {
        question: "How does PawBazar work?",
        answer:
          "PawBazar is a platform that connects pet lovers with pet sellers and service providers. You can browse listings, contact sellers directly, and arrange meetings to adopt pets or purchase supplies.",
      },
      {
        question: "Is PawBazar free to use?",
        answer:
          "Yes, browsing and basic features are completely free. We may charge small fees for premium listing features or promoted posts to help sellers reach more buyers.",
      },
      {
        question: "How do I create an account?",
        answer:
          "Click the 'Register' button in the top navigation, fill in your details, and verify your email address. You can also sign up using your Google account for faster registration.",
      },
    ],
    adoption: [
      {
        question: "How do I adopt a pet safely?",
        answer:
          "Always meet the pet in person, ask for vaccination records, verify the seller's identity, and consider a trial period. Never send money without meeting the pet first.",
      },
      {
        question: "What should I ask the seller?",
        answer:
          "Ask about vaccination history, health records, temperament, age, any behavioral issues, reason for selling, and if the pet is spayed/neutered.",
      },
      {
        question: "What if the pet has health issues after adoption?",
        answer:
          "Contact the seller immediately and consult a veterinarian. Many reputable sellers offer health guarantees. Keep all communication records for reference.",
      },
    ],
    selling: [
      {
        question: "How do I create a good listing?",
        answer:
          "Use clear, high-quality photos, write detailed descriptions, include vaccination records, set fair prices, and respond promptly to inquiries.",
      },
      {
        question: "What information should I include?",
        answer:
          "Include age, breed, gender, vaccination status, health records, temperament, training level, and reason for selling. Be honest and transparent.",
      },
      {
        question: "How do I verify potential buyers?",
        answer:
          "Ask questions about their experience with pets, living situation, and commitment level. Meet in person and trust your instincts about the buyer.",
      },
    ],
    account: [
      {
        question: "I forgot my password. How do I reset it?",
        answer:
          "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions in the reset email we send you.",
      },
      {
        question: "How do I update my profile information?",
        answer:
          "Go to your Dashboard, click on 'Profile Settings', make your changes, and save. You can update your name, contact information, and profile picture.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Contact our support team with your account deletion request. We'll help you remove your account and all associated data within 7 business days.",
      },
    ],
    technical: [
      {
        question: "The website is loading slowly. What should I do?",
        answer:
          "Try refreshing the page, clearing your browser cache, or using a different browser. If the problem persists, contact our technical support team.",
      },
      {
        question: "I can't upload photos to my listing.",
        answer:
          "Ensure your photos are under 5MB each and in JPG, PNG, or WebP format. Try using a different browser or device if the issue continues.",
      },
      {
        question: "The messaging system isn't working.",
        answer:
          "Check your internet connection and try refreshing the page. If messages aren't sending, contact support with details about the error you're seeing.",
      },
    ],
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Help & Support
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get answers to your questions and support when you need it
          </motion.p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <motion.section
        className="py-12 bg-base-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📧",
                title: "Email Support",
                description: "Get help via email",
                contact: "support@pawbazar.com",
                response: "Within 24 hours",
              },
              {
                icon: "📱",
                title: "Phone Support",
                description: "Call us directly",
                contact: "+880 1688-645882",
                response: "9 AM - 6 PM (Sat-Thu)",
              },
              {
                icon: "💬",
                title: "Live Chat",
                description: "Chat with our team",
                contact: "Available on website",
                response: "Instant response",
              },
            ].map((contact, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{contact.icon}</div>
                  <h3 className="card-title justify-center text-xl mb-2">
                    {contact.title}
                  </h3>
                  <p className="text-base-content/70 mb-4">
                    {contact.description}
                  </p>
                  <div className="text-primary font-semibold mb-2">
                    {contact.contact}
                  </div>
                  <div className="text-sm text-base-content/60">
                    {contact.response}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Help Categories */}
      <motion.section
        className="py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {helpCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`btn ${
                  selectedCategory === category.id
                    ? "btn-primary"
                    : "btn-outline btn-primary"
                } btn-lg`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* FAQ Content */}
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-8"
              variants={itemVariants}
            >
              {helpCategories.find((cat) => cat.id === selectedCategory)?.name}{" "}
              FAQ
            </motion.h2>

            <div className="space-y-4">
              {helpContent[selectedCategory]?.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="collapse collapse-plus bg-base-200 hover:bg-base-300 transition-colors duration-300"
                >
                  <input type="radio" name="help-accordion" />
                  <div className="collapse-title text-lg font-semibold">
                    {item.question}
                  </div>
                  <div className="collapse-content">
                    <p className="text-base-content/80 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Form */}
      <motion.section
        className="py-20 bg-base-200"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <h2 className="text-4xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-xl text-base-content/70">
                Send us a message and we'll get back to you as soon as possible
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleContactSubmit}
              className="card bg-base-100 shadow-xl"
              variants={itemVariants}
            >
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Name *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="input input-bordered"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Email *</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="input input-bordered"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Subject *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    className="input input-bordered"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Message *</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32"
                    placeholder="Please describe your issue in detail..."
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                </div>

                <div className="form-control mt-6">
                  <motion.button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📤 Send Message
                  </motion.button>
                </div>
              </div>
            </motion.form>
          </div>
        </div>
      </motion.section>

      {/* Additional Resources */}
      <motion.section
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-4xl font-bold mb-4">Additional Resources</h2>
            <p className="text-xl text-base-content/70">
              Explore more ways to get help and learn about pet care
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📚",
                title: "Pet Care Guide",
                description:
                  "Comprehensive guides on pet care, training, and health",
                link: "/guides",
              },
              {
                icon: "👥",
                title: "Community Forum",
                description:
                  "Connect with other pet owners and share experiences",
                link: "/community",
              },
              {
                icon: "🎥",
                title: "Video Tutorials",
                description:
                  "Watch helpful videos on pet care and platform usage",
                link: "/tutorials",
              },
            ].map((resource, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="card-body text-center">
                  <div className="text-5xl mb-4">{resource.icon}</div>
                  <h3 className="card-title justify-center text-xl mb-4">
                    {resource.title}
                  </h3>
                  <p className="text-base-content/70 mb-6">
                    {resource.description}
                  </p>
                  <div className="card-actions justify-center">
                    <Link to={resource.link} className="btn btn-primary btn-sm">
                      Learn More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Help;

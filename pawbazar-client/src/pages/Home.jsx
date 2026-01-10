import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRecentListings } from "../hooks/useListings";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { listings: recentListings, loading: listingsLoading } =
    useRecentListings(6);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Find Your Perfect Companion",
      subtitle: "Thousands of loving pets waiting for their forever homes",
      gradient: "from-purple-600/80 to-blue-600/80",
    },
    {
      url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1464&q=80",
      title: "Everything Your Pet Needs",
      subtitle: "Quality supplies, food, and accessories for happy pets",
      gradient: "from-green-600/80 to-teal-600/80",
    },
    {
      url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      title: "Join Our Community",
      subtitle: "Connect with fellow pet lovers and share experiences",
      gradient: "from-orange-600/80 to-red-600/80",
    },
  ];

  const categories = [
    {
      name: "Dogs",
      icon: "🐕",
      count: "150+ available",
      link: "/pets-supplies?category=dogs",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Cats",
      icon: "🐱",
      count: "120+ available",
      link: "/pets-supplies?category=cats",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Pet Food",
      icon: "🥘",
      count: "200+ products",
      link: "/pets-supplies?category=food",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Accessories",
      icon: "🎾",
      count: "300+ items",
      link: "/pets-supplies?category=accessories",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Birds",
      icon: "🐦",
      count: "80+ available",
      link: "/pets-supplies?category=birds",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      name: "Fish",
      icon: "🐠",
      count: "60+ available",
      link: "/pets-supplies?category=fish",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const formatPrice = (price) => {
    return price === 0 ? "Free Adoption" : `৳${price.toLocaleString()}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
    <div className="min-h-screen">
      {/* Hero Section - Full Screen */}
      <div className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
          >
            <img
              src={heroImages[currentSlide].url}
              className="w-full h-full object-cover"
              alt={heroImages[currentSlide].title}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${heroImages[currentSlide].gradient}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white max-w-4xl px-4">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {heroImages[currentSlide].title}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {heroImages[currentSlide].subtitle}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/pets-supplies"
                className="btn btn-primary btn-lg text-lg px-8 hover:scale-105 transition-transform"
              >
                🐾 Browse Pets & Supplies
              </Link>
              <Link
                to="/add-listing"
                className="btn btn-outline btn-lg text-lg px-8 text-white border-white hover:bg-white hover:text-gray-800 hover:scale-105 transition-all"
              >
                ➕ Add Your Pet
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroImages.map((_, index) => (
            <motion.button
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 right-8 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll Down</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Categories Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-base-200 to-base-300"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Browse Categories
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Find exactly what you're looking for in our carefully organized
              categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={category.link} className="block group">
                  <div
                    className={`card bg-gradient-to-br ${category.color} text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-full`}
                  >
                    <div className="card-body items-center text-center p-6">
                      <motion.div
                        className="text-5xl mb-4"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {category.icon}
                      </motion.div>
                      <h3 className="card-title text-lg font-bold">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90">{category.count}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recent Listings */}
      <motion.section
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center mb-16"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Recent Listings
              </h2>
              <p className="text-xl text-base-content/70">
                Discover the latest pets and supplies added to our platform
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/pets-supplies" className="btn btn-primary btn-lg">
                View All Listings
              </Link>
            </motion.div>
          </motion.div>

          {listingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="card bg-base-100 shadow-xl">
                  <div className="skeleton h-64 w-full"></div>
                  <div className="card-body">
                    <div className="skeleton h-6 w-3/4 mb-2"></div>
                    <div className="skeleton h-4 w-1/2 mb-4"></div>
                    <div className="skeleton h-10 w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentListings.map((listing) => (
                <motion.div
                  key={listing._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <figure className="relative overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f3f4f6"/><text x="150" y="100" text-anchor="middle" dy=".3em" font-size="40">🐾</text></svg>`;
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="badge badge-primary">
                        {listing.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`badge ${
                          listing.price === 0 ? "badge-success" : "badge-info"
                        }`}
                      >
                        {formatPrice(listing.price)}
                      </span>
                    </div>
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-lg line-clamp-1">
                      {listing.name}
                    </h3>
                    <p className="text-base-content/70 text-sm flex items-center">
                      📍 {listing.location}
                    </p>
                    <p className="text-base-content/80 line-clamp-2 text-sm">
                      {listing.description}
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <Link
                        to={`/listing/${listing._id}`}
                        className="btn btn-primary btn-sm hover:scale-105 transition-transform"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Thousands of pet lovers trust PawBazar for their pet adoption and
              supply needs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Happy Pets Adopted", icon: "🏠" },
              { number: "500+", label: "Active Listings", icon: "📝" },
              { number: "2000+", label: "Community Members", icon: "👥" },
              { number: "50+", label: "Cities Covered", icon: "🌍" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-base-100 to-base-200"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              What Our Community Says
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Real stories from pet lovers who found their perfect companions
              through PawBazar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Ahmed",
                location: "Dhaka",
                image:
                  "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "Found my adorable Golden Retriever through PawBazar! The process was smooth and the seller was very genuine. My family is complete now! 🐕❤️",
                petType: "Dog Adoption",
              },
              {
                name: "Rafiq Hassan",
                location: "Chittagong",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "Excellent platform for pet supplies! Got premium cat food and toys at great prices. Fast delivery and authentic products. Highly recommended! 🐱",
                petType: "Pet Supplies",
              },
              {
                name: "Fatima Khan",
                location: "Sylhet",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "As a first-time pet owner, PawBazar's community helped me so much! Found a beautiful Persian cat and got amazing advice from other members. 🐾",
                petType: "Cat Adoption",
              },
              {
                name: "Karim Uddin",
                location: "Rajshahi",
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "Listed my puppies here and found loving families for all of them. The platform is user-friendly and reaches genuine pet lovers. Great experience! 🏠",
                petType: "Pet Seller",
              },
              {
                name: "Nasreen Begum",
                location: "Khulna",
                image:
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "The customer service is outstanding! Had an issue with my order and they resolved it immediately. Trust and reliability at its best! 💯",
                petType: "Customer Support",
              },
              {
                name: "Aminul Islam",
                location: "Barisal",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "Been using PawBazar for 2 years now. From adoption to supplies, everything is top-notch. My go-to platform for all pet needs! 🌟",
                petType: "Long-term User",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="card-body p-6">
                  <div className="flex items-center mb-4">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={testimonial.image} alt={testimonial.name} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-base-content/70">
                        📍 {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-lg">
                        ⭐
                      </span>
                    ))}
                  </div>

                  <p className="text-base-content/80 mb-4 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  <div className="badge badge-primary badge-outline">
                    {testimonial.petType}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Service Providers Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-secondary to-accent text-secondary-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Trusted Service Providers
            </h2>
            <p className="text-xl text-secondary-content/90 max-w-2xl mx-auto">
              Connect with verified veterinarians, trainers, and pet care
              professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🏥",
                title: "Veterinary Clinics",
                count: "50+",
                description:
                  "Certified vets for health checkups, vaccinations, and emergency care",
                services: [
                  "Health Checkups",
                  "Vaccinations",
                  "Surgery",
                  "Emergency Care",
                ],
              },
              {
                icon: "🎓",
                title: "Pet Trainers",
                count: "30+",
                description:
                  "Professional trainers for obedience, behavior, and specialized training",
                services: [
                  "Basic Training",
                  "Behavior Correction",
                  "Agility Training",
                  "Puppy Classes",
                ],
              },
              {
                icon: "✂️",
                title: "Grooming Services",
                count: "40+",
                description:
                  "Expert grooming for all breeds with premium care and styling",
                services: [
                  "Bathing & Brushing",
                  "Nail Trimming",
                  "Hair Styling",
                  "Dental Care",
                ],
              },
              {
                icon: "🏨",
                title: "Pet Boarding",
                count: "25+",
                description:
                  "Safe and comfortable boarding facilities for your peace of mind",
                services: [
                  "Day Care",
                  "Overnight Boarding",
                  "Holiday Care",
                  "Play Time",
                ],
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="card bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="card-body text-center p-6">
                  <motion.div
                    className="text-6xl mb-4"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="card-title text-xl font-bold text-white justify-center mb-2">
                    {service.title}
                  </h3>
                  <div className="badge badge-accent badge-lg mb-4">
                    {service.count} Providers
                  </div>
                  <p className="text-secondary-content/90 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-1">
                    {service.services.map((item, i) => (
                      <div
                        key={i}
                        className="text-xs text-secondary-content/80 flex items-center justify-center"
                      >
                        <span className="mr-1">✓</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-12" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/services"
                className="btn btn-accent btn-lg text-lg px-8"
              >
                🔍 Find Service Providers
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="py-20 bg-base-100"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Get answers to common questions about pet adoption, care, and our
              platform
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How do I adopt a pet through PawBazar?",
                  answer:
                    "Simply browse our listings, contact the seller directly through our messaging system, arrange a meeting, and complete the adoption process. We recommend meeting the pet first to ensure compatibility.",
                },
                {
                  question: "Are all pets on PawBazar vaccinated?",
                  answer:
                    "We encourage all sellers to provide vaccination records. Always ask for health certificates and vaccination history before adoption. We also recommend a vet checkup after adoption.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We support various payment methods including bKash, Nagad, Rocket, bank transfers, and cash payments. Payment terms are arranged directly between buyers and sellers.",
                },
                {
                  question: "Can I return a pet if it doesn't work out?",
                  answer:
                    "Pet adoption is a serious commitment. However, if there are genuine compatibility issues, many sellers are understanding. We encourage thorough consideration before adoption.",
                },
                {
                  question: "How do I verify a seller's credibility?",
                  answer:
                    "Check seller ratings, read reviews, ask for references, and always meet in person. Our verified badge system helps identify trusted sellers with good track records.",
                },
                {
                  question: "Do you provide pet care guidance?",
                  answer:
                    "Yes! Our community forum, blog, and customer support provide extensive pet care guidance. We also connect you with local veterinarians and trainers.",
                },
                {
                  question: "What if I need emergency pet care?",
                  answer:
                    "We maintain a directory of 24/7 emergency veterinary clinics across Bangladesh. Contact our support team for immediate assistance in finding nearby emergency care.",
                },
                {
                  question: "How do I list my pet for adoption?",
                  answer:
                    "Create an account, click 'Add Listing', fill in your pet's details with clear photos, set your terms, and publish. Our team reviews listings to ensure quality and authenticity.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="collapse collapse-plus bg-base-200 hover:bg-base-300 transition-colors duration-300"
                >
                  <input type="radio" name="faq-accordion" />
                  <div className="collapse-title text-lg font-semibold">
                    {faq.question}
                  </div>
                  <div className="collapse-content">
                    <p className="text-base-content/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div className="text-center mt-12" variants={itemVariants}>
            <p className="text-base-content/70 mb-4">
              Still have questions? We're here to help!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/help" className="btn btn-primary btn-lg text-lg px-8">
                💬 Contact Support
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-base-200"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ready to Find Your Perfect Pet?
            </h2>
            <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
              Join thousands of happy pet owners who found their companions
              through PawBazar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/pets-supplies"
                  className="btn btn-primary btn-lg text-lg px-8"
                >
                  🔍 Browse Pets
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/add-listing"
                  className="btn btn-outline btn-lg text-lg px-8"
                >
                  📝 List Your Pet
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const serviceProviders = [
    {
      id: 1,
      name: "Dr. Rahman's Veterinary Clinic",
      category: "veterinary",
      location: "Dhanmondi, Dhaka",
      rating: 4.9,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      services: [
        "Health Checkups",
        "Vaccinations",
        "Surgery",
        "Emergency Care",
      ],
      contact: "+880 1711-123456",
      experience: "15+ years",
      price: "৳500-2000",
    },
    {
      id: 2,
      name: "Happy Paws Training Center",
      category: "training",
      location: "Gulshan, Dhaka",
      rating: 4.8,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      services: ["Basic Training", "Behavior Correction", "Agility Training"],
      contact: "+880 1722-234567",
      experience: "8+ years",
      price: "৳1000-3000",
    },
    {
      id: 3,
      name: "Paws & Claws Grooming",
      category: "grooming",
      location: "Uttara, Dhaka",
      rating: 4.7,
      reviews: 234,
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      services: ["Bathing & Brushing", "Nail Trimming", "Hair Styling"],
      contact: "+880 1733-345678",
      experience: "5+ years",
      price: "৳800-2500",
    },
    {
      id: 4,
      name: "Pet Paradise Boarding",
      category: "boarding",
      location: "Banani, Dhaka",
      rating: 4.9,
      reviews: 67,
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      services: ["Day Care", "Overnight Boarding", "Holiday Care"],
      contact: "+880 1744-456789",
      experience: "10+ years",
      price: "৳300-1500/day",
    },
  ];

  const categories = [
    { id: "all", name: "All Services", icon: "🏢" },
    { id: "veterinary", name: "Veterinary", icon: "🏥" },
    { id: "training", name: "Training", icon: "🎓" },
    { id: "grooming", name: "Grooming", icon: "✂️" },
    { id: "boarding", name: "Boarding", icon: "🏨" },
  ];

  const filteredProviders =
    selectedCategory === "all"
      ? serviceProviders
      : serviceProviders.filter(
          (provider) => provider.category === selectedCategory
        );

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
            Pet Care Services
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect with trusted veterinarians, trainers, groomers, and boarding
            facilities across Bangladesh
          </motion.p>
        </div>
      </div>

      {/* Category Filter */}
      <motion.section
        className="py-12 bg-base-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
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
        </div>
      </motion.section>

      {/* Service Providers */}
      <motion.section
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProviders.map((provider) => (
              <motion.div
                key={provider.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <figure>
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-xl">{provider.name}</h3>
                  <p className="text-base-content/70 flex items-center">
                    📍 {provider.location}
                  </p>

                  <div className="flex items-center gap-2 my-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(provider.rating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-base-content/70">
                      {provider.rating} ({provider.reviews} reviews)
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.services.map((service, index) => (
                        <span
                          key={index}
                          className="badge badge-primary badge-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Experience:</span>
                      <br />
                      {provider.experience}
                    </div>
                    <div>
                      <span className="font-semibold">Price Range:</span>
                      <br />
                      {provider.price}
                    </div>
                  </div>

                  <div className="card-actions justify-between mt-4">
                    <a
                      href={`tel:${provider.contact}`}
                      className="btn btn-outline btn-sm"
                    >
                      📞 Call
                    </a>
                    <Link
                      to={`/service/${provider.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-secondary to-accent text-secondary-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Are You a Service Provider?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-secondary-content/90">
              Join our network of trusted pet care professionals and reach
              thousands of pet owners
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register-service"
                className="btn btn-accent btn-lg text-lg px-8"
              >
                🏢 Register Your Service
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;

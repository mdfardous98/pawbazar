import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecentListings } from "../hooks/useListings";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { listings: recentListings, loading: listingsLoading } =
    useRecentListings(6);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Find Your Perfect Companion",
      subtitle: "Thousands of loving pets waiting for their forever homes",
    },
    {
      url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1464&q=80",
      title: "Everything Your Pet Needs",
      subtitle: "Quality supplies, food, and accessories for happy pets",
    },
    {
      url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      title: "Join Our Community",
      subtitle: "Connect with fellow pet lovers and share experiences",
    },
  ];

  const categories = [
    {
      name: "Dogs",
      icon: "🐕",
      count: "150+ available",
      link: "/pets-supplies?category=dogs",
    },
    {
      name: "Cats",
      icon: "🐱",
      count: "120+ available",
      link: "/pets-supplies?category=cats",
    },
    {
      name: "Pet Food",
      icon: "🥘",
      count: "200+ products",
      link: "/pets-supplies?category=food",
    },
    {
      name: "Accessories",
      icon: "🎾",
      count: "300+ items",
      link: "/pets-supplies?category=accessories",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const formatPrice = (price) => {
    return price === 0 ? "Free Adoption" : `৳${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <div className="carousel w-full h-96 md:h-[500px]">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-item relative w-full ${
              index === currentSlide ? "block" : "hidden"
            }`}
          >
            <img
              src={image.url}
              className="w-full object-cover"
              alt={image.title}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {image.title}
                </h1>
                <p className="text-lg md:text-xl mb-6">{image.subtitle}</p>
                <Link to="/pets-supplies" className="btn btn-primary btn-lg">
                  Browse Pets & Supplies
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer transform hover:scale-105"
              >
                <div className="card-body items-center text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="card-title">{category.name}</h3>
                  <p className="text-sm opacity-70">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Recent Listings</h2>
            <Link to="/pets-supplies" className="btn btn-outline btn-primary">
              View All
            </Link>
          </div>

          {listingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="card bg-base-100 shadow-xl">
                  <div className="skeleton h-48 w-full"></div>
                  <div className="card-body">
                    <div className="skeleton h-4 w-3/4 mb-2"></div>
                    <div className="skeleton h-3 w-1/2 mb-4"></div>
                    <div className="skeleton h-16 w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="skeleton h-4 w-1/3"></div>
                      <div className="skeleton h-8 w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map((listing) => (
                <div
                  key={listing._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <figure>
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="h-48 w-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-lg">{listing.name}</h3>
                    <p className="text-sm opacity-70 flex items-center">
                      <span className="mr-1">📍</span>
                      {listing.location}
                    </p>
                    <p className="text-sm line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="card-actions justify-between items-center mt-4">
                      <span
                        className={`text-lg font-bold ${
                          listing.price === 0 ? "text-success" : "text-primary"
                        }`}
                      >
                        {formatPrice(listing.price)}
                      </span>
                      <Link
                        to={`/listing/${listing._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
              <p className="text-base-content/70 mb-4">
                Be the first to add a pet or supply listing!
              </p>
              <Link to="/add-listing" className="btn btn-primary">
                Add First Listing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Awareness Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Adopt, Don't Shop</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Every year, millions of pets are waiting in shelters for loving
            homes. By choosing adoption, you're not just gaining a companion -
            you're saving a life.
          </p>
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title text-primary-content/70">
                Pets Adopted
              </div>
              <div className="stat-value">1,200+</div>
              <div className="stat-desc text-primary-content/70">This year</div>
            </div>
            <div className="stat">
              <div className="stat-title text-primary-content/70">
                Happy Families
              </div>
              <div className="stat-value">950+</div>
              <div className="stat-desc text-primary-content/70">
                And counting
              </div>
            </div>
            <div className="stat">
              <div className="stat-title text-primary-content/70">
                Success Rate
              </div>
              <div className="stat-value">98%</div>
              <div className="stat-desc text-primary-content/70">
                Successful adoptions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Community Says
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-16 rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="Sarah Ahmed"
                    />
                  </div>
                </div>
                <h3 className="font-bold mb-2">Sarah Ahmed</h3>
                <p className="text-sm opacity-70">
                  "Found my best friend through PawBazar. The process was smooth
                  and the support was amazing!"
                </p>
                <div className="rating rating-sm mt-2">
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                    defaultChecked
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-16 rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="Karim Rahman"
                    />
                  </div>
                </div>
                <h3 className="font-bold mb-2">Karim Rahman</h3>
                <p className="text-sm opacity-70">
                  "Great platform for pet supplies. Quality products and fast
                  delivery every time."
                </p>
                <div className="rating rating-sm mt-2">
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    defaultChecked
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-16 rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="Fatima Khan"
                    />
                  </div>
                </div>
                <h3 className="font-bold mb-2">Fatima Khan</h3>
                <p className="text-sm opacity-70">
                  "The community here is so supportive. Got great advice for my
                  new puppy!"
                </p>
                <div className="rating rating-sm mt-2">
                  <input
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2 bg-orange-400"
                    defaultChecked
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Pet?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy pet owners who found their companions
            through PawBazar. Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pets-supplies" className="btn btn-primary btn-lg">
              Browse Pets
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-primary-content">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Browse & Search</h3>
              <p className="text-base-content/70">
                Explore our wide selection of pets and supplies. Use filters to
                find exactly what you're looking for.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-secondary-content">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Connect & Chat</h3>
              <p className="text-base-content/70">
                Contact pet owners directly through our platform. Ask questions
                and arrange meetings safely.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-accent-content">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Adopt & Love</h3>
              <p className="text-base-content/70">
                Complete the adoption process and welcome your new family member
                home with love and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Care Tips Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pet Care Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-base-100 shadow-lg">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Dog nutrition"
                  className="h-32 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-sm">Proper Nutrition</h3>
                <p className="text-xs text-base-content/70">
                  Feed your pet high-quality food appropriate for their age and
                  size.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Exercise"
                  className="h-32 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-sm">Regular Exercise</h3>
                <p className="text-xs text-base-content/70">
                  Keep your pet active with daily walks and playtime for better
                  health.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Vet checkup"
                  className="h-32 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-sm">Vet Checkups</h3>
                <p className="text-xs text-base-content/70">
                  Schedule regular veterinary visits to maintain your pet's
                  health.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Grooming"
                  className="h-32 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-sm">Grooming Care</h3>
                <p className="text-xs text-base-content/70">
                  Regular grooming keeps your pet clean, healthy, and
                  comfortable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Happy dog"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      Max Found His Forever Home
                    </h3>
                    <p className="text-sm text-base-content/70 mb-3">
                      "Max was rescued from the streets and found a loving
                      family through PawBazar. Now he enjoys daily walks in the
                      park and has become the neighborhood favorite!"
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-success">Adopted</span>
                      <span className="text-xs text-base-content/60">
                        2 months ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Happy cat"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      Luna's New Beginning
                    </h3>
                    <p className="text-sm text-base-content/70 mb-3">
                      "Luna was shy and scared when she first arrived at the
                      shelter. Through PawBazar, she found a patient family who
                      helped her bloom into a confident, loving cat."
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-success">Adopted</span>
                      <span className="text-xs text-base-content/60">
                        1 month ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Breeds Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Breeds
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              {
                name: "Golden Retriever",
                image:
                  "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
              },
              {
                name: "Persian Cat",
                image:
                  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
              },
              {
                name: "German Shepherd",
                image:
                  "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
              },
              {
                name: "British Shorthair",
                image:
                  "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
              },
              {
                name: "Labrador",
                image:
                  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
              },
              {
                name: "Maine Coon",
                image:
                  "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
              },
            ].map((breed, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden">
                  <img
                    src={breed.image}
                    alt={breed.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium">{breed.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Get the latest news about pet adoptions, care tips, and special
            offers delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="join w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="input input-bordered join-item flex-1 text-base-content"
              />
              <button className="btn btn-secondary join-item">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-lg font-medium">
                How do I adopt a pet through PawBazar?
              </div>
              <div className="collapse-content">
                <p>
                  Browse our available pets, contact the current owner through
                  our platform, arrange a meeting, and complete the adoption
                  process. We provide guidance throughout the entire journey.
                </p>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Is there an adoption fee?
              </div>
              <div className="collapse-content">
                <p>
                  Adoption fees vary by pet and are set by the current owner.
                  Many pets are available for free adoption, while others may
                  have a small fee to cover medical expenses.
                </p>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Can I return a pet if it doesn't work out?
              </div>
              <div className="collapse-content">
                <p>
                  We encourage thorough consideration before adoption. However,
                  if circumstances change, we can help facilitate a return or
                  rehoming process to ensure the pet's wellbeing.
                </p>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                How do I list my pet for adoption?
              </div>
              <div className="collapse-content">
                <p>
                  Create an account, click "Add Listing", fill out the pet
                  information form with photos and details, and publish your
                  listing. It's completely free to list pets for adoption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

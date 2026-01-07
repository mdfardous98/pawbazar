import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                    checked
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
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    checked
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
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2 bg-orange-400"
                    checked
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
    </div>
  );
};

export default Home;

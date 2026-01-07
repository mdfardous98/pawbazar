import { useState, useEffect } from 'react'

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Find Your Perfect Companion",
      subtitle: "Thousands of loving pets waiting for their forever homes"
    },
    {
      url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1464&q=80",
      title: "Everything Your Pet Needs",
      subtitle: "Quality supplies, food, and accessories for happy pets"
    },
    {
      url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      title: "Join Our Community",
      subtitle: "Connect with fellow pet lovers and share experiences"
    }
  ]

  const categories = [
    { name: "Dogs", icon: "🐕", count: "150+ available" },
    { name: "Cats", icon: "🐱", count: "120+ available" },
    { name: "Pet Food", icon: "🥘", count: "200+ products" },
    { name: "Accessories", icon: "🎾", count: "300+ items" }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <div className="carousel w-full h-96 md:h-[500px]">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-item relative w-full ${
              index === currentSlide ? 'block' : 'hidden'
            }`}
          >
            <img
              src={image.url}
              className="w-full object-cover"
              alt={image.title}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{image.title}</h1>
                <p className="text-lg md:text-xl mb-6">{image.subtitle}</p>
                <button className="btn btn-primary btn-lg">Get Started</button>
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
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
                <div className="card-body items-center text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="card-title">{category.name}</h3>
                  <p className="text-sm opacity-70">{category.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="card bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={`https://images.unsplash.com/photo-${1560807707-${item}0000000000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                    alt="Pet"
                    className="h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">Friendly Golden Retriever</h3>
                  <p className="text-sm opacity-70">Dhaka, Bangladesh</p>
                  <p>A loving and energetic companion looking for a forever home.</p>
                  <div className="card-actions justify-between items-center mt-4">
                    <span className="text-lg font-bold text-primary">Free Adoption</span>
                    <button className="btn btn-primary btn-sm">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awareness Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Adopt, Don't Shop</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Every year, millions of pets are waiting in shelters for loving homes. 
            By choosing adoption, you're not just gaining a companion - you're saving a life.
          </p>
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title text-primary-content/70">Pets Adopted</div>
              <div className="stat-value">1,200+</div>
            </div>
            <div className="stat">
              <div className="stat-title text-primary-content/70">Happy Families</div>
              <div className="stat-value">950+</div>
            </div>
            <div className="stat">
              <div className="stat-title text-primary-content/70">Success Rate</div>
              <div className="stat-value">98%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Join Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="avatar mb-4">
                <div className="w-16 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <h3 className="font-bold mb-2">Sarah Ahmed</h3>
              <p className="text-sm opacity-70">"Found my best friend through PawBazar. The process was smooth and the support was amazing!"</p>
            </div>
            <div className="text-center">
              <div className="avatar mb-4">
                <div className="w-16 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <h3 className="font-bold mb-2">Karim Rahman</h3>
              <p className="text-sm opacity-70">"Great platform for pet supplies. Quality products and fast delivery every time."</p>
            </div>
            <div className="text-center">
              <div className="avatar mb-4">
                <div className="w-16 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <h3 className="font-bold mb-2">Fatima Khan</h3>
              <p className="text-sm opacity-70">"The community here is so supportive. Got great advice for my new puppy!"</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
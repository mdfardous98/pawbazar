import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Help = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    subject: "",
    category: "general",
    message: "",
    priority: "medium",
  });

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account on PawBazar?",
          a: "Click the 'Register' button in the top right corner, fill in your details, and verify your email address. You can also sign up using your Google account for faster registration.",
        },
        {
          q: "Is PawBazar free to use?",
          a: "Yes! Creating an account, browsing listings, and posting pet adoptions is completely free. We only charge a small fee for premium features like featured listings.",
        },
        {
          q: "How do I add my first listing?",
          a: "After logging in, click 'Add Listing' in the navigation menu. Fill out the form with your pet's details, upload photos, and publish your listing.",
        },
      ],
    },
    {
      category: "Pet Adoption",
      questions: [
        {
          q: "How does the adoption process work?",
          a: "Browse available pets, contact the current owner through our platform, arrange a meeting, and complete the adoption process. We provide guidance throughout the journey.",
        },
        {
          q: "Are there adoption fees?",
          a: "Adoption fees vary by pet and are set by the current owner. Many pets are available for free adoption, while others may have a small fee to cover medical expenses.",
        },
        {
          q: "Can I return a pet if it doesn't work out?",
          a: "We encourage thorough consideration before adoption. However, if circumstances change, we can help facilitate a return or rehoming process to ensure the pet's wellbeing.",
        },
        {
          q: "What should I prepare before adopting a pet?",
          a: "Ensure you have proper supplies (food, bed, toys), a safe environment, and are prepared for the long-term commitment. Consider your lifestyle and living situation.",
        },
      ],
    },
    {
      category: "Buying & Selling",
      questions: [
        {
          q: "How do I purchase pet supplies?",
          a: "Browse our supplies section, select items you need, and place an order. You can contact sellers directly for questions or bulk purchases.",
        },
        {
          q: "What payment methods are accepted?",
          a: "We support various payment methods including cash on delivery, mobile banking (bKash, Nagad), and bank transfers. Payment terms are set by individual sellers.",
        },
        {
          q: "How do I track my orders?",
          a: "Go to 'My Orders' in your dashboard to track all your purchases. You'll receive notifications about order status updates.",
        },
      ],
    },
    {
      category: "Safety & Trust",
      questions: [
        {
          q: "How do I stay safe when meeting sellers/buyers?",
          a: "Always meet in public places, bring a friend if possible, verify the seller's identity, and trust your instincts. Never share personal financial information.",
        },
        {
          q: "How do I report suspicious activity?",
          a: "Use the 'Report' button on listings or contact our support team immediately. We take all reports seriously and investigate promptly.",
        },
        {
          q: "Are all pets on PawBazar healthy?",
          a: "While we encourage health checks, we cannot guarantee the health of all pets. Always ask for medical records and consider a vet checkup after adoption.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "I'm having trouble uploading photos",
          a: "Ensure your photos are under 5MB and in JPG, PNG, or WebP format. Try refreshing the page or using a different browser if issues persist.",
        },
        {
          q: "Why can't I see my listing?",
          a: "New listings may take a few minutes to appear. If it's been longer, check if your listing meets our guidelines or contact support.",
        },
        {
          q: "How do I delete my account?",
          a: "Go to Settings > Account > Delete Account. Note that this action is permanent and cannot be undone.",
        },
      ],
    },
  ];

  const guideData = [
    {
      title: "First-Time Pet Owner Guide",
      description: "Everything you need to know before getting your first pet",
      content: [
        "Research different pet types and their needs",
        "Prepare your home with necessary supplies",
        "Find a local veterinarian",
        "Budget for ongoing costs (food, medical, grooming)",
        "Consider pet insurance options",
      ],
    },
    {
      title: "Pet Care Essentials",
      description: "Basic care tips for keeping your pet healthy and happy",
      content: [
        "Provide fresh water and quality food daily",
        "Maintain regular exercise and playtime",
        "Schedule routine veterinary checkups",
        "Keep up with vaccinations and preventive care",
        "Create a safe, comfortable living environment",
      ],
    },
    {
      title: "Selling on PawBazar",
      description: "Best practices for successful selling",
      content: [
        "Take high-quality, well-lit photos",
        "Write detailed, honest descriptions",
        "Set competitive prices",
        "Respond promptly to inquiries",
        "Meet buyers in safe, public locations",
      ],
    },
  ];

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    toast.success(
      "Your message has been sent! We'll get back to you within 24 hours."
    );
    setContactForm({
      name: user?.displayName || "",
      email: user?.email || "",
      subject: "",
      category: "general",
      message: "",
      priority: "medium",
    });
  };

  const sections = [
    { id: "faq", label: "FAQ", icon: "❓" },
    { id: "guides", label: "Guides", icon: "📚" },
    { id: "contact", label: "Contact", icon: "📧" },
    { id: "resources", label: "Resources", icon: "🔗" },
  ];

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Help Center
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Find answers to common questions, learn how to use PawBazar
            effectively, and get the support you need.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search for help..."
                className="input input-bordered flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-lg sticky top-4">
              <div className="card-body p-4">
                <ul className="menu menu-compact">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-3 ${
                          activeSection === section.id ? "active" : ""
                        }`}
                      >
                        <span className="text-lg">{section.icon}</span>
                        <span>{section.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* FAQ Section */}
            {activeSection === "faq" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  Frequently Asked Questions
                </h2>

                {filteredFAQ.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-base-content/70">
                      No results found for "{searchQuery}"
                    </p>
                  </div>
                ) : (
                  filteredFAQ.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-4">
                      <h3 className="text-xl font-semibold text-primary">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.questions.map((item, index) => (
                          <div
                            key={index}
                            className="collapse collapse-plus bg-base-200"
                          >
                            <input type="radio" name={`faq-${categoryIndex}`} />
                            <div className="collapse-title text-lg font-medium">
                              {item.q}
                            </div>
                            <div className="collapse-content">
                              <p className="text-base-content/80">{item.a}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Guides Section */}
            {activeSection === "guides" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Helpful Guides</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guideData.map((guide, index) => (
                    <div key={index} className="card bg-base-200 shadow-lg">
                      <div className="card-body">
                        <h3 className="card-title">{guide.title}</h3>
                        <p className="text-base-content/70 mb-4">
                          {guide.description}
                        </p>
                        <ul className="space-y-2">
                          {guide.content.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-2"
                            >
                              <span className="text-primary mt-1">•</span>
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card bg-primary text-primary-content">
                  <div className="card-body">
                    <h3 className="card-title">Need More Help?</h3>
                    <p>
                      Can't find what you're looking for? Our community forum
                      has thousands of discussions about pet care, adoption
                      tips, and more.
                    </p>
                    <div className="card-actions">
                      <button className="btn btn-secondary">Visit Forum</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Section */}
            {activeSection === "contact" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Contact Support</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body text-center">
                      <div className="text-3xl mb-2">📧</div>
                      <h3 className="font-bold">Email Support</h3>
                      <p className="text-sm text-base-content/70">
                        Get help via email
                      </p>
                      <p className="font-medium">support@pawbazar.com</p>
                      <p className="text-xs text-base-content/60">
                        Response within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body text-center">
                      <div className="text-3xl mb-2">💬</div>
                      <h3 className="font-bold">Live Chat</h3>
                      <p className="text-sm text-base-content/70">
                        Chat with our team
                      </p>
                      <button className="btn btn-primary btn-sm mt-2">
                        Start Chat
                      </button>
                      <p className="text-xs text-base-content/60">
                        Available 9 AM - 6 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Send us a Message</h3>

                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Name</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={contactForm.name}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Email</span>
                          </label>
                          <input
                            type="email"
                            className="input input-bordered"
                            value={contactForm.email}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Category</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={contactForm.category}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                          >
                            <option value="general">General Question</option>
                            <option value="technical">Technical Issue</option>
                            <option value="account">Account Problem</option>
                            <option value="payment">Payment Issue</option>
                            <option value="report">Report Content</option>
                            <option value="feedback">Feedback</option>
                          </select>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Priority</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={contactForm.priority}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                priority: e.target.value,
                              }))
                            }
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Subject</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={contactForm.subject}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              subject: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Message</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered h-32"
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              message: e.target.value,
                            }))
                          }
                          placeholder="Please describe your issue or question in detail..."
                          required
                        ></textarea>
                      </div>

                      <button type="submit" className="btn btn-primary">
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Resources Section */}
            {activeSection === "resources" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Helpful Resources</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">🏥 Veterinary Resources</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <a href="#" className="link">
                            Find Local Veterinarians
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Emergency Pet Care
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Vaccination Schedules
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Pet Insurance Guide
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">📋 Legal & Documentation</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <a href="#" className="link">
                            Pet Adoption Contracts
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Terms of Service
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Privacy Policy
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Community Guidelines
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">🎓 Training & Behavior</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <a href="#" className="link">
                            Basic Pet Training
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Behavioral Issues
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Socialization Tips
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Professional Trainers
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">🌐 External Links</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <a href="#" className="link">
                            Pet Care Organizations
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Animal Welfare Groups
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Pet Health Resources
                          </a>
                        </li>
                        <li>
                          <a href="#" className="link">
                            Community Forums
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;

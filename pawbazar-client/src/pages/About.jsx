import { Link } from "react-router-dom";

const About = () => {
  const teamMembers = [
    {
      name: "MD Fardous",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      bio: "Passionate about connecting pets with loving families. 5+ years in tech and animal welfare.",
      social: {
        linkedin: "https://www.linkedin.com/in/mdfardous",
        github: "https://github.com/mdfardous98",
      },
    },
    {
      name: "Sarah Ahmed",
      role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      bio: "Veterinarian turned operations expert. Ensures the best care standards for all our pets.",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Karim Rahman",
      role: "Community Manager",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      bio: "Building bridges between pet lovers. Former animal shelter coordinator with 8+ years experience.",
      social: {
        linkedin: "#",
        facebook: "#",
      },
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "PawBazar Founded",
      description:
        "Started with a simple mission: make pet adoption easier and safer for everyone.",
    },
    {
      year: "2024",
      title: "1,000+ Successful Adoptions",
      description:
        "Reached our first major milestone of helping 1,000 pets find loving homes.",
    },
    {
      year: "2025",
      title: "Nationwide Expansion",
      description:
        "Expanded our services to cover all major cities across Bangladesh.",
    },
    {
      year: "2026",
      title: "Community of 50,000+",
      description:
        "Built a thriving community of pet lovers, adopters, and advocates.",
    },
  ];

  const values = [
    {
      icon: "❤️",
      title: "Compassion First",
      description:
        "Every decision we make is guided by what's best for the animals and their wellbeing.",
    },
    {
      icon: "🤝",
      title: "Trust & Safety",
      description:
        "We maintain the highest standards of safety and verification for all our users.",
    },
    {
      icon: "🌍",
      title: "Community Impact",
      description:
        "Building stronger communities through responsible pet ownership and care.",
    },
    {
      icon: "💡",
      title: "Innovation",
      description:
        "Continuously improving our platform to better serve pets and their families.",
    },
  ];

  const stats = [
    { number: "15,000+", label: "Pets Helped" },
    { number: "50,000+", label: "Happy Families" },
    { number: "200+", label: "Partner Shelters" },
    { number: "98%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">About PawBazar</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              We're on a mission to create a world where every pet has a loving
              home and every family finds their perfect companion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pets-supplies" className="btn btn-primary btn-lg">
                Start Adopting
              </Link>
              <Link to="/help" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            {stats.map((stat, index) => (
              <div key={index} className="stat text-center">
                <div className="stat-value text-primary">{stat.number}</div>
                <div className="stat-title">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Happy pets"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <p className="text-lg">
                  PawBazar was born from a simple observation: too many loving
                  pets were waiting in shelters while families struggled to find
                  the right companion for their homes.
                </p>
                <p>
                  Founded in 2023 by a team of animal lovers and tech
                  enthusiasts, we set out to bridge this gap using technology,
                  community, and a deep commitment to animal welfare.
                </p>
                <p>
                  Today, we're proud to be Bangladesh's leading platform for pet
                  adoption and supplies, having facilitated thousands of
                  successful adoptions and built a thriving community of pet
                  lovers.
                </p>
                <div className="flex gap-4">
                  <div className="stat">
                    <div className="stat-value text-2xl text-primary">2023</div>
                    <div className="stat-desc">Founded</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value text-2xl text-secondary">
                      15K+
                    </div>
                    <div className="stat-desc">Pets Helped</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="card-title justify-center mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-content font-bold">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-base-content/70">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <figure className="px-6 pt-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-full w-32 h-32 object-cover"
                  />
                </figure>
                <div className="card-body text-center">
                  <h3 className="card-title justify-center">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                  <p className="text-sm text-base-content/70 mb-4">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-3">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="btn btn-ghost btn-circle btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        className="btn btn-ghost btn-circle btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <div className="card bg-primary text-primary-content shadow-xl">
              <div className="card-body">
                <p className="text-xl leading-relaxed">
                  "To create a world where every pet finds a loving home and
                  every family discovers the joy of pet companionship through
                  safe, transparent, and compassionate connections."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you're looking to adopt, help a pet find a home, or support
            our community, there's a place for you at PawBazar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-primary btn-lg">
              Join Our Community
            </Link>
            <Link to="/add-listing" className="btn btn-outline btn-lg">
              List a Pet
            </Link>
            <Link to="/help" className="btn btn-ghost btn-lg">
              Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

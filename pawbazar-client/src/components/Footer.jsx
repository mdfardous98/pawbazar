import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <aside>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold">PawBazar</span>
        </div>
        <p className="max-w-xs">
          Your trusted platform for pet adoption and supplies. Connecting loving
          families with pets in need of homes.
        </p>
      </aside>

      <nav>
        <h6 className="footer-title">Services</h6>
        <Link to="/pets-supplies" className="link link-hover">
          Pet Adoption
        </Link>
        <Link to="/pets-supplies?category=food" className="link link-hover">
          Pet Supplies
        </Link>
        <Link to="/help" className="link link-hover">
          Pet Care
        </Link>
        <Link to="/" className="link link-hover">
          Community
        </Link>
      </nav>

      <nav>
        <h6 className="footer-title">Company</h6>
        <Link to="/about" className="link link-hover">
          About us
        </Link>
        <Link to="/help" className="link link-hover">
          Help & Support
        </Link>
        <a className="link link-hover">Privacy Policy</a>
        <a className="link link-hover">Terms of Service</a>
      </nav>

      <nav>
        <h6 className="footer-title">Social</h6>
        <div className="grid grid-flow-col gap-4">
          <a
            className="link link-hover"
            href="https://twitter.com/pawbazar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
          <a
            className="link link-hover"
            href="https://youtube.com/pawbazar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </a>
          <a
            className="link link-hover"
            href="https://facebook.com/pawbazar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
        </div>
      </nav>

      <div className="footer-center">
        <div className="text-center">
          <p>Copyright © 2026 - All rights reserved by PawBazar</p>
          <p className="text-sm opacity-70">
            Made with ❤️ for pets and their families
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

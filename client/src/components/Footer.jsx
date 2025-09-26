// src/components/Footer.jsx
export default function Footer() {
  return (

    <footer className="bg-[#2a3b1f] text-white py-10 px-6 border-t-4 border-[#ff9933]">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold">KisaanMitra</h2>
          <p className="mt-3 text-sm text-gray-200">
            Growing with nature. Sustainable solutions for a better tomorrow.
          </p>
        </div>

        {/* Quick Links */}
        <div >
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-200">
            
            <li><a href="#about" className="hover:text-[#ffdd66]">About</a></li>
            <li><a href="#gallery" className="hover:text-[#ffdd66]">Gallery</a></li>
            <li><a href="/login" className="hover:text-[#ffdd66]">Login</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-gray-200">
            <li>Email: support@kisaanmitra.in</li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: Bharat</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
          <form className="flex flex-col space-y-3">
            <input 
              type="email" 
              placeholder="Your email" 
              className="px-3 py-2 rounded-lg text-green-900 focus:outline-none"
            />
            <button className="bg-[#ff9933] text-green-900 px-4 py-2 rounded-lg hover:bg-[#ffb366] font-semibold">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-sm text-gray-300 mt-10 border-t border-white/10 pt-6">
        © {new Date().getFullYear()} KisaanMitra. All rights reserved.
      </div>
    </footer>
  );
}

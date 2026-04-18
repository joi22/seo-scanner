import StaticLayout from "@/components/StaticLayout";

export default function ContactPage() {
  return (
    <StaticLayout title="Contact Us">
      <p>Have questions about your SEO report or need help with custom optimization? We're here to help.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 not-prose">
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
              <textarea className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 min-h-[120px]" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">WhatsApp Support</h3>
            <p className="text-slate-600 mb-4">Chat directly with our experts for instant help.</p>
            <a href="https://wa.me/03082762326" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
            <p className="text-slate-600">support@shopifyseo.com</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Response Time</h3>
            <p className="text-slate-600">We typically respond within 24 business hours.</p>
          </div>
        </div>
      </div>
    </StaticLayout>
  );
}

import { useState } from "react";

export default function Appointment() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practiceArea: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your request! We will contact you within 24 hours.');
    setFormData({
      name: "",
      email: "",
      phone: "",
      practiceArea: "",
      message: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="appointment-bg text-white py-24" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-gold font-semibold mb-4" data-testid="text-appointment-subtitle">Book Appointment</p>
            <h2 className="font-serif text-4xl font-bold mb-6" data-testid="text-appointment-title">
              Request a Free Consultation
            </h2>
            <p className="text-gray-200 mb-8" data-testid="text-appointment-description">
              Our experienced attorneys are ready to discuss your case and provide expert legal advice. Fill out the form and we'll contact you within 24 hours.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4" data-testid="contact-phone">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:phone" data-width="24"></span>
                <div>
                  <h4 className="font-bold mb-1">Call Us</h4>
                  <p className="text-gray-300">3164-5456854</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" data-testid="contact-email">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:email" data-width="24"></span>
                <div>
                  <h4 className="font-bold mb-1">Email Us</h4>
                  <p className="text-gray-300">info@barristar.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" data-testid="contact-address">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:map-marker" data-width="24"></span>
                <div>
                  <h4 className="font-bold mb-1">Visit Us</h4>
                  <p className="text-gray-300">121 King Street, Melbourne, Australia</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg">
            <form className="space-y-4" onSubmit={handleSubmit} data-testid="form-appointment">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-gold text-gray-800"
                  data-testid="input-name"
                  required
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-gold text-gray-800"
                  data-testid="input-email"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-gold text-gray-800"
                  data-testid="input-phone"
                />
                <select 
                  name="practiceArea"
                  value={formData.practiceArea}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-gold text-gray-800"
                  data-testid="select-practice-area"
                >
                  <option value="">Select Practice Area</option>
                  <option value="family-law">Family Law</option>
                  <option value="criminal-defense">Criminal Defense</option>
                  <option value="business-law">Business Law</option>
                  <option value="personal-injury">Personal Injury</option>
                  <option value="real-estate-law">Real Estate Law</option>
                  <option value="estate-planning">Estate Planning</option>
                </select>
              </div>
              
              <textarea 
                name="message"
                placeholder="Your Message" 
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-gold text-gray-800"
                data-testid="textarea-message"
              ></textarea>
              
              <button 
                type="submit" 
                className="w-full bg-brand-blue text-white px-8 py-3 font-semibold hover:bg-opacity-90 transition-colors"
                data-testid="button-submit-request"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

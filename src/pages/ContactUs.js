import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      const userId = currentUser ? currentUser.uid : null;
      if (userId) {
        await setDoc(doc(db, 'contactus', userId), formData);
        alert('Contact data saved successfully!');
        // Reset form to fresh state after submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error('Error saving contact data:', error);
      alert('Failed to save contact data.');
    }
  };

  return (
    <div className="contactus-container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="contactus-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactUs;

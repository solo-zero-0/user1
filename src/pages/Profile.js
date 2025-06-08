import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Profile = ({ setUserName, setUserEmail }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    countryCode: '+1',
    phoneNumber: '',
    about: '',
    programmingLanguages: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load existing profile data from Firestore if user is logged in
    const fetchProfile = async () => {
      // Use UID from Firebase auth currentUser to fetch profile
      const currentUser = auth.currentUser;
      const userId = currentUser ? currentUser.uid : null;
      if (userId) {
        const docRef = doc(db, 'profiles', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
          setIsEditing(false);
          if (setUserName) setUserName(docSnap.data().name);
          if (setUserEmail) setUserEmail(docSnap.data().email);
          // Save email to localStorage for persistence
          localStorage.setItem('userEmail', docSnap.data().email);
        }
      }
    };
    fetchProfile();
  }, [setUserName, setUserEmail]);


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
      if (setUserName) setUserName(formData.name);
      if (setUserEmail) setUserEmail(formData.email);
      // Save profile data to Firestore using UID as document ID
      const currentUser = auth.currentUser;
      const userId = currentUser ? currentUser.uid : null;
      if (userId) {
        await setDoc(doc(db, 'profiles', userId), formData);
        alert('Profile data saved successfully!');
        setIsEditing(false);
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
      alert('Failed to save profile data.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isEditing) {
    return (
      <div className="profile-container">
        <h1>Profile Details</h1>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Gender:</strong> {formData.gender}</p>
        <p><strong>Phone Number:</strong> {formData.countryCode} {formData.phoneNumber}</p>
        <p><strong>Programming Languages Known:</strong> {formData.programmingLanguages}</p>
        <p><strong>About You:</strong> {formData.about}</p>
        <button onClick={handleEdit}>Edit</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
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
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Country Code:
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            required
          >
            <option value="+1">+1 (USA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+91">+91 (India)</option>
            <option value="+61">+61 (Australia)</option>
            <option value="+81">+81 (Japan)</option>
            <option value="+49">+49 (Germany)</option>
            <option value="+33">+33 (France)</option>
            <option value="+86">+86 (China)</option>
            <option value="+7">+7 (Russia)</option>
            <option value="+55">+55 (Brazil)</option>
          </select>
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter 10 digit phone number"
            pattern="^[0-9]{10}$"
            title="Phone number with exactly 10 digits"
            required
          />
        </label>
        <label>
          Programming Languages Known:
          <input
            type="text"
            name="programmingLanguages"
            value={formData.programmingLanguages}
            onChange={handleChange}
            placeholder="e.g. JavaScript, Python, Java"
          />
        </label>
        <label>
          About You:
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us a few words about yourself"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Profile;

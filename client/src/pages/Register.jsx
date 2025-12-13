
// aos 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import { Input } from "../components";
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos'; 
import 'aos/dist/aos.css'; 

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");

  // Format Pakistani phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Handle different input formats
    if (cleaned.startsWith('92')) {
      // Format: +92 3XX XXX XXXX
      const formatted = cleaned.replace(/^92(\d{3})(\d{3})(\d{4}).*/, '+92 $1 $2 $3');
      return formatted.length > 4 ? formatted : `+92 ${cleaned.slice(2)}`;
    } else if (cleaned.startsWith('3') && cleaned.length <= 10) {
      // Format: 03XX XXX XXXX
      const formatted = cleaned.replace(/^(\d{4})(\d{3})(\d{4}).*/, '$1 $2 $3');
      return `0${formatted}`;
    } else if (cleaned.startsWith('03')) {
      // Already starts with 03
      const formatted = cleaned.replace(/^(\d{4})(\d{3})(\d{4}).*/, '$1 $2 $3');
      return formatted;
    }
    
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setContact(formatted);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z]+$/.test(name)) {
      toast.error("Name must contain only alphabets");
      return;
    }

    if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
      toast.error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(city)) {
      toast.error("City must contain only alphabets and spaces");
      return;
    }

    // Pakistani phone number validation
    // Remove spaces and validate the cleaned number
    const cleanedContact = contact.replace(/\s+/g, '');
    const pakistaniPhonePattern = /^(\+92|92|0)?3[0-9]{9}$/;
    
    if (!pakistaniPhonePattern.test(cleanedContact)) {
      toast.error("Please enter a valid Pakistani phone number (e.g., +92 300 123 4567 or 0300 123 4567)");
      return;
    }

    // Validate specific Pakistani mobile network prefixes
    const mobilePrefix = cleanedContact.replace(/^(\+92|92|0)/, '').substring(0, 3);
    const validPrefixes = ['300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '330', '331', '332', '333', '334', '335', '336', '337', '338', '339', '340', '341', '342', '343', '344', '345', '346', '347', '348', '349'];
    
    if (!validPrefixes.includes(mobilePrefix)) {
      toast.error("Please enter a valid Pakistani mobile number with correct network prefix");
      return;
    }

    console.log(name, password, email, city, contact);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
        name,
        password,
        email,
        city,
        contact,
      });

      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({    duration: 1000, // Animation duration in milliseconds
      easing: 'ease-in-out', // Animation easing
      offset: 120, // Trigger animation before the element comes into view
      once: true });
  }, []);

  return (
    <div className='bg-gray-900'>
      <div className='container mx-auto px-6'>
        <form
          className='flex w-full h-screen justify-center items-center flex-col gap-5'
          onSubmit={onSubmit}
          data-aos="fade-up" // Add AOS animation
        >
          <h2 className='text-center text-4xl text-white font-bold'>Register</h2>

          <Input 
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength="4"
            maxLength="30"
            data-aos="zoom-in" // Add AOS animation
          />

          <Input 
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-aos="zoom-in" // Add AOS animation
          />

          <Input 
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-aos="zoom-in" // Add AOS animation
          />

          <Input 
            type="text"
            placeholder="City"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            minLength="4"
            maxLength="35"
            data-aos="zoom-in" // Add AOS animation
          />

          <Input 
            type="text"
            placeholder="Phone (e.g., +92 300 123 4567 or 0300 123 4567)"
            name="phone"
            value={contact}
            onChange={handlePhoneChange}
            maxLength="17"
            data-aos="zoom-in" // Add AOS animation
          />

          <Link to="/login" className='text-white opacity-85 font-medium' data-aos="fade-in">
            Already a registered user? <span className='underline text-blue-600 font-semibold'>Login</span>
          </Link>

          <button 
            type='submit' 
            className='btn px-5 py-2 font-normal outline-none border border-white rounded-sm text-xl text-white hover:text-black hover:bg-white transition-all ease-in w-full max-w-[750px]'
            data-aos="slide-up" // Add AOS animation
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      alert("Registration successful!");
      navigate('/login');
    } catch (error) {
      setErrors({ server: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#FFF2F2] p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#2D336B] mb-6 text-center">Create Account</h2>

        {errors.server && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {["firstName", "lastName", "phone", "email", "password", "confirmPassword"].map((field, index) => (
            <div className='mb-4' key={index}>
              <label htmlFor={field} className="block text-[#2D336B] font-semibold mb-2">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type={field.includes("password") ? "password" : "text"}
                id={field}
                name={field}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-[#7886C7] focus:outline-none ${errors[field] ? 'border-red-500' : ''}`}
                onChange={handleChange}
                required
              />
              {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2 text-lg bg-[#2D336B] text-white rounded-md shadow hover:bg-[#7886C7] transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  );
};

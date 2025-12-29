import React, { useState } from 'react';
import { registerLabour } from '../services/api';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    governmentId: '',
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [labourId, setLabourId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          photo: 'Please select an image file',
        }));
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: 'File size must be less than 5MB',
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
      if (errors.photo) {
        setErrors((prev) => ({
          ...prev,
          photo: '',
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setQrCode(null);
    setLabourId(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('phone', formData.phone.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('governmentId', formData.governmentId.trim());
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      const response = await registerLabour(submitData);

      if (response.success) {
        setQrCode(response.data.qrCode);
        setLabourId(response.data.labourId);
        setSuccessMessage('Labour registered successfully!');
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          governmentId: '',
          photo: null,
        });
        // Reset file input
        const fileInput = document.getElementById('photo');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to register labour. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Download QR code
  const downloadQR = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `labour-qr-${labourId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h1 className="page-title">Labour Registration</h1>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        {/* Phone Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email ID
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address (optional)"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        {/* Government ID Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="governmentId">
            Government ID Number
          </label>
          <input
            type="text"
            id="governmentId"
            name="governmentId"
            className="form-input"
            value={formData.governmentId}
            onChange={handleChange}
            placeholder="Enter government ID (optional)"
          />
        </div>

        {/* Photo Upload Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="photo">
            Photo
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="photo" className="file-input-label">
              {formData.photo ? formData.photo.name : 'Choose a photo (optional)'}
            </label>
          </div>
          {errors.photo && <div className="error-message">{errors.photo}</div>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register Labour'}
        </button>

        {/* Error Message */}
        {errors.submit && (
          <div className="error-message" style={{ marginTop: '10px', textAlign: 'center' }}>
            {errors.submit}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="success-message" style={{ marginTop: '10px', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}
      </form>

      {/* QR Code Display */}
      {qrCode && (
        <div className="qr-container">
          <h3 style={{ marginBottom: '15px', color: '#333' }}>QR Code Generated</h3>
          <img src={qrCode} alt="QR Code" className="qr-code" />
          <button onClick={downloadQR} className="download-btn">
            Download QR Code
          </button>
          {labourId && (
            <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
              Labour ID: {labourId}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;


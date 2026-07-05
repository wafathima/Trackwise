import { useState } from 'react';

export const useForm = (initialValues, validateConfig) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const tempErrors = {};
    Object.keys(validateConfig).forEach((key) => {
      const value = values[key];
      const rules = validateConfig[key];

      if (rules.required && !value) {
        tempErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        tempErrors[key] = rules.message || 'Invalid format';
      } else if (rules.minLength && value.length < rules.minLength) {
        tempErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least ${rules.minLength} characters`;
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  return { values, setValues, errors, handleChange, validate };
};
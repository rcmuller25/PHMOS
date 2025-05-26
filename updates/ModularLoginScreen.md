// ============================================================================
// LOGIN SCREEN - MODULAR ARCHITECTURE
// ============================================================================
// This file contains a complete modular login screen implementation with
// reusable components, comprehensive error handling, and security features.
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import './LoginScreen.css'; // CSS module for styling

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
// Centralized type definitions for better maintainability and type safety

interface LoginFormData {
  identifier: string; // Can be email or username
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  showPasswordToggle?: boolean;
  disabled?: boolean;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'link';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

interface ErrorMessageProps {
  message?: string;
  type?: 'error' | 'warning' | 'info';
  className?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
// Reusable validation and utility functions

/**
 * Validates email format using regex
 * @param email - Email string to validate
 * @returns boolean indicating if email is valid
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Determines if identifier is email or username based on format
 * @param identifier - User input string
 * @returns 'email' | 'username'
 */
const getIdentifierType = (identifier: string): 'email' | 'username' => {
  return identifier.includes('@') ? 'email' : 'username';
};

/**
 * Validates the login form data
 * @param formData - Current form state
 * @returns ValidationErrors object with any validation issues
 */
const validateLoginForm = (formData: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Validate identifier (email or username)
  if (!formData.identifier.trim()) {
    errors.identifier = 'Email or username is required';
  } else {
    const identifierType = getIdentifierType(formData.identifier);
    if (identifierType === 'email' && !isValidEmail(formData.identifier)) {
      errors.identifier = 'Please enter a valid email address';
    } else if (identifierType === 'username' && formData.identifier.length < 3) {
      errors.identifier = 'Username must be at least 3 characters long';
    }
  }
  
  // Validate password
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  return errors;
};

// ============================================================================
// INPUT FIELD COMPONENT
// ============================================================================
// Reusable input field with validation and password toggle functionality

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoComplete,
  showPasswordToggle = false,
  disabled = false,
}) => {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Determine actual input type (for password toggle)
  const inputType = showPasswordToggle && showPassword ? 'text' : type;
  
  /**
   * Handles input change events
   * DEBUG NOTE: If input values aren't updating, check this handler
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  /**
   * Toggles password visibility
   * DEBUG NOTE: If password toggle isn't working, check this function
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  return (
    <div className="input-field-container">
      <label htmlFor={id} className="input-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      
      <div className="input-wrapper">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`input-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
        />
        
        {/* Password visibility toggle button */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle-btn"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={disabled}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      
      {/* Error message display */}
      {error && (
        <ErrorMessage 
          message={error} 
          type="error" 
          className="input-error-message"
        />
      )}
    </div>
  );
};

// ============================================================================
// BUTTON COMPONENT
// ============================================================================
// Reusable button component with different variants and loading states

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}) => {
  /**
   * Handles button click events
   * DEBUG NOTE: If button clicks aren't registering, check this handler
   */
  const handleClick = () => {
    if (!disabled && !loading) {
      onClick();
    }
  };
  
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${className} ${loading ? 'btn-loading' : ''}`}
      aria-disabled={disabled || loading}
    >
      {loading && <span className="loading-spinner">⏳</span>}
      {children}
    </button>
  );
};

// ============================================================================
// CHECKBOX COMPONENT
// ============================================================================
// Reusable checkbox component for "Remember Me" functionality

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  /**
   * Handles checkbox change events
   * DEBUG NOTE: If checkbox state isn't updating, check this handler
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };
  
  return (
    <div className="checkbox-container">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={`checkbox ${disabled ? 'checkbox-disabled' : ''}`}
      />
      <label htmlFor={id} className="checkbox-label">
        {label}
      </label>
    </div>
  );
};

// ============================================================================
// ERROR MESSAGE COMPONENT
// ============================================================================
// Reusable error message component for consistent error display

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  className = '',
}) => {
  if (!message) return null;
  
  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };
  
  return (
    <div className={`error-message error-${type} ${className}`} role="alert">
      <span className="error-icon">{icons[type]}</span>
      <span className="error-text">{message}</span>
    </div>
  );
};

// ============================================================================
// MAIN LOGIN SCREEN COMPONENT
// ============================================================================
// Main component that orchestrates all sub-components

const LoginScreen: React.FC = () => {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  // All state variables with detailed comments for debugging
  
  /** Form data state - contains all user inputs */
  const [formData, setFormData] = useState<LoginFormData>({
    identifier: '', // Email or username input
    password: '',   // Password input
    rememberMe: false, // Remember me checkbox state
  });
  
  /** Validation errors state - contains field-specific error messages */
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  /** Loading state - indicates if login request is in progress */
  const [isLoading, setIsLoading] = useState(false);
  
  /** Real-time validation toggle - enables/disables live validation */
  const [enableRealTimeValidation, setEnableRealTimeValidation] = useState(false);
  
  // =========================================================================
  // FORM HANDLERS
  // =========================================================================
  
  /**
   * Updates identifier field and triggers real-time validation
   * DEBUG NOTE: If identifier field doesn't update, check this function
   */
  const handleIdentifierChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, identifier: value }));
    
    // Clear previous identifier errors
    if (errors.identifier) {
      setErrors(prev => ({ ...prev, identifier: undefined }));
    }
  }, [errors.identifier]);
  
  /**
   * Updates password field and triggers real-time validation
   * DEBUG NOTE: If password field doesn't update, check this function
   */
  const handlePasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
    
    // Clear previous password errors
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  }, [errors.password]);
  
  /**
   * Updates remember me checkbox state
   * DEBUG NOTE: If remember me doesn't toggle, check this function
   */
  const handleRememberMeChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  }, []);
  
  // =========================================================================
  // VALIDATION EFFECTS
  // =========================================================================
  
  /**
   * Real-time validation effect
   * Validates form data as user types (after first submission attempt)
   * DEBUG NOTE: If validation isn't working, check this effect
   */
  useEffect(() => {
    if (enableRealTimeValidation) {
      const validationErrors = validateLoginForm(formData);
      setErrors(validationErrors);
    }
  }, [formData, enableRealTimeValidation]);
  
  // =========================================================================
  // AUTHENTICATION HANDLERS
  // =========================================================================
  
  /**
   * Handles login form submission
   * DEBUG NOTE: If login isn't working, start debugging here
   */
  const handleLogin = async () => {
    console.log('🔍 DEBUG: Login attempt started', { formData });
    
    // Enable real-time validation after first submission
    setEnableRealTimeValidation(true);
    
    // Validate form data
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    
    // Stop if validation errors exist
    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ DEBUG: Validation failed', validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual authentication API call
      console.log('🚀 DEBUG: Calling authentication API');
      
      // Simulated API call - replace with your authentication logic
      const response = await simulateLoginAPI(formData);
      
      console.log('✅ DEBUG: Login successful', response);
      
      // TODO: Handle successful login (store tokens, redirect, etc.)
      handleLoginSuccess(response);
      
    } catch (error) {
      console.error('❌ DEBUG: Login failed', error);
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Simulated login API call - replace with your actual authentication
   * DEBUG NOTE: Replace this with your real authentication endpoint
   */
  const simulateLoginAPI = async (loginData: LoginFormData): Promise<any> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate authentication logic
    if (loginData.identifier === 'admin@example.com' && loginData.password === 'password123') {
      return {
        success: true,
        token: 'mock-jwt-token',
        user: { id: 1, email: loginData.identifier },
      };
    } else {
      throw new Error('Invalid credentials');
    }
  };
  
  /**
   * Handles successful login response
   * DEBUG NOTE: If post-login navigation isn't working, check this function
   */
  const handleLoginSuccess = (response: any) => {
    console.log('🎉 DEBUG: Processing successful login');
    
    // TODO: Store authentication token
    if (formData.rememberMe) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('rememberMe', 'true');
    } else {
      sessionStorage.setItem('authToken', response.token);
    }
    
    // TODO: Redirect to dashboard or main app
    // Example: navigate('/dashboard');
    alert('Login successful! (Replace with navigation)');
  };
  
  /**
   * Handles login errors
   * DEBUG NOTE: If error messages aren't showing, check this function
   */
  const handleLoginError = (error: any) => {
    console.log('🔥 DEBUG: Processing login error', error);
    
    // Set appropriate error message based on error type
    if (error.message.includes('Invalid credentials')) {
      setErrors(prev => ({
        ...prev,
        general: 'Invalid email/username or password. Please try again.',
      }));
    } else if (error.message.includes('Network')) {
      setErrors(prev => ({
        ...prev,
        general: 'Network error. Please check your connection and try again.',
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        general: 'Login failed. Please try again later.',
      }));
    }
  };
  
  /**
   * Handles forgot password navigation
   * DEBUG NOTE: If forgot password link doesn't work, check this function
   */
  const handleForgotPassword = () => {
    console.log('🔍 DEBUG: Forgot password clicked');
    
    // TODO: Navigate to forgot password screen
    // Example: navigate('/forgot-password');
    alert('Navigate to forgot password screen (implement navigation)');
  };
  
  // =========================================================================
  // FUTURE SECURITY ENHANCEMENTS
  // =========================================================================
  
  /**
   * Placeholder for Multi-Factor Authentication
   * TODO: Implement MFA after successful primary authentication
   */
  const handleMFAChallenge = async (mfaToken: string) => {
    console.log('🔐 DEBUG: MFA challenge initiated');
    
    // TODO: Implement MFA logic
    // - SMS verification
    // - TOTP authentication
    // - Biometric authentication
    // - Hardware token verification
  };
  
  /**
   * Placeholder for biometric authentication
   * TODO: Integrate fingerprint/face recognition
   */
  const handleBiometricAuth = async () => {
    console.log('👆 DEBUG: Biometric authentication requested');
    
    // TODO: Implement biometric authentication
    // - Check device capabilities
    // - Request biometric prompt
    // - Handle biometric result
  };
  
  // =========================================================================
  // RENDER
  // =========================================================================
  
  return (
    <div className="login-screen">
      <div className="login-container">
        {/* Header Section */}
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Please sign in to your account</p>
        </div>
        
        {/* General Error Message */}
        {errors.general && (
          <ErrorMessage 
            message={errors.general} 
            type="error" 
            className="general-error"
          />
        )}
        
        {/* Login Form */}
        <form 
          className="login-form" 
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* Email/Username Input */}
          <InputField
            id="identifier"
            label="Email or Username"
            type="text"
            value={formData.identifier}
            onChange={handleIdentifierChange}
            error={errors.identifier}
            placeholder="Enter your email or username"
            required
            autoComplete="username"
            disabled={isLoading}
          />
          
          {/* Password Input */}
          <InputField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handlePasswordChange}
            error={errors.password}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            showPasswordToggle
            disabled={isLoading}
          />
          
          {/* Remember Me and Forgot Password Row */}
          <div className="form-options">
            <Checkbox
              id="rememberMe"
              label="Remember me"
              checked={formData.rememberMe}
              onChange={handleRememberMeChange}
              disabled={isLoading}
            />
            
            <Button
              onClick={handleForgotPassword}
              variant="link"
              disabled={isLoading}
              className="forgot-password-link"
            >
              Forgot Password?
            </Button>
          </div>
          
          {/* Login Button */}
          <Button
            type="submit"
            onClick={handleLogin}
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
            className="login-button"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        {/* Future Security Features */}
        <div className="security-options">
          {/* TODO: Uncomment when implementing biometric auth */}
          {/* <Button
            onClick={handleBiometricAuth}
            variant="secondary"
            className="biometric-login-btn"
          >
            🔒 Sign in with Biometrics
          </Button> */}
        </div>
        
        {/* Footer/Additional Options */}
        <div className="login-footer">
          <p className="signup-prompt">
            Don't have an account?{' '}
            <Button
              onClick={() => console.log('Navigate to signup')}
              variant="link"
              className="signup-link"
            >
              Sign Up
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
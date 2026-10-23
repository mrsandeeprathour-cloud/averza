import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.phone.trim()
      )
    ) {
      newErrors.phone =
        "Please enter a valid 10-digit Indian phone number";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post(
        "/auth/register",
        {
          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          password:
            formData.password,
        }
      );

      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <p>AVERZA</p>

          <h1>Create Account</h1>

          <span>
            Create your account and start shopping
          </span>
        </div>

        {serverError && (
          <p className="server-error">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="register-first-name">
                First Name
              </label>

              <input
                id="register-first-name"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />

              {errors.firstName && (
                <p className="field-error">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="register-last-name">
                Last Name
              </label>

              <input
                id="register-last-name"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />

              {errors.lastName && (
                <p className="field-error">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

            {errors.email && (
              <p className="field-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-phone">
              Phone Number
            </label>

            <input
              id="register-phone"
              type="tel"
              name="phone"
              placeholder="10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
            />

            {errors.phone && (
              <p className="field-error">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <div className="password-input-wrapper">
              <input
                id="register-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="field-error">
                {errors.password}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">
              Confirm Password
            </label>

            <div className="password-input-wrapper">
              <input
                id="register-confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="field-error">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
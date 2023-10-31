import { FiUserPlus } from "react-icons/fi";
import { FiUserCheck } from "react-icons/fi";
import { UseAuthContext } from "@/pages/auth-provider/auth-provider";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const Registration: React.FC = () => {
  const { handleSignUp, registerUserToDatabase } = UseAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    retypePassword: "",
  });
  const router = useRouter();
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [strongPassword, setStrongPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "retypePassword") {
      if (value === formData.password) {
        setPasswordMatch(true);
      } else {
        setPasswordMatch(false);
      }
    }
    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
      setStrongPassword(passwordRegex.test(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.retypePassword) {
      console.log("Passwords do not match");
      return;
    }
    if (!strongPassword) {
      console.log("Password does not meet strength requirements");
      return;
    }

    Swal.fire({
      position: "center",
      icon: "success",
      title: "User registration successfull!",
      showConfirmButton: false,
      timer: 1500,
    });
    router.push("/components/auth/login");
    try {
      await handleSignUp(formData.email, formData.password, formData.name, "");

      registerUserToDatabase({
        name: formData.name,
        email: formData.email,
        image: "",
        role: "user",
        totalReport: 0,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error creating new user!",
      });
      console.error("Error signing up:", error);
    }
  };

  const handleBackLogin = () => {
    localStorage.removeItem("prev-path");
  };

  return (
    <div className="registration-page">
      <div className="w-full my-5 flex flex-col justify-center items-center">
        <h1 className="mb-5 text-2xl font-semibold flex items-center gap-2">
          Registration
          <span className="mt-0.5">
            <FiUserPlus />
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-96">
          <div className="form-group flex flex-col gap-2 w-full">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="border text-lg px-3 py-2 outline-blue-500 border-gray-500 rounded-none"
            />
          </div>
          <div className="form-group flex flex-col gap-2 w-full">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border text-lg px-3 py-2 outline-blue-500 border-gray-500 rounded-none"
            />
          </div>
          <div className="form-group flex flex-col gap-2 w-full">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="border text-lg px-3 py-2 outline-blue-500 border-gray-500 rounded-none"
            />
            {formData.password !== "" && (
              <span
                className={strongPassword ? "text-green-500" : "text-red-500"}
              >
                {strongPassword
                  ? "Password is strong and meets the requirements."
                  : "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long."}
              </span>
            )}
          </div>
          <div className="form-group flex flex-col gap-2 w-full">
            <label htmlFor="retypePassword">Retype Password</label>
            <input
              type="password"
              id="retypePassword"
              name="retypePassword"
              value={formData.retypePassword}
              onChange={handleInputChange}
              required
              className="border text-lg px-3 py-2 outline-blue-500 border-gray-500 rounded-none"
            />
            {formData.retypePassword !== "" && (
              <span
                className={passwordMatch ? "text-green-500" : "text-red-500"}
              >
                {passwordMatch
                  ? "Passwords match, you can continue."
                  : "Passwords do not match. Please check and correct any mistakes."}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 px-5 py-2 text-white font-semibold my-2 flex items-start justify-center gap-2"
            disabled={
              formData.password !== formData.retypePassword || !passwordMatch
            }
          >
            Submit
            <span className="text-lg mt-0.5">
              <FiUserCheck />
            </span>
          </button>
          <Link
            href="/components/auth/login"
            className="text-blue-500 border-b-2 border-transparent delay-100 hover:border-blue-500 w-fit"
            onClick={handleBackLogin}
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Registration;

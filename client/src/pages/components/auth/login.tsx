import { AiOutlineLock } from "react-icons/ai";
import { MdVpnKey } from "react-icons/md";
import { UseAuthContext } from "@/pages/auth-provider/auth-provider";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Login: React.FC = () => {
  const router = useRouter();
  const { handleSignIn } = UseAuthContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    router.push("/");
    handleSignIn(formData.email, formData.password);
  };

  return (
    <div className="login-page">
      <div className="w-full my-5 flex flex-col justify-center items-center">
        <h1 className="mb-5 text-2xl font-semibold flex items-center gap-2 text-gray-700">
          Login
          <span>
            <AiOutlineLock />
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="form-group flex flex-col gap-2 w-fit">
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
          <div className="form-group flex flex-col gap-2 w-fit">
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
          </div>
          <button
            type="submit"
            className="bg-blue-500 px-5 py-2 text-white font-semibold my-2 flex items-center justify-center gap-2"
          >
            Submit
            <span className="text-xl mt-0.5">
              <MdVpnKey />
            </span>
          </button>
          <Link
            href="/components/auth/register"
            className="text-blue-500 border-b-2 border-transparent delay-100 hover:border-blue-500 w-fit"
          >
            Create an account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;

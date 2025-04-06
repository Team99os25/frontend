"use client";

import Link from "next/link";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import axios from 'axios'
import { toast, Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "At least 8 characters").required("Required"),
  e_role: Yup.string().oneOf(["HR", "Employee"], "Select a valid role").required("Required"),
}).required();
type FormData = Yup.InferType<typeof validationSchema>;

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      router.push('/vibemeter');
    }
  }, [router]);

  const submitData = async (data: FormData) => {
    try {
      const AxiosResponse = await axios.post(
        "http://localhost:3000/api/user/signin",
        data,
        {
          validateStatus: (status) => {
            return status < 600;
          },
        })
      if (AxiosResponse.data.code == 0) {
        const userDetails = {
          email: data.email,
          role: data.e_role,
        };
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
        
        toast.success(AxiosResponse.data.message);
        router.push('/vibemeter');
      }
      else {
        toast.error(AxiosResponse.data.message);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50">
      <Toaster />
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(submitData)}>
        <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Sign In
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email", { required: "Email Address is required" })}
              aria-invalid={errors.email ? "true" : "false"}
              type="email"
              className="w-full mt-1 rounded-md border border-gray-300 p-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Your Role
            </label>
            <select
              {...register("e_role")}
              id="role"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HR">HR</option>
              <option value="Employee">Employee</option>
            </select>
            {errors.e_role && (
              <p className="mt-1 text-sm text-red-500">{errors.e_role.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input {...register('password', { required: "Password is required" })}
              className="w-full mt-1 rounded-md border border-gray-300 p-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Password"
              type="password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            onSubmit={handleSubmit((data) => console.log(data))}
            className="w-full mt-4 rounded-md bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </div>
      </form>
    </section>
  );
};

export default Login;

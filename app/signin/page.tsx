"use client";

import Link from "next/link";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import axios from 'axios'
import { toast, Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const validationSchema = Yup.object({
  employee_id: Yup.string().required("Employee ID is required"),
  password: Yup.string().required("Required"),
  role: Yup.string().oneOf(["hr", "employee"], "Select a valid role").required("Required"),
}).required();
type FormData = Yup.InferType<typeof validationSchema>;

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      employee_id: "",
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
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data,
        {
          validateStatus: (status) => {
            return status < 600;
          },
          withCredentials: true,
        })
        console.log(AxiosResponse)
        
      if (AxiosResponse.status == 200) {
        const userDetails = {
          employee_id: data.employee_id,
          role: data.role,
        };
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
        if(data.role == "employee") {
          toast.success(AxiosResponse.data.message);
          router.push('/vibemeter');
        }
        else {
          router.push('/hr-dashboard');
        }
      }
      else {
        toast.error(AxiosResponse.data.detail);
      }
    } catch (error) {
      console.log(error)
      toast.error("An error occurred during sign in");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e2337] via-[#2b3558] to-[#1e2337] flex items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">
            Welcome to Vibemeter
          </h1>
          <p className="mt-2 text-blue-100/80">
            Sign in to track and manage your vibes
          </p>
        </div>

        <form 
          onSubmit={handleSubmit(submitData)}
          className="bg-[#151823]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Employee ID
              </label>
              <input
                {...register("employee_id")}
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-blue-100 
                  placeholder:text-blue-100/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 
                  focus:border-transparent transition-all duration-200"
                placeholder="Enter your Employee ID"
                autoComplete="off"
              />
              {errors.employee_id && (
                <p className="mt-1 text-sm text-red-400">{errors.employee_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-blue-100 
                  focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
                  transition-all duration-200"
              >
                <option value="employee" className="bg-[#151823]">Employee</option>
                <option value="hr" className="bg-[#151823]">HR</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-blue-100 
                  placeholder:text-blue-100/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 
                  focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="px-8 h-12 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-lg
                  hover:from-blue-600 hover:to-blue-500 transition-all duration-300 rounded-xl
                  hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
              >
                Sign In
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
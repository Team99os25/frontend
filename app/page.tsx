"use client"
import EmployeeDashboard from "@/app/employee/page";
import Hero from "@/components/Hero";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    if(!localStorage.getItem("userDetails")) router.push("/HRLogin")
  },[])
  return (
    <>
      <Hero />
    </>
  );
}

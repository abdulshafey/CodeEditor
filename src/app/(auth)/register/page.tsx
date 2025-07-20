"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";
import Axios from "@/lib/Axios";

const formSchema = z
  .object({
    name: z.string({ message: "Name is required" }).min(3),
    email: z.string({ message: "Email is required" }).email().min(5).max(50),
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must have at least 8 Characters" })
      .regex(/[A-z]/, "Password must have  atleast One Uppercase")
      .regex(/[a-z]/, "Password must have atleast one Lowercase")
      .regex(/[0-9]/, "Password must have atleast one Number")
      .regex(/[@#$%^&*]/, "Password must have atleast one special Character"),
    confirmPassword: z.string({ message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password must be same",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();
  const router = useRouter();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
    try {
      setIsLoading(true);
      const response = await Axios.post("api/auth/register", payload);
      if (response.status === 201) {
        console.log(response);

        showToast(response.data.message, "success");
        form.reset();
        router.push("/login");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);

      showToast(error?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="lg:p-10 space-y-7">
      <h1 className="text-xl font-semibold text-center">Create Account</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-md mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Name"
                    {...field}
                    disabled={isLoading}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Email"
                    {...field}
                    disabled={isLoading}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Password"
                    {...field}
                    disabled={isLoading}
                    type="password"
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Confirm Password"
                    {...field}
                    disabled={isLoading}
                    type="password"
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full cursor-pointer"
          >
            {isLoading ? "Loading..." : "Create Account"}
          </Button>
        </form>
      </Form>

      <div className="max-w-md mx-auto">
        <p>
          Already have an account ?{" "}
          <Link href={"/login"} className="text-primary drop-shadow-md">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

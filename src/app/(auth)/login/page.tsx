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
import Link from "next/link";

const formSchema = z.object({
  email: z.string({ message: "Email is required" }).email().min(5).max(50),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must have at least 8 Characters" })
    .regex(/[A-z]/, "Password must have  atleast One Uppercase")
    .regex(/[a-z]/, "Password must have atleast one Lowercase")
    .regex(/[0-9]/, "Password must have atleast one Number")
    .regex(/[@#$%^&*]/, "Password must have atleast one special Character"),
});

const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  return (
    <div className="lg:p-10 space-y-7">
      <h1 className="text-xl font-semibold text-center">Login</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-md mx-auto"
        >
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
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full cursor-pointer"
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>

      <div className="max-w-md mx-auto">
        <p>
          Don&apos;t have an account ?
          <Link href={"/register"} className="text-primary drop-shadow-md ml-1">
            Create Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { authApi, setAuthToken } from "@/lib/api";

type SignInForm = { email: string; password: string };

export default function SigninForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInForm>({ defaultValues: { email: "", password: "" } });

    async function onSubmit(values: SignInForm) {
        try {
            const response = await authApi.signIn(values);
            const token = response.data?.data?.access_token;
            if (!token) throw new Error("No access token returned");
            setAuthToken(token);
            router.replace("/");
            router.refresh();
        } catch {
            setError("root", {
                message: "Invalid credentials. Please try again.",
            });
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-5 py-10 text-[#20221f]">
            <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[#e5e3dc] bg-[#fbfaf7] shadow-xl shadow-black/5 md:grid-cols-2">
                <div className="p-8 md:p-11">
                    <div className="mb-10 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#20221f] text-[#e7cfa0]">
                            <Sparkles size={19} />
                        </div>
                        <div>
                            <p className="font-serif text-[21px] tracking-wide">
                                Al Qasr
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a8b84]">
                                Admin studio
                            </p>
                        </div>
                    </div>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#ac8954]">
                        Welcome back
                    </p>
                    <h1 className="font-serif text-3xl tracking-[-0.02em]">
                        Sign in to your studio
                    </h1>
                    <p className="mt-2 text-sm text-[#85867f]">
                        Manage your fragrance catalog, products and categories.
                    </p>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="mt-8 space-y-4"
                    >
                        <label className="block text-xs font-medium">
                            Email
                            <span
                                className={`mt-2 flex items-center gap-2 rounded-xl border bg-white px-3 ${errors.email ? "border-[#d8b3ab]" : "border-[#e2e0d8] focus-within:border-[#b28b58]"}`}
                            >
                                <Mail size={15} className="text-[#aaa9a2]" />
                                <input
                                    type="email"
                                    placeholder="admin@alqasr.com"
                                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#aaa9a2]"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message:
                                                "Enter a valid email address",
                                        },
                                    })}
                                />
                            </span>
                            {errors.email && (
                                <p className="mt-1.5 text-[11px] text-[#a56b6b]">
                                    {errors.email.message}
                                </p>
                            )}
                        </label>
                        <label className="block text-xs font-medium">
                            Password
                            <span
                                className={`mt-2 flex items-center gap-2 rounded-xl border bg-white px-3 ${errors.password ? "border-[#d8b3ab]" : "border-[#e2e0d8] focus-within:border-[#b28b58]"}`}
                            >
                                <Lock size={15} className="text-[#aaa9a2]" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#aaa9a2]"
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                />
                            </span>
                            {errors.password && (
                                <p className="mt-1.5 text-[11px] text-[#a56b6b]">
                                    {errors.password.message}
                                </p>
                            )}
                        </label>
                        {errors.root && (
                            <p className="rounded-xl bg-[#f4e7e3] px-3 py-3 text-xs text-[#a56b6b]">
                                {errors.root.message}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#20221f] px-4 py-3 text-xs font-medium text-white shadow-lg shadow-black/10 transition hover:bg-[#363833] disabled:opacity-60"
                        >
                            {isSubmitting && (
                                <Loader2 size={15} className="animate-spin" />
                            )}
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>
                <div className="hidden flex-col justify-between bg-[#20221f] p-11 text-[#f3f0e9] md:flex">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#c7b899]">
                        Atelier of fragrance
                    </p>
                    <div>
                        <Sparkles className="mb-5 text-[#e7cfa0]" size={22} />
                        <p className="font-serif text-2xl leading-snug tracking-[-0.01em]">
                            Every great house is built on a quiet craft.
                        </p>
                        <p className="mt-3 text-xs text-[#9a9b94]">
                            Curate perfumes, attars and gift collections from a
                            single studio.
                        </p>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#6f7169]">
                        Al Qasr — Admin Studio
                    </p>
                </div>
            </div>
        </main>
    );
}

import Image from 'next/image'
import { signup } from '../login/actions'
import Link from 'next/link'

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-block text-white px-6 py-3 mb-4 transform -rotate-1 ">
                        <Image src='/logo.png' alt="Logo" width={100} height={100} />
                    </div>
                    <p className="text-2xl text-black font-semibold uppercase tracking-wider">
                        PREPAPP
                    </p>
                    <p className="text-gray-600 text-sm">
                        Professional Learning Platform
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-xl border-l-4 border-black overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                        <h2 className="text-xl font-bold text-gray-900">
                            Create your account
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Join PrepApp and start your learning journey today.
                        </p>
                    </div>
                    {/* Display Name Field */}

                    <div className="px-6 py-6">
                        <form className="space-y-5">


                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
                                >
                                    DU Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="Create a strong password"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Password must be at least 8 characters long
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="Confirm your password"
                                />
                            </div>

                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mt-1"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                    I agree to the{' '}
                                    <Link href="/terms" className="font-medium text-black hover:text-gray-700 underline decoration-2 underline-offset-2">
                                        Terms of Service
                                    </Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" className="font-medium text-black hover:text-gray-700 underline decoration-2 underline-offset-2">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <button
                                formAction={signup}
                                className="w-full py-3 px-4 bg-black text-white font-bold uppercase tracking-wide rounded-md hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500 font-medium">
                                        Already have an account?
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <Link
                                href="/login"
                                className="inline-block font-medium text-black hover:text-gray-700 underline decoration-2 underline-offset-2"
                            >
                                Sign in to your account →
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="flex justify-center space-x-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-gray-700 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/support" className="hover:text-gray-700 transition-colors">
                            Support
                        </Link>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                        © 2025 PrepApp. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

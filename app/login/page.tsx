import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brutalist Header */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 transform -skew-x-12">
            LOGIN
          </h1>
          <div className="w-20 h-1 bg-white mx-auto transform rotate-3"></div>
        </div>

        {/* Login Form Container */}
        <div className="bg-white text-black p-8 border-8 border-black transform rotate-1 shadow-[16px_16px_0px_0px_#000000]">
          <form className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-xl font-black uppercase tracking-wider"
              >
                EMAIL
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="w-full px-4 py-4 text-lg font-bold border-4 border-black bg-yellow-300 placeholder-black focus:bg-yellow-400 focus:outline-none focus:border-red-500 transform -skew-x-1"
                placeholder="YOUR@EMAIL.COM"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-xl font-black uppercase tracking-wider"
              >
                PASSWORD
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="w-full px-4 py-4 text-lg font-bold border-4 border-black bg-cyan-300 placeholder-black focus:bg-cyan-400 focus:outline-none focus:border-red-500 transform skew-x-1"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button 
              formAction={login}
              className="w-full py-6 text-2xl font-black uppercase tracking-widest bg-red-500 border-4 border-black text-white hover:bg-red-600 transform -rotate-1 hover:rotate-0 transition-all duration-200 shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] active:shadow-none active:transform active:translate-x-2 active:translate-y-2"
            >
              ENTER
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t-4 border-black">
            <div className="flex justify-between items-center">
              <a 
                href="/signup" 
                className="text-lg font-black uppercase underline decoration-4 decoration-yellow-400 hover:decoration-red-500 transform hover:skew-x-12 transition-all"
              >
                SIGN UP
              </a>
              <a 
                href="/forgot" 
                className="text-lg font-black uppercase underline decoration-4 decoration-cyan-400 hover:decoration-red-500 transform hover:-skew-x-12 transition-all"
              >
                FORGOT?
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-4">
          <div className="w-4 h-4 bg-yellow-400 transform rotate-45"></div>
          <div className="w-4 h-4 bg-cyan-400 transform -rotate-45"></div>
          <div className="w-4 h-4 bg-red-500 transform rotate-45"></div>
        </div>
      </div>
    </div>
  )
}
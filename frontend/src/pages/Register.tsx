
function Register() {
  return (
    <div className="container p-5 h-screen">
      <div className="flex flex-col h-full">
        <div className="pt-10">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
          <p className="text-center my-3">By continuing, you agree to our <span className="text-blue-400">User Agreement</span> and acknowledge that you understand the <span className="text-blue-400">Privacy Policy</span>.</p>
          <div className="flex flex-col mt-4 gap-y-2">
            <div className="flex items-center p-2 rounded-full bg-white color text-slate-800">
              <div className="w-5 h-5 bg-red-400 rounded-full"></div>
              <p className="ms-3">Continue as Michael</p>
              <div className="ms-auto w-5 h-5 bg-red-400 rounded-full"></div>
            </div>
            <div className="flex items-center p-2 rounded-full bg-white color text-slate-800">
              <div className="w-5 h-5 bg-blue-400 rounded-full"></div>
              <p className="ms-[25%]">Continue With Apple</p>
            </div>
          </div>
          <div className="divider my-3">OR</div>
          <input type="email" placeholder="Email*" className="bg-[#2A3236] p-3.5 border-0 outline-0 rounded-2xl w-full"/>
          <p className="mt-4">Already a redditor? <span className="text-blue-400">Log in</span></p>
        </div>
        <button className="mt-auto text-center w-full bg-[#2A3236] py-2.5 rounded-full">Continue</button>
      </div>
    </div>
  )
}

export default Register;
import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react"
import { Children, useState } from "react";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false)
  const { data: session } = useSession()
  if (!session) {
    return (
      <div className='bg-blue-900 w-screen h-screen flex items-center'>
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white text-black font-semibold p-2 px-4 rounded-lg"> Login com Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 min-h-screen">
      <div className="block md:hidden">
      <button onClick={ev => setShowNav(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>

      </button>
      </div>
      <div className=" flex">
        <Nav show={showNav}/>
        <div className="bg-white text-black flex-grow mt-2 mb-2 mr-2 rounded-lg p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

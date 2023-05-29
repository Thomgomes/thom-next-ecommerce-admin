import Nav from "@/components/Nav";
import Layout from "@/components/Layout";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const {data: session} = useSession()

  return <Layout>
    <div className="text-blue-900">
      <h2>
      Olá, <b>{session?.user?.name}</b>
      </h2>
      {/* <div>
         <Image src={session?.user?.image} width={100} height={100} />
      </div> */}
    </div>
  </Layout>
}

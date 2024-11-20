import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function SigninLayout({ children }: ChatLayoutProps) {
  if (cookies().get('token') !== undefined) {
    redirect("/chat")
  }

  return <div>{children}</div>
}

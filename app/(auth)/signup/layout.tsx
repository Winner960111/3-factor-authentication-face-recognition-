

interface ChatLayoutProps {
  children: React.ReactNode
}


export default async function SignupLayout({ children }: ChatLayoutProps) {
  return (
    <div>
      {children}
    </div>
  )
}

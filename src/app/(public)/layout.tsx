import GlobalHeader from '@/components/global-header'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GlobalHeader />
      <main className="pt-24 md:pt-28">{children}</main>
    </>
  )
}

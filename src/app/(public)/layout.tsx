import GlobalHeader from '@/components/global-header'
import { CartProvider } from '@/context/cart-context'
import { CartUIProvider } from '@/context/cart-ui-context'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <CartUIProvider>
        <GlobalHeader />
        <main className="pt-24 md:pt-28">{children}</main>
      </CartUIProvider>
    </CartProvider>
  )
}

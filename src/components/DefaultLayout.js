import Header from '@/components/AppHeader'
import Footer from '@/components/AppFooter'

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-1">{children}</main>
      <Footer />
    </>
  )
}

export default Layout

export function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
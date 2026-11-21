import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PolicyDocument from '../../components/common/PolicyDocument';
import { useCmsPages } from '../../utils/cmsStorage';
import { FONTS } from '../../constant/style';

export default function PolicyPage({ slug }: { slug: string }) {
  const { pages, isLoading, isError, reload } = useCmsPages();
  const page = pages[slug];
  const contentName = slug === 'payment' ? 'payment information' : 'policy';
  return <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: FONTS.main }}>
    <Navbar />
    <main className="flex-1">
      {isLoading ? <p role="status" className="p-12 text-center">Loading {contentName}...</p>
        : isError ? <div role="alert" className="p-12 text-center">
          <p>We couldn’t load this {contentName}. Please try again.</p>
          <button type="button" className="mt-4 underline cursor-pointer" onClick={() => void reload()}>Retry</button>
        </div>
        : !page?.isActive ? <p className="p-12 text-center">This {contentName} is currently unavailable. Please contact our support team.</p>
        : <PolicyDocument page={page} />}
    </main>
    <Footer />
  </div>;
}

import Image from "next/image";
import GolbalApi from "./_utils/GlobalApi";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";
import SliderDesktopWrapper from "./_components/DesktopsliderWapper";
import SliderWrapper from "./_components/SliderWrapper";
import MobileSearchSection from "./_components/MobileSearchSection";

export default async function Home() {
  let sliderData = [];
  let categoryData = [];
  let sliderDestopData = [];

  try {
    sliderDestopData = await GolbalApi.getSlidersDesktop();
    sliderData = await GolbalApi.getSliders();
    categoryData = await GolbalApi.getCategoryList();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const productList = await GolbalApi.getAllProducts();

  return (
    <div className="relative">
      <div className="lg:px-12 mb-4 px-3 relative z-10">
        <SliderWrapper SliderList={sliderData} />
      </div>
    
      <div className="lg:px-12 mb-4 px-3 relative z-10">
        <SliderDesktopWrapper SliderDesktopList={sliderDestopData}/>
      </div>

      <div className="lg:px-12 relative z-10">
        <CategoryList CategoryList={categoryData} />
      </div>

      <MobileSearchSection />
      
      <div className="lg:px-12 relative z-10">
        <ProductList products={productList} />
      </div>

      <div className="lg:px-12 px-3 mb-5 relative z-10">
        <Image
          src="/banner.png"
          alt="banner"
          width={1920}
          height={500}
          sizes="(max-width: 1024px) 100vw, 1920px"
          className="object-cover rounded-lg lg:max-h-[300px]"
        />
      </div>

      <div className="relative z-10">
        <Footer/>
      </div>
    </div>
  );
}
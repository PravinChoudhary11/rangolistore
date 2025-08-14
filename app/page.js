import Image from "next/image";
import GolbalApi from "./_utils/GlobalApi";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";
import SliderDesktopWrapper from "./_components/DesktopsliderWapper";
import SliderWrapper from "./_components/SliderWrapper";

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
    <>

      {/* Slider - Full Width with Defined Height */}
      <div className=" lg:px-12 mb-4 px-3">
        <SliderWrapper SliderList={sliderData} />
      </div>
      {/* DecstopSlider  */}
      <div className=" lg:px-12 mb-4 px-3">
        <SliderDesktopWrapper SliderDesktopList={sliderDestopData}/>
      </div>
      {/* Category List Container */}
      <div className=" lg:px-12">
        <CategoryList CategoryList={categoryData} />
      </div>

      {/* Product List - Container for Alignment */}
      <div className=" lg:px-12 ">
        <ProductList products={productList} />
      </div>

      {/* Full-Width Banner with Responsive Height */}
      <div className="lg:px-12 px-3 mb-5 ">
     <Image
      src="/banner.png"
      alt="banner"
      width={1920}
      height={500}
      sizes="(max-width: 1024px) 100vw, 1920px"
      className="object-cover rounded-lg lg:max-h-[300px]"
    />
    </div>
      {/* Footer  for mobile*/}
      <div>
        <Footer/>
      </div>
    </>
  );
}

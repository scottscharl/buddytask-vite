import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow w-full max-w-4xl px-4 py-6 mx-auto">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;

import React from "react";

const SocialLinks: React.FC = () => {
  return (
    <div className="flex justify-around mt-5">
      <a
        href="https://www.facebook.com/aymenpromotionimmobiliere/?locale=fr_FR"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex justify-center items-center bg-[#F7C66A] rounded-full hover:bg-white transition-colors group"
      >
        <i className="fa-brands fa-facebook-f text-white group-hover:text-[#031B17] text-xl"></i>
      </a>
      <a
        href="https://www.instagram.com/aymenpromotion/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex justify-center items-center bg-[#F7C66A] rounded-full hover:bg-white transition-colors group"
      >
        <i className="fa-brands fa-instagram text-white group-hover:text-[#031B17] text-xl"></i>
      </a>
      <a
        href="https://www.linkedin.com/company/aymen-promotion-immobiliere/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex justify-center items-center bg-[#F7C66A] rounded-full hover:bg-white transition-colors group"
      >
        <i className="fa-brands fa-linkedin-in text-white group-hover:text-[#031B17] text-xl"></i>
      </a>
      <a
        href="https://www.youtube.com/@aymenpromotionimmobiliere6948"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex justify-center items-center bg-[#F7C66A] rounded-full hover:bg-white transition-colors group"
      >
        <i className="fa-brands fa-youtube text-white group-hover:text-[#031B17] text-xl"></i>
      </a>
      <a
        href="https://www.tiktok.com/@aymenpromotionimmo"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex justify-center items-center bg-[#F7C66A] rounded-full hover:bg-white transition-colors group"
      >
        <i className="fa-brands fa-tiktok text-white group-hover:text-[#031B17] text-xl"></i>
      </a>
    </div>
  );
};

export default SocialLinks;

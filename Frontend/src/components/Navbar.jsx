import React, { useState } from "react";
import CardNav from "./CardNav";
import logo from "../assets/PrismLogo-dark-removebg.png";
import robot from "../assets/robot.png";
import upload from "../assets/upload.png";
import magnifyingGlass from "../assets/magnifying-Glass.png";
import vault from "../assets/vault.png";
import { DraggableCardDemo } from "@/components/DraggableCard";

const Navbar = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleArgusChat = () => setIsChatVisible((s) => !s);

  const items = [
    {
      label: "Import",
      bgColor: "rgba(13, 7, 22, 0.7)",
      textColor: "#fff",
      //   links: [
      //     { label: "Company", ariaLabel: "About Company" },
      //     { label: "Careers", ariaLabel: "About Careers" },
      //   ],
      imageSrc: upload,
      href: "/import",
    },
    {
      label: "Vault",
      bgColor: "rgba(23, 13, 39, 0.7)",
      textColor: "#fff",
      //   links: [
      //     { label: "Featured", ariaLabel: "Featured Projects" },
      //     { label: "Case Studies", ariaLabel: "Project Case Studies" },
      //   ],
      imageSrc: vault,
      href: "/vault",
    },
    {
      label: "Argus",
      bgColor: "rgba(39, 30, 55, 0.7)",
      textColor: "#fff",
      //   links: [
      //     { label: "Email", ariaLabel: "Email us" },
      //     { label: "Twitter", ariaLabel: "Twitter" },
      //     { label: "LinkedIn", ariaLabel: "LinkedIn" },
      //   ],
      imageSrc: robot,
    },
  ];

  return (
    <>
      {isChatVisible && (
        <DraggableCardDemo
          isVisible={isChatVisible}
          toggleVisibility={toggleArgusChat}
        />
      )}

      <div className="fixed top-0 left-0 right-0 z-50 ">
        <CardNav
          logo={logo}
          logoAlt="Company Logo"
          items={items}
          baseColor="rgba(255, 255, 255, 0.1)"
          menuColor="#ffff"
          buttonBgColor="#111"
          buttonTextColor="#fff"
          ease="power3.out"
          // className="top-1"
          onItemClick={(item) => {
            if (item.label === "Argus") {
              toggleArgusChat();
            } else if (item.href) {
              // fallback navigation (if you want to handle in JS instead of anchor)
              // window.location.href = item.href;
            }
          }}
        />
      </div>
    </>
  );
};

export default Navbar;

import CardNav from "./CardNav";
import logo from "../assets/PrismLogo-dark-removebg.png";

const Navbar = () => {
  const items = [
    {
      label: "About",
      bgColor: "rgba(13, 7, 22, 0.7)",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company" },
        { label: "Careers", ariaLabel: "About Careers" },
      ],
    },
    {
      label: "Projects",
      bgColor: "rgba(23, 13, 39, 0.7)",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", ariaLabel: "Project Case Studies" },
      ],
    },
    {
      label: "Contact",
      bgColor: "rgba(39, 30, 55, 0.7)",
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" },
      ],
    },
  ];

  return (
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
    />
  );
};

export default Navbar;

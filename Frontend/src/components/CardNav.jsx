import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
// use your own icon import if react-icons is not available
import { GoArrowUpRight } from "react-icons/go";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import ButtonWrapper from "./ButtonWrapper";
// import { RippleButton } from "@/components/magicui/ripple-button";
import GlareHover from "./GlareHover";
import FadeContent from "./FadeContent";
import { ThemeTogglerButton } from "./animate-ui/components/buttons/theme-toggler";

const CardNav = ({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
  onItemClick = () => {},
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1"
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[99] top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${
          isExpanded ? "open" : ""
        } block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <div
            className={`hamburger-menu ${
              isHamburgerOpen ? "open" : ""
            } group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2 md:order-none`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            style={{ color: menuColor || "#000" }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""
              } group-hover:opacity-75`}
            />
          </div>

          <Link
            to="/"
            className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none"
          >
            <img src={logo} alt={logoAlt} className="logo h-[28px]" />
          </Link>

          {/* <div className="flex gap-1">
            <ThemeTogglerButton /> */}
          <FadeContent
            blur={true}
            duration={1500}
            easing="ease-out"
            initialOpacity={0}
          >
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  // className="card-nav-cta-button hidden md:inline-flex items-center justify-center border-0 rounded-[calc(0.75rem-0.2rem)] px-4 h-full font-medium cursor-pointer transition-colors duration-300"
                  style={{
                    //   backgroundColor: buttonBgColor,
                    color: buttonTextColor,
                  }}
                >
                  <GlareHover
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                  >
                    Sign In
                  </GlareHover>
                </button>
                {/* <ButtonWrapper /> */}
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div
                className="h-full items-center justify-center md:inline-flex "
                style={{
                  width: "40px",
                  height: "40px",
                }}
              >
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: "100%",
                        height: "100%",
                      },
                    },
                  }}
                />
              </div>
            </SignedIn>
          </FadeContent>
          {/* </div> */}
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
          } md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => {
            const isClickable = !item.href;
            const cardContent = (
              <div
                key={`${item.label}-${idx}`}
                className="nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%] overflow-hidden" // Added overflow-hidden
                ref={setCardRef(idx)}
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
                {...(isClickable
                  ? {
                      role: "button",
                      tabIndex: 0,
                      onClick: () => onItemClick(item),
                      onKeyDown: (e) => {
                        if (e.key === "Enter" || e.key === " ")
                          onItemClick(item);
                      },
                      style: {
                        cursor: "pointer",
                        ...{ backgroundColor: item.bgColor },
                        color: item.textColor,
                      },
                    }
                  : {})}
              >
                {/* The label, now relative to position text above the image */}
                <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px] relative z-10">
                  {item.label}
                </div>

                {/* === CONDITIONAL RENDERING LOGIC START === */}
                {item.imageSrc ? (
                  // If there's an image, render it as a styled background div
                  <div
                    className="absolute inset-0 z-0 opacity-50"
                    style={{
                      backgroundImage: `url(${item.imageSrc})`,
                      backgroundSize: "65%", // Or "contain"
                      backgroundPosition: "140% 100%", // Shows bottom-right 3/4
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                ) : (
                  // Otherwise, render the links as before
                  <div className="nav-card-links mt-auto flex flex-col gap-[2px] relative z-10">
                    {item.links?.map((lnk, i) => (
                      <a
                        key={`${lnk.label}-${i}`}
                        className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                        href={lnk.href}
                        aria-label={lnk.ariaLabel}
                      >
                        <GoArrowUpRight
                          className="nav-card-link-icon shrink-0"
                          aria-hidden="true"
                        />
                        {lnk.label}
                      </a>
                    ))}
                  </div>
                )}
                {/* === CONDITIONAL RENDERING LOGIC END === */}
              </div>
            );

            // If the item has an href, wrap the entire card in a link
            if (item.href) {
              return (
                <a
                  href={item.href}
                  key={`${item.label}-link-${idx}`}
                  className="contents"
                >
                  {cardContent}
                </a>
              );
            }

            return cardContent;
          })}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;

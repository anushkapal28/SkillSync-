import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";

const Navbar = () => {
  const isUserSignedIn = false;

  return (
    <nav
      className={cn(
        "sticky h-14 inset-x-0 top-0 z-30 border-b border-gray-200 bg-white/40 backdrop-blur-lg transition-all"
      )}
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          {/* Logo */}
          <Link
            href="/"
            className="flex z-40 justify-center items-center gap-1"
          >
            <Image
              src="/logo.png"
              alt="convo logo"
              width={250}
              height={50}
              quality={100}
              className="w-36 h-8"
            />
          </Link>

          <div className="flex gap-1 sm:gap-4 items-center">
            {/* Mobile menu when user not signed in */}
            {!isUserSignedIn ? (
              <MobileNav />
            ) : (
              <Link
                className={buttonVariants({
                  size: "sm",
                  className: "sm:hidden mr-3",
                })}
                href="/dashboard"
              >
                Dashboard
              </Link>
            )}

            {/* Desktop menu */}
            <div className="hidden items-center space-x-4 sm:flex">
              {!isUserSignedIn ? (
                <>
                  {/* Hover Dropdown for Our Services */}
                  <div className="relative group">
                    <button
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      Our Services
                    </button>

                    {/* Dropdown menu */}
                    <div className="absolute left-0 hidden group-hover:flex group-hover:flex-col bg-white text-gray-800 shadow-md rounded-md  min-w-[200px] z-50">
                      <Link
                        href="/services/aimentoring"
                        className="px-4 py-2 hover:bg-gray-100 transition"
                      >
                        AI-Powered Mentoring
                      </Link>
                      <Link
                        href="/services/resumeanalyser"
                        className="px-4 py-2 hover:bg-gray-100 transition"
                      >
                        Resume Analyser
                      </Link>
                      <Link
                        href="/services/careercounselling"
                        className="px-4 py-2 hover:bg-gray-100 transition"
                      >
                        Career Counselling
                      </Link>
                    </div>
                  </div>

                  {/* Sign in / Sign up */}
                  <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                  <Link
                    className={buttonVariants({
                      size: "sm",
                    })}
                    href="/sign-up"
                  >
                    Get started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className={buttonVariants({
                      size: "sm",
                    })}
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>

            {/* Mock user avatar (replace with Clerk, etc.) */}
            {isUserSignedIn && (
              <div className="bg-emerald-600 border-2 border-black shadow-lg rounded-full w-10 h-10"></div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;

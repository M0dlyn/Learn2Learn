import { Link, useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import Learn2LearnLogo from '@/components/learn2learn-logo';
import { Button } from "@/components/ui/button"
import { UserMenuContent } from '@/components/user-menu-content';
import { usePage, Link } from '@inertiajs/react';
import { type SharedData } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const { url } = usePage();
  const { auth } = usePage<SharedData>().props;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="border-b bg-[#B2DFDB] text-[#263238] dark:bg-[#00796B] dark:text-[#E0F2F1]">
      <div className="w-full flex h-16 p-4 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-25 w-25 items-center justify-center">
              <Learn2LearnLogo mode="auto" className="h-full w-auto object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-[#4DB6AC] ${
                isActive("/dashboard") ? "text-[#00796B] dark:text-[#B2DFDB]" : "text-[#263238]/80 dark:text-[#E0F2F1]/80"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/notepad"
              className={`text-sm font-medium transition-colors hover:text-[#4DB6AC] ${
                isActive("/notepad") ? "text-[#00796B] dark:text-[#B2DFDB]" : "text-[#263238]/80 dark:text-[#E0F2F1]/80"
              }`}
            >
              Notepad
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-[#263238] dark:text-[#E0F2F1]">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#E0F2F1] dark:bg-[#263238]">
              <div className="flex flex-col gap-6 py-6">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="flex h-25 w-25 items-center justify-center">
                    <Learn2LearnLogo mode="auto" className="h-full w-auto object-contain" />
                  </div>
                  <span className="text-xl font-bold text-[#00796B] dark:text-[#4DB6AC]">LearnSmart</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-[#4DB6AC] ${
                      isActive("/dashboard") ? "text-[#00796B] dark:text-[#B2DFDB]" : "text-[#263238]/80 dark:text-[#E0F2F1]/80"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/notepad"
                    className={`text-sm font-medium transition-colors hover:text-[#4DB6AC] ${
                      isActive("/notepad") ? "text-[#00796B] dark:text-[#B2DFDB]" : "text-[#263238]/80 dark:text-[#E0F2F1]/80"
                    }`}
                  >
                    Notepad
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                  <AvatarFallback>{auth.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#E0F2F1] text-[#263238] dark:bg-[#263238] dark:text-[#E0F2F1] border-gray-400" align="end" forceMount>
              <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
import { Brain, Menu } from "lucide-react"
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
    return url === path
  }

  return (
    <header className="border-b bg-primary">
      <div className="container flex h-16 p-6 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold text-foreground">LearnSmart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/dashboard") ? "text-accent" : "text-foreground/80"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/notepad"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/notepad") ? "text-accent" : "text-foreground/80"
              }`}
            >
              Notepad
            </Link>
            <Link
              href="/notes"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/notes") ? "text-accent" : "text-foreground/80"
              }`}
            >
              Notes
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-accent" />
                  <span className="text-xl font-bold">LearnSmart</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-accent ${
                      isActive("/dashboard") ? "text-accent" : "text-foreground/80"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/notepad"
                    className={`text-sm font-medium transition-colors hover:text-accent ${
                      isActive("/notepad") ? "text-accent" : "text-foreground/80"
                    }`}
                  >
                    Notepad
                  </Link>
                  <Link
                    href="/notes"
                    className={`text-sm font-medium transition-colors hover:text-accent ${
                      isActive("/notes") ? "text-accent" : "text-foreground/80"
                    }`}
                  >
                    Notes
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
                  <AvatarFallback>{auth.user.name[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

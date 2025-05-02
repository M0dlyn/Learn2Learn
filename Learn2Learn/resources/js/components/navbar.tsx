import { Link, useLocation } from "react-router-dom"
import { Brain, User, LogOut, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="border-b bg-primary">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold text-foreground">LearnSmart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/dashboard") ? "text-accent" : "text-foreground/80"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/notepad"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/notepad") ? "text-accent" : "text-foreground/80"
              }`}
            >
              Notepad
            </Link>
            <Link
              to="/notes"
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
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-accent" />
                  <span className="text-xl font-bold">LearnSmart</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-accent ${
                      isActive("/dashboard") ? "text-accent" : "text-foreground/80"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/notepad"
                    className={`text-sm font-medium transition-colors hover:text-accent ${
                      isActive("/notepad") ? "text-accent" : "text-foreground/80"
                    }`}
                  >
                    Notepad
                  </Link>
                  <Link
                    to="/notes"
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

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

// web/components/main-nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, Bell, User as UserIcon, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Locale, dictionary } from "@/i18n-config";
// No longer need to import AuthUser/ProfileUser types for props
import { createClient } from '@/lib/supabase/client';
import { useAuth } from "@/context/AuthContext"; // Import the custom hook

// Remove authUser and profile from props interface
interface MainNavProps {
  locale: Locale;
}

export default function MainNav({ locale }: MainNavProps) {
  // Get auth data from context
  const { authUser, profile } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const t = dictionary[locale];

  const isActive = (path: string) => {
    if (path === "") return pathname === `/${locale}`;
    return pathname === `/${locale}${path}`;
  };

  const navItems = [
    { href: "", label: t["home"] },
    { href: "/pet-life", label: t["pet-life"] },
    { href: "/community", label: t["community"] },
    { href: "/shop", label: t["shop"] },
    { href: "/discussion", label: t["discussion"] },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      router.push(`/${locale}`);
      router.refresh(); // Refresh is important here
    }
  };

  // Determine user display name and avatar initials (using data from context)
  const displayName = profile?.username || authUser?.email || "User";
  const avatarFallback = displayName?.substring(0, 2).toUpperCase() || "U";
  const avatarUrl = profile?.avatarUrl || authUser?.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
       <div className="container-custom flex h-16 items-center justify-between">
        {/* Left Side: Logo, Nav Links, Mobile Menu Trigger */}
        <div className="flex items-center">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
               {/* ... SheetTrigger ... */}
               <Button variant="ghost" size="icon" className="lg:hidden mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               {/* ... SheetContent header ... */}
               <Link href={`/${locale}`} className="flex items-center gap-2 mb-8" onClick={() => setIsOpen(false)}>
                 <Image src="/images/logo.png" alt="喵圈 Meow Circle" width={28} height={28} className="h-7 w-7" />
                 <span className="text-xl font-bold">喵圈</span>
               </Link>
              <div className="grid gap-2 py-6">
                 {/* ... Regular nav items ... */}
                 {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className={`flex w-full items-center py-2 text-lg font-semibold ${
                      isActive(item.href) ? "text-primary" : "text-primary/70"
                    }`}
                    onClick={() => setIsOpen(false)} // Close sheet on navigation
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Mobile Auth Links using context data */}
                <div className="border-t pt-4 mt-4 space-y-2">
                  {authUser ? (
                     <>
                        <Link href={`/${locale}/profile/${profile?.username || authUser.id}`} className="flex w-full items-center py-2 text-lg font-semibold text-primary/70" onClick={() => setIsOpen(false)}>個人資料</Link>
                        <Link href={`/${locale}/settings`} className="flex w-full items-center py-2 text-lg font-semibold text-primary/70" onClick={() => setIsOpen(false)}>設定</Link>
                        {/* Updated logout to also close the sheet */}
                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex w-full items-center py-2 text-lg font-semibold text-destructive">登出</button>
                     </>
                  ) : (
                    <>
                        <Link href={`/${locale}/login`} className="flex w-full items-center py-2 text-lg font-semibold text-primary/70" onClick={() => setIsOpen(false)}>{t["login"]}</Link>
                        <Link href={`/${locale}/register`} className="flex w-full items-center py-2 text-lg font-semibold text-primary/70" onClick={() => setIsOpen(false)}>{t["register"]}</Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo */}
          {/* ... Desktop logo ... */}
           <Link href={`/${locale}`} className="hidden lg:flex items-center gap-2 mr-6">
             <Image src="/images/logo.png" alt="喵圈 Meow Circle" width={28} height={28} className="h-7 w-7" />
             <span className="text-xl font-bold">喵圈</span>
           </Link>

          {/* Desktop Nav Links */}
           {/* ... Desktop nav items ... */}
           <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-primary/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Icons and Auth Buttons/Dropdown */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* ... Search Icon ... */}
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">{t["search"]}</span>
          </Button>
          {/* Conditional rendering for logged-in user icons using context data */}
          {authUser && (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </>
          )}

          {/* Auth Section: Conditional rendering based on context data */}
          {authUser ? (
            // --- Logged In State (using context data) ---
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 {/* ... Avatar Trigger ... */}
                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                 {/* ... Dropdown Content with links and logout ... */}
                 <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {authUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href={`/${locale}/profile`}>
                     <UserIcon className="mr-2 h-4 w-4" />
                     <span>個人資料</span>
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>設定</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>登出</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // --- Logged Out State ---
            <>
              <div className="hidden md:flex items-center gap-2">
                 <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/login`}>{t["login"]}</Link>
                 </Button>
                 <Button size="sm" asChild>
                  <Link href={`/${locale}/register`}>{t["register"]}</Link>
                 </Button>
               </div>
               <Button variant="ghost" size="icon" className="md:hidden" asChild>
                 <Link href={`/${locale}/login`}>
                    <UserIcon className="h-5 w-5" />
                    <span className="sr-only">Login/Register</span>
                 </Link>
               </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent,SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {Settings} from 'lucide-react';
import Learn2LearnLogo from '@/components/learn2learn-logo';

// Main navigation items - Dashboard removed
const mainNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

// Empty footer items - Repository and Documentation removed
const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-[#E0F2F1] text-[#263238] dark:bg-[#263238] dark:text-[#E0F2F1]">
            <SidebarHeader className="border-b border-[#4DB6AC]/20 dark:border-[#4DB6AC]/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <Learn2LearnLogo className="h-30 w-auto object-contain" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#E0F2F1] dark:bg-[#263238]">
                <NavMain items={mainNavItems} />
            </SidebarContent>
        </Sidebar>
    );
}
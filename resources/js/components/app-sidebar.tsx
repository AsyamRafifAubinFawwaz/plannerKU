import { Link, usePage } from '@inertiajs/react';
import { FiGrid, FiTarget, FiCalendar, FiBookOpen, FiGithub, FiUsers, FiSettings } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa6';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: FiGrid,
    },
    {
        title: 'Tugas',
        href: '/tasks',
        icon: FiTarget,
    },
    {
        title: 'Habit',
        href: '/habits',
        icon: FaFire,
    },
    {
        title: 'Kalender',
        href: '/events',
        icon: FiCalendar,
    },
    {
        title: 'Kolaborasi Tim',
        href: '/collaboration',
        icon: FiUsers,
    },
    {
        title: 'Pengaturan',
        href: '/settings/profile',
        icon: FiSettings,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FiGithub,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: FiBookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isPro = auth?.user?.isPro ?? false;
    const isMax = auth?.user?.isMax ?? false;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                
                {/* Upgrade Banner in Sidebar */}
                {!isMax && (
                    <div className="mt-8 px-4 group-data-[collapsible=icon]:hidden">
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/20 rounded-full blur-xl pointer-events-none" />
                            
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FaFire size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white leading-tight">
                                        {isPro ? 'Upgrade ke Max' : 'Upgrade ke Pro'}
                                    </h4>
                                    <p className="text-[11px] text-text-muted mt-0.5 leading-tight">
                                        {isPro ? 'Buka fitur kolaborasi & PDF' : 'Tugas tak terbatas & WA Notif'}
                                    </p>
                                </div>
                            </div>
                            <Link 
                                href="/pricing" 
                                className="w-full bg-primary text-white text-center py-2 rounded-lg text-[13px] font-bold border-b-[3px] border-b-[#C4500D] active:translate-y-[2px] active:border-b-[1px] transition-all relative z-10"
                            >
                                Lihat Paket
                            </Link>
                        </div>
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

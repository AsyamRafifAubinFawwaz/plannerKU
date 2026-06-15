import { Link } from '@inertiajs/react';

export default function AppLogo() {
    return (
        <div className="flex items-center justify-center w-full">
            {/* Logo untuk Sidebar Expanded */}
            <img 
                src="/image/logo-light.svg" 
                alt="PlannerKu" 
                className="h-10 w-auto object-contain group-data-[collapsible=icon]:hidden" 
            />
            
            {/* Logo untuk Sidebar Collapsed */}
            <img 
                src="/image/logo.svg" 
                alt="PlannerKu" 
                className="h-10 w-auto object-contain hidden group-data-[collapsible=icon]:block" 
            />
        </div>
    );
}

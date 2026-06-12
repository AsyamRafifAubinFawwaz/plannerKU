import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';
import { UpgradeModal } from '@/components/shared/upgrade-modal';
import { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const isPro = (auth as any)?.user?.isPro ?? false;
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [waEnabled, setWaEnabled] = useState(false);

    const handleWaToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isPro) {
            e.preventDefault();
            setUpgradeModalOpen(true);
            return;
        }
        setWaEnabled(e.target.checked);
    };

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been
                                                sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* WA Notification Bait */}
            <div className="space-y-6 mt-10 p-6 bg-surface border border-border rounded-xl">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0">
                        <FiMessageCircle size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1">Notifikasi WhatsApp Harian</h3>
                        <p className="text-sm text-muted-foreground mb-4">Dapatkan ringkasan tugas dan habit yang belum selesai setiap pagi pukul 07:00 WIB. Gratis uji coba fitur ini di paket Pro!</p>
                        
                        <div className="flex items-center gap-4">
                            <Label htmlFor="wa_toggle" className="flex items-center gap-3 cursor-pointer">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        id="wa_toggle" 
                                        className="sr-only peer"
                                        checked={waEnabled}
                                        onChange={handleWaToggle}
                                    />
                                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                                </div>
                                <span className="text-sm font-medium text-foreground">Aktifkan Notifikasi</span>
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteUser />

            <UpgradeModal 
                open={upgradeModalOpen} 
                onClose={() => setUpgradeModalOpen(false)} 
                title="Fitur Khusus Pro"
                description="Fitur Notifikasi WhatsApp otomatis tiap pagi hanya tersedia untuk paket Pro dan Max."
            />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};

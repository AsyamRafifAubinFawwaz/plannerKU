import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-white font-medium">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Masukkan nama lengkapmu"
                                    className="bg-bg border-border text-white rounded-xl px-4 py-6 focus-visible:ring-primary/50"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-white font-medium">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@contoh.com"
                                    className="bg-bg border-border text-white rounded-xl px-4 py-6 focus-visible:ring-primary/50"
                                />
                                <InputError message={errors.email} />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="wa_number" className="text-white font-medium">Nomor WhatsApp</Label>
                                <Input
                                    id="wa_number"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    autoComplete="tel"
                                    name="wa_number"
                                    placeholder="Contoh: 08123456789"
                                    className="bg-bg border-border text-white rounded-xl px-4 py-6 focus-visible:ring-primary/50"
                                />
                                <InputError message={errors.wa_number as string} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                                <div className="[&>div>input]:bg-bg [&>div>input]:border-border [&>div>input]:text-white [&>div>input]:rounded-xl [&>div>input]:px-4 [&>div>input]:py-6 [&>div>input]:focus-visible:ring-primary/50">
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Password"
                                        passwordrules={passwordRules}
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-white font-medium">
                                    Confirm password
                                </Label>
                                <div className="[&>div>input]:bg-bg [&>div>input]:border-border [&>div>input]:text-white [&>div>input]:rounded-xl [&>div>input]:px-4 [&>div>input]:py-6 [&>div>input]:focus-visible:ring-primary/50">
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={5}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm password"
                                        passwordrules={passwordRules}
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-4 w-full bg-primary text-white font-bold text-lg py-3 rounded-xl border-b-4 border-b-[#C4500D] active:translate-y-[2px] active:border-b-[2px] transition-all disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4 flex justify-center items-center gap-2"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Daftar Sekarang
                            </button>
                        </div>

                        <div className="text-center text-sm font-medium text-text-muted mt-2">
                            Sudah punya akun?{' '}
                            <Link href="/login" tabIndex={7} className="text-primary hover:text-white transition-colors">
                                Masuk di sini
                            </Link>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};

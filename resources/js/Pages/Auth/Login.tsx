import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import logoUrl from "../../../images/logo.png";
import illustrationUrl from "../../../images/illustration.svg";
import { FormInput, FormCheck } from "@/Components/Form";
import Button from "@/Components/Button";

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.store'));
    };

    return (
        <GuestLayout>
            <Head title="Giriş Yap - Otel Yönetimi - Otelinizi Kolayca Yönetin" />

            <div className="block grid-cols-2 gap-4 xl:grid">
                {/* BEGIN: Login Info */}
                <div className="flex-col hidden min-h-screen xl:flex">
                    <a href="" className="flex items-center pt-5 -intro-x">
                        <img
                            alt="Midone Tailwind HTML Admin Template"
                            className="w-44"
                            src={logoUrl}
                        />
                    </a>
                    <div className="my-auto">
                        <img
                            alt="Midone Tailwind HTML Admin Template"
                            className="w-1/2 -mt-16 -intro-x"
                            src={illustrationUrl}
                        />
                        <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                            Otelinizi Kolayca Yönetin
                        </div>
                        <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                            Hesabınıza giriş yapmak için birkaç tıklama <br/> daha yapmanız gerekiyor.
                        </div>
                    </div>
                </div>
                {/* END: Login Info */}
                {/* BEGIN: Login Form */}
                <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
                    <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                        <form onSubmit={submit}>
                        <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                            Giriş Yap
                        </h2>
                        <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                            Hesabınıza giriş yapmak için birkaç tıklama daha yapmanız gerekiyor.
                        </div>
                        <div className="mt-8 intro-x">
                            <FormInput
                                type="text"
                                className="block px-4 py-3 intro-x min-w-full xl:min-w-[350px]"
                                placeholder="E-posta"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && ( <div className="text-theme-6 mt-2 text-danger">{errors.email}</div>)}
                            <FormInput
                                type="password"
                                className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                                placeholder="Şifre"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && ( <div className="text-theme-6 mt-2 text-danger">{errors.password}</div>)}
                        </div>
                        <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                            <div className="flex items-center mr-auto">
                                <FormCheck.Input
                                    id="remember-me"
                                    type="checkbox"
                                    className="mr-2 border"
                                    name="remember"
                                />
                                <label
                                    className="cursor-pointer select-none"
                                    htmlFor="remember-me"
                                >
                                    Beni hatırla
                                </label>
                            </div>
                            <a href="">Şifremi Unutum?</a>
                        </div>
                        <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                            <Button
                                variant="primary"
                                className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                            >
                                Giriş Yap
                            </Button>
                            {/*<Button*/}
                            {/*    variant="outline-secondary"*/}
                            {/*    className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"*/}
                            {/*>*/}
                            {/*    Register*/}
                            {/*</Button>*/}
                        </div>
                        <div className="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
                            By signin up, you agree to our{" "}
                            <a className="text-primary dark:text-slate-200" href="">
                                Terms and Conditions
                            </a>{" "}
                            &{" "}
                            <a className="text-primary dark:text-slate-200" href="">
                                Privacy Policy
                            </a>
                        </div>
                    </form>
                    </div>
                </div>
                {/* END: Login Form */}
            </div>
        </GuestLayout>
    );
}


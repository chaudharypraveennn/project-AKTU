import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { GraduationCap, BookOpen, BarChart3, CheckCircle } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"
import { googleAuth } from "../services/api"
import { restoreProgressFromServer } from "../utils/progress"

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.20455C17.64 8.56637 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
        </svg>
    )
}

const perks = [
    { icon: BookOpen,    text: "Access all unit-wise PYQs" },
    { icon: BarChart3,   text: "Track progress per subject & unit" },
    { icon: CheckCircle, text: "Pick up right where you left off" },
]

export default function Auth() {
    const [searchParams] = useSearchParams()
    const redirectTo     = searchParams.get("redirect") || "/"
    const navigate       = useNavigate()

    async function handleGoogleSuccess(credentialResponse) {
        try {
            const data = await googleAuth(credentialResponse.credential)
            sessionStorage.setItem("pyq_user", JSON.stringify(data.user))
            window.dispatchEvent(new Event("pyq_auth_change"))
            await restoreProgressFromServer()
            navigate(redirectTo)
        } catch (err) {
            console.error("Google login failed:", err)
        }
    }

    return (
        <div className="lr-page min-h-screen flex -mt-[72px]">

            {/* LEFT — desktop branding panel */}
            <div className="lr-left hidden lg:flex flex-col justify-between w-[480px] shrink-0 relative overflow-hidden border-r p-14">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/12 via-[#0d1120] to-[#0b0f1a]" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/6 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
                    backgroundSize: "48px 48px"
                }} />

                <div className="relative z-10">
                    <Link to="/" className="lr-back-link text-sm flex items-center gap-2 transition-colors duration-150 w-fit">
                        ← Back to home
                    </Link>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="lr-brand-name font-semibold text-sm tracking-wide">AKTU PYQs</span>
                    </div>
                    <h2 className="lr-heading text-4xl font-black leading-[1.15] mb-4 tracking-tight">
                        Study smarter.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Score higher.</span>
                    </h2>
                    <p className="lr-sub text-sm leading-relaxed mb-10 max-w-xs">
                        Sign in with Google to unlock all PYQs, track your progress, and never lose your study streak.
                    </p>
                    <ul className="space-y-4">
                        {perks.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-3.5">
                                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
                                    <Icon className="w-3.5 h-3.5 text-indigo-400" />
                                </div>
                                <span className="lr-perk-text text-sm">{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative z-10 lr-footer-text text-xs">© 2026 Solvvr · Free forever</p>
            </div>

            {/* RIGHT — sign-in panel */}
            <div className="lr-right flex-1 flex items-center justify-center px-5 py-10 relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[500px] h-[500px] bg-indigo-600/4 rounded-full blur-3xl" />
                </div>

                <div className="relative w-full max-w-[360px]">

                    {/* Mobile back link */}
                    <Link to="/" className="lg:hidden lr-back-link text-sm flex items-center gap-1 mb-6 transition-colors">
                        ← Home
                    </Link>

                    {/* Mobile branding card */}
                    <div className="lg:hidden lr-mobile-card rounded-2xl p-5 mb-7 border">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-4 h-4 text-indigo-400" />
                            </div>
                            <p className="lr-heading text-base font-black leading-tight">
                                Study smarter.{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Score higher.</span>
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {perks.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-1.5">
                                    <Icon className="w-3 h-3 text-indigo-400 shrink-0" />
                                    <span className="lr-perk-text text-xs">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card */}
                    <div className="lr-modal-card rounded-2xl overflow-hidden shadow-2xl">
                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600" />
                        <div className="p-8">
                            <div className="mb-8">
                                <p className="text-xs lr-label-muted uppercase tracking-widest font-semibold mb-2">Welcome</p>
                                <h1 className="lr-heading text-2xl font-black leading-tight">Continue with Google</h1>
                                <p className="lr-sub text-sm mt-2 leading-relaxed">One click to sign in or create your free account.</p>
                            </div>
                            <div className="w-full h-px lr-divider mb-8" />

                            {/* Real Google login button */}
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => console.log("Google Login Failed")}
                                    theme="outline"
                                    size="large"
                                />
                            </div>

                            <p className="text-center lr-footer-text text-xs mt-5 leading-relaxed">
                                By continuing, you agree to our terms.<br />No password needed · Always free.
                            </p>
                        </div>
                    </div>

                    <p className="text-center lr-footer-text text-xs mt-6">
                        New users are automatically registered on first sign-in.
                    </p>
                </div>
            </div>
        </div>
    )
}
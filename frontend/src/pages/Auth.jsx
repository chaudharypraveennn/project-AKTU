import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { googleAuth } from "../services/api"
import { restoreProgressFromServer } from "../utils/progress"
import { BookOpen, BarChart3, CheckCircle, GraduationCap, Sparkles, ArrowLeft } from "lucide-react"

const perks = [
    { icon: BookOpen,    text: "All unit-wise PYQs with solutions",        sub: "Every subject, every year" },
    { icon: BarChart3,   text: "Track progress per subject & unit",         sub: "Know exactly where you stand" },
    { icon: CheckCircle, text: "Pick up right where you left off",          sub: "Synced across all devices" },
]

// Floating orb background — pure CSS, no images
function OrbBg() {
    return (
        <div className="auth-orbs" aria-hidden="true">
            <div className="auth-orb auth-orb-1" />
            <div className="auth-orb auth-orb-2" />
            <div className="auth-orb auth-orb-3" />
        </div>
    )
}

export default function Auth() {
    const [searchParams] = useSearchParams()
    const redirectTo     = searchParams.get("redirect") || "/"
    const navigate       = useNavigate()

    async function handleGoogleSuccess(credentialResponse) {
        try {
            const data = await googleAuth(credentialResponse.credential)
            if (!data || !data.token) { console.error("❌ Invalid response from backend"); return }
            localStorage.setItem("token",    data.token)
            localStorage.setItem("user",     JSON.stringify(data.user))
            localStorage.setItem("pyq_user", JSON.stringify(data.user))
            await restoreProgressFromServer()
            navigate(redirectTo)
        } catch (err) {
            console.error("Google login failed:", err)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("pyq_user")
        }
    }

    return (
        <div className="lr-page auth-redesign min-h-screen flex -mt-[72px] relative overflow-hidden">

            <OrbBg />

            {/* ── LEFT PANEL ── */}
            <div className="auth-left-panel hidden lg:flex flex-col justify-between w-[520px] shrink-0 relative z-10 p-14">

                {/* Back link */}
                <Link to="/" className="auth-back-link flex items-center gap-2 text-sm font-medium w-fit group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to home
                </Link>

                {/* Middle content */}
                <div>
                    {/* Brand chip */}
                    <div className="auth-brand-chip flex items-center gap-3 mb-12 w-fit px-4 py-2.5 rounded-2xl">
                        <div className="auth-brand-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-black tracking-widest uppercase auth-brand-label">Solvvr</p>
                            <p className="text-[10px] auth-brand-sub">AKTU PYQs Platform</p>
                        </div>
                    </div>

                    {/* Headline */}
                    <h2 className="auth-headline text-5xl font-black leading-[1.08] tracking-tight mb-5">
                        Study smarter.<br />
                        <span className="auth-headline-accent">Score higher.</span>
                    </h2>

                    <p className="auth-desc text-sm leading-relaxed mb-12 max-w-sm">
                        One click with Google unlocks every PYQ, solution, and your personal progress tracker — completely free.
                    </p>

                    {/* Perks */}
                    <ul className="space-y-4">
                        {perks.map(({ icon: Icon, text, sub }, i) => (
                            <li key={text} className="auth-perk-item flex items-center gap-4 p-3.5 rounded-2xl"
                                style={{ animationDelay: `${i * 80}ms` }}>
                                <div className="auth-perk-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="auth-perk-text text-sm font-semibold leading-tight">{text}</p>
                                    <p className="auth-perk-sub text-xs mt-0.5">{sub}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <p className="auth-footer-copy text-xs">© 2026 Solvvr · Free forever</p>
                    <span className="auth-free-badge flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Always Free
                    </span>
                </div>

            </div>

            {/* ── VERTICAL DIVIDER ── */}
            <div className="auth-divider-line hidden lg:block w-px self-stretch my-10 shrink-0 relative z-10" />

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 flex items-center justify-center px-5 py-12 relative z-10">

                <div className="w-full max-w-[400px]">

                    {/* Mobile back */}
                    <Link to="/" className="auth-back-link lg:hidden flex items-center gap-2 text-sm font-medium mb-8 w-fit group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to home
                    </Link>

                    {/* Card */}
                    <div className="auth-card relative overflow-hidden rounded-3xl">

                        {/* Top shimmer bar */}
                        <div className="h-[3px] w-full auth-card-bar" />

                        <div className="p-8 sm:p-10">

                            {/* Card header */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="auth-card-icon-wrap w-11 h-11 rounded-2xl flex items-center justify-center shrink-0">
                                    <GraduationCap className="w-5 h-5 auth-card-icon-color" />
                                </div>
                                <div>
                                    <p className="auth-card-title text-base font-black leading-tight">Welcome to Solvvr</p>
                                    <p className="auth-card-sub text-xs mt-0.5">Sign in to unlock everything</p>
                                </div>
                            </div>

                            {/* Mobile perks — visible only on mobile */}
                            <div className="lg:hidden space-y-3 mb-8">
                                {perks.map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-2.5">
                                        <span className="auth-check-dot w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                                            <Icon className="w-2.5 h-2.5" />
                                        </span>
                                        <span className="auth-perk-text text-xs font-medium">{text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="auth-card-divider w-full h-px mb-8" />

                            {/* Headline */}
                            <h1 className="auth-card-headline text-2xl font-black mb-2">One click to start</h1>
                            <p className="auth-card-desc text-sm mb-8">No password. No forms. Just Google.</p>

                            {/* Google button wrapper */}
                            <div className="auth-google-wrap relative flex items-center justify-center p-5 rounded-2xl mb-6">
                                {/* Animated ring */}
                                <div className="auth-google-ring absolute inset-0 rounded-2xl" />
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => console.log("Google Login Failed")}
                                    theme="outline"
                                    size="large"
                                    width="300"
                                />
                            </div>

                            {/* Trust row */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="auth-trust-dot" />
                                <p className="auth-trust-text text-xs text-center">
                                    No password · No spam · Cancel anytime
                                </p>
                                <div className="auth-trust-dot" />
                            </div>

                        </div>
                    </div>

                    {/* Below card note */}
                    <p className="auth-below-card text-xs text-center mt-5">
                        By signing in you agree to our&nbsp;
                        <span className="auth-below-card-link font-semibold cursor-pointer">Terms</span>
                        &nbsp;&amp;&nbsp;
                        <span className="auth-below-card-link font-semibold cursor-pointer">Privacy Policy</span>
                    </p>

                </div>
            </div>

        </div>
    )
}
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { GraduationCap, BookOpen, BarChart3, CheckCircle } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"
import { googleAuth } from "../services/api"
import { restoreProgressFromServer } from "../utils/progress"
const perks = [
    { icon: BookOpen, text: "Access all unit-wise PYQs" },
    { icon: BarChart3, text: "Track progress per subject & unit" },
    { icon: CheckCircle, text: "Pick up right where you left off" },
]

export default function Auth() {

    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/"
    const navigate = useNavigate()

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

            {/* LEFT PANEL */}
            <div className="lr-left hidden lg:flex flex-col justify-between w-[480px] shrink-0 relative overflow-hidden border-r p-14">

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
                        <span className="lr-brand-name font-semibold text-sm tracking-wide">
                            AKTU PYQs
                        </span>
                    </div>

                    <h2 className="lr-heading text-4xl font-black leading-[1.15] mb-4 tracking-tight">
                        Study smarter.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
                            Score higher.
                        </span>
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

                <p className="relative z-10 lr-footer-text text-xs">
                    © 2026 Solvvr · Free forever
                </p>

            </div>

            {/* RIGHT PANEL */}
            <div className="lr-right flex-1 flex items-center justify-center px-5 py-10 relative">

                <div className="relative w-full max-w-[360px]">

                    <Link to="/" className="lg:hidden lr-back-link text-sm flex items-center gap-1 mb-6 transition-colors">
                        ← Home
                    </Link>

                    <div className="lr-modal-card rounded-2xl overflow-hidden shadow-2xl">

                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600" />

                        <div className="p-8">

                            <div className="mb-8">
                                <p className="text-xs lr-label-muted uppercase tracking-widest font-semibold mb-2">
                                    Welcome
                                </p>

                                <h1 className="lr-heading text-2xl font-black leading-tight">
                                    Continue with Google
                                </h1>

                                <p className="lr-sub text-sm mt-2 leading-relaxed">
                                    One click to sign in or create your free account.
                                </p>
                            </div>

                            <div className="w-full h-px lr-divider mb-8" />

                            {/* GOOGLE LOGIN BUTTON */}

                            <div className="flex justify-center">

                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => console.log("Google Login Failed")}
                                    theme="outline"
                                    size="large"
                                />

                            </div>

                            <p className="text-center lr-footer-text text-xs mt-5 leading-relaxed">
                                By continuing, you agree to our terms.<br />
                                No password needed · Always free.
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

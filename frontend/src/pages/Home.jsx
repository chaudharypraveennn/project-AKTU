import { useSearchParams, useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useState, useEffect, useRef } from "react"
import {
    BookOpen, FlaskConical, Zap, Calculator,
    Database, Monitor, GitBranch, Globe,
    Cpu, Code2, Cloud, BrainCircuit,
    Rocket, Bot, Network, ShieldCheck,
    ChevronRight, ArrowRight, GraduationCap,
    BarChart3, Layers, BookMarked,
    Star, RefreshCw, Clock3, Mail, Instagram, Sparkles
} from "lucide-react"



const subjectIcons = {
    "Maths": Calculator, "Physics": FlaskConical, "Chemistry": FlaskConical, "Electrical": Zap,
    "DBMS": Database, "OS": Monitor, "DSA": GitBranch, "CN": Globe,
    "DAA": BarChart3, "Compiler": Cpu, "Web Tech": Code2, "Cloud": Cloud,
    "Project": Rocket, "AI": Bot, "ML": BrainCircuit, "Security": ShieldCheck,
}

const subjectColors = {
    "First Year":  { dot: "#6366f1", glow: "rgba(99,102,241,0.12)" },
    "Second Year": { dot: "#0ea5e9", glow: "rgba(14,165,233,0.12)" },
    "Third Year":  { dot: "#10b981", glow: "rgba(16,185,129,0.12)" },
    "Fourth Year": { dot: "#f59e0b", glow: "rgba(245,158,11,0.12)"  },
}

const yearLabels = {
    "First Year": "1st Year", "Second Year": "2nd Year",
    "Third Year": "3rd Year", "Fourth Year": "4th Year",
}

const faqs = [
    { q: "How are questions organized?",        a: "Questions are organized year-wise, subject-wise and unit-wise — making it easy to drill exactly what you need." },
    { q: "Are these real AKTU exam questions?", a: "Yes. Every question is sourced from previous AKTU examination papers." },
    { q: "Can I report a wrong question?",      a: 'Use the "Report" button on any question page to flag it. We review all reports.' },
    { q: "Do I need to login to practice?",     a: "No account needed to practice. Login only unlocks progress tracking across devices." },
]

const quickPractice = [
    { icon: Star,     label: "Important Questions", desc: "High-weightage questions most likely to appear in your exam",          iconColor: "text-amber-400",   iconBg: "bg-amber-500/10 border-amber-500/20",   badge: "Most Popular", badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
    { icon: RefreshCw,label: "Repeat Questions",    desc: "Questions that have appeared in 2+ exam years — never skip these",    iconColor: "text-sky-400",     iconBg: "bg-sky-500/10 border-sky-500/20",       badge: "High Chance",  badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/25" },
    { icon: Clock3,   label: "Recently Added",      desc: "Fresh questions from the latest AKTU exam papers",                    iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10 border-emerald-500/20",badge: "New",          badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
]

function SubjectCard({ subject, year, onClick, index = 0 }) {
    const Icon  = subjectIcons[subject] || BookOpen
    const color = subjectColors[year]   || subjectColors["First Year"]
    return (
        <div
            onClick={onClick}
            className="subject-card group bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 cursor-pointer backdrop-blur-sm"
            style={{ animationDelay: `${index * 55}ms`, animationFillMode: "both" }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                     style={{ background: color.glow, border: `1px solid ${color.dot}30` }}>
                    <Icon className="w-5 h-5" style={{ color: color.dot }} />
                </div>
                <ChevronRight className="subject-arrow w-4 h-4 text-slate-500 mt-1" />
            </div>
            <h3 className="text-base font-semibold text-slate-100 mb-1">{subject}</h3>
            <p className="text-xs text-slate-500">5 units · PYQs</p>
        </div>
    )
}

export default function Home() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const initialYear = searchParams.get("year")

    const [subjectMap, setSubjectMap] = useState({})
    const [loading, setLoading] = useState(true)

    const getUser = () => { try { return JSON.parse(sessionStorage.getItem("pyq_user")) } catch { return null } }
    const [userTick, setUserTick] = useState(0)
    const user = getUser()

    useEffect(() => {
        const stored = sessionStorage.getItem("pyq_last_year")
        if (stored && !Object.keys(subjectMap).includes(stored)) sessionStorage.removeItem("pyq_last_year")
    }, [])

    useEffect(() => {
        const handler = () => setUserTick(t => t + 1)
        window.addEventListener("pyq_auth_change", handler)
        return () => window.removeEventListener("pyq_auth_change", handler)
    }, [])
    useEffect(() => {

    async function fetchSubjects() {

        try {

            const res = await fetch("http://localhost:5000/api/questions/subjects")
            const data = await res.json()

            setSubjectMap(data)
            setLoading(false)

        } catch (err) {

            console.error("Failed to load subjects:", err)

        }

    }

    fetchSubjects()

}, [])

    const validYears = Object.keys(subjectMap || {})
    const storedYear = sessionStorage.getItem("pyq_last_year")
    const [selectedYear, setSelectedYear] = useState(
        validYears.includes(initialYear) ? initialYear : validYears.includes(storedYear) ? storedYear : null
    )
    const [search, setSearch] = useState("")
    const [openFaq, setOpenFaq] = useState(null)

    const accentColor = (selectedYear && subjectColors[selectedYear]) ? subjectColors[selectedYear].dot : "#6366f1"

    function selectYear(year) {
        setSelectedYear(year)
        setSearch("")
        sessionStorage.setItem("pyq_last_year", year)
    }

    const years = Object.keys(subjectMap)
    const allSubjectsFlat = Object.entries(subjectMap).flatMap(([yr, subs]) => subs.map(s => ({ subject: s, year: yr })))
    let subjects = []
let searchResults = []

if (search.trim()) {
    searchResults = allSubjectsFlat.filter(({ subject }) =>
        subject.toLowerCase().includes(search.toLowerCase())
    )
} else if (selectedYear) {
    subjects = subjectMap[selectedYear]
}

/* ADD THIS BLOCK HERE */
if (loading) {
    return (
        <div className="flex items-center justify-center h-screen text-white">
            Loading subjects...
        </div>
    )
}



    return (
        <div className="bg-[#0b0f1a] min-h-screen text-white relative overflow-x-hidden">

            {/* ── DARK THEME BACKGROUND ────────────────────────────────── */}
            <div className="dark-bg-layer" aria-hidden="true">
                <div className="dark-orb-1" />
                <div className="dark-orb-2" />
                <div className="dark-orb-3" />
                <div className="dark-orb-4" />
                <div className="dark-orb-5" />
            </div>

            {/* Falling meteor streaks — right side only, sparse, slow & random */}
            <div className="dark-particles" aria-hidden="true">
                {[
                    { cls: "dp-1", left: "8%",  delay: "0s",    dur: "18s" },
                    { cls: "dp-4", left: "22%", delay: "5.5s",  dur: "26s" },
                    { cls: "dp-0", left: "35%", delay: "2.0s",  dur: "21s" },
                    { cls: "dp-2", left: "48%", delay: "11.3s", dur: "31s" },
                    { cls: "dp-3", left: "60%", delay: "1.2s",  dur: "24s" },
                    { cls: "dp-1", left: "72%", delay: "8.7s",  dur: "19s" },
                    { cls: "dp-0", left: "14%", delay: "14.5s", dur: "28s" },
                    { cls: "dp-4", left: "82%", delay: "3.8s",  dur: "22s" },
                    { cls: "dp-2", left: "55%", delay: "17.2s", dur: "35s" },
                    { cls: "dp-3", left: "30%", delay: "9.0s",  dur: "29s" },
                    { cls: "dp-0", left: "90%", delay: "6.4s",  dur: "23s" },
                    { cls: "dp-1", left: "42%", delay: "20.0s", dur: "32s" },
                ].map(({ cls, left, delay, dur }, i) => (
                    <span key={i} className={`dp ${cls}`} style={{
                        left,
                        animationName: "meteorFall",
                        animationDelay: delay,
                        animationDuration: dur,
                        animationTimingFunction: "linear",
                        animationIterationCount: "infinite",
                    }} />
                ))}
            </div>

            {/* Slow wandering grain particles — full page */}
            <div className="dark-scanline" aria-hidden="true">
                {[...Array(55)].map((_, i) => (
                    <span key={i} className={`gp gp-${i % 5}`} style={{
                        left:              `${(i * 8.3  + (i % 9)  * 4.7) % 100}%`,
                        top:               `${(i * 11.1 + (i % 13) * 3.9) % 100}%`,
                        animationDuration: `${12 + (i % 8) * 3}s`,
                        animationDelay:    `${((i * 1.13) % 10).toFixed(1)}s`,
                    }} />
                ))}
            </div>

            {/* Film grain texture */}
            <div className="dark-grain" aria-hidden="true" />

            <Navbar />

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-slate-800/60 z-10">
                <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

                    {/* LEFT */}
                    <div className="flex-1 min-w-0 w-full text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-3 sm:px-4 py-1.5 mb-5 sm:mb-6">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="text-xs text-indigo-500 font-medium tracking-wide hero-badge-text">AKTU Previous Year Questions</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-4 sm:mb-5 hero-heading">
                            Study Smarter,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-500">Score Higher.</span>
                        </h1>
                        <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 hero-sub">
                            Unit-wise PYQs from all AKTU subjects — organized, searchable, and always free.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center lg:justify-start">
                                <button
                                    onClick={() => document.getElementById("browse").scrollIntoView({ behavior: "smooth" })}
                                    className="start-btn flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 sm:px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
                                >
                                    Start Practicing
                                    <ArrowRight className="start-arrow w-4 h-4" />
                                </button>
                                {!user && (
                                    <Link to="/login" className="hero-join-btn flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl border font-semibold text-sm transition-all duration-200">
                                        <Sparkles className="w-4 h-4" />
                                        Create account
                                    </Link>
                                )}
                                {user && (
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        Welcome back,&nbsp;<span className="text-slate-200 font-semibold">
                                            {user.firstName
                                                ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
                                                : "there"}
                                        </span>&nbsp;<span className="text-lg">👋</span>
                                    </div>
                                )}
                            </div>

                            {!user && (
                                <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                                    <div className="flex -space-x-1.5">
                                        {[
                                            { icon: Star,     color: "text-amber-400" },
                                            { icon: BarChart3, color: "text-indigo-400" },
                                            { icon: Layers,   color: "text-emerald-400" },
                                        ].map(({ icon: Icon, color }, i) => (
                                            <span key={i} className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                                                <Icon className={`w-3 h-3 ${color}`} />
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-slate-500 text-xs">
                                        <span className="text-slate-300 font-medium">Track every question you solve.</span>
                                        {" "}Sign up free — takes 10 seconds.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — floating stat cards (desktop only, or inline row on mobile) */}
                    <div className="flex lg:hidden flex-row gap-3 w-full justify-center flex-wrap">
                        {[
                            { label: "Questions", val: "500+", icon: BookMarked, color: "text-indigo-400" },
                            { label: "Subjects",  val: "15+",  icon: Layers,     color: "text-sky-400" },
                            { label: "Units",     val: "40+",  icon: Network,    color: "text-emerald-400" },
                        ].map(({ label, val, icon: Icon, color }) => (
                            <div key={label} className="bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 flex items-center gap-3 backdrop-blur-sm">
                                <Icon className={`w-4 h-4 ${color} shrink-0`} />
                                <div>
                                    <p className="text-white font-bold text-base leading-none">{val}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden lg:flex flex-col gap-4 shrink-0 w-64">
                        {[
                            { label: "Questions", val: "500+", icon: BookMarked, color: "text-indigo-400",   cls: "stat-card-0" },
                            { label: "Subjects",  val: "15+",  icon: Layers,     color: "text-sky-400",     cls: "stat-card-1" },
                            { label: "Units",     val: "40+",  icon: Network,    color: "text-emerald-400", cls: "stat-card-2" },
                        ].map(({ label, val, icon: Icon, color, cls }) => (
                            <div key={label} className={`${cls} bg-slate-800/50 border border-slate-700/60 rounded-xl px-5 py-4 flex items-center gap-4 backdrop-blur-sm cursor-default`}>
                                <Icon className={`w-5 h-5 ${color} shrink-0`} />
                                <div>
                                    <p className="text-white font-bold text-lg leading-none">{val}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ── BROWSE ────────────────────────────────────────────────── */}
            <section id="browse" className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
                <div className="mb-8">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Browse</p>
                    <h2 className="text-2xl font-black text-slate-100">Explore by Year & Subject</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">

                    {/* Year pills */}
                    <div className="shrink-0 md:sticky md:top-[88px] md:self-start">
                        <p className="text-xs text-slate-600 uppercase tracking-wider mb-3 font-medium">Year</p>
                        <div className="flex md:flex-col gap-2 overflow-x-auto pb-1 md:pb-0">
                            {years.map(year => {
                                const active = selectedYear === year
                                const dot = subjectColors[year].dot
                                return (
                                    <button key={year} onClick={() => selectYear(year)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all duration-200 shrink-0 md:w-40
                                            ${active ? "bg-slate-800 border border-slate-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}>
                                        <span className="w-2 h-2 rounded-full shrink-0 transition-all duration-200" style={{ background: active ? dot : "#334155" }} />
                                        {yearLabels[year]}
                                        {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-500 hidden md:block" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="hidden md:block w-px bg-slate-800 self-stretch" />

                    {/* Subjects panel */}
                    <div className="flex-1 min-h-[200px] md:min-h-[340px]">
                        <div className="relative mb-6">
                            <input
                                placeholder="Search subjects..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-4 pr-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
                            />
                        </div>

                        {search.trim() ? (
                            <div className="animate-subjects">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                        {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} across all years
                                    </span>
                                </div>
                                {searchResults.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <p className="text-slate-400 font-medium mb-1">No subjects found</p>
                                        <p className="text-slate-600 text-sm">Try a different keyword</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {searchResults.map(({ subject, year: yr }) => (
                                            <SubjectCard key={`${yr}-${subject}`} subject={subject} year={yr}
                                                         onClick={() => navigate(`/units/${encodeURIComponent(yr)}/${encodeURIComponent(subject)}`)} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : !selectedYear ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
                                    <BookOpen className="w-7 h-7 text-slate-600" />
                                </div>
                                <h3 className="text-slate-300 font-semibold text-lg mb-1">Select a year to begin</h3>
                                <p className="text-slate-600 text-sm">Or search any subject above</p>
                            </div>
                        ) : (
                            <div key={selectedYear} className="animate-subjects">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                        {selectedYear} · {subjects.length} subjects
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {subjects.map((subject) => (
                                        <SubjectCard key={subject} subject={subject} year={selectedYear}
                                                     onClick={() => navigate(`/units/${encodeURIComponent(selectedYear)}/${encodeURIComponent(subject)}`)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            {/* ── QUICK PRACTICE ────────────────────────────────────────── */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-16">
                <div className="mb-8">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Shortcuts</p>
                    <h2 className="text-2xl font-black text-slate-100">Quick Practice</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                    {quickPractice.map(({ icon: Icon, label, desc, iconColor, iconBg, badge, badgeColor }) => (
                        <div key={label} className="relative group bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
                            <div className="flex items-start justify-between mb-5">
                                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}`}>{badge}</span>
                            </div>
                            <h3 className="font-bold text-slate-100 mb-2 text-base">{label}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                            <div className="mt-5 flex items-center gap-1 text-xs text-slate-600 group-hover:text-indigo-400 transition-colors duration-200">
                                <span>Explore</span>
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────────────────── */}
            <section className="relative z-10 max-w-3xl mx-auto px-6 pb-20">
                <div className="mb-8">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Help</p>
                    <h2 className="text-2xl font-black text-slate-100">FAQ</h2>
                </div>
                <div className="space-y-2">
                    {faqs.map((faq, i) => (
                        <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
                             className="border border-slate-800 rounded-xl overflow-hidden cursor-pointer">
                            <div className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/60 transition-colors">
                                <span className="font-medium text-slate-200 text-sm">{faq.q}</span>
                                <ChevronRight className={`w-4 h-4 text-slate-500 shrink-0 ml-4 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`} />
                            </div>
                            {openFaq === i && (
                                <div className="px-5 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800">
                                    <p className="pt-3">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────────────────── */}
            <footer className="relative z-10 px-3 sm:px-4 pb-6 pt-4">
                <div className="max-w-5xl mx-auto rounded-2xl border border-slate-700/50 bg-[#0d1117]/80 backdrop-blur-xl overflow-hidden">
                    <div className="px-5 sm:px-8 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 sm:gap-10">
                        <div>
                            <img src="/src/assets/quizzer-logo.png" alt="logo" className="h-7 w-auto object-contain" />
                            <p className="text-slate-500 text-sm leading-relaxed">Practice previous year questions organized by year, subject, and unit. Built for AKTU students.</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-slate-500">
                                {["Home", "Important Questions", "Repeat Questions", "Recently Added"].map(l => (
                                    <li key={l} className="hover:text-indigo-400 cursor-pointer transition-colors">{l}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="sm:col-span-2 md:col-span-1">
                            <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Contact</h3>
                            <a href="mailto:contact.solvvr@gmail.com" className="flex items-center gap-2.5 text-slate-400 hover:text-indigo-400 transition-colors duration-150 text-sm mb-4 group w-fit">
                                <Mail className="w-4 h-4 shrink-0 group-hover:text-indigo-400 transition-colors" />
                                contact.solvvr@gmail.com
                            </a>
                            <a href="https://www.instagram.com/_solvvr_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-slate-400 hover:text-pink-400 transition-colors duration-150 text-sm group w-fit">
                                <Instagram className="w-4 h-4 shrink-0 group-hover:text-pink-400 transition-colors" />
                                @_solvvr_
                            </a>
                        </div>
                    </div>
                    <div className="border-t border-slate-800/60 text-center text-slate-600 text-xs py-4">
                        © 2026 Solvvr · Built for students
                    </div>
                </div>
            </footer>

        </div>
    )
}

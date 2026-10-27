import {
  LayoutDashboard,
  Compass,
  Sparkles,
  BarChart3,
  BookOpen,
  FileQuestion,
  CalendarDays,
  TrendingUp,
  Bot,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Learning Path", href: "/learning-path", icon: Compass },
  { label: "AI Recommendations", href: "/recommendations", icon: Sparkles },
  { label: "Skill Analysis", href: "/skill-analysis", icon: BarChart3 },
  { label: "Explore Courses", href: "/courses", icon: BookOpen },
  { label: "Smart Quiz", href: "/quiz", icon: FileQuestion },
  { label: "Study Plan", href: "/study-plan", icon: CalendarDays },
  { label: "Progress Analytics", href: "/analytics", icon: TrendingUp },
  { label: "AI Assistant", href: "/assistant", icon: Bot },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
]

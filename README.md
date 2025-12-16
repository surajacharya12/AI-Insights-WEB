# AI Insight - Web Frontend

A modern, feature-rich learning platform built with Next.js 15, featuring AI-powered course generation, interactive quizzes, PDF chat, and beautiful UI components.

## 🚀 Features

- **🎓 AI Course Generation** - Generate complete courses with chapters, topics, and YouTube videos
- **📊 Progress Tracking** - Track learning progress at topic level with checkboxes
- **📝 Interactive Quizzes** - AI-generated quizzes on any topic with score history
- **📄 Chat with PDF** - Upload PDFs and ask questions using AI
- **🤖 ThinkBot** - AI chatbot for answering questions
- **📚 Resource Sharing** - Upload and share learning materials
- **🔐 Authentication** - Secure login/signup with persistent sessions
- **🌙 Modern UI** - Beautiful, responsive design with animations

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Markdown**: React Markdown + Syntax Highlighter
- **HTTP Client**: Axios
- **Notifications**: Sonner

## 📁 Project Structure

```
aiinsightweb/
├── app/
│   ├── (auth)/                    # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (authenticated)/           # Protected routes
│   │   ├── dashboard/             # Main dashboard
│   │   ├── explore-courses/       # Browse all courses
│   │   ├── quiz/                  # Quiz feature
│   │   ├── chatpdf/               # Chat with PDF
│   │   ├── thinkbot/              # AI chatbot
│   │   ├── resources/             # Resource library
│   │   ├── hero/                  # Hero/landing page
│   │   ├── ai-tools/              # AI tools section
│   │   ├── settings/              # User settings
│   │   └── _components/           # Shared authenticated components
│   ├── course/
│   │   └── [courseId]/            # Course viewing page
│   │       └── _components/
│   │           └── course-accordion/  # Modular accordion components
│   ├── components/                # Global components
│   │   ├── app-sidebar.tsx
│   │   ├── app-navbar.tsx
│   │   └── AddNewCourseDialog.tsx
│   ├── context/
│   │   └── UserContext.tsx        # Global user state
│   ├── api/
│   │   └── api_url.ts             # API configuration
│   └── page.tsx                   # Landing page
├── components/ui/                  # shadcn/ui components
└── public/
```

## 🎨 Key Components

### Course Accordion (Modular)
```
course-accordion/
├── index.ts              # Barrel exports
├── types.ts              # TypeScript interfaces
├── CourseAccordion.tsx   # Main component with header
├── ChapterAccordionItem.tsx  # Chapter level
├── TopicAccordionItem.tsx    # Topic level with checkbox
├── MarkdownContent.tsx       # Enhanced markdown renderer
└── VideoSection.tsx          # YouTube video grid
```

### Features:
- ✅ Nested accordions (Chapters → Topics)
- ✅ Progress tracking with checkboxes
- ✅ Syntax-highlighted code blocks with copy button
- ✅ Styled markdown tables
- ✅ YouTube video grid with featured player
- ✅ Beautiful gradient styling and animations

## 🔐 Authentication Flow

1. **Persistent Login**: User data stored in `localStorage`
2. **Protected Routes**: `AuthenticatedLayout` guards all `/dashboard/*` routes
3. **Auto-redirect**:
   - Logged in user visits `/login` → Redirects to `/dashboard`
   - Logged out user visits `/dashboard` → Redirects to `/login`
4. **Session Refresh**: Fetches fresh user data from API on load

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with features |
| `/login` | User login |
| `/signup` | User registration |
| `/dashboard` | Main dashboard with enrolled courses |
| `/explore-courses` | Browse and enroll in courses |
| `/course/[courseId]` | View course content |
| `/quiz` | Take AI-generated quizzes |
| `/chatpdf` | Chat with uploaded PDFs |
| `/thinkbot` | AI chatbot interface |
| `/resources` | Browse/upload resources |
| `/settings` | User settings and profile |

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/surajacharya12/AI-Insights-WEB.git
cd aiinsightweb
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL in `app/api/api_url.ts`:
```typescript
const API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ai-insights-backend.vercel.app"
        : "http://localhost:3001";

export default API_URL;
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit

# Lint
npm run lint
```

## 🎯 Environment Variables

Create a `.env.local` file (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🌐 Deployment

The frontend is deployed on Vercel:
- **Production**: Connect your GitHub repo to Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## 📦 Key Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "@radix-ui/*": "UI primitives",
  "framer-motion": "Animations",
  "lucide-react": "Icons",
  "react-markdown": "Markdown rendering",
  "react-syntax-highlighter": "Code highlighting",
  "axios": "HTTP client",
  "sonner": "Toast notifications",
  "tailwindcss": "Styling"
}
```

## 📸 Screenshots

### Dashboard
- Clean, modern design with gradient accents
- Enrolled courses with progress bars
- Quick access to all features

### Course View
- Nested accordion with chapters and topics
- Progress checkboxes for each topic
- Embedded YouTube videos
- Syntax-highlighted code blocks

### Quiz
- AI-generated questions
- Score tracking and history
- Multiple choice format

## 📄 License

MIT License

## 👤 Author

**Suraj Acharya**
- GitHub: [@surajacharya12](https://github.com/surajacharya12)

---

Made with ❤️ using Next.js and AI

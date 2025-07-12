# StackIt - Q&A Forum

A modern, full-stack Q&A forum built with Next.js, TypeScript, Tailwind CSS, and more.

## Team Members
- Pratyoosh Prakash - pratyoosh.prakash.dev@gmail.com
- Swapnil - swapnilsen2656@gmail.com
- Harsh Raj - rajharsh437@gmail.com
- Tannystha Ghosh - tannysthaghosh06@gmail.com

## 🚀 Features

### Core Features
- **🔐 Authentication**: Secure user authentication with Clerk
- **📝 Rich Text Editor**: Create questions and answers with Tiptap rich text editor
- **🏷️ Tag System**: Organize questions with multi-tag support and auto-creation
- **👍 Voting System**: Vote on answers to help the community with optimistic UI
- **✅ Accept Answers**: Question owners can mark answers as accepted
- **🔔 Notifications**: Get notified for comments and @mentions
- **💬 Comment System**: Comment on answers with @mention support
- **🌙 Dark Mode**: Beautiful dark mode support with smooth transitions and persistent preferences
- **📱 Responsive**: Works great on all devices

### Advanced Features
- **🔍 Search & Filter**: Advanced search by text, filter by status (answered/unanswered)
- **📊 Sorting**: Sort questions by newest, oldest, most answers, or least answers
- **👤 User Profiles**: View user profiles with their questions and stats
- **📋 My Questions**: Dedicated page to manage your own questions
- **🗑️ Delete Questions**: Question owners can delete their questions with cascading deletes
- **⚡ Optimistic UI**: Real-time updates for voting, answer acceptance, and question deletion
- **🎯 Auto User Creation**: Users are automatically created on first interaction
- **🔄 Database Seeding**: Pre-populated with common programming tags
- **🛡️ Admin Panel**: Role-based admin panel for content moderation and user management
- **👑 Role Management**: Promote/demote users to admin with full permissions
- **🔒 Access Control**: Middleware-protected admin routes with database role verification

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **UI Components**: Shadcn/ui
- **Rich Text**: Tiptap
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rlpratyoosh/stack-it
   cd stack-it
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛡️ Admin Panel

### Features
The admin panel provides comprehensive moderation and management capabilities:

- **📊 Dashboard**: Overview statistics for questions, answers, comments, and users
- **❓ Question Management**: View and delete any question with full context
- **💬 Answer Management**: Moderate answers with vote scores and comment counts
- **🗨️ Comment Management**: Manage comments with full threading context
- **👥 User Management**: View user statistics and manage roles
- **👑 Role Management**: Promote/demote admin privileges
- **🔒 Secure Access**: Middleware-protected routes with database role verification

### Admin Access
To access the admin panel:

1. **Promote a user to admin role**:
   ```bash
   npm run admin:promote <clerk_user_id>
   ```

2. **Navigate to admin panel**: 
   - Users with admin role will see an "Admin" button in the header
   - Admin panel is accessible at `/admin`
   - Non-admin users are automatically redirected

### Admin Capabilities
- **Full Content Moderation**: Delete any question, answer, or comment
- **User Role Management**: Promote users to admin or revoke admin access
- **Content Overview**: View all content with full context and metadata
- **User Statistics**: Monitor user activity and engagement
- **Optimistic UI**: Real-time updates with proper error handling

## 🗄️ Database Schema

The application uses the following main models:

- **User**: Stores user information from Clerk with auto-creation and role management
- **Question**: Forum questions with title, description, and tags
- **Answer**: Answers to questions with voting and comment support
- **Comment**: Comments on answers with @mention functionality
- **Tag**: Categorization system for questions with auto-creation
- **Vote**: User votes on answers (+1 or -1)
- **Notification**: User notifications for comments and @mentions

### Role-Based Access
- **USER**: Default role for all users (can ask questions, answer, comment, vote)
- **ADMIN**: Elevated permissions (all user permissions + moderation capabilities)

## 🔧 Setup Instructions

### 1. Database Setup

1. Create a PostgreSQL database (Railway, Supabase, or local)
2. Update `DATABASE_URL` in your `.env.local`
3. Run migrations: `npx prisma migrate dev`
4. Seed default tags: `npm run db:seed`

### 2. Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Get your API keys from the Clerk dashboard
3. Users will be automatically created when they first interact with the app

### 3. Features Overview

#### Pages
- `/` - Home page with all questions
- `/ask` - Create new questions (authenticated users only)
- `/question/[id]` - View question details and answers
- `/user/[id]` - User profile and their questions
- `/my-questions` - User's own questions management page
- `/admin` - Admin panel for content moderation (admin users only)

#### Components
- `QuestionCard` - Display question preview
- `AskQuestionForm` - Form to create new questions
- `AnswerForm` - Form to submit answers
- `AnswerCard` - Display individual answers with voting
- `VoteButton` - Vote on answers
- `TagSelector` - Multi-tag selection component
- `NotificationBell` - Show user notifications
- `RichTextEditor` - Tiptap-based rich text editor

## 🎨 Styling

The application uses Tailwind CSS v4 with:
- Custom design system with consistent spacing and colors
- Dark mode support
- Responsive design
- Modern UI components from Shadcn/ui

## 🚀 Deployment

1. **Database**: Deploy your PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. **Application**: Deploy to Vercel, Netlify, or your preferred platform
3. **Environment Variables**: Set all required environment variables in production

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with default tags
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Create and apply new migrations
- `npx prisma generate` - Regenerate Prisma client

### Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── ask/               # Ask question page
│   ├── my-questions/      # User's own questions
│   ├── question/[id]/     # Question detail pages
│   └── user/[id]/         # User profile pages
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── AnswerCard.tsx    # Answer display with comments
│   ├── CommentSection.tsx # Comment system
│   ├── QuestionsWithSearch.tsx # Search/filter/sort
│   ├── NotificationBell.tsx # Notification system
│   └── ...
├── lib/                  # Utility functions
│   ├── action.ts        # Server actions
│   ├── prisma-db.ts     # Database queries
│   ├── validations.ts   # Zod schemas
│   └── utils.ts         # Helper functions
└── prisma/              # Database schema and migrations
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with default tags
- `npm run admin:promote <clerk_id>` - Promote user to admin role

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Issues

If you find a bug or want to request a feature, please open an issue on GitHub.
# StackIt - Q&A Forum

A modern, full-stack Q&A forum built with Next.js, TypeScript, Tailwind CSS, and more.

## Team Members
- Pratyoosh Prakash - pratyoosh.prakash.dev@gmail.com
- Swapnil - swapnilsen2656@gmail.com
- Harsh Raj - rajharsh437@gmail.com
- Tannystha Ghosh - tannysthaghosh06@gmail.com

## 🚀 Features

- **🔐 Authentication**: Secure user authentication with Clerk
- **📝 Rich Text Editor**: Create questions and answers with Tiptap rich text editor
- **🏷️ Tag System**: Organize questions with multi-tag support
- **👍 Voting System**: Vote on answers to help the community
- **✅ Accept Answers**: Question owners can mark answers as accepted
- **🔔 Notifications**: Get notified when someone answers your questions
- **🌙 Dark Mode**: Beautiful dark mode support
- **📱 Responsive**: Works great on all devices

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
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses the following main models:

- **User**: Stores user information from Clerk
- **Question**: Forum questions with title, description, and tags
- **Answer**: Answers to questions with voting support
- **Tag**: Categorization system for questions
- **Vote**: User votes on answers (+1 or -1)
- **Notification**: User notifications for interactions

## 🔧 Setup Instructions

### 1. Database Setup

1. Create a PostgreSQL database
2. Update `DATABASE_URL` in your `.env.local`
3. Run migrations: `npx prisma migrate dev`

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

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── ask/            # Ask question page
│   ├── question/       # Question detail pages
│   └── user/           # User profile pages
├── components/         # React components
├── lib/               # Utility functions
│   ├── actions.ts     # Server actions
│   ├── prisma-db.ts   # Database queries
│   ├── validations.ts # Zod schemas
│   └── utils.ts       # Helper functions
└── prisma/            # Database schema and migrations
```

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
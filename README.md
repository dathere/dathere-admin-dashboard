# datHere Admin Dashboard

Modern admin interface for managing CKAN datasets with PortalJS integration. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Complete Data Management
- Datasets - Full CRUD operations with file upload support
- Organizations - Manage orgs, logos, and member datasets
- Groups - Thematic dataset grouping
- Users - User management with admin/member roles
- Resources - Multi-file support per dataset

### Data Stories
- MDX-powered editor with live preview
- 12 chart types - Bar, Line, Pie, Area, Scatter, Radar, Funnel, Treemap, etc.
- Visual chart builder for non-technical users
- Formatting toolbar - Bold, Italic, Headers, Lists, Links, Images, Code
- Write/Preview tabs with real-time MDX compilation

### Modern UI
- Full dark/light mode with theme persistence
- Responsive design - Mobile, tablet, desktop
- Real-time activity streams
- Dashboard analytics with quick stats

## Quick Setup

### Prerequisites
- Node.js 18+
- CKAN 2.11+ instance running
- PortalJS (optional, for public portal)

### Installation
```bash
# Clone the repo
git clone https://github.com/dathere/dathere-admin-dashboard.git
cd dathere-admin-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Configuration

Edit `.env.local`:
```bash
# CKAN Configuration
NEXT_PUBLIC_CKAN_URL=http://localhost:5050      # Enter your CKAN URL for browser here
CKAN_API_URL=http://localhost:5050              # Enter your CKAN URL for server here
CKAN_API_KEY=your-api-key-here                  # Get from CKAN user profile

# URLs
NEXT_PUBLIC_PORTALJS_URL=http://localhost:3000  # Enter your PortalJS URL here (if using)
NEXT_PUBLIC_APP_URL=http://localhost:3001       # Enter your dashboard URL here

# Stories
PORTALJS_STORIES_PATH=/path/to/portaljs/content/stories  # Enter path to stories folder

# Optional
OPENAI_API_KEY=sk-your-key-here                 # Enter your OpenAI API key (optional)
```

### Start Development Server
```bash
npm run dev
```

Access at: http://localhost:3001

## Get CKAN API Key

1. Go to your CKAN instance (e.g., http://localhost:5050)
2. Login > Profile > API Tokens
3. Create new token
4. Copy to `.env.local` as `CKAN_API_KEY`

## Architecture

### System Overview
```
Admin Dashboard (Port 3001)
    |
    v
CKAN API (Port 5050)
    ^
    |
PortalJS Portal (Port 3000 - optional)
```


## Tech Stack

### Core
- Next.js 14 - React framework with App Router
- TypeScript - Type safety
- Tailwind CSS - Utility-first styling
- CKAN 2.11 API - Data management backend

### Key Libraries
- Forms: react-hook-form + zod validation
- Charts: Recharts (12 chart types)
- MDX: @mdx-js/mdx for story compilation
- Icons: lucide-react
- Notifications: react-hot-toast

## Project Structure
```
dathere-admin-dashboard/
├── app/
│   ├── api/                 # Next.js API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── ckan/           # CKAN proxy endpoints
│   │   └── stories/        # Story CRUD endpoints
│   ├── dashboard/          # Dashboard home page
│   ├── datasets/           # Dataset management
│   │   ├── create/        # Create dataset form
│   │   └── [name]/        # Dataset detail & edit
│   ├── stories/            # Story editor
│   │   ├── create/        # Create story
│   │   └── edit/[slug]/   # Edit story
│   ├── users/              # User management
│   ├── organizations/      # Organization management
│   ├── groups/             # Group management
│   └── profile/            # User profile
├── components/
│   ├── Sidebar.tsx         # Main navigation
│   ├── charts/             # 12 Recharts components
│   ├── modals/             # DataChartModal, etc.
│   └── ...                 # Shared components
├── lib/
│   ├── ckan-api.ts         # CKAN API helpers
│   └── mdx-generator.ts    # MDX utilities
└── public/                 # Static assets (logos, icons)
```

See `COMPONENT_MAP.md` for detailed component locations.

## Workflow

### With PortalJS
```bash
# Terminal 1: CKAN (Docker)
docker start ckan-sandbox_ckan_sbx_1

# Terminal 2: PortalJS (public portal)
cd ~/projects/portaljs-fresh-test
npm run dev  # http://localhost:3000

# Terminal 3: Admin Dashboard
cd ~/projects/dathere-admin-dashboard  
npm run dev  # http://localhost:3001
```


## Key Features Explained

### Dataset Management
- Create datasets with metadata (title, description, tags)
- Upload multiple resources (CSV, Excel, PDF, images)
- Assign to organizations
- Set public/private visibility
- Edit and delete operations

### Story System
- Write data stories using Markdown
- Embed 12 types of interactive charts
- Live preview with MDX compilation
- Formatting toolbar for ease of use
- Visual chart builder modal
- Auto-save functionality

### User Management
- Create and edit users
- Assign admin or member roles
- Track user activity
- Profile pages with stats

### Organization Management
- Create hierarchical organizations
- Upload logos
- Assign datasets to organizations
- Manage members

### Theme System
- Toggle between dark and light modes
- Persists preference in localStorage
- Consistent across all pages
- Theme-aware logo switching

## API Routes

All API routes are in `app/api/`:

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### CKAN Proxy
- `GET /api/ckan/package_list` - List all datasets
- `POST /api/ckan/package_create` - Create dataset
- `POST /api/ckan/package_patch` - Update dataset
- `POST /api/ckan/package_delete` - Delete dataset
- `POST /api/ckan/resource_create` - Upload file
- `POST /api/ckan/resource_delete` - Delete file
- Similar routes for users, orgs, groups

### Stories
- `POST /api/stories/create` - Create story
- `PUT /api/stories/update` - Update story
- `GET /api/stories/get` - Get story by slug
- `DELETE /api/stories/delete` - Delete story

## Troubleshooting

### File Upload Fails
- Check CKAN file upload limit in `ckan.ini`
- Verify CKAN_API_URL in `.env.local`
- Check CKAN filestore permissions

### CORS Errors
- Enable CORS in CKAN config
- Add dashboard URL to whitelist
- Restart CKAN after config changes

### Stories Not Showing
- Check PORTALJS_STORIES_PATH is correct
- Verify content/stories folder exists
- Check file permissions

### Theme Not Persisting
- Check localStorage is enabled
- Clear browser cache
- Check console for errors

## Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request


## Support

For issues or questions:
- GitHub Issues: https://github.com/dathere/dathere-admin-dashboard/issues
- Email: mustaaq@dathere.com

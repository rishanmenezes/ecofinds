# EcoFinds

EcoFinds is an innovative e-commerce platform designed to connect users with sustainable and eco-friendly products. Our mission is to make conscious consumption accessible and convenient, fostering a community that values environmental responsibility.

## Features

- **User Authentication:** Secure sign-up and login powered by Supabase.
- **Product Listings:** Browse and discover a wide range of eco-friendly products.
- **Shopping Cart:** Add and manage products before checkout.
- **User Profiles:** Personalize your experience and manage your listings.
- **Responsive Design:** Seamless experience across various devices.

## Technologies Used

- **Frontend:**
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn UI
  - Radix UI
  - React Router DOM
  - React Hook Form
  - TanStack Query
  - Recharts
- **Backend/Database:**
  - Supabase (PostgreSQL, Authentication, Storage)

## Installation

To get EcoFinds up and running on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd "EcoFinds - Original - Copy"
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add your Supabase project details:

    ```env
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

    You can find these credentials in your Supabase project settings.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    bun run dev
    ```

    The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

-   **Browse Products:** Navigate to the home page to view available eco-friendly products.
-   **Authentication:** Sign up or log in to access personalized features.
-   **Add Listings:** If you're a seller, create and manage your product listings.
-   **Shopping:** Add items to your cart and proceed to checkout.

## Project Structure

```
EcoFinds/
├── public/
├── src/
│   ├── App.tsx
│   ├── components/       # Reusable UI components (e.g., Layout, Product, ui)
│   ├── hooks/            # Custom React hooks (e.g., useAuth, use-mobile)
│   ├── integrations/     # Third-party service integrations (e.g., Supabase)
│   ├── lib/              # Utility functions (e.g., utils.ts)
│   ├── pages/            # Application pages (e.g., Auth, Feed, AddProduct)
│   └── main.tsx
├── supabase/             # Supabase configuration and migrations
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite build configuration
└── README.md             # Project documentation
## Contributing

We welcome contributions to EcoFinds! Please feel free to fork the repository, create a new branch, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

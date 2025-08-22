The setup involves installing prerequisites, configuring environment variables, and starting the database. Once set up, you can use npm run scripts to execute the CLI commands.

## Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js (v18 or higher)

NPM (comes with Node.js)

Docker and Docker Compose

## 1. One-Time Setup
Follow these steps to configure the project for the first time.

# Clone the Repository: Open your terminal and clone the project from GitHub.

git clone <your-repository-url>
cd <repository-folder>


# Install Dependencies: Install the required Node.js packages.

npm install

# Configure Environment Variables: Create a .env file by copying the example file.

Now, open the .env file and add your MongoDB connection URI and an optional GitHub Personal Access Token to increase API rate limits.
MONGO_URI="mongodb://localhost:27017/orgpulse"
GITHUB_TOKEN="your_github_token_here"

# Start the Database: Use Docker Compose to start the MongoDB container in the background.

docker compose up -d

# Initialize the Database: Run the init command to create the necessary indexes in MongoDB for efficient querying.

orgpulse init

## 2. Running Commands
Once the setup is complete, you can use the following commands to operate the tool.

# Fetch Data from an Organization:

orgpulse -- fetch <organization-name>
Example: orgpulse fetch vercel

# Resume an Interrupted Fetch:
If a fetch command fails, simply run it again. The tool will read the checkpoint.json file and resume where it left off.

# View Top Repositories:

orgpulse sort <organization-name> --metric <metric> --limit <number>
Example: orgpulse sort vercel --metric stars --limit 5

# Export Data to CSV:

orgpulse export <organization-name> <fileName>
Example: orgpulse export vercel vercel-repos.csv


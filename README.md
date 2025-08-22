The setup involves installing prerequisites, configuring environment variables, and starting the database. Once set up, you can use npm run scripts to execute the CLI commands.

## Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js (v18 or higher)

NPM (comes with Node.js)

Docker and Docker Compose

## 1. One-Time Setup
Follow these steps to configure the project for the first time.

### Clone the Repository: Open your terminal and clone the project from GitHub.

git clone <your-repository-url>
cd <repository-folder>


### Install Dependencies: Install the required Node.js packages.

npm install

### Configure Environment Variables: Create a .env file by copying the example file.

Now, open the .env file and add your MongoDB connection URI and an optional GitHub Personal Access Token to increase API rate limits.
MONGO_URI="mongodb://localhost:27017/orgpulse"
GITHUB_TOKEN="your_github_token_here"

### Start the Database: Use Docker Compose to start the MongoDB container in the background.

docker compose up -d

### Initialize the Database: Run the init command to create the necessary indexes in MongoDB for efficient querying.
```
orgpulse init
```

## 2. Running Commands
Once the setup is complete, you can use the following commands to operate the tool.

### Fetch Data from an Organization:

orgpulse fetch <organization-name>
Example:
```
orgpulse fetch vercel
```
### Resume an Interrupted Fetch:
If a fetch command fails, simply run it again. The tool will read the checkpoint.json file and resume where it left off.

### View Top Repositories:

orgpulse sort <organization-name> --metric <metric> --limit <number>
Example:
```
orgpulse sort vercel --metric stars --limit 5
```
### Export Data to CSV:

orgpulse export <organization-name> <fileName>
Example: 
```
 orgpulse export vercel vercel-repos.csv
```

### Fetch Contributors of a Repository:

orgpulse contributors <organization-name> <repoName> --order <order> --limit <limit>
Example: 
```
 orgpulse contributors vercel ms --order desc --limit 6
```

### Refresh Stars and openIssues of all repositories of an organisation:

orgpulse sync-stars <organization-name>
Example: 
```
orgpulse sync-stars vercel
```
    

## 3.Field Mapping Note & Debug Diary 
<img src="https://github.com/user-attachments/assets/93ab793d-b022-4620-98e0-8587a79736b9" alt="Field Mapping Notes" width="350"/>


## 4.Debug Diary

The Bug: The Infinite Pagination Loop

During development, the fetch command would work for small orgs but would never finish for larger ones like microsoft or google. It appeared to be stuck in an infinite loop, continuously fetching the same page of repositories.

The Buggy Code Snippet:
This was my initial logic for handling pagination inside my getResources utility.


### // Falsy Code


    const getResources = async (link, fetchingIssues) => {

    let nextPageUrl = link;
    let result = [];
    
    console.log("Fetching all resources... Please wait");
    
    while (nextPageUrl) {
        const response = await makeRequestWithRetry({
            url: nextPageUrl,
            method: "GET",
        });
        
      result = [...result, ...response.data];
        
        // The bug is here: If fetchingIssues is true, or if it's the last page
        // for repos, nextPageUrl is never reset to null. The loop will run
        // forever using the same last page URL.
        
        if (!fetchingIssues) {
            const nextLink = getNextPageUrl(response.headers.link);
            if (nextLink) {
                nextPageUrl = nextLink;
            }
        }
    }
    return result;
    };
    
This buggy version fails because if !fetchingIssues is false, or if it's the last page and getNextPageUrl returns null, the if block is skipped, and nextPageUrl is never updated. It retains its old value, and the while (nextPageUrl) condition remains true forever.

### The Fix:
The fix was to ensure nextPageUrl was explicitly set to null if a "next" link was not found, which terminates the while loop.


// Fixed code

    const getResources = async (link, fetchingIssues) => {
    let nextPageUrl = link;
    let result = [];
    
    console.log("Fetching all resources... Please wait");
    
    while (nextPageUrl) {
        const response = await makeRequestWithRetry({
            url: nextPageUrl,
            method: "GET",
        });

     result = [...result, ...response.data];
     
        
        // fix : explicitly det nextPageUrl to null to avoid infinite pagination loop
        nextPageUrl = null;
        if (!fetchingIssues) {
            const nextLink = getNextPageUrl(response.headers.link);
            if (nextLink) {
                nextPageUrl = nextLink;
            }
        }
    }
    return result;
    };

## 5. Handwirtten mini flowChart of pagination/checkpoint logic

<img src="https://github.com/user-attachments/assets/664f7955-98d9-4e1c-8c46-e3ab9d7a4aaa" alt="Mini flowChart" width="300"/>



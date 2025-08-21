import { Command } from 'commander'
import { configDotenv } from 'dotenv';
import { initDB } from '../cli/initDB.js';
import { fetchOrgData } from '../cli/fetch.js';
import { showTopRepos } from '../cli/top.js';
import { exportRepos } from '../cli/exportAsCSV.js';

configDotenv({
    path : '.env'
})

const program = new Command();



program
    .name('orgpulse')
    .description('a github CLI tool to export organization\'s repositories and openIssues')
    .version('1.0.0');

program
    .command('init')
    .description('initialize the database')
    .action(initDB)
    
program
    .command('fetch <orgName>')
    .description('fetch all repositories for the organization')
    .action(fetchOrgData)
    
program
    .command('sort <orgName>')
    .option('-m, --metric <metric>', 'sort by issues or stars')
    .option('-l, --limit <limit>', 'limit the number of repos to show')
    .description('fetch all repositories for the organization')
    .action(showTopRepos)

program
    .command('export <repoName> <filePath>')
    .description('fetch all repositories for the organization')
    .action(exportRepos)






program.parse(process.argv)
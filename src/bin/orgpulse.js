import { Command } from 'commander'
import dotenv from 'dotenv';
import { initDB } from '../cli/initDB.js';
import { fetchOrgData } from '../cli/fetch.js';
import { showTopRepos } from '../cli/top.js';
import { exportRepos } from '../cli/exportAsCSV.js';
import { getContributors } from '../cli/topContributors.js';

dotenv.configDotenv({
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
    .description('fetch all repositories for an organization')
    .action(fetchOrgData)
    
program
    .command('sort <orgName>')
    .option('-m, --metric <metric>', 'sort by issues or stars')
    .option('-l, --limit <limit>', 'limit the number of repos to show')
    .description('sort repos of an organisation')
    .action(showTopRepos)

program
    .command('export <repoName> <filePath>')
    .description('export repo as a csv file')
    .action(exportRepos)

program
  .command('contributors <orgName> <repoName>')
  .description('fetch all contributors of a repo')
  .option('-o, --order <order>', 'sort order: asc or desc')
  .option('-l, --limit <limit>', 'number of contributors to display')
  .action(getContributors);

program.parse(process.argv)
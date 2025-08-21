import { Command } from 'commander'
import { configDotenv } from 'dotenv';
import { initDB } from '../cli/initDB';
import { initDB } from '../cli/initDB';

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
    .command('fetch --org <orgName>')
    .description('fetch all repositories for the organization')
    .action(initDB)

program
    .command('fetch --org <orgName> --repo <repoName>')
    .description('fetch all issues for the repository')
    .action(initDB)

program
    .command('fetch --org <orgName> --repo <repoName>')
    .description('fetch all issues for the repository')
    .action(initDB)




program.parse(process.argv)
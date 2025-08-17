import { Command } from 'commander'
import { configDotenv } from 'dotenv';

configDotenv({
    path : '.env'
})

const program = new Command();



program
    .name('orgpulse')
    .description('a github CLI tool to export organization\'s repositories and openIssues')
    .version('1.0.0');


program.parse(process.argv)
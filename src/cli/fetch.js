import fs from 'fs/promises'
import { getAllIssues, getAllRepos } from '../github/commandsApi.js'
import plimit from 'p-limit';
import { repoModel } from '../models/repo.model.js';
import { issueModel } from '../models/issues.model.js';
import { connectDB } from '../db/connectDB.js';

const CHECKPOINT_FILE = '../../checkpoint.json';


function mapRepo(apiRepo) {
    return {
        org_name: apiRepo.owner.login,
        url : apiRepo.html_url,
        repo_name: apiRepo.name,
        description: apiRepo.description,
        topics: apiRepo.topics,
        language: apiRepo.language ? apiRepo.language : null,
        stars: apiRepo.stargazers_count,
        forks: apiRepo.forks_count,
        openIssues: apiRepo.open_issues_count,
        license: apiRepo.license?.spdx_id ? apiRepo.license.spdx_id : null,
        pushedAt: apiRepo.pushed_at,
    };
}


const fetchOrgData = async (orgName) => {

    await connectDB();

    console.log(`Fetching all repos for ${orgName}...`);

    const allRepos = await getAllRepos(orgName);


    const limit = plimit(5);

    const tasks = allRepos.map(repo => limit(async () => {
        console.log(`Processing repo: ${repo.name}`);
     
        const repoDoc = mapRepo(repo);
        await repoModel.updateOne(
            { org_name: repo.owner.login, repo_name: repo.name },
            { $set: repoDoc },
            { upsert: true })

        const issues = await getAllIssues(orgName, repo.name);
        if (issues.length > 0) {
            const issueOps = issues.map(issue => ({
                updateOne: {
                    filter: { repo: issue.repository_url.split('/').slice(-2).join('/'), number: issue.number },
                    update: { $set: issue },
                    upsert: true
                }
            }));
            await issueModel.bulkWrite(issueOps);
        }

        await fs.writeFile(CHECKPOINT_FILE, JSON.stringify({ lastProcessedRepo: repo.name }));
    }));

    await Promise.all(tasks);
    console.log('Fetch complete.');
    process.exit(0);
}

export {fetchOrgData}
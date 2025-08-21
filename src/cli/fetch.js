// src/cli/fetch.js
import fs from 'fs/promises'
import { connectDB } from '../DB/connectDB';
import { getAllIssues, getAllRepos } from '../github/commandsApi.js'
import plimit from 'p-limit';
import { repoModel } from '../Models/repo.model.js';
import { issueModel } from '../models/issues.model.js';

const CHECKPOINT_FILE = '../../checkpoint.json';

// Pure mapping function (good for unit testing!)
function mapRepo(apiRepo) {
    return {
        org_name: apiRepo.owner.login,
        name: apiRepo.name,
        description: apiRepo.description,
        topics: apiRepo.topics,
        language: apiRepo.language,
        stars: apiRepo.stargazers_count,
        forks: apiRepo.forks_count,
        openIssues: apiRepo.open_issues_count,
        license: apiRepo.license ? apiRepo.license.spdx_id : null,
        pushedAt: apiRepo.pushed_at,
    };
}


async function fetchOrgData(org, { since }) {

    console.log(`Fetching all repos for ${org}...`);

    const allRepos = await getAllRepos(org);

    const limit = plimit(5);

    const tasks = allRepos.map(repo => limit(async () => {
        console.log(`Processing repo: ${repo.name}`);
     
        const repoDoc = mapRepo(repo);
        await repoModel.updateOne(
            { org_name: repo.owner.login, name: repo.name },
            { $set: repoDoc },
            { upsert: true })

        const issues = await getAllIssues(org, repo.name);
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

        // 3. Update checkpoint
        await fs.writeFile(CHECKPOINT_FILE, JSON.stringify({ lastProcessedRepo: repo.name }));
    }));

    await Promise.all(tasks);
    console.log('Fetch complete.');
    process.exit(0);
}

module.exports = { fetchOrgData };
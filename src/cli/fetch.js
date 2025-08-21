import fs from 'fs/promises'
import { getAllIssues, getAllRepos } from '../github/commandsApi.js'
import plimit from 'p-limit';
import { repoModel } from '../models/repo.model.js';
import { issueModel } from '../models/issues.model.js';
import { connectDB } from '../db/connectDB.js';

const CHECKPOINT_FILE = './checkpoint.json';

function mapRepo(apiRepo) {
  return {
    org_name: apiRepo.owner.login,
    url: apiRepo.html_url,
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
  try {
    await connectDB();

    let lastProcessedRepo = null;
    try {
      const checkpointData = await fs.readFile(CHECKPOINT_FILE, 'utf8');
      lastProcessedRepo = JSON.parse(checkpointData).lastProcessedRepo;
      if (lastProcessedRepo) console.log(`Resuming from after: ${lastProcessedRepo}`);
    } catch (e) {
      console.log('No valid checkpoint. Starting fresh.');
    }

    console.log(`Fetching all repos for ${orgName}...`);
    let allRepos = await getAllRepos(orgName);

    if (lastProcessedRepo) {
      const resumeIndex = allRepos.findIndex(repo => repo.name === lastProcessedRepo);
      if (resumeIndex !== -1) {
        allRepos = allRepos.slice(resumeIndex + 1);
        console.log(`Resuming with ${allRepos.length} remaining repos.`);
      }
    }

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

  } catch (error) {
    console.error("Fetch failed:", error);
  } finally {
    process.exit(0);
  }
};

export { fetchOrgData };
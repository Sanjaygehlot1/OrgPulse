import { connectDB } from "../db/connectDB.js";
import { repoModel } from "../models/repo.model.js";


async function showTopRepos(orgName, { metric, limit }) {

    console.log(`Showing top ${metric} repos for ${orgName}...`);

    try {
        await connectDB();
        const sortKey = metric === 'issues' ? 'openIssues' : 'stars';
        console.log(metric,limit,sortKey,orgName)

        const topRepos = await repoModel
            .find({ org_name: orgName })
            .sort({ [sortKey]: -1 })
            .limit(parseInt(limit, 10))

            if(topRepos.length === 0){
                console.log(`No repositories found for ${orgName}`);
                process.exit(0);
            }


        console.table(topRepos.map(r => ({ "Repository Name": r.repo_name, Stars: r.stars, openIssues: r.openIssues })));
        process.exit(0);

    } catch (error) {
        console.log(error);
    }

}

export { showTopRepos };
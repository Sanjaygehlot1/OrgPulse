import { connectDB } from "../db/connectDB.js";
import { repoModel } from "../models/repo.model.js";
import { AxiosInstance } from "../utils/axiosInstance.js";

const refresh = async (orgName) => {

    try {
        await connectDB();
        console.log(`fetching latest updated for repos of Org : ${orgName}`)

        const response = await AxiosInstance.get(`/orgs/${orgName}/repos?per_page=100`);

        const updates = await Promise.all(
            response.data.map((repo) =>
                repoModel.updateOne(
                    { org_name: orgName, repo_name: repo.name },
                    {
                        stars: repo.stargazers_count,
                        forks: repo.forks_count,
                        openIssues: repo.open_issues_count,
                    }
                )
            )
        )

        const matchedTotal = updates.reduce((sum, result) => sum + result.matchedCount, 0)
        
        const modifiedTotal = updates.reduce((sum, result) => sum + result.modifiedCount, 0)

        if (matchedTotal === 0) {
            console.log("No repositories found for this organization in the database.")
        } else {
            if(modifiedTotal === 0){
                console.log("already up-to date. No changes found");
            }else{
                console.log(`${modifiedTotal} ${modifiedTotal == 1 ? 'repository' : 'repositories'} updated.`)
            }
        }
        console.log(`fetch to see updated details`);
        process.exit(0);
    } catch (error) {
        console.log('Error updating details : ', error.message)
    }



}

export { refresh };
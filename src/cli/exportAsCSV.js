import fs from "fs/promises";
import { Parser } from "json2csv";
import {connectDB} from "../db/connectDB.js";
import {repoModel} from "../models/repo.model.js";

const exportRepos = async (orgName, fileName) => {
  try {
    await connectDB();

    const repos = await repoModel.find({ org_name: orgName }).lean();

    if(repos.length === 0){
        console.log(`No repositories found for ${orgName}`);
        process.exit(0);
    }

    

    const fields = [
      { label: "Repository Name", value: "repo_name" },
      { label: "Stars", value: "stars" },
      { label: "Open Issues", value: "openIssues" },
      { label: "Forks", value: "forks" },
      { label: "Language", value: "language" },
      { label: "License", value: "license" },
      {
        label: "Last Push Date",
        value: (row) => row.pushedAt?.toISOString?.() || row.pushedAt,
      },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(repos);

    await fs.writeFile(fileName, csv, {flag :'w'});

    console.log(`Exported ${repos.length} repos to ${fileName}`);
  } catch (err) {
    console.error("Error exporting repos:", err.message);
  } finally {
    process.exit(0); 
  }
}

export {exportRepos}
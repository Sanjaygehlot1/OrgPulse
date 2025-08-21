import axios from "axios";
import { connectDB } from "../db/connectDB.js";
import { contributorsModel } from "../models/contributors.model.js";
import { AxiosInstance } from "../utils/axiosInstance.js";

const contributorsInterface = (doc) => {
     return (
          {
               name: doc.login,
               contributions: doc.contributions,
               type: doc.type,
               url: doc.url,
          }
     )
}


const getContributors = async (orgName, repoName,options) => {

     const { order = "desc", limit } = options;

     await connectDB();

     const response = await AxiosInstance.get(`repos/${orgName}/${repoName}/contributors?per_page=100`);

      if(response.data.length === 0){
                console.log(`No contributors found for repo :${repoName} and org : ${orgName}`);
                process.exit(0);
            }


     await Promise.all(
    response.data.map(async (doc) => {
      const data = contributorsInterface(doc);
      await contributorsModel.updateOne(
        { org_name: orgName, repo_name: repoName, name: doc.login },
        { $set: { ...data, org_name: orgName, repo_name: repoName } },
        { upsert: true }
      );
    })
  );

     const sortOrder = order == "desc" ? -1 : 1

     const dbRes = await contributorsModel
          .find({ org_name: orgName, repo_name: repoName })
          .sort({ contributions : sortOrder })
          .limit(parseInt(limit, 10))


           if(dbRes.length === 0){
                console.log(`No contributors found for repo :${repoName} and org : ${orgName}`);
                process.exit(0);
            }


     console.table(dbRes.map((res) => ({Name : res.name, Type : res.type, Contributions : res.contributions, Profile : res.url})));
     process.exit(0);


}


export { getContributors }
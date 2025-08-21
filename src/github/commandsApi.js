import { AxiosInstance } from "../utils/axiosInstance";


const getNextPageUrl = (link) => {

    if (!link) return null;

    const nextLink = link
        .split(',')
        .map(item => item.trim().endsWith('rel="next"'))[0];

    return nextLink ? nextLink.split(';')[0].slice(1, -1) : null;

}

const getResourses = async (link) =>{
    let nextPageUrl = link;
    let result = [];
    console.log('fetching all issues for you... please wait')
    while (nextPageUrl) {
        const respose = await AxiosInstance.get(nextPageUrl);
        result = [...result, ...respose.data];

        nextPageUrl = getNextPageUrl(respose.headers.link);

    }

    return result;
}

const getAllRepos = async (orgName) => {

   return await getResourses(`/orgs/${orgName}/repos?per_page=100`)

}

const getAllIssues = async (orgName, repoName) => {

       return await getResourses(`/orgs/${orgName}/repos/${repoName}/issues?per_page=100`)

}

export {getAllRepos,getAllIssues};

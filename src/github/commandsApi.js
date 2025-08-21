import { AxiosInstance } from "../utils/axiosInstance.js";


async function makeRequestWithRetry(config, retries = 3, delay = 1000) {
    try {
        
        return await AxiosInstance(config);
    } catch (error) {
        if (error.response) {
            const { status, headers } = error.response;

           
            if (status === 403 && headers['x-ratelimit-remaining'] === '0') {
                const resetTime = new Date(headers['x-ratelimit-reset'] * 1000);
                const waitTime = resetTime.getTime() - Date.now();

                if (waitTime > 0) {
                    console.warn(
                        `Rate limit hit. Waiting for ${Math.ceil(waitTime / 1000)}s...`
                    );
                    await new Promise((res) => setTimeout(res, waitTime));
                    return makeRequestWithRetry(config, retries, delay); 
                }
            }

            if (status >= 400 && status < 500) {
                console.error(
                    `Request failed with status ${status}. Not retrying.`
                );
                
            }
        }

        if (retries > 0 && error.response.status != 401) {
            console.warn(
                `Request failed. Retrying in ${delay / 1000}s... (${retries} retries left)`
            );
            await new Promise((res) => setTimeout(res, delay));
            return makeRequestWithRetry(config, retries - 1, delay * 2);
        }
        

        throw error.response.data.message;
    }
}

 
const getNextPageUrl = (linkHeader) => {
    if (!linkHeader) return null;

    const links = linkHeader.split(",");
    for (const link of links) {
        const [urlPart, relPart] = link.split(";");
        if (relPart && relPart.includes('rel="next"')) {
            return urlPart.trim().slice(1, -1);
        }
    }
    return null;
};

 
const getResources = async (link) => {
    let nextPageUrl = link;
    let result = [];

    console.log("Fetching all resources... Please wait");

    while (nextPageUrl) {
        const response = await makeRequestWithRetry({
            url: nextPageUrl,
            method: "GET",
        });

        

        result = [...result, ...response.data];

        nextPageUrl = getNextPageUrl(response.headers.link);
    }

    return result;
};
 
const getAllRepos = async (orgName) => {
    return await getResources(`/orgs/${orgName}/repos?per_page=100`);
};

 
const getAllIssues = async (orgName, repoName) => {
    return await getResources(
        `/repos/${orgName}/${repoName}/issues?per_page=100`
    );
};

export { getAllRepos, getAllIssues };

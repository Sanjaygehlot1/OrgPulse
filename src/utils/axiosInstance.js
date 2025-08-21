import axios from 'axios';




const AxiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 30000,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'orgpulse-cli',
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});





export  {AxiosInstance};

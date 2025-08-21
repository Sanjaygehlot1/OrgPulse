import axios from 'axios';
import dotenv from 'dotenv'

dotenv.configDotenv({
    path : '.env'
})

const githubToken = process.env.GITHUB_TOKEN;


const AxiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 30000,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'orgpulse-cli',
    Authorization: `token ${githubToken}`,
  },
});





export  {AxiosInstance};

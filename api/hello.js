export default function hello(request, response) {
    response.status(200).json({
        body: request.body,
        repo: process.env.REPO_NAME,
        owner: process.env.REPO_OWNER,
        path: process.env.REPO_PATH
    })
}
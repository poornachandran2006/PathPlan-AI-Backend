import requests

GITHUB_API = "https://api.github.com"


def fetch_github_profile(username: str) -> dict:
    user_res = requests.get(f"{GITHUB_API}/users/{username}")
    repo_res = requests.get(f"{GITHUB_API}/users/{username}/repos")

    if user_res.status_code != 200:
        return {"error": "GitHub user not found"}

    profile = user_res.json()
    repos = repo_res.json()

    repo_data = []
    for repo in repos:
        repo_data.append({
            "name": repo.get("name"),
            "description": repo.get("description"),
            "language": repo.get("language"),
            "stars": repo.get("stargazers_count"),
            "forks": repo.get("forks_count"),
            "updated_at": repo.get("updated_at"),
            "has_readme": repo.get("has_pages")
        })

    return {
        "username": profile.get("login"),
        "public_repos": profile.get("public_repos"),
        "followers": profile.get("followers"),
        "repo_summary": repo_data
    }

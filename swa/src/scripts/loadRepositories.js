// async function loadRepositories(count = 6) {
//   const response = await fetch(`https://api.github.com/users/clowa/repos?sort=pushed&direction=desc&per_page=${count}`);
//   if (!response.ok) {
//       throw new Error('Network response was not ok ' + response.statusText);
//   }
//   const repos = await response.json();
//   return repos;
// }

async function loadRepositories(repositories = array(string)) {
  const repos = [];

  for (const r of repositories) {
    const response = await fetch(`https://api.github.com/repos/clowa/${r}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }
    const repo = await response.json();
    repos.push(repo);
  }

  return repos;
}

export default loadRepositories;
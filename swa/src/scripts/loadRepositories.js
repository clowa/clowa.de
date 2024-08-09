async function loadRepositories(count = 6) {
  const response = await fetch(`https://api.github.com/users/clowa/repos?sort=pushed&direction=desc&per_page=${count}`);
  if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
  }
  const repos = await response.json();
  return repos;
}

export default loadRepositories;
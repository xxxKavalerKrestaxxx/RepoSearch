const searchInput = document.querySelector(".search-input");
const autoCompleteResults = document.querySelector(".autocomplete-results");
const repoList = document.querySelector(".repo-list");

function autoComplete(items) {
	if (!items.length) {
		autoCompleteResults.classList.remove("disp-block");
		return;
	}
	autoCompleteResults.textContent = "";
	items.forEach((item) => {
		const elementList = document.createElement("li");
		elementList.classList.add("element-list");
		elementList.textContent = item.full_name;
		elementList.addEventListener("click", () => {
			addToRepoList(item);
			searchInput.value = "";
			autoCompleteResults.classList.remove("disp-block");
		});
		autoCompleteResults.appendChild(elementList);
	});
	autoCompleteResults.classList.add("disp-block");
}

function debounce(func, time) {
	let timeOut;
	return function (...args) {
		clearTimeout(timeOut);
		timeOut = setTimeout(() => func.apply(this, args), time);
	};
}

function searchRepos(query) {
	const queryTrue = query.trim();
	if (!queryTrue) {
		autoCompleteResults.classList.remove("disp-block");
		return;
	}
	fetch(
		`https://api.github.com/search/repositories?q=${queryTrue}&per_page=5`
	)
		.then((response) => response.json())
		.then((data) => autoComplete(data.items))
		.catch((error) => console.log(error));
}

function addToRepoList(repo) {
	const li = document.createElement("li");
	li.classList.add("list-class");
	const repoInfo = document.createElement("div");
	repoInfo.classList.add("repo-saved");
	const name = document.createElement("strong");
	name.textContent = repo.full_name;
	const author = document.createElement("div");
	author.textContent = `Owner: ${repo.owner.login}`;
	const stars = document.createElement("div");
	stars.textContent = `Stars: ${repo.stargazers_count}`;

	repoInfo.appendChild(name);
	repoInfo.appendChild(author);
	repoInfo.appendChild(stars);
	li.appendChild(repoInfo);

	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete";
	deleteBtn.classList.add("delete-btn");
	deleteBtn.addEventListener("click", () => li.remove());
	li.appendChild(deleteBtn);

	repoList.appendChild(li);
}

searchInput.addEventListener(
	"input",
	debounce((event) => {
		const searchText = event.target.value;
		searchRepos(searchText);
	}, 500)
);

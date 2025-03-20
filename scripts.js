// fetch all folder paths of the generators from `folders.json`
let folderPaths = [];

async function fetch_folders() {
  await fetch("./folders.json")
    .then((response) => response.json())
    .then((data) => {
      folderPaths = data.folder_paths;
    });
}

async function get_generator_card_footer() {
  await fetch_folders();
  const repoOwner = "LifeAdventurer";
  const repoName = "generators";
  for (let folderIndex = 1; folderIndex <= folderPaths.length; folderIndex++) {
    const folderPath = folderPaths[folderIndex - 1];
    const apiUrl =
      `https://api.github.com/repos/${repoOwner}/${repoName}/commits?path=${folderPath}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // the latest commit will be at the top of the list
        const lastCommit = data[0].commit.author.date;
        const commitTimeStamp = new Date(lastCommit).getTime() / 1000;
        const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
        const timeDifference = currentTimeStamp - commitTimeStamp;

        $(`#last-update-${folderIndex}`).html(
          `Last updated ${format_time_difference(timeDifference)} ago`,
        );
      });
    // .catch(error => console.error('Error fetching data:', error));
  }
}

// determine whether it is seconds, minutes, hours, or days ago
function format_time_difference(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  }
}

get_generator_card_footer();

const darkModeIcon = document.querySelector("#dark-mode-icon");

darkModeIcon.onclick = () => {
  darkModeIcon.classList.toggle("bx-sun");
  document.body.classList.toggle("dark-mode");
};

// temporary
let max_height = -1;
document.querySelectorAll('.card-body').forEach(el => max_height = Math.max(max_height, el.offsetHeight));
document.querySelectorAll('.card-body').forEach(el => el.style.height = `${max_height}px`);

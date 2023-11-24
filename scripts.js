// fetch all folder paths of the generators from `folders.json`
let folderPaths = []

async function fetch_folders(){
  await fetch('./folders.json')
  .then(response => response.json())
  .then(data => {
    folderPaths = data.folder_paths;
    // console.log(folderPaths);
  })
}
  
const repoOwner = 'LifeAdventurer'; 
const repoName = 'generators'; 

async function generator_card_footer(){
  await fetch_folders()
  // console.log(folderPaths);
  for(let i = 0; i < folderPaths.length; i++){
    let folderPath = folderPaths[i];
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?path=${folderPath}`;
    console.log(apiUrl);

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // the latest commit will be at the top of the list
      let lastCommit = data[0].commit.author.date; 
      const commitTimeStamp = new Date(lastCommit).getTime() / 1000;
      const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
      const timeDifference = currentTimeStamp - commitTimeStamp;
      
      // console.log(timeSinceLastUpdate);
      $(`#last-update-${i + 1}`).html(`Last updated ${formatTimeDifference(timeDifference)} ago`)
    })
    .catch(error => console.error('Error fetching data:', error));
  }
}

// determine whether it is seconds, minutes, hours, or days ago
function formatTimeDifference(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if(days > 0){
    return `${days} day${days > 1 ? 's' : ''}`;
  } 
  else if(hours > 0){
    return `${hours} hour${hours > 1 ? 's' : ''}`;    
  } 
  else if(minutes > 0){
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } 
  else{
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
}

generator_card_footer()
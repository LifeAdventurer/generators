const repoOwner = 'LifeAdventurer'; 
const repoName = 'generators'; 
const folderPath_1 = 'fortune_generator';
const folderPath_2  = 'quote_generator';
const apiUrl_1 = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?path=${folderPath_1}`;
const apiUrl_2 = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?path=${folderPath_2}`;

let timeSinceLastUpdate_1;
fetch(apiUrl_1)
.then(response => response.json())
.then(data => {
  let lastCommit = data[0].commit.author.date; 
  const commitTimeStamp = new Date(lastCommit).getTime() / 1000;
  const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
  const timeDifference = currentTimeStamp - commitTimeStamp;
  
  timeSinceLastUpdate_1 = formatTimeDifference(timeDifference);
  $('#last-update-1').html(`Last updated ${timeSinceLastUpdate_1} ago`)
})
.catch(error => console.error('Error fetching data:', error));


let timeSinceLastUpdate_2;
fetch(apiUrl_2)
.then(response => response.json())
.then(data => {
  let lastCommit = data[0].commit.author.date; 
  const commitTimeStamp = new Date(lastCommit).getTime() / 1000;
  const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
  const timeDifference = currentTimeStamp - commitTimeStamp;
  
  timeSinceLastUpdate_2 = formatTimeDifference(timeDifference);
  $('#last-update-2').html(`Last updated ${timeSinceLastUpdate_2} ago`)
})
.catch(error => console.error('Error fetching data:', error));

function formatTimeDifference(seconds){
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

// $('#last-update-2').html(`Last updated ${timeSinceLastUpdate} ago`)
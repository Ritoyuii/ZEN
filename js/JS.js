const API_KEY = '1c4884e53c1f6bd16ebb4eb65f86c74d'; 

function sendMessage() {
  const input = document.getElementById('userInput').value;
  const chatBody = document.getElementById('chatBody');
  
  if (input.trim() === "") return;

  chatBody.innerHTML += `<div><strong>Tú:</strong> ${input}</div>`;
  document.getElementById('userInput').value = ""; 

  searchMovie(input).then(result => {
    if (result) {
      chatBody.innerHTML += `<div><strong>DANY:</strong> Puedes ver <strong>${result.title}</strong> en: ${result.platforms.join(", ")}.</div>`;
      chatBody.innerHTML += `<div><strong>DANY:</strong> Títulos similares: ${result.similar.join(", ")}.</div>`;
    } else {
      chatBody.innerHTML += `<div><strong>DANY:</strong> Lo siento, no tengo información sobre esa película o serie.</div>`;
    }
    chatBody.scrollTop = chatBody.scrollHeight;
  });
}


async function searchMovie(query) {
  try {
 
    const searchResponse = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      const movieId = searchData.results[0].id;
      const title = searchData.results[0].title || searchData.results[0].name;


      const platformsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
      const platformsData = await platformsResponse.json();

      const platforms = platformsData.results && platformsData.results.ES
        ? platformsData.results.ES.flatrate.map(p => p.provider_name)
        : ["Plataformas no encontradas"];


      const similarResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`);
      const similarData = await similarResponse.json();

      const similarTitles = similarData.results && similarData.results.length > 0
        ? similarData.results.slice(0, 3).map(s => s.title)
        : ["No se encontraron títulos similares"];

      return {
        title: title,
        platforms: platforms,
        similar: similarTitles
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al buscar la película/serie:', error);
    return null;
  }
}


function toggleChat() {
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.querySelector('.chat-input');
  if (chatBody.style.display === "none") {
    chatBody.style.display = "block";
    chatInput.style.display = "flex";
  } else {
    chatBody.style.display = "none";
    chatInput.style.display = "none";
  }
}


const chatbox = document.getElementById("chatbox");
const chatHeader = document.getElementById("chatHeader");

let offsetX, offsetY, isDragging = false;

chatHeader.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - chatbox.offsetLeft;
  offsetY = e.clientY - chatbox.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    chatbox.style.left = `${e.clientX - offsetX}px`;
    chatbox.style.top = `${e.clientY - offsetY}px`;
  }
});


document.addEventListener('mouseup', () => {
  isDragging = false;
});


    function getContrastingColor(r, g, b) {
        return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
      }
  
      function generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
  
        const bgColor = `rgb(${r}, ${g}, ${b})`;
        const textColor = getContrastingColor(r, g, b);
  
        return { bgColor, textColor };
      }

      function updateFooterColors() {
        const footer = document.getElementById('dynamic-footer');
        const { bgColor, textColor } = generateRandomColor();
  
        footer.style.backgroundColor = bgColor;
        footer.style.color = textColor;
      }
  
      updateFooterColors();
  
      document.getElementById('dynamic-footer').addEventListener('click', updateFooterColors);
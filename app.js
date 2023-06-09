const searchBar = document.querySelector("#search-bar");
const loadMoreBtn = document.querySelector(".load-more");
const form = document.querySelector(".header-search");
const gallery = document.querySelector(".gallery");
const user = document.querySelector(".user-image");
const personalGallery = document.querySelector(".personal-gallery");
const logo = document.querySelector(".logo");

// TODO: Config api
// ! https://api.unsplash.com/search/photos?page=1&query=office
const API_KEY = "3O0GI4QIziGzIWAXnB4FsIBfq-ts5Pe0RYmalkCfkAA";
const UNSPLASH_API = "https://api.unsplash.com";

// TODO: Global variables
let page = 1;
let per_page = 50;
let storage = JSON.parse(localStorage.getItem("IMAGES") || "[]");

// TODO: Fetch unplash api
async function fetchImages(query) {
  try {
    let response;
    if (!query) {
      response = await fetch(
        `${UNSPLASH_API}/photos?page=${page}&per_page=${per_page}&client_id=${API_KEY}`
      );
    } else {
      response = await fetch(
        `${UNSPLASH_API}/search/photos?page=${page}&query=${query}&per_page=${per_page}&client_id=${API_KEY}`
      );
    }
    const data = await response.json();
    const results = query ? data.results : data;
    renderImages(results);
  } catch (error) {
    console.log(error);
  }
}
fetchImages();

// TODO: Search images
form.addEventListener("submit", handleSearch);
function handleSearch(e) {
  e.preventDefault();
  const searchQuery = searchBar.value;
  gallery.innerHTML = "";
  fetchImages(searchQuery);
}

// TODO: Render images
function renderImages(images) {
  if (!images) return;
  images.forEach((item) => {
    const imageItem = document.createElement("div");
    imageItem.className = "image-item";

    const img = document.createElement("img");
    img.src = item.urls.regular;
    imageItem.appendChild(img);

    const imgMeta = document.createElement("div");
    imgMeta.className = "image-meta";
    imageItem.appendChild(imgMeta);

    const row = document.createElement("div");
    row.className = "row";
    imgMeta.appendChild(row);

    const author = document.createElement("h1");
    author.className = "image-author";
    author.textContent = item.user.first_name;
    row.appendChild(author);

    const span = document.createElement("span");
    span.className = "toggle-add";
    row.appendChild(span);

    const i = document.createElement("i");
    i.className = "fa-solid fa-plus";
    span.appendChild(i);

    span.addEventListener("click", function () {
      span.innerHTML = `<i class="fa-solid fa-check"></i>`;
      span.style.pointerEvents = "none";
      const imageInfo = {
        imageUrl: item.urls.regular,
        author: item.user.first_name,
      };
      storage.push(imageInfo);
      localStorage.setItem("IMAGES", JSON.stringify(storage));
      renderStorage();
    });

    gallery.appendChild(imageItem);
  });
}

// TODO: Load more button
loadMoreBtn.addEventListener("click", function () {
  page++;
  fetchImages(searchBar.value);
});

// TODO: Switch page when click at logo and user-avatar
user.addEventListener("click", function () {
  gallery.style.display = "none";
  loadMoreBtn.style.display = "none";
  personalGallery.style.display = "block";
});
logo.addEventListener("click", function () {
  gallery.style.display = "block";
  loadMoreBtn.style.display = "block";
  personalGallery.style.display = "none";
});

// TODO: Render storage
function renderStorage() {
  personalGallery.innerHTML = "";
  storage.forEach((item) => {
    const template = `<div class="image-item">
    <img src="${item.imageUrl}" alt="" />
    <div class="image-meta">
      <div class="row">
        <h1 class="image-author">${item.author}</h1>
        <span><i class="fa-solid fa-heart"></i></span>
      </div>
    </div>
  </div>`;
    personalGallery.insertAdjacentHTML("beforeend", template);
  });
}
renderStorage();

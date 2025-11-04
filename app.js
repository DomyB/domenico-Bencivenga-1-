const AUTH_PASSWORD = "campus-connect";

const campusLocations = [
  {
    id: "library",
    name: "Main Library",
    description: "Quiet study floors, group collaboration rooms, and a rooftop terrace.",
    tags: ["Study", "Quiet"],
  },
  {
    id: "innovation-hub",
    name: "Innovation Hub",
    description: "Makerspace with 3D printers, tech talks, and startup meetups.",
    tags: ["Tech", "Workshops"],
  },
  {
    id: "quad",
    name: "Central Quad",
    description: "Perfect for casual hangs, picnics, and open-air concerts.",
    tags: ["Outdoor", "Social"],
  },
  {
    id: "sports-center",
    name: "Sports & Wellness Center",
    description: "Group fitness classes, intramural leagues, and wellness events.",
    tags: ["Fitness", "Wellness"],
  },
  {
    id: "art-complex",
    name: "Creative Arts Complex",
    description: "Studio space, film screenings, and gallery nights.",
    tags: ["Arts", "Culture"],
  },
];

const cityEvents = [
  {
    title: "Riverfront Jazz Nights",
    category: "Music",
    location: "Riverside Amphitheater",
    date: "2024-06-14",
    time: "19:30",
    description: "Weekly sunset concerts featuring local jazz ensembles and guest performers.",
    cost: "Free with student ID",
  },
  {
    title: "Tech & Startups Mixer",
    category: "Networking",
    location: "District 9 CoLab",
    date: "2024-06-18",
    time: "18:00",
    description: "Connect with founders, investors, and fellow innovators across the city.",
    cost: "$10",
  },
  {
    title: "Farm-to-Table Night Market",
    category: "Food",
    location: "Old Town Market Square",
    date: "2024-06-20",
    time: "17:00",
    description: "Over 40 local vendors, live demos, and community workshops.",
    cost: "Free entry",
  },
  {
    title: "Indie Film Festival",
    category: "Culture",
    location: "Cinema Lumière",
    date: "2024-06-22",
    time: "16:00",
    description: "Three days of screenings, filmmaker panels, and VR storytelling labs.",
    cost: "$25 weekend pass",
  },
  {
    title: "City Night Run",
    category: "Sports",
    location: "Harborfront Boardwalk",
    date: "2024-06-27",
    time: "21:00",
    description: "5k glow run along the waterfront with DJs and recovery stations.",
    cost: "$15",
  },
];

const bars = [
  {
    name: "The Observatory",
    neighborhood: "Downtown Arts District",
    highlights: ["Rooftop skyline views", "Signature astronomy-themed cocktails", "Live DJs on weekends"],
    entry: "Free before 10 PM with student ID",
  },
  {
    name: "Campus Taphouse",
    neighborhood: "North Campus",
    highlights: ["80+ craft beers", "Trivia Thursdays", "Student open mic nights"],
    entry: "$5 cover, 21+",
  },
  {
    name: "Electric Garden",
    neighborhood: "Riverside",
    highlights: ["Immersive light installations", "Outdoor dance floor", "Vegan bar bites"],
    entry: "$12 cover includes first drink",
  },
  {
    name: "The Vinyl Lounge",
    neighborhood: "Midtown",
    highlights: ["Vintage vinyl listening booths", "Silent disco Fridays", "Barista-crafted mocktails"],
    entry: "Free entry, reservations recommended",
  },
];

const meetupForm = document.getElementById("meetup-form");
const meetupList = document.getElementById("meetup-list");
const meetupFilter = document.getElementById("meetup-filter");
const meetupSearch = document.getElementById("meetup-search");
const meetupLocationSelect = document.getElementById("meetup-location");
const noMeetupsMessage = document.getElementById("no-meetups");
const eventList = document.getElementById("event-list");
const eventCategoryFilter = document.getElementById("event-category");
const eventDateFilter = document.getElementById("event-date");
const barGrid = document.getElementById("bar-grid");
const overlay = document.getElementById("auth-overlay");
const appContainer = document.getElementById("app");
const enterBtn = document.getElementById("enter-btn");
const passwordInput = document.getElementById("password");
const authMessage = document.getElementById("auth-message");

const meetupState = JSON.parse(localStorage.getItem("campus-connect-meetups") ?? "[]");

const renderMeetupOptions = () => {
  const options = campusLocations
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join("");
  meetupLocationSelect.insertAdjacentHTML("beforeend", options);
  meetupFilter.insertAdjacentHTML(
    "beforeend",
    campusLocations.map(({ id, name }) => `<option value="${id}">${name}</option>`).join("")
  );
};

const renderBars = () => {
  barGrid.innerHTML = bars
    .map(
      (bar) => `
        <article class="bar-card">
          <h3>${bar.name}</h3>
          <div class="details">
            <span class="tag">${bar.neighborhood}</span>
            <ul>
              ${bar.highlights.map((item) => `<li>${item}</li>`).join("")}
            </ul>
            <p><strong>Entry:</strong> ${bar.entry}</p>
          </div>
        </article>
      `
    )
    .join("");
};

const renderMeetups = (filters = {}) => {
  const { search = "", location = "all" } = filters;
  const items = meetupState
    .filter((meetup) => (location === "all" ? true : meetup.location === location))
    .filter((meetup) => meetup.title.toLowerCase().includes(search.toLowerCase()));

  meetupList.innerHTML = items
    .map(
      (meetup) => `
      <li class="item">
        <div class="meta">
          <span class="tag">${campusLocations.find((loc) => loc.id === meetup.location)?.name ?? "Campus"}</span>
          <span>${new Date(`${meetup.date}T${meetup.time}`).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}</span>
        </div>
        <h3>${meetup.title}</h3>
        <p>${meetup.description}</p>
        <p class="meta">Organized by ${meetup.organizer}</p>
      </li>
    `
    )
    .join("");

  const isEmpty = items.length === 0;
  meetupList.classList.toggle("hidden", isEmpty);
  noMeetupsMessage.classList.toggle("hidden", !isEmpty);
};

const renderEvents = (filters = {}) => {
  const { category = "all", date } = filters;
  const filtered = cityEvents.filter((event) => {
    const matchesCategory = category === "all" ? true : event.category === category;
    const matchesDate = date ? event.date === date : true;
    return matchesCategory && matchesDate;
  });

  eventList.innerHTML = filtered
    .map(
      (event) => `
      <li class="item">
        <div class="meta">
          <span class="tag">${event.category}</span>
          <span>${new Date(`${event.date}T${event.time}`).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}</span>
        </div>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p class="meta">${event.location} • ${event.cost}</p>
      </li>
    `
    )
    .join("");
};

const populateEventCategories = () => {
  const uniqueCategories = ["all", ...new Set(cityEvents.map((event) => event.category))];
  eventCategoryFilter.innerHTML = uniqueCategories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
};

const registerListeners = () => {
  meetupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("meetup-title").value.trim();
    const location = meetupLocationSelect.value;
    const date = document.getElementById("meetup-date").value;
    const time = document.getElementById("meetup-time").value;
    const description = document.getElementById("meetup-description").value.trim();

    if (!title || !location || !date || !time || !description) {
      return;
    }

    const organizer = prompt("Add your name so classmates know who to find:");

    const meetup = {
      id: crypto.randomUUID(),
      title,
      location,
      date,
      time,
      description,
      organizer: organizer?.trim() || "Anonymous Student",
    };

    meetupState.push(meetup);
    localStorage.setItem("campus-connect-meetups", JSON.stringify(meetupState));

    meetupForm.reset();
    renderMeetups({ search: meetupSearch.value, location: meetupFilter.value });
  });

  meetupFilter.addEventListener("change", () => {
    renderMeetups({ search: meetupSearch.value, location: meetupFilter.value });
  });

  meetupSearch.addEventListener("input", () => {
    renderMeetups({ search: meetupSearch.value, location: meetupFilter.value });
  });

  eventCategoryFilter.addEventListener("change", () => {
    renderEvents({ category: eventCategoryFilter.value, date: eventDateFilter.value });
  });

  eventDateFilter.addEventListener("change", () => {
    renderEvents({ category: eventCategoryFilter.value, date: eventDateFilter.value });
  });

  enterBtn.addEventListener("click", () => {
    const value = passwordInput.value.trim();
    if (value === AUTH_PASSWORD) {
      overlay.classList.add("hidden");
      appContainer.classList.remove("hidden");
    } else {
      authMessage.classList.remove("hidden");
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      enterBtn.click();
    }
  });
};

const init = () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderMeetupOptions();
  renderBars();
  renderMeetups();
  renderEvents();
  populateEventCategories();
  registerListeners();
};

document.addEventListener("DOMContentLoaded", init);

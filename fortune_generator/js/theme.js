document.addEventListener("DOMContentLoaded", () => {
  const themeListContainer = document.querySelector("#themeList");
  const root = document.documentElement;

  async function fetchThemes() {
    try {
      const response = await fetch("./json/themes.json");
      const themes = await response.json();
      populateThemeList(themes["themes"]);
    } catch (error) {
      console.error("Error fetching themes:", error);
    }
  }

  // Populate theme list in modal
  function populateThemeList(themes) {
    themeListContainer.innerHTML = "";
    themes.forEach((theme) => {
      const themeItem = document.createElement("div");
      themeItem.className =
        "theme-item list-group-item d-flex justify-content-between align-items-center";
      themeItem.style.cursor = "pointer";
      themeItem.id = "themeItem";

      // Add theme name
      const themeName = document.createElement("span");
      themeName.textContent = theme.name;
      themeItem.appendChild(themeName);

      const colorPreivewContainer = document.createElement("div");
      colorPreivewContainer.className = "color-preview-container";

      const propertyKeys = Object.keys(theme.properties);
      colorPreivewContainer.style.backgroundColor =
        theme.properties[propertyKeys[5]];

      // Add color dots for visual preview
      const colorPreview = document.createElement("div");
      colorPreview.className = "color-preview";

      Object.values(theme.properties).slice(0, 3).forEach((color) => {
        const colorDot = document.createElement("span");
        colorDot.style.backgroundColor = color;
        colorDot.className = "color-dot";
        colorPreview.appendChild(colorDot);
      });

      colorPreivewContainer.appendChild(colorPreview);
      themeItem.appendChild(colorPreivewContainer);

      // Apply theme on click
      themeItem.addEventListener("click", () => applyTheme(theme.properties));

      themeListContainer.appendChild(themeItem);
    });
  }

  // Apply theme by setting CSS variables
  function applyTheme(properties) {
    Object.entries(properties).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  fetchThemes();
});

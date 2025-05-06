fetch('data/projects.json')
  .then((res) => {
    if (!res.ok) {
      throw new Error("JSON file not found!");
    }
    return res.json();
  })
  .then((data) => {
    const { about, projects } = data;

    // -------- Render About Section --------
    const aboutWrapper = document.querySelector('.about-wrapper');

    if (!aboutWrapper) {
      console.error("'.about-wrapper' not found in HTML!");
    } else {
      const descriptionHTML = about.description
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');

        const aboutHTML = `
        <div class="about-heading">
          <h2>${about.heading}</h2>
        </div>
        <div class="about-content">
          ${about.description.map(paragraph => `<p>${paragraph}</p>`).join('')}
        </div>
      `;
      

      aboutWrapper.innerHTML = aboutHTML;
    }

    // -------- Render Projects Section (same as before) --------
    const wrapper = document.querySelector('.projects-wrapper');

    if (!wrapper) {
      console.error("'.projects-wrapper' not found in HTML!");
      return;
    }

    projects.forEach((project, index) => {
      const isReversed = index % 2 === 1 ? 'reverse' : '';
      const media =
        project.type === 'video'
          ? `<video src="${project.media}" autoplay muted loop playsinline></video>`
          : `<img src="${project.media}" alt="${project.title}" />`;

      const tags = project.tags.map(tag => `<span>${tag}</span>`).join(' ');

      const html = `
        <section class="project ${isReversed}" data-aos="${index % 2 === 0 ? 'fade-right' : 'fade-left'}">
          <div class="project-box">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tags">${tags}</div>
            <div class="dot"></div>
          </div>
          <div class="media-preview">
            ${media}
            <a class="view-button" href="${project.url}" target="_blank">View site</a>
          </div>
        </section>
      `;

      wrapper.innerHTML += html;
    });
  })
  .catch((error) => {
    console.error("Error loading data:", error);
  });


  // Generate a pixelated image effect
document.addEventListener('DOMContentLoaded', function() {
  // Create pixelated profile image
  createPixelatedImage();
  
  // Initialize partner accordion functionality
  initPartnerAccordion();
});

// Function to create pixelated profile image
function createPixelatedImage() {
  const pixelContainer = document.getElementById('pixelatedImage');
  if (!pixelContainer) return;
  
  const colors = [
      '#3A2618', '#553626', '#8E7161', '#D6BFB1', '#F5E8DF',
      '#2C2C2C', '#4D4D4D', '#6E6E6E', '#C19183', '#E5A79A',
      '#FFFFFF', '#F2E6DF', '#CDB8AA', '#A89384', '#876C5A'
  ];
  
  // Create 10x10 grid of pixels
  for (let i = 0; i < 100; i++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixel');
      
      // Use a pattern that creates a pixelated face-like appearance
      if (i >= 25 && i < 75 && i % 10 >= 2 && i % 10 <= 7) {
          // Core face area - use skin tones
          const colorIndex = Math.floor(Math.random() * 7) + 3;
          pixel.style.backgroundColor = colors[colorIndex];
      } else if ((i >= 30 && i < 40) || (i >= 60 && i < 70)) {
          // Use darker colors for hair area
          const colorIndex = Math.floor(Math.random() * 3);
          pixel.style.backgroundColor = colors[colorIndex];
      } else if (i >= 80) {
          // Use darker colors for shoulders/clothing
          const colorIndex = Math.floor(Math.random() * 2) + 5;
          pixel.style.backgroundColor = colors[colorIndex];
      } else {
          // Background pixels
          const colorIndex = Math.floor(Math.random() * 3) + 5;
          pixel.style.backgroundColor = colors[colorIndex];
      }
      
      pixelContainer.appendChild(pixel);
  }
  
  // Add hover effect to the pixelated image
  const profileImage = document.querySelector('.profile-image');
  if (profileImage) {
      profileImage.addEventListener('mouseover', function() {
          const pixels = document.querySelectorAll('.pixel');
          pixels.forEach(pixel => {
              const delay = Math.random() * 500;
              setTimeout(() => {
                  const randomColor = getRandomColor();
                  pixel.style.transition = 'background-color 0.5s ease';
                  pixel.style.backgroundColor = randomColor;
              }, delay);
          });
      });
      
      profileImage.addEventListener('mouseout', function() {
          const pixels = document.querySelectorAll('.pixel');
          pixels.forEach(pixel => {
              pixel.style.transition = 'background-color 0.5s ease';
              // Reset to original colors would go here if needed
          });
      });
  }
}

// Function to get random color
function getRandomColor() {
  const colors = [
      '#3A2618', '#553626', '#8E7161', '#D6BFB1', '#F5E8DF',
      '#2C2C2C', '#4D4D4D', '#6E6E6E', '#A5A5A5', '#E5A79A'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Function to initialize partner accordion functionality
function initPartnerAccordion() {
  const partnerItems = document.querySelectorAll('.partner-item');
  
  partnerItems.forEach(item => {
      const header = item.querySelector('.partner-header');
      const toggleBtn = item.querySelector('.toggle-btn');
      
      header.addEventListener('click', () => {
          // Toggle current item
          togglePartnerItem(item);
          
          // Close other items
          partnerItems.forEach(otherItem => {
              if (otherItem !== item && otherItem.classList.contains('open')) {
                  togglePartnerItem(otherItem);
              }
          });
      });
  });
}

// Function to toggle partner item open/closed state
function togglePartnerItem(item) {
  const isOpen = item.classList.contains('open');
  const toggleBtn = item.querySelector('.toggle-btn');
  
  if (isOpen) {
      item.classList.remove('open');
      toggleBtn.textContent = '+';
      toggleBtn.classList.remove('minus');
      toggleBtn.classList.add('plus');
  } else {
      item.classList.add('open');
      toggleBtn.textContent = '−';
      toggleBtn.classList.remove('plus');
      toggleBtn.classList.add('minus');
  }
}

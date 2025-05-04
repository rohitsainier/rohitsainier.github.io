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

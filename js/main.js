fetch('data/projects.json')
  .then((res) => {
    if (!res.ok) {
      throw new Error("JSON file not found!");
    }
    return res.json();
  })
  .then((projects) => {
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
          <div class="project-info">
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <div class="tags">${tags}</div>
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
    console.error("Error loading project data:", error);
  });
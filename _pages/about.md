---
permalink: /
title: ""
author_profile: true
excerpt: "PhD student in physics at UTEP working in lattice dynamics, atomistic simulation, and scientific workflow automation."
redirect_from: 
  - /about/
  - /about.html
---
<div class="lab-home">
  <section class="lab-home__hero">
    <div class="lab-home__copy">
      <p class="lab-eyebrow">Computational Physics and Materials Modeling</p>
      <h1 class="lab-home__title">Diego Armando Juarez Rosales</h1>
      <p class="lab-home__lead">
        I am a PhD student in Physics at The University of Texas at El Paso. This site brings together
        selected research projects, conference material, and interactive visualizations from my work in
        lattice dynamics, atomistic simulation, and scientific workflow automation.
      </p>

      <div class="lab-home__actions">
        <a class="lab-button lab-button--primary" href="{{ '/portfolio/' | relative_url }}">Research Projects</a>
        <a class="lab-button lab-button--ghost" href="{{ '/cv/' | relative_url }}">Curriculum Vitae</a>
      </div>

      <div class="lab-stat-grid">
        <div class="lab-stat">
          <span class="lab-stat__label">Current Role</span>
          <strong class="lab-stat__value">PhD Student, UTEP Physics</strong>
        </div>
        <div class="lab-stat">
          <span class="lab-stat__label">Research Areas</span>
          <strong class="lab-stat__value">Phonons, NiTi alloys, atomistic modeling</strong>
        </div>
        <div class="lab-stat">
          <span class="lab-stat__label">Workflow</span>
          <strong class="lab-stat__value">Python, LAMMPS, HPC, scientific data analysis</strong>
        </div>
      </div>
    </div>

    <div class="lab-home__media">
      <div class="lab-media-frame">
        <img
          src="{{ '/images/phonons.gif' | relative_url }}"
          alt="Animated phonon visualization"
          loading="lazy"
        >
      </div>
      <p class="lab-media-note">
        Featured animation from my research workflow, focused on lattice vibrations and atomistic motion.
      </p>
    </div>
  </section>

  <section class="lab-section">
    <div class="lab-section__header">
      <div>
        <p class="lab-eyebrow">Selected Work</p>
        <h2 class="lab-section__title">Research Highlights</h2>
      </div>
      <p class="lab-section__text">
        A few representative examples from my recent work in lattice dynamics, thermodynamics,
        and molecular simulation.
      </p>
    </div>

    <div class="lab-highlight-grid">
      <article class="lab-highlight lab-highlight--dark">
        <div class="lab-highlight__media">
          <img
            src="{{ '/images/phon_disp_GaAs.gif' | relative_url }}"
            alt="Phonon dispersion animation for 2D GaAs"
            loading="lazy"
          >
        </div>
        <div class="lab-highlight__body">
          <span class="lab-tag">Phonons and Lattice Dynamics</span>
          <h3 class="lab-highlight__title">Phonon Dispersion in 2D GaAs</h3>
          <p>
            This visualization shows how vibrational modes evolve across reciprocal space in a
            two-dimensional GaAs system, offering a compact view of stability and dynamical behavior.
          </p>
        </div>
      </article>

      <article class="lab-highlight">
        <div class="lab-media-stack">
          <div class="lab-highlight__media">
            <img
              src="{{ '/images/image70.gif' | relative_url }}"
              alt="Birch-Murnaghan equation-of-state fit for NiTi with antisite defects"
              loading="lazy"
            >
          </div>
          <div class="lab-highlight__media">
            <img
              src="{{ '/images/image95.gif' | relative_url }}"
              alt="Thermodynamic response of NiTi under point-defect conditions"
              loading="lazy"
            >
          </div>
        </div>
        <div class="lab-highlight__body">
          <span class="lab-tag">Thermodynamics and Defects</span>
          <h3 class="lab-highlight__title">Birch-Murnaghan EOS for NiTi</h3>
          <p>
            These results highlight how point defects modify equilibrium volume, stiffness, and
            thermodynamic trends in NiTi through equation-of-state fitting across multiple conditions.
          </p>
        </div>
      </article>

      <article class="lab-highlight lab-highlight--dark">
        <div class="lab-highlight__media">
          <img
            src="{{ '/images/NiTi_bcc_B2.gif' | relative_url }}"
            alt="Molecular dynamics simulation of a heat-driven transformation in NiTi"
            loading="lazy"
          >
        </div>
        <div class="lab-highlight__body">
          <span class="lab-tag">Molecular Dynamics</span>
          <h3 class="lab-highlight__title">Heat-Driven Transformation in NiTi</h3>
          <p>
            A molecular dynamics animation of a B2 NiTi nanostructure in which one region is heated
            toward melting while the opposite side remains fixed, revealing the evolution of the
            solid-liquid interface at the atomic scale.
          </p>
        </div>
      </article>

      <article class="lab-highlight">
        <div class="lab-highlight__media lab-highlight__media--contain">
          <img
            src="{{ '/images/method_of_images_grounded_sphere.gif' | relative_url }}"
            alt="Method of images animation for a grounded conducting sphere"
            loading="lazy"
          >
        </div>
        <div class="lab-highlight__body">
          <span class="lab-tag">Computational Electrodynamics</span>
          <h3 class="lab-highlight__title">Method of Images for a Grounded Sphere</h3>
          <p>
            This project is a graduate-level electrodynamics study based on Jackson, combining
            derivations, computational notebooks, and visualizations. The animation shows how the
            image charge changes as the external source moves so that the sphere remains at zero potential.
          </p>
        </div>
      </article>
    </div>
  </section>

  <section class="lab-section">
    <div class="lab-section__header">
      <div>
        <p class="lab-eyebrow">Interactive Models</p>
        <h2 class="lab-section__title">Explore the Physics</h2>
      </div>
      <p class="lab-section__text">
        These interactive demos turn part of the research story into something visual and hands-on.
      </p>
    </div>

    <div class="lab-tool-grid">
      <article class="lab-tool">
        <div class="lab-tool__copy">
          <span class="lab-tag">Interactive Canvas</span>
          <h3 class="lab-highlight__title">Lattice Vibration Explorer</h3>
          <p>
            Click anywhere on the canvas to trigger a phonon-like disturbance and watch the wave move
            through the atomic lattice.
          </p>
        </div>

        <div class="lab-canvas-shell">
          <canvas id="phononCanvas" width="800" height="700"></canvas>
        </div>
      </article>

      <article class="lab-tool">
        <div class="lab-tool__copy">
          <span class="lab-tag">Interactive Canvas</span>
          <h3 class="lab-highlight__title">FCC Neighbor Explorer</h3>
          <p>
            Rotate the cluster, inspect atoms, and identify the neighbor shell associated with each
            atomic position in a face-centered cubic structure.
          </p>
        </div>

        <div class="lab-canvas-shell">
          <canvas id="fccCanvas" width="800" height="700"></canvas>
        </div>

        <p id="fcc-info" class="lab-tool__note">
          Click an atom to identify its FCC neighbor shell.
        </p>
      </article>
    </div>
  </section>

  <section id="photo-showcase" class="psc">
    <div class="psc-wrap">
      <div class="psc-head">
        <p class="lab-eyebrow">Beyond the Simulations</p>
        <h2 class="psc-title">Field Notes</h2>
        <p class="psc-sub">
          A small set of moments from research, conferences, and day-to-day life in science.
        </p>
      </div>

      <div class="psc-frame" aria-label="Photo carousel">
        <button type="button" class="psc-btn psc-prev" id="psc-prev" aria-label="Previous photo">&lsaquo;</button>

        <img
          id="psc-img"
          class="psc-img"
          src="{{ '/images/me_01.jpg' | relative_url }}"
          alt="Diego photo 1"
          loading="lazy"
        >

        <button type="button" class="psc-btn psc-next" id="psc-next" aria-label="Next photo">&rsaquo;</button>
      </div>

      <div class="psc-footer">
        <div id="psc-counter" class="psc-counter" aria-label="Photo counter"></div>
        <div id="psc-dots" class="psc-dots" aria-label="Slideshow position"></div>
      </div>
    </div>
  </section>
</div>

<script id="ps-photos-json" type="application/json">
[
  { "src": "{{ '/images/me_01.jpg' | relative_url }}", "alt": "Diego photo 1" },
  { "src": "{{ '/images/me_02.jpg' | relative_url }}", "alt": "Diego photo 2" },
  { "src": "{{ '/images/me_03.jpg' | relative_url }}", "alt": "Diego photo 3" },
  { "src": "{{ '/images/me_04.jpg' | relative_url }}", "alt": "Diego photo 4" },
  { "src": "{{ '/images/me_05.jpg' | relative_url }}", "alt": "Diego photo 5" },
  { "src": "{{ '/images/me_06.jpg' | relative_url }}", "alt": "Diego photo 6" },
  { "src": "{{ '/images/me_07.jpg' | relative_url }}", "alt": "Diego photo 7" },
  { "src": "{{ '/images/me_08.jpg' | relative_url }}", "alt": "Diego photo 8" },
  { "src": "{{ '/images/me_09.jpg' | relative_url }}", "alt": "Diego photo 9" },
  { "src": "{{ '/images/me_10.jpg' | relative_url }}", "alt": "Diego photo 10" },
  { "src": "{{ '/images/me_11.jpg' | relative_url }}", "alt": "Diego photo 11" },
  { "src": "{{ '/images/me_12.jpg' | relative_url }}", "alt": "Diego photo 12" },
  { "src": "{{ '/images/me_13.jpg' | relative_url }}", "alt": "Diego photo 13" },
  { "src": "{{ '/images/me_14.jpg' | relative_url }}", "alt": "Diego photo 14" },
  { "src": "{{ '/images/me_07-2.jpg' | relative_url }}", "alt": "Diego photo 15" },
  { "src": "{{ '/images/IMG_0149.jpg' | relative_url }}", "alt": "Diego photo 16" },
  { "src": "{{ '/images/IMG_2168_4.jpg' | relative_url }}", "alt": "Diego photo 17" },
  { "src": "{{ '/images/IMG_2630.jpg' | relative_url }}", "alt": "Diego photo 18" },
  { "src": "{{ '/images/IMG_3094-2.jpg' | relative_url }}", "alt": "Diego photo 19" },
  { "src": "{{ '/images/IMG_3102-2.jpg' | relative_url }}", "alt": "Diego photo 20" },
  { "src": "{{ '/images/IMG_3132.jpg' | relative_url }}", "alt": "Diego photo 21" },
  { "src": "{{ '/images/IMG_6930.jpg' | relative_url }}", "alt": "Diego photo 22" },
  { "src": "{{ '/images/dji_mimo_20251006_211238_20251006211239_1759804625959_photo-2.jpg' | relative_url }}", "alt": "Diego photo 23" },
  { "src": "{{ '/images/dji_mimo_20260214_125438_20260214125439_1771100502988_photo-2.jpg' | relative_url }}", "alt": "Diego photo 24" }
]
</script>

<script src="{{ '/assets/js/phonon_ripple.js' | relative_url }}"></script>
<script src="{{ '/assets/js/fcc_neighbors.js' | relative_url }}"></script>
<script src="{{ '/assets/js/photo_showcase.js' | relative_url }}"></script>



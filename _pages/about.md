---
permalink: /
title: "Diego Armando Juarez Rosales"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---



<div style="max-width:1000px; margin:0 auto;">
  <div style="
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap:24px;
    align-items:center;
    background:#f5f8ff;
    padding:24px;
    border-radius:16px;
    border:2px solid #004080;
  ">
    
    <div>
      <h2 style="color:#004080; margin-top:0; font-size:1.8em; font-weight:700; margin-bottom:12px;">
        👋 Hello everyone!
      </h2>
      <p style="color:#222; font-size:1.05em; line-height:1.6; margin:0;">
        Welcome to my academic portfolio! I’ll be uploading <b>presentations</b>, <b>posters</b>, and <b>future papers</b>.
        I’ll also share <i>phonon simulations</i> and other visuals from my research journey.
        I hope this page reflects my passion for science and my goal of becoming a dedicated researcher and scientist.
      </p>
    </div>
  
    <div style="text-align:center;">
      <img 
        src="{{ '/images/phonons.gif' | relative_url }}" 
        alt="Phonon simulation animation"
        style="
          max-width:100%;
          border-radius:14px;
          box-shadow:0 0 15px rgba(0,0,0,0.18);
          transition: transform 0.3s ease;
        "
        onmouseover="this.style.transform='scale(1.03)'"
        onmouseout="this.style.transform='scale(1)'"
        loading="lazy"
      >
    </div>
  </div>
</div>



<p style="margin-bottom: 20px;">


<div style="
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
  align-items: center;
  background: linear-gradient(135deg, #000000 0%, #001a40 100%);
  padding: 32px;
  border-radius: 18px;
  border: 2px solid #004080;
  box-shadow: 0 0 20px rgba(0, 64, 128, 0.3);
  margin-bottom: 28px;
">
  <!-- Image (left side) -->
  <div style="text-align:center;">
    <img 
      src="{{ '/images/phon_disp_GaAs.gif' | relative_url }}" 
      alt="Phonon dispersion animation for 2D GaAs" 
      style="
        max-width:100%;
        border-radius:16px;
        box-shadow:0 0 25px rgba(0,64,128,0.5);
        transition: transform 0.3s ease;
      "
      onmouseover="this.style.transform='scale(1.03)'"
      onmouseout="this.style.transform='scale(1)'"
      loading="lazy"
    >
  </div>

  <!-- Text (right side) -->
  <div>
    <h2 style="color:#FFFFFF; font-size:1.8em; font-weight:700; margin-top:0; margin-bottom:12px; letter-spacing:0.5px;">
      ⚛️ Science in Motion
    </h2>
    <p style="color:#E0E0E0; font-size:1.05em; line-height:1.6; margin:0;">
      Explore my research on lattice vibrations and nanoscale behavior. Here you can see a visualization of the  <b>phonon dispersion in 2D GaAs</b>.
    </p>
  </div>
</div>


<p style="margin-bottom: 20px;">


<div style="
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  align-items: center;
  background: #ffffff;
  padding: 28px;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
">
  <!-- Images (left side) -->
  <div style="text-align:center;">
    <img 
      src="{{ '/images/image70.gif' | relative_url }}" 
      alt="Birch-Murnaghan EOS fit for NiTi with antisite defects" 
      style="
        max-width:100%;
        border-radius:16px;
        box-shadow:0 0 18px rgba(15,23,42,0.15);
        transition: transform 0.3s ease;
        margin-bottom:18px;
      "
      onmouseover="this.style.transform='scale(1.03)'"
      onmouseout="this.style.transform='scale(1)'"
      loading="lazy"
    >

    <img 
      src="{{ '/images/image95.gif' | relative_url }}" 
      alt="Second GIF description" 
      style="
        max-width:100%;
        border-radius:16px;
        box-shadow:0 0 18px rgba(15,23,42,0.15);
        transition: transform 0.3s ease;
      "
      onmouseover="this.style.transform='scale(1.03)'"
      onmouseout="this.style.transform='scale(1)'"
      loading="lazy"
    >
    
  </div>

  <!-- Text (right side) -->
  <div>
    <h2 style="color:#0f172a; font-size:1.7em; font-weight:700; margin-top:0; margin-bottom:10px;">
      🧮 Birch–Murnaghan EOS for NiTi with point defects
    </h2>
    <p style="color:#334155; font-size:1.05em; line-height:1.6; margin:0;">
      This GIF showcases another result from my work: the <b>Birch–Murnaghan equation-of-state fit for NiTi with point defects</b>.  
      It highlights how the alloy’s mechanical response evolves with volume and how point defects modify its equilibrium properties.
    </p>
  </div>
</div>




<p style="margin-bottom: 20px;">





<h2 style="text-align:center; margin-top:32px; margin-bottom:12px;">
  Click anywhere to generate a lattice vibration <b>(phonon)</b>.
</h2>

<div style="
  background: linear-gradient(135deg, #000000 0%, #001a40 100%);
  padding:8px;                 
  border-radius:18px;
  border:2px solid #004080;
  box-shadow:0 0 20px rgba(0,64,128,0.3);
">
  <canvas
    id="phononCanvas"
    width="1000"
    height="700"
    style="
      display:block;
      margin:0;                
      width:100%;
      max-width:100%;
      border-radius:14px;
      background:#020617;
    ">
  </canvas>
</div>

<script src="{{ '/assets/js/phonon_ripple.js' | relative_url }}"></script>



<p style="margin-bottom: 20px;">



<h2 style="text-align:center; margin-top:40px; margin-bottom:12px;">
  FCC Neighbor Explorer 
</h2>

<div style="
  background: linear-gradient(135deg, #000000 0%, #001a40 100%);
  padding:8px;
  border-radius:18px;
  border:2px solid #004080;
  box-shadow:0 0 20px rgba(0,64,128,0.3);
">
  <canvas
    id="fccCanvas"
    width="1000"
    height="700"
    style="
      display:block;
      margin:0;
      width:100%;
      max-width:100%;
      border-radius:14px;
      background:#020617;
    ">
  </canvas>
</div>

<p id="fcc-info" style="
  text-align:center;
  margin-top:8px;
  color:#4b5563;
  font-size:0.95em;
">
  Click any atom to see what FCC neighbor shell it belongs to.
</p>

<script src="{{ '/assets/js/fcc_neighbors.js' | relative_url }}"></script>

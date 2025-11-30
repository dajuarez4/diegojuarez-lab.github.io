---
permalink: /
title: "Diego Armando Juarez Rosales"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---




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
">
  <!-- Image first (left side) -->
  <div style="text-align:center;">
    <img 
      src="{{ '/images/phon_disp_GaAs.gif' | relative_url }}" 
      alt="Phonon dispersion animation for GaAs 2D" 
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

  <!-- Text second (right side) -->
  <div>
    <h2 style="color:#FFFFFF; font-size:1.8em; font-weight:700; margin-top:0; margin-bottom:12px; letter-spacing:0.5px;">
      ⚛️ Science in Motion
    </h2>
    <p style="color:#E0E0E0; font-size:1.05em; line-height:1.6; margin:0;">
      Explore my research on lattice vibrations and nanoscale behavior. Below, a visualization of the 
      <b>phonon dispersion in 2D-GaAs</b>.
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
    width="800"
    height="400"
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
    width="800"
    height="400"
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

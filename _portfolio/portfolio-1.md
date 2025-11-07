---
title: "Utilities To Execute Pipelines"
excerpt: "This framework automates the set up, submission, and execution of scientific codes,
generally taking care of the minutiae. Post-processing tasks, such as the development of machine
learning models, are easier because of a common data structure. <br/><img src='/images/500x300.png'>"
collection: portfolio
---

To reduce human error in creating input files for simulations, especially when handling hundreds or even thousands of jobs, we developed Utilities to Execute Pipelines (UTEP), a robust
and versatile Python framework to streamline the generation and analysis of large-scale scientific
datasets. This framework automates the set up, submission, and execution of scientific codes,
generally taking care of the minutiae. Post-processing tasks, such as the development of machine
learning models, are easier because of a common data structure. UTEP was deployed on Perlmutter, a National Energy Research Scientific Computing Center (NERSC) supercomputer, but
it can be deployed on any Unix system. Here we present instances of UTEP applied to projects
in computational thermodynamics of alloys, lattice dynamics of crystals, charge distributions in a
semiconductor, and a multi-objective genetic algorithms used to test crystal stability.

!-- Embed PDF -->
<div style="margin:1rem 0;">
  <object data="{{ '/files/utep.pdf#toolbar=0&view=FitH' | relative_url }}"
          type="application/pdf" width="100%" height="800px">
    <iframe src="{{ '/files/utep.pdf#toolbar=0&view=FitH' | relative_url }}"
            width="100%" height="800px">
    </iframe>
  </object>
</div>

<!-- Fallback links -->
<p style="text-align:center;">
  <a class="btn btn--primary" href="{{ '/files/utep.pdf' | relative_url }}" target="_blank">Open PDF</a>
  &nbsp;|&nbsp;
  <a href="{{ '/files/utep.pdf' | relative_url }}" download>Download PDF</a>
</p>




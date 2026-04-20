---
title: "Utilities to Execute Pipelines (UTEP)"
excerpt: "A Python framework for preparing inputs, launching jobs, and organizing large scientific workflows on HPC systems."
collection: portfolio
---

<div class="research-project">
  <div class="research-project__intro">
    <p class="research-project__lede">
      Utilities to Execute Pipelines (UTEP) is a Python framework developed to reduce human error
      when preparing, submitting, and analyzing large collections of scientific simulations.
    </p>
    <p>
      The framework standardizes input generation, job execution, and post-processing so that large
      parameter sweeps remain reproducible and easier to inspect. It was designed for workloads that
      can quickly grow from dozens of runs to thousands of jobs.
    </p>
    <p>
      UTEP has been deployed on Perlmutter at NERSC and can also be adapted to other Unix-based
      environments. It has supported projects in computational thermodynamics, lattice dynamics,
      charge-distribution studies, and workflow-driven crystal stability analysis.
    </p>
  </div>

  <div class="research-project__media research-project__media--narrow">
    <img src="{{ '/images/utep_logo.png' | relative_url }}" alt="UTEP framework logo" loading="lazy">
  </div>

  <div class="research-project__actions">
    <a class="lab-button lab-button--primary" href="{{ '/images/utep.pdf' | relative_url }}" target="_blank" rel="noopener">Open PDF</a>
    <a class="lab-button lab-button--ghost" href="https://github.com/jamunozlab/UTEP-HELD" target="_blank" rel="noopener">Repository</a>
  </div>
</div>




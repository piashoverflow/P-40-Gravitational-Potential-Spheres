# P-40: Gravitational Potential, Energy & Spherical Theorems Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Author: Shamsuddin Piash](https://img.shields.io/badge/Author-Shamsuddin%20Piash-0ea5e9.svg)](https://piashoverflow.github.io)
[![BUET ME](https://img.shields.io/badge/Institution-BUET%20'25-10b981.svg)](https://buet.ac.bd)

> **Interactive Computational Gravitational Potential & Classical Field Simulator**  
> Developed by **Shamsuddin Piash** | Department of Mechanical Engineering, Bangladesh University of Engineering and Technology (BUET).  
> Covers **HSC Physics 1st Paper, Chapter 6 (Gravitation & Gravity / মহাকর্ষ ও অভিকর্ষ)** — Topic Code **P-40**.

---

## 🔬 Core Physical Principles & Formulations

### 1. Gravitational Potential $V$ & Potential Energy $U$
- **Gravitational Potential**: Work done per unit mass bringing a test mass from infinity to distance $r$:
  $$V(r) = - \int_\infty^r \vec{E} \cdot d\vec{r} = -\frac{GM}{r}$$
- **Field-Potential Relation**:
  $$\vec{E} = - \nabla V \implies E = -\frac{dV}{dr}$$
- **Gravitational Potential Energy**:
  $$U(r) = mV(r) = -\frac{GMm}{r}$$

---

### 2. Hollow Spherical Shell Theorems (খোলক উপপাদ্য)
For a thin uniform spherical shell of mass $M$ and radius $R$:
- **Inside the shell ($r < R$)**:
  $$E = 0 \quad \text{(Zero gravitational field everywhere inside)}$$
  $$V = -\frac{GM}{R} = \text{constant}$$
- **Outside the shell ($r \ge R$)**:
  $$E = \frac{GM}{r^2}, \quad V = -\frac{GM}{r}$$

---

### 3. Uniform Solid Sphere Theorems (সুষম নিরেট গোলকের উপপাদ্য)
For a uniform solid sphere of mass $M$ and radius $R$:
- **Interior points ($r \le R$)**:
  $$E(r) = \frac{GM}{R^3} r \quad \text{(Linear increase with radial distance)}$$
  $$V(r) = -\frac{GM}{2R^3}(3R^2 - r^2) \quad \text{(Parabolic potential well)}$$
- **At Sphere Center ($r = 0$)**:
  $$V_{\text{center}} = -\frac{3GM}{2R} = 1.5 V_{\text{surface}}$$
- **Exterior points ($r \ge R$)**:
  $$E(r) = \frac{GM}{r^2}, \quad V(r) = -\frac{GM}{r}$$

---

### 4. Simple Harmonic Motion Through a Diametric Earth Tunnel
When an object of mass $m$ is dropped into a frictionless tunnel drilled through Earth:
- Restoring force is strictly proportional to displacement:
  $$F(x) = -m \left(\frac{GM}{R^3}\right) x = - \left(\frac{mg}{R}\right) x = -kx$$
- Oscillates in Simple Harmonic Motion (SHM):
  $$\omega = \sqrt{\frac{g}{R}} \approx 1.24 \times 10^{-3} \text{ rad/s}$$
  $$T = 2\pi\sqrt{\frac{R}{g}} \approx 5,075 \text{ s} \approx 84.6 \text{ minutes}$$
- Maximum speed at the center:
  $$v_{\text{max}} = \omega R = \sqrt{gR} \approx 7.91 \text{ km/s}$$

---

## 🚀 Getting Started & Local Development

```bash
# Clone repository
git clone https://github.com/piashoverflow/P-40-Gravitational-Potential-Spheres.git
cd P-40-Gravitational-Potential-Spheres

# Install dependencies
npm install

# Launch Vite development server
npm run dev

# Build for production / Vercel
npm run build
```

---

## 🌐 1-Click Deployment to Vercel
This project is configured for out-of-the-box zero-config deployment on [Vercel](https://vercel.com). Simply import this repository into your Vercel dashboard and click **Deploy**.

---

## 📜 License
MIT License © 2026 **Shamsuddin Piash**. See [LICENSE](LICENSE) for details.

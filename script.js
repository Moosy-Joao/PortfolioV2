// Language switching functionality
class LanguageManager {
  constructor() {
    this.currentLang = "pt"
    this.init()
  }

  init() {
    this.bindEvents()
    this.setLanguage(this.currentLang)
  }

  bindEvents() {
    const ptBtn = document.getElementById("lang-pt")
    const enBtn = document.getElementById("lang-en")

    ptBtn.addEventListener("click", () => this.setLanguage("pt"))
    enBtn.addEventListener("click", () => this.setLanguage("en"))
  }

  setLanguage(lang) {
    this.currentLang = lang

    // Update button states
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.getElementById(`lang-${lang}`).classList.add("active")

    // Update document language
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en"

    // Update all translatable elements
    document.querySelectorAll("[data-pt][data-en]").forEach((element) => {
      const text = element.getAttribute(`data-${lang}`)
      if (text) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = text
        } else {
          element.textContent = text
        }
      }
    })

    // Update meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      const descriptions = {
        pt: "João Pedro - Desenvolvedor Full Stack | Full Stack Developer. Especializado em Node.js, React.js, PostgreSQL, SpringBoot. Sarandi, PR.",
        en: "João Pedro - Full Stack Developer specialized in Node.js, React.js, PostgreSQL, SpringBoot. Software Engineering student from Sarandi, PR, Brazil.",
      }
      metaDescription.setAttribute("content", descriptions[lang])
    }

    // Update page title
    const titles = {
      pt: "João Pedro - Desenvolvedor Full Stack",
      en: "João Pedro - Full Stack Developer",
    }
    document.title = titles[lang]
  }
}

// Navigation functionality
class NavigationManager {
  constructor() {
    this.navbar = document.querySelector(".navbar")
    this.hamburger = document.querySelector(".hamburger")
    this.navMenu = document.querySelector(".nav-menu")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.init()
  }

  init() {
    this.bindEvents()
    this.handleScroll()
    this.setActiveLink()
  }

  bindEvents() {
    // Hamburger menu toggle
    this.hamburger.addEventListener("click", () => {
      this.navMenu.classList.toggle("active")
      this.hamburger.classList.toggle("active")
    })

    // Close mobile menu when clicking on links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.navMenu.classList.remove("active")
        this.hamburger.classList.remove("active")
      })
    })

    // Scroll event for navbar background
    window.addEventListener("scroll", () => this.handleScroll())

    // Intersection Observer for active link highlighting
    this.observeSections()
  }

  handleScroll() {
    if (window.scrollY > 100) {
      this.navbar.style.background = "rgba(10, 10, 10, 0.98)"
    } else {
      this.navbar.style.background = "rgba(10, 10, 10, 0.95)"
    }
  }

  observeSections() {
    const sections = document.querySelectorAll("section[id]")
    const options = {
      threshold: 0.3,
      rootMargin: "-100px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.setActiveLink(entry.target.id)
        }
      })
    }, options)

    sections.forEach((section) => observer.observe(section))
  }

  setActiveLink(activeId = "home") {
    this.navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${activeId}`) {
        link.classList.add("active")
      }
    })
  }
}

// Smooth scrolling for anchor links
class SmoothScroll {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          const offsetTop = target.offsetTop - 80 // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })
  }
}

// Contact form functionality
class ContactForm {
  constructor() {
    this.form = document.getElementById("contactForm")
    this.init()
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    }
  }

  async handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(this.form)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    }

    // Validar se todos os campos estão preenchidos
    if (!data.name || !data.email || !data.message) {
      this.showMessage("Por favor, preencha todos os campos.", "error")
      return
    }

    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.textContent = "Redirecionando..."
    submitBtn.disabled = true

    try {
      // Enviar para WhatsApp
      this.sendToWhatsApp(data)

      // Show success message
      this.showMessage("Redirecionando para o WhatsApp...", "success")
      this.form.reset()
    } catch (error) {
      // Show error message
      this.showMessage("Erro ao processar. Tente novamente.", "error")
    } finally {
      // Reset button state after a delay
      setTimeout(() => {
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 2000)
    }
  }

  sendToWhatsApp(data) {
    // Seu número do WhatsApp (substitua pelo seu número real)
    const phoneNumber = "5544988430768" // Formato: código do país + DDD + número

    // Formatear a mensagem
    const message = `*Nova mensagem do portfólio:*

*Nome:* ${data.name}
*Email:* ${data.email}

*Mensagem:*
${data.message}

---
_Enviado através do formulário de contato do portfólio_`

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message)

    // Criar URL do WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Abrir WhatsApp em uma nova aba
    window.open(whatsappURL, "_blank")
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector(".form-message")
    if (existingMessage) {
      existingMessage.remove()
    }

    // Create new message element
    const messageEl = document.createElement("div")
    messageEl.className = `form-message ${type}`
    messageEl.textContent = message
    messageEl.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            ${
              type === "success"
                ? "background: rgba(76, 175, 80, 0.1); color: #4caf50; border: 1px solid #4caf50;"
                : "background: rgba(244, 67, 54, 0.1); color: #f44336; border: 1px solid #f44336;"
            }
        `

    this.form.appendChild(messageEl)

    // Remove message after 5 seconds
    setTimeout(() => {
      messageEl.remove()
    }, 5000)
  }
}

// Scroll animations
class ScrollAnimations {
  constructor() {
    this.init()
  }

  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe elements for animation
    document.querySelectorAll(".skill-category, .project-card, .stat-item").forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })
  }
}

// Performance optimization
class PerformanceOptimizer {
  constructor() {
    this.init()
  }

  init() {
    // Lazy load images when they come into view
    this.lazyLoadImages()

    // Preload critical resources
    this.preloadCriticalResources()

    // Add loading states
    this.addLoadingStates()
  }

  lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]")
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }

  preloadCriticalResources() {
    // Preload fonts
    const fontLink = document.createElement("link")
    fontLink.rel = "preload"
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    fontLink.as = "style"
    document.head.appendChild(fontLink)
  }

  addLoadingStates() {
    // Add loading class to body initially
    document.body.classList.add("loading")

    // Remove loading class when page is fully loaded
    window.addEventListener("load", () => {
      document.body.classList.remove("loading")
    })
  }
}

// Accessibility enhancements
class AccessibilityManager {
  constructor() {
    this.init()
  }

  init() {
    this.handleKeyboardNavigation()
    this.addAriaLabels()
    this.manageFocus()
  }

  handleKeyboardNavigation() {
    // Handle escape key for mobile menu
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const navMenu = document.querySelector(".nav-menu")
        const hamburger = document.querySelector(".hamburger")
        if (navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
          hamburger.classList.remove("active")
        }
      }
    })
  }

  addAriaLabels() {
    // Add aria-labels to interactive elements without text
    const hamburger = document.querySelector(".hamburger")
    if (hamburger && !hamburger.getAttribute("aria-label")) {
      hamburger.setAttribute("aria-label", "Toggle navigation menu")
    }
  }

  manageFocus() {
    // Ensure focus is visible for keyboard users
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation")
      }
    })

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation")
    })
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new LanguageManager()
  new NavigationManager()
  new SmoothScroll()
  new ContactForm()
  new ScrollAnimations()
  new PerformanceOptimizer()
  new AccessibilityManager()
})

// Service Worker registration for PWA capabilities
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error)
  // You could send this to an error tracking service
})

// Performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0]
      console.log("Page load time:", perfData.loadEventEnd - perfData.loadEventStart)
    }, 0)
  })
}

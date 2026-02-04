<template>
  <div class="accessibility-widget">
    <!-- Botón flotante de accesibilidad -->
    <button
      @click="toggleMenu"
      class="accessibility-button"
      aria-label="Menú de accesibilidad"
      aria-expanded="menuOpen"
    >
        <img src="/accessibility.png" alt="accessibility" class="h-12 w-12" />
    </button>

    <!-- Menú desplegable -->
    <transition name="slide-fade">
      <div v-if="menuOpen" class="accessibility-menu" role="menu">
        <div class="menu-header">
          <h3 class="menu-title">Accesibilidad</h3>
          <button @click="resetAll" class="reset-button" aria-label="Restablecer configuración">
            Restablecer
          </button>
        </div>

        <div class="menu-options">
          <!-- Aumentar texto -->
          <button
            @click="increaseFontSize"
            class="menu-option"
            :class="{ active: fontSize > 100 }"
            role="menuitem"
          >
            <span class="option-icon">🔍</span>
            <span class="option-text">Aumentar texto</span>
          </button>

          <!-- Disminuir texto -->
          <button
            @click="decreaseFontSize"
            class="menu-option"
            :class="{ active: fontSize < 100 }"
            role="menuitem"
          >
            <span class="option-icon">🔍</span>
            <span class="option-text">Disminuir texto</span>
          </button>

          <!-- Escala de grises -->
          <button
            @click="toggleGrayscale"
            class="menu-option"
            :class="{ active: grayscale }"
            role="menuitem"
            aria-pressed="grayscale"
          >
            <span class="option-icon">🎨</span>
            <span class="option-text">Escala de grises</span>
          </button>

          <!-- Alto contraste -->
          <button
            @click="toggleHighContrast"
            class="menu-option"
            :class="{ active: highContrast }"
            role="menuitem"
            aria-pressed="highContrast"
          >
            <span class="option-icon">🌓</span>
            <span class="option-text">Alto contraste</span>
          </button>

          <!-- Contraste negativo -->
          <button
            @click="toggleNegativeContrast"
            class="menu-option"
            :class="{ active: negativeContrast }"
            role="menuitem"
            aria-pressed="negativeContrast"
          >
            <span class="option-icon">🌗</span>
            <span class="option-text">Contraste negativo</span>
          </button>

          <!-- Fondo claro -->
          <button
            @click="toggleLightBackground"
            class="menu-option"
            :class="{ active: lightBackground }"
            role="menuitem"
            aria-pressed="lightBackground"
          >
            <span class="option-icon">💡</span>
            <span class="option-text">Fondo claro</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AccessibilityMenu',
  data() {
    return {
      menuOpen: false,
      fontSize: 100,
      grayscale: false,
      highContrast: false,
      negativeContrast: false,
      lightBackground: false
    }
  },
  mounted() {
    this.loadPreferences()
    this.applyAccessibility()
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    
    handleClickOutside(event) {
      const widget = this.$el
      if (widget && !widget.contains(event.target)) {
        this.menuOpen = false
      }
    },

    increaseFontSize() {
      if (this.fontSize < 150) {
        this.fontSize += 10
        this.applyAccessibility()
        this.savePreferences()
      }
    },

    decreaseFontSize() {
      if (this.fontSize > 80) {
        this.fontSize -= 10
        this.applyAccessibility()
        this.savePreferences()
      }
    },

    toggleGrayscale() {
      this.grayscale = !this.grayscale
      this.applyAccessibility()
      this.savePreferences()
    },

    toggleHighContrast() {
      this.highContrast = !this.highContrast
      if (this.highContrast) {
        this.negativeContrast = false
        this.lightBackground = false
      }
      this.applyAccessibility()
      this.savePreferences()
    },

    toggleNegativeContrast() {
      this.negativeContrast = !this.negativeContrast
      if (this.negativeContrast) {
        this.highContrast = false
        this.lightBackground = false
      }
      this.applyAccessibility()
      this.savePreferences()
    },

    toggleLightBackground() {
      this.lightBackground = !this.lightBackground
      if (this.lightBackground) {
        this.highContrast = false
        this.negativeContrast = false
      }
      this.applyAccessibility()
      this.savePreferences()
    },

    resetAll() {
      this.fontSize = 100
      this.grayscale = false
      this.highContrast = false
      this.negativeContrast = false
      this.lightBackground = false
      this.applyAccessibility()
      this.savePreferences()
    },

    applyAccessibility() {
      const html = document.documentElement

      // Tamaño de fuente
      html.style.fontSize = `${this.fontSize}%`

      // Escala de grises
      if (this.grayscale) {
        html.classList.add('grayscale-mode')
      } else {
        html.classList.remove('grayscale-mode')
      }

      // Alto contraste
      if (this.highContrast) {
        html.classList.add('high-contrast-mode')
        html.classList.remove('negative-contrast-mode', 'light-background-mode')
      } else {
        html.classList.remove('high-contrast-mode')
      }

      // Contraste negativo
      if (this.negativeContrast) {
        html.classList.add('negative-contrast-mode')
        html.classList.remove('high-contrast-mode', 'light-background-mode')
      } else {
        html.classList.remove('negative-contrast-mode')
      }

      // Fondo claro
      if (this.lightBackground) {
        html.classList.add('light-background-mode')
        html.classList.remove('high-contrast-mode', 'negative-contrast-mode')
      } else {
        html.classList.remove('light-background-mode')
      }
    },

    savePreferences() {
      const preferences = {
        fontSize: this.fontSize,
        grayscale: this.grayscale,
        highContrast: this.highContrast,
        negativeContrast: this.negativeContrast,
        lightBackground: this.lightBackground
      }
      localStorage.setItem('accessibility-preferences', JSON.stringify(preferences))
    },

    loadPreferences() {
      const saved = localStorage.getItem('accessibility-preferences')
      if (saved) {
        const preferences = JSON.parse(saved)
        this.fontSize = preferences.fontSize || 100
        this.grayscale = preferences.grayscale || false
        this.highContrast = preferences.highContrast || false
        this.negativeContrast = preferences.negativeContrast || false
        this.lightBackground = preferences.lightBackground || false
      }
    }
  }
}
</script>

<style scoped>
.accessibility-widget {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
}

.accessibility-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.accessibility-button:hover {
  background: #1d4ed8;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.accessibility-button:focus {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

.accessibility-menu {
  position: absolute;
  bottom: 70px;
  left: 0;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.menu-header {
  padding: 16px;
  background: #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.menu-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.reset-button {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.reset-button:hover {
  background: #dbeafe;
}

.reset-button:focus {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.menu-options {
  padding: 8px;
}

.menu-option {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.menu-option:hover {
  background: #f3f4f6;
}

.menu-option:focus {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

.menu-option.active {
  background: #dbeafe;
  border-left: 4px solid #2563eb;
  padding-left: 12px;
}

.option-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.option-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-align: left;
}

/* Animación de entrada */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(5px);
  opacity: 0;
}
</style>

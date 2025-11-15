import { useEffect, useRef } from 'react'

const ParticleSystem = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []
    let mouse = { x: null, y: null, radius: 150 }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }
    window.addEventListener('mouseleave', handleMouseLeave)

    // Particle class
    class Particle {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        this.size = Math.random() * 2 + 1
        this.density = Math.random() * 30 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }

      update() {
        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          const maxDistance = mouse.radius
          const force = (maxDistance - distance) / maxDistance
          const directionX = forceDirectionX * force * this.density
          const directionY = forceDirectionY * force * this.density

          if (distance < mouse.radius) {
            this.x -= directionX
            this.y -= directionY
          } else {
            if (this.x !== this.baseX) {
              const dx = this.x - this.baseX
              this.x -= dx / 10
            }
            if (this.y !== this.baseY) {
              const dy = this.y - this.baseY
              this.y -= dy / 10
            }
          }
        } else {
          // Gentle floating animation when no mouse interaction
          this.x += this.speedX
          this.y += this.speedY

          // Bounce back to base position
          if (Math.abs(this.x - this.baseX) > 20 || Math.abs(this.y - this.baseY) > 20) {
            this.x += (this.baseX - this.x) * 0.02
            this.y += (this.baseY - this.y) * 0.02
          }
        }
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles = []
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particles.push(new Particle(x, y))
      }
    }
    initParticles()

    // Connect particles
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const opacity = 1 - distance / 100
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  )
}

export default ParticleSystem
